import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAdminApi, withAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { url, key } = await request.json();
    
    if (!url || !key) {
      return NextResponse.json({ error: "URL and key are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Update site_settings table with the new URL (ImageKit URL)
    const { error: dbError } = await supabase
      .from("site_settings")
      .update({ value: url, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return withAuthCookies(auth.response, NextResponse.json({ success: true, url }));
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Clear value in site_settings
    const { error: dbError } = await supabase
      .from("site_settings")
      .update({ value: null, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return withAuthCookies(auth.response, NextResponse.json({ success: true }));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
