import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.IMAGEKIT_PUBLIC_KEY) {
      throw new Error("Missing ImageKit configuration");
    }
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get ImageKit auth parameters" }, { status: 500 });
  }
}
