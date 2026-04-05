import { NextRequest, NextResponse } from "next/server";
import { products } from "@deer-drone/data";
import { filterProducts } from "@deer-drone/utils";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? request.nextUrl.searchParams.get("query") ?? "";

  return NextResponse.json({
    items: filterProducts(products, query).slice(0, 5),
  });
}
