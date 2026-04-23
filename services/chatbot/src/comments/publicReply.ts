/**
 * Posts a public reply to a Facebook comment via Graph API.
 */

import type { CommentIntent } from "./classifier.js";

const BASE = "https://graph.facebook.com/v20.0";

// ---------------------------------------------------------------------------
// Static public reply templates (SHORT — max 1 sentence)
// ---------------------------------------------------------------------------

export const PUBLIC_REPLIES: Record<CommentIntent, string> = {
  info_request:     "Сайн байна уу! 👋 Мэдээллийг чат руу илгээлээ.",
  product_interest: "Сайн байна уу! 🛒 Захиалгын мэдээллийг чат руу илгээлээ.",
  financing:        "Сайн байна уу! 💰 Зээлийн мэдээллийг чат руу илгээлээ.",
  recommend:        "Сайн байна уу! 📦 Санал болгох бүтээгдэхүүнийг чат руу илгээлээ.",
  human_support:    "Сайн байна уу! 📞 Манай ажилтан удахгүй чат руу холбогдох болно.",
  low_confidence:   "Сайн байна уу! ℹ️ Дэлгэрэнгүй мэдээллийг чат руу илгээлээ.",
  spam:             "", // no reply to spam
};

// ---------------------------------------------------------------------------
// Post a reply under the given comment
// ---------------------------------------------------------------------------

export async function postPublicReply(
  commentId: string,
  message: string,
  pageToken: string
): Promise<void> {
  if (!message || !pageToken) return;

  try {
    const res = await fetch(
      `${BASE}/${commentId}/comments?access_token=${pageToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[publicReply] Graph API error", err);
    } else {
      console.log(`[publicReply] replied to comment ${commentId}`);
    }
  } catch (e) {
    console.error("[publicReply] fetch failed", e);
  }
}
