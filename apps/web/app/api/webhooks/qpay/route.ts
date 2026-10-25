import { NextResponse } from "next/server";
import { createServiceClient } from "../../../../lib/supabase/service";
import { isQPayInvoicePaid, markOrderPaid } from "../../../../lib/order-payment";

/**
 * QPay payment webhook (by order_number).
 *
 * The request body is only a hint about WHICH order to look at. Whether it is
 * paid is decided by asking QPay about the order's own invoice — a body saying
 * "payment_status: PAID" proves nothing, since anyone can POST it.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderNumber = typeof body?.order_number === "string" ? body.order_number.trim() : "";

    if (!orderNumber) {
      return NextResponse.json({ error: "order_number is required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, total, payment_reference")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ ok: true, paid: true, message: "Order already paid" });
    }

    if (!order.payment_reference) {
      return NextResponse.json({ ok: false, paid: false, message: "Order has no QPay invoice" }, { status: 400 });
    }

    const paid = await isQPayInvoicePaid(order.payment_reference, Number(order.total ?? 0));
    if (!paid) {
      return NextResponse.json({ ok: true, paid: false, message: "QPay reports the invoice as not paid" });
    }

    await markOrderPaid(supabase, order.id);
    return NextResponse.json({ ok: true, paid: true });
  } catch (err) {
    console.error("QPay webhook handling error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
