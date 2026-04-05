import { NextResponse } from "next/server";
import { products } from "@deer-drone/data";
import { getProductBySlug } from "@deer-drone/utils";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const params = await context.params;
  const product = getProductBySlug(products, params.slug);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
