import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "../../../../lib/supabase";
import { requireAdminApi } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) {
      return auth.response;
    }

    const body = await request.json();
    const { product, images, specs } = body;

    if (!product.name || !product.slug || !product.price) {
      return NextResponse.json({ error: "Нэр, Slug болон үнэ заавал оруулах шаардлагатай" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Insert product
    const { data: newProduct, error: productError } = await supabase
      .from("products")
      .insert({
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
        status: 'active'
      })
      .select()
      .single();

    if (productError) {
      console.error("Product insert error:", productError);
      return NextResponse.json({ error: "Бараа үүсгэхэд алдаа гарлаа. Slug давхардсан байж магадгүй." }, { status: 500 });
    }

    // 2. Insert images
    if (images && images.length > 0) {
      const imagesToInsert = images.map((img: any) => ({
        product_id: newProduct.id,
        url: img.url,
        display_order: img.display_order
      }));

      const { error: imagesError } = await supabase.from("product_images").insert(imagesToInsert);
      if (imagesError) console.error("Images insert error:", imagesError);
    }

    // 3. Insert specs
    if (specs && specs.length > 0) {
      const specsToInsert = specs.map((spec: any) => ({
        product_id: newProduct.id,
        label: spec.label,
        value: spec.value,
        display_order: spec.display_order
      }));

      const { error: specsError } = await supabase.from("product_specs").insert(specsToInsert);
      if (specsError) console.error("Specs insert error:", specsError);
    }

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err) {
    console.error("Create product failed:", err);
    return NextResponse.json({ error: "Серверийн алдаа гарлаа" }, { status: 500 });
  }
}
