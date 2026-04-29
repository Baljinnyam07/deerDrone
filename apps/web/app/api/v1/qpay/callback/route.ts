import { NextResponse, type NextRequest } from "next/server";
import { checkQPayPayment } from "../../../../../lib/qpay";
import { createServiceClient } from "../../../../../lib/supabase/service";

// QPay calls this URL after the customer pays.
// It sends a POST with payment_id in the body, and we pass order_id via query param.
export async function POST(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order_id");
  if (!orderId) {
    return NextResponse.json({ error: "order_id байхгүй" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Get the order to find the qpay invoice reference
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, total, payment_reference")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Захиалга олдсонгүй" }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ message: "Аль хэдийн төлөгдсөн" });
  }

  // Verify with QPay that payment actually succeeded
  try {
    const check = await checkQPayPayment(orderId);
    const isPaid = check.count > 0 && check.rows.some(r => r.payment_status === "PAID");

    if (isPaid) {
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);
    }

    return NextResponse.json({ paid: isPaid });
  } catch (err) {
    console.error("QPay callback check алдаа:", err);
    return NextResponse.json({ error: "Шалгах үед алдаа гарлаа" }, { status: 500 });
  }
}
