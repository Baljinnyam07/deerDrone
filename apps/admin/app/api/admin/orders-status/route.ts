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

    // ── Telegram Notification for "paid" status ──────────────────────
    if (status === "paid") {
      const tgMsg = 
        `💳 <b>Захиалга төлөгдлөө! (Admin)</b>\n\n` +
        `<b>Захиалга:</b> #${order.order_number}\n` +
        `<b>Хэрэглэгч:</b> ${order.contact_name}\n` +
        `<b>Дүн:</b> ${order.total?.toLocaleString()}₮\n` +
        `<b>Шинэ төлөв:</b> Төлөгдсөн\n` +
        `<b>Админ:</b> ${auth.user.email}`;
      
      // Using global fetch or imported function
      const { sendTelegramNotification } = await import("@/lib/telegram");
      sendTelegramNotification(tgMsg).catch(e => console.error("Telegram error:", e));
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
          previous_status: order.status, 
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
