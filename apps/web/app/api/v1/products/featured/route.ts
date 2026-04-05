import { NextResponse } from "next/server";
import { products } from "@deer-drone/data";
import { pickFeaturedProducts } from "@deer-drone/utils";

export function GET() {
  return NextResponse.json({
    items: pickFeaturedProducts(products, 4),
  });
}
