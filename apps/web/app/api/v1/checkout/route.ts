import { NextResponse } from "next/server";
import type { CheckoutPayload } from "@deer-drone/types";
import { getDeliveryQuote, validateCheckoutPayload } from "@deer-drone/utils";
import { createClient } from "../../../../lib/supabase/server";
import { createServiceClient } from "../../../../lib/supabase/service";
import { createQPayInvoice } from "../../../../lib/qpay";

type OrderItemRow = {
  line_total: number;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

type ProductRow = {
  id: string;
  name: string;
  price: number;
  stock_qty: number;
};

async function restoreReservedStock(
  supabase: ReturnType<typeof createServiceClient>,
  items: OrderItemRow[],
) {
  for (const item of items) {
    await supabase.rpc("restore_product_stock", {
      restore_qty: item.quantity,
      target_product_id: item.product_id,
    });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutPayload;

    if (!validateCheckoutPayload(payload)) {
      return NextResponse.json(
        { error: "Захиалгын мэдээлэл дутуу байна. Нэр, утас, хаягаа шалгана уу." },
        { status: 400 },
      );
    }

    if (payload.items.length === 0 || payload.items.some((item) => item.quantity < 1)) {
      return NextResponse.json(
        { error: "Захиалгад дор хаяж нэг бараа байх шаардлагатай." },
        { status: 400 },
      );
    }

    const userClient = await createClient();
    const {
      data: { user },
    } = await userClient.auth.getUser();

    const supabase = createServiceClient();
    const productIds = [...new Set(payload.items.map((item) => item.productId))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, stock_qty")
      .in("id", productIds);

    if (productsError || !products?.length) {
      return NextResponse.json(
        { error: "Сонгосон бараанууд олдсонгүй." },
        { status: 400 },
      );
    }

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Зарим бараа олдсонгүй эсвэл идэвхгүй байна." },
        { status: 400 },
      );
    }

    const productsById = new Map(
      products.map((product) => [product.id, product as ProductRow]),
    );

    const orderItems = payload.items.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock_qty < item.quantity) {
        throw new Error(`${product.name} барааны үлдэгдэл хүрэлцэхгүй байна.`);
      }

      return {
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        line_total: product.price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
    const shipping = getDeliveryQuote(payload.shippingMethod);
    const total = subtotal + shipping.fee;
    const reservedItems: OrderItemRow[] = [];

    for (const item of orderItems) {
      const { data: reserved, error: reserveError } = await supabase.rpc(
        "reserve_product_stock",
        {
          requested_qty: item.quantity,
          target_product_id: item.product_id,
        },
      );

      if (reserveError || !reserved) {
        await restoreReservedStock(supabase, reservedItems);
        return NextResponse.json(
          { error: `${item.product_name} барааны үлдэгдэл дууссан байна.` },
          { status: 409 },
        );
      }

      reservedItems.push(item);
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: "",
        user_id: user?.id ?? null,
        status: "pending",
        contact_name: payload.contactName,
        contact_phone: payload.contactPhone,
        payment_method: payload.paymentMethod,
        shipping_method: payload.shippingMethod,
        shipping_address: payload.shippingAddress,
        shipping_cost: shipping.fee,
        subtotal,
        total,
        notes: payload.notes || null,
        source: "web",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      await restoreReservedStock(supabase, reservedItems);
      return NextResponse.json(
        { error: "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу." },
        { status: 500 },
      );
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      })),
    );

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      await supabase.from("orders").delete().eq("id", order.id);
      await restoreReservedStock(supabase, reservedItems);
      return NextResponse.json(
        { error: "Захиалгын мөр хадгалах үед алдаа гарлаа. Дахин оролдоно уу." },
        { status: 500 },
      );
    }

    let payment: Record<string, unknown>;

    if (payload.paymentMethod === "qpay") {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      const callbackUrl = `${siteUrl}/api/v1/qpay/callback?order_id=${order.id}`;

      const invoice = await createQPayInvoice({
        orderId: order.id,
        amount: total,
        description: `DEER Drone захиалга #${order.order_number}`,
        callbackUrl,
      });

      payment = {
        method: "qpay",
        invoiceId: invoice.invoice_id,
        qrCode: `data:image/png;base64,${invoice.qr_image}`,
        deeplinks: invoice.urls,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      };
    } else {
      payment = {
        method: "bank_transfer",
        accountName: "DEER Technology LLC",
        accountNumber: "5001234567",
        reference: order.order_number,
      };
    }

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          total: order.total,
          createdAt: order.created_at,
        },
        payment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Серверийн алдаа гарлаа. Дахин оролдоно уу.",
      },
      { status: 500 },
    );
  }
}
