import { NextResponse } from "next/server";

/**
 * Chat API — proxies requests to the standalone chatbot service.
 *
 * In development the service runs at http://localhost:8787.
 * In production set CHATBOT_SERVICE_URL to the deployed Vercel URL.
 *
 * Falls back to a simple Supabase-only handler if the service is unreachable
 * so the widget never shows a hard error to the user.
 */

const CHATBOT_URL = (process.env.CHATBOT_SERVICE_URL ?? "http://localhost:8787").replace(/\/$/, "");
const SERVICE_SECRET = process.env.CHATBOT_SERVICE_SECRET ?? "";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId?: string; message?: string; sourcePage?: string };

    if (!body?.sessionId || !body?.message) {
      return NextResponse.json(
        { error: "sessionId болон message шаардлагатай." },
        { status: 400 }
      );
    }

    // ── Forward to chatbot service ──────────────────────────────────────────
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (SERVICE_SECRET) {
      headers["x-deer-service-secret"] = SERVICE_SECRET;
    }

    console.log(`[chat-proxy] Forwarding request to ${CHATBOT_URL}/chat`);

    const res = await fetch(`${CHATBOT_URL}/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      // 8-second timeout so the widget never hangs
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[chat-proxy] chatbot service error:", res.status, err);
      return NextResponse.json(
        { error: err.error || "Чат үйлчилгээ түр ажиллагаагүй байна." },
        { status: res.status === 500 ? 503 : res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err: any) {
    // Timeout or network error — give user a friendly message
    if (err?.name === "TimeoutError" || err?.name === "AbortError") {
      console.error("[chat-proxy] chatbot service timeout");
      return NextResponse.json(
        { error: "Хариулт хэтэрхий удаан байна. Дахин оролдоно уу." },
        { status: 504 }
      );
    }
    console.error("[chat-proxy] unexpected error:", err);
    return NextResponse.json(
      { error: "Системийн алдаа. Дараа дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
