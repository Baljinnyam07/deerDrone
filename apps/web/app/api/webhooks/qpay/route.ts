import { NextResponse } from "next/server";
import { createServiceClient } from "../../../../lib/supabase/service";

export async function POST(request: Request) {
  try {
    // Expected QPay Webhook Payload (simplified for mock purposes)
    // QPay officially might have specific headers or payload structure
    const body = await request.json();
    const { order_number, payment_status } = body;

    if (!order_number) {
      return NextResponse.json({ error: "order_number is required" }, { status: 400 });
    }

    if (payment_status !== "PAID") {
      return NextResponse.json({ ok: true, message: "Ignored non-paid status" });
    }

    const supabase = createServiceClient();

    // 1. Fetch Order and check status to prevent double-processing
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("order_number", order_number)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
      return NextResponse.json({ ok: true, message: "Order already processed" });
    }

    // 2. Update order status to 'paid'
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    if (updateError) {
      throw updateError;
    }

    // 3. Decrement stock for each item in the order
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", order.id);

    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        // We use a database RPC or just a direct query. 
        // Here we read current stock and decrement.
        const { data: product } = await supabase
          .from("products")
          .select("stock_qty")
          .eq("id", item.product_id)
          .single();

        if (product && product.stock_qty > 0) {
          await supabase
            .from("products")
            .update({ stock_qty: Math.max(0, product.stock_qty - item.quantity) })
            .eq("id", item.product_id);
        }
      }
    }

    return NextResponse.json({ ok: true, message: "Order marked as paid and stock updated" });
  } catch (err) {
    console.error("QPay Webhook handling error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
