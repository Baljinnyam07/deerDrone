import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAdminApi, withAuthCookies } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { orderId, status, note } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: previous } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single();

    // 1. Update Order Status
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // ── Telegram Notification: order became paid (e.g. bank transfer confirmed) ──
    // Only on the transition to "paid", so re-saving a paid order doesn't notify again
    if (status === "paid" && previous?.status !== "paid") {
      const { data: items } = await supabase
        .from("order_items")
        .select("product_name, quantity")
        .eq("order_id", orderId);
      const lines = (items ?? []).map((i: any) => `• ${i.quantity}x ${i.product_name}`).join("\n");

      const tgMsg =
        `✅ <b>Төлбөр амжилттай төлөгдсөн захиалга! (Admin баталгаажуулсан)</b>\n\n` +
        `<b>Захиалга:</b> #${order.order_number}\n` +
        `<b>Хэрэглэгч:</b> ${order.contact_name}\n` +
        `<b>Утас:</b> ${order.contact_phone ?? "—"}\n` +
        `<b>Төлбөр:</b> ${order.payment_method === "qpay" ? "QPay" : "Дансаар"}\n` +
        `<b>Дүн:</b> ${order.total?.toLocaleString()}₮\n` +
        `<b>Админ:</b> ${auth.user.email}` +
        (lines ? `\n\n<b>Бараа:</b>\n${lines}` : "");

      const { sendTelegramNotification } = await import("@/lib/telegram");
      await sendTelegramNotification(tgMsg).catch(e => console.error("Telegram error:", e));
    }

    // 2. Create Audit Log
    const { error: logError } = await supabase
      .from("admin_audit_logs")
      .insert({
        admin_email: auth.user.email,
        action: `UPDATE_ORDER_STATUS`,
        target_table: "orders",
        target_id: orderId,
        details: {
          previous_status: previous?.status ?? null,
          new_status: status,
          note: note || `Status updated to ${status}`
        },
        ip_address: request.headers.get("x-forwarded-for") || "unknown"
      });

    if (logError) {
      console.error("Audit log error:", logError);
    }

    return withAuthCookies(auth.response, NextResponse.json({ success: true, order }));
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
