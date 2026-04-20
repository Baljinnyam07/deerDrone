import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAdminApi, withAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const key = formData.get("key") as string;

    if (!file || !key) {
      return NextResponse.json({ error: "File and key are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Upload to Storage
    const fileName = `${key}_${Date.now()}.mp4`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("site-videos")
      .upload(fileName, file, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (storageError) {
      console.error("Storage error:", storageError);
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("site-videos")
      .getPublicUrl(fileName);

    // 3. Update site_settings table
    const { error: dbError } = await supabase
      .from("site_settings")
      .update({ value: publicUrl, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return withAuthCookies(auth.response, NextResponse.json({ success: true, url: publicUrl }));
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
