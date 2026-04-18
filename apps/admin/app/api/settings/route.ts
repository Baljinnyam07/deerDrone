import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAdminApi, withAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { key, value, label, description } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if exists
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).single();

    let dbError;
    if (existing) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
      dbError = error;
    } else {
      const { error } = await supabase
        .from("site_settings")
        .insert([{ key, value, label: label || key, description: description || "" }]);
      dbError = error;
    }

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return withAuthCookies(auth.response, NextResponse.json({ success: true }));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
