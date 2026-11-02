import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { requireAdminApi, withAuthCookies } from "@/lib/auth";
import { revalidateTag } from "@/lib/revalidate";
import { sanitizeProductMedia } from "@/lib/product-media";

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { slug, data } = await request.json();
    if (typeof slug !== "string" || !slug) {
      return NextResponse.json({ error: "Slug шаардлагатай." }, { status: 400 });
    }

    const media = sanitizeProductMedia(data);
    if (!media) {
      return NextResponse.json({ error: "Эхлээд гол (hero) зургаа оруулна уу." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("product_media")
      .upsert({ slug, data: media, updated_at: new Date().toISOString() });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await revalidateTag("product-media");
    return withAuthCookies(auth.response, NextResponse.json({ success: true }));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Removes the saved content so the product falls back to its built-in page.
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdminApi(request);
    if (!auth.ok) return auth.response;

    const { slug } = await request.json();
    if (typeof slug !== "string" || !slug) {
      return NextResponse.json({ error: "Slug шаардлагатай." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("product_media").delete().eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await revalidateTag("product-media");
    return withAuthCookies(auth.response, NextResponse.json({ success: true }));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
