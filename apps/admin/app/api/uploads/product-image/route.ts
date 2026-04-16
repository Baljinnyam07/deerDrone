import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminApi, withAuthCookies } from "../../../../lib/auth";
import { createAdminClient } from "../../../../lib/supabase";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Файл илгээгдээгүй байна." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Зөвхөн зураг upload хийх боломжтой." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Зургийн хэмжээ 10MB-аас ихгүй байх ёстой." },
        { status: 400 },
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName =
      file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "product-image";
    const filePath = `products/${Date.now()}-${crypto.randomUUID()}-${safeName}.${extension}`;

    const supabase = createAdminClient();
    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, Buffer.from(await file.arrayBuffer()), {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Product image upload failed:", error);
      return NextResponse.json(
        { error: "Зураг upload хийх үед алдаа гарлаа." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return withAuthCookies(
      auth.response,
      NextResponse.json({ path: filePath, url: publicUrl }, { status: 201 }),
    );
  } catch (error) {
    console.error("Product image upload error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа." },
      { status: 500 },
    );
  }
}
