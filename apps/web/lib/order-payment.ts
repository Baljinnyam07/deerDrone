import "server-only";

import { checkQPayPayment } from "./qpay";
import type { createServiceClient } from "./supabase/service";
import { sendTelegramNotification } from "./telegram";

type Supabase = ReturnType<typeof createServiceClient>;

/**
 * Asks QPay itself whether the invoice is paid in full. Never trust a "PAID"
 * claim in an incoming request — anyone can POST that.
 */
export async function isQPayInvoicePaid(invoiceId: string, expectedTotal: number): Promise<boolean> {
  const check = await checkQPayPayment(invoiceId);
  const paidRows = (check.rows ?? []).filter((r) => r.payment_status === "PAID");
  const paidAmount = paidRows.reduce((sum, r) => sum + Number(r.paid_amount ?? 0), 0);
  return paidRows.length > 0 && paidAmount >= expectedTotal;
}

/**
 * Flips the order to "paid" and sends the Telegram notification — exactly once.
 * Only the caller whose update actually changes the status gets a row back, so
 * concurrent callers (QPay callback, checkout-page polling, webhook) can't
 * notify twice. Stock is NOT touched: checkout already reserved it.
 * Returns true if this call marked the order paid.
 */
export async function markOrderPaid(supabase: Supabase, orderId: string): Promise<boolean> {
  const { data: order } = await supabase
    .from("orders")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .neq("status", "paid")
    .select("id, order_number, total, contact_name, contact_phone")
    .maybeSingle();

  if (!order) return false;

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, quantity")
    .eq("order_id", order.id);
  const lines = (items ?? []).map((i) => `• ${i.quantity}x ${i.product_name}`).join("\n");

  const tgMsg =
    `✅ <b>Төлбөр амжилттай төлөгдсөн захиалга!</b>\n\n` +
    `<b>Захиалга:</b> #${order.order_number}\n` +
    `<b>Хэрэглэгч:</b> ${order.contact_name}\n` +
    `<b>Утас:</b> ${order.contact_phone ?? "—"}\n` +
    `<b>Төлбөр:</b> QPay\n` +
    `<b>Дүн:</b> ${order.total?.toLocaleString()}₮` +
    (lines ? `\n\n<b>Бараа:</b>\n${lines}` : "");

  // Awaited: on serverless an un-awaited send can be cut off once the response returns
  await sendTelegramNotification(tgMsg).catch((e) => console.error("Telegram notification error:", e));
  return true;
}
