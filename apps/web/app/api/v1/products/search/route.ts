import { NextRequest, NextResponse } from "next/server";
import { getCatalogProducts } from "../../../../../lib/supabase/catalog";

export async function GET(request: NextRequest) {
  const query =
    request.nextUrl.searchParams.get("q") ??
    request.nextUrl.searchParams.get("query") ??
    request.nextUrl.searchParams.get("search") ??
    "";

  return NextResponse.json({
    items: await getCatalogProducts({ query, limit: 5 }),
  });
}
