import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAdminApi, withAuthCookies } from "@/lib/auth";
import { revalidateTag } from "@/lib/revalidate";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { key, value, label, description } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error: dbError } = await supabase
      .from("site_settings")
      .upsert(
        {
          key,
          value,
          label: label || key,
          description: description || "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Trigger revalidation for settings
    await revalidateTag("settings");

    return withAuthCookies(auth.response, NextResponse.json({ success: true }));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
