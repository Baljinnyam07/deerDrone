import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "../../../../lib/supabase/queries";

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;

  const categorySlug = p.get("category") ?? p.get("cat") ?? undefined;
  const brand        = p.get("brand") ?? undefined;
  const search       = p.get("q") ?? p.get("query") ?? p.get("search") ?? undefined;
  const sort         = (p.get("sort") as any) ?? undefined;
  const limit        = p.get("limit")  ? Number(p.get("limit"))  : 10;
  const offset       = p.get("offset") ? Number(p.get("offset")) : 0;

  const items = await getProducts({ categorySlug, brand, search, sort, limit, offset });

  return NextResponse.json({ items, total: items.length });
}
