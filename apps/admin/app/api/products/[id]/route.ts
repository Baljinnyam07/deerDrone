import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "../../../../lib/supabase";
import { requireAdminApi } from "../../../../lib/auth";

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) {
      return auth.response;
    }

    const params = await props.params;
    const body = await request.json();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("products")
      .update({
        name: body.name,
        slug: body.slug,
        brand: body.brand,
        category_id: body.category_id,
        price: body.price,
        compare_price: body.compare_price,
        stock_qty: body.stock_qty,
        short_description: body.short_description,
        description: body.description,
        hero_note: body.hero_note,
        is_leasable: body.is_leasable,
      })
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) {
      return auth.response;
    }

    const params = await props.params;
    const supabase = createAdminClient();

    const { error } = await supabase.from("products").delete().eq("id", params.id);
    
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
