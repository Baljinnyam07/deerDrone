import { NextRequest, NextResponse } from "next/server";
import { products } from "@deer-drone/data";
import { filterProducts } from "@deer-drone/utils";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const category = request.nextUrl.searchParams.get("category") ?? undefined;
  const items = filterProducts(products, query, category);

  return NextResponse.json({
    items,
    total: items.length,
  });
}
