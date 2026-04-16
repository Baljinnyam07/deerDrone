import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminApi, withAuthCookies } from "../../../../lib/auth";
import { createAdminClient } from "../../../../lib/supabase";

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi(request);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { fileName, fileType, fileSize } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: "Файлын нэр олдсонгүй." }, { status: 400 });
    }

    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Зургийн хэмжээ 10MB-аас ихгүй байх ёстой." }, { status: 400 });
    }

    const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const safeName =
      fileName
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "product-image";
    const filePath = `products/${Date.now()}-${crypto.randomUUID()}-${safeName}.${extension}`;

    const supabase = createAdminClient();
    
    // Create a signed URL valid for 60 seconds for direct browser upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .createSignedUploadUrl(filePath);

    if (uploadError || !uploadData) {
      console.error("Signed URL generation failed:", uploadError);
      return NextResponse.json(
        { error: "Зураг хуулах холбоос үүсгэхэд алдаа гарлаа." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return withAuthCookies(
      auth.response,
      NextResponse.json({ 
        path: filePath, 
        url: publicUrl, 
        signedUrl: uploadData.signedUrl, 
        token: uploadData.token 
      }, { status: 200 }),
    );
  } catch (error) {
    console.error("Product image upload URL error:", error);
    return NextResponse.json(
      { error: "Серверийн алдаа гарлаа." },
      { status: 500 },
    );
  }
}
