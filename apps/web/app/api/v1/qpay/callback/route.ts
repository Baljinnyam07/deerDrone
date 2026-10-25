import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "../../../../../lib/supabase/service";
import { isQPayInvoicePaid, markOrderPaid } from "../../../../../lib/order-payment";

// QPay calls this URL after the customer pays.
// It sends a POST with payment_id in the body, and we pass order_id via query param.
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");

  console.log("QPay Callback - POST received");
  console.log("Order ID from URL:", orderId);

  if (!orderId) {
    return NextResponse.json({ error: "order_id байхгүй" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "not-set";
  console.log("Using Supabase URL:", supabaseUrl);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, total, payment_reference")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Order search error:", orderError);
    return NextResponse.json({ error: "Захиалга олдсонгүй", details: orderError?.message }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ message: "Аль хэдийн төлөгдсөн", paid: true });
  }

  if (!order.payment_reference) {
    return NextResponse.json({ error: "Төлбөрийн мэдээлэл (invoice_id) олдсонгүй" }, { status: 400 });
  }

  // Verify with QPay that payment actually succeeded (and in full)
  try {
    const isPaid = await isQPayInvoicePaid(order.payment_reference, Number(order.total ?? 0));

    if (isPaid) {
      // Marks paid + notifies Telegram exactly once, even when QPay's callback and
      // the checkout page's polling hit this route at the same time
      await markOrderPaid(supabase, orderId);
    }

    return NextResponse.json({ paid: isPaid });
  } catch (err) {
    console.error("QPay callback check алдаа:", err);
    return NextResponse.json({ error: "Шалгах үед алдаа гарлаа" }, { status: 500 });
  }
}
