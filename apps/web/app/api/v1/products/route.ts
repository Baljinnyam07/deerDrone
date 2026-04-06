import { NextRequest, NextResponse } from "next/server";
import { getCatalogProducts } from "../../../../lib/supabase/catalog";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const category =
    request.nextUrl.searchParams.get("category") ??
    request.nextUrl.searchParams.get("cat") ??
    undefined;
  const items = await getCatalogProducts({ category, query });

  return NextResponse.json({
    items,
    total: items.length,
  });
}
