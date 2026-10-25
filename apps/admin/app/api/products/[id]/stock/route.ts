import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "../../../../../lib/supabase";
import { requireAdminApi, withAuthCookies } from "../../../../../lib/auth";
import { revalidateTag } from "../../../../../lib/revalidate";

/**
 * Stock-only update for the products list (inline +/− and typed quantity),
 * so changing stock doesn't require sending the whole product form.
 */
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) {
      return auth.response;
    }

    const params = await props.params;
    const body = await request.json().catch(() => ({}));
    const stockQty = Number(body?.stock_qty);

    if (!Number.isInteger(stockQty) || stockQty < 0 || stockQty > 100000) {
      return NextResponse.json({ error: "Үлдэгдэл 0-ээс их бүхэл тоо байх ёстой" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .update({ stock_qty: stockQty })
      .eq("id", params.id)
      .select("id, stock_qty")
      .single();

    if (error) throw error;

    await revalidateTag("products");

    return withAuthCookies(auth.response, NextResponse.json({ success: true, product: data }));
  } catch (err: any) {
    console.error("Update stock error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
