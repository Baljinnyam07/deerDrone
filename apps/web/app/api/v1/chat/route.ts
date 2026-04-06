import { NextResponse } from "next/server";
import type { ChatRequest } from "@deer-drone/types";
import {
  getChatbotServiceUrl,
  getOptionalChatbotServiceSecret,
} from "../../../../lib/server-env";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ChatRequest>;

    if (!payload.message || !payload.sessionId) {
      return NextResponse.json(
        { error: "sessionId болон message шаардлагатай." },
        { status: 400 },
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const serviceSecret = getOptionalChatbotServiceSecret();

    if (serviceSecret) {
      headers["x-deer-service-secret"] = serviceSecret;
    }

    const response = await fetch(getChatbotServiceUrl(), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const body = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: body.error || "AI зөвлөх одоогоор холбогдохгүй байна." },
        { status: response.status },
      );
    }

    return NextResponse.json(body);
  } catch (error) {
    console.error("Chat proxy error:", error);
    return NextResponse.json(
      { error: "AI зөвлөх түр ажиллагаагүй байна. Дараа дахин оролдоно уу." },
      { status: 503 },
    );
  }
}
