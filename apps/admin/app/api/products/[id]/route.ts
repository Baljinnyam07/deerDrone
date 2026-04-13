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
    const { product, images, specs } = body;
    const supabase = createAdminClient();

    // 1. Update core product info
    const { error: productError } = await supabase
      .from("products")
      .update({
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category_id: product.category_id,
        price: product.price,
        compare_price: product.compare_price,
        stock_qty: product.stock_qty,
        short_description: product.short_description,
        description: product.description,
        hero_note: product.hero_note,
        is_leasable: product.is_leasable,
      })
      .eq("id", params.id);

    if (productError) throw productError;

    // 2. Sync Images (Delete & Re-insert)
    if (images) {
      await supabase.from("product_images").delete().eq("product_id", params.id);
      
      if (images.length > 0) {
        const imagesToInsert = images.map((img: any, idx: number) => ({
          product_id: params.id,
          url: img.url,
          display_order: img.display_order ?? idx
        }));
        const { error: imagesError } = await supabase.from("product_images").insert(imagesToInsert);
        if (imagesError) console.error("Images sync error:", imagesError);
      }
    }

    // 3. Sync Specs (Delete & Re-insert)
    if (specs) {
      await supabase.from("product_specs").delete().eq("product_id", params.id);

      if (specs.length > 0) {
        const specsToInsert = specs.map((spec: any, idx: number) => ({
          product_id: params.id,
          label: spec.label,
          value: spec.value,
          display_order: spec.display_order ?? idx
        }));
        const { error: specsError } = await supabase.from("product_specs").insert(specsToInsert);
        if (specsError) console.error("Specs sync error:", specsError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Update product error:", err);
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
