import { NextResponse } from "next/server";
import { getCatalogProducts } from "../../../../../lib/supabase/catalog";

export async function GET() {
  return NextResponse.json({
    items: await getCatalogProducts({ featuredOnly: true, limit: 4 }),
  });
}
