import { NextResponse, type NextRequest } from "next/server";
import { getProductMedia } from "../../../../../lib/product-media";
import { getProductBySlug } from "../../../../../lib/supabase/queries";

// Built-in rich page configuration for a product; the admin uses it as the starting point of its editor.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ media: getProductMedia(product.slug, product.categorySlug) });
}
