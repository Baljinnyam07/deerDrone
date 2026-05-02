/**
 * Sends a Messenger DM to the commenter based on detected intent.
 * Uses the existing Graph API sender pattern from messenger.ts.
 */

import type { CommentIntent } from "./classifier.js";
import { captureLeadTool } from "../tools/catalog.js";
import { STATIC } from "../constants/staticResponses.js";

const BASE = "https://graph.facebook.com/v20.0/me";
const SITE_URL = process.env.SITE_URL || "https://deerdrone.mn";

// ---------------------------------------------------------------------------
// Static DM templates
// ---------------------------------------------------------------------------

const FINANCING_DM = STATIC.loanAck;

const HANDOFF_DM =
  "✅ Таны хүсэлтийг хүлээн авлаа.\n\n" +
  "Манай ажилтан удахгүй холбоо барих болно.\n" +
  "☎ 8815-7242";

const INTRO_DM = "Манай бүтээгдэхүүнүүдийг харна уу 👇";
const SIMILAR_DM = "Танд санал болгох бүтээгдэхүүнүүд 👇";

// ---------------------------------------------------------------------------
// Main dispatcher
// ---------------------------------------------------------------------------

export async function dispatchCommentDM(
  commentId: string,
  intent: CommentIntent,
  commentText: string,
  pageToken: string
): Promise<void> {
  let replyText = "";

  switch (intent) {
    case "info_request":
    case "product_interest": {
      replyText = `Сайн байна уу! 👋 ${INTRO_DM}\n\n${SITE_URL}`;
      break;
    }

    case "recommend": {
      replyText = `Сайн байна уу! 👋 ${SIMILAR_DM}\n\n${SITE_URL}`;
      break;
    }

    case "financing": {
      // Silent lead capture
      await captureLeadTool(
        "Тодорхойгүй", "",
        `Facebook зээл: ${commentText.slice(0, 100)}`,
        "financing", "fb_comment"
      ).catch(console.error);

      // Send image first, then text — early return to skip the trailing graphPost
      const rawImg = `${SITE_URL}/aaaaaaa-01.jpg`;
      const proxyImg = `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=1000&output=jpg`;

      await graphPost(pageToken, {
        recipient: { comment_id: commentId },
        message: {
          attachment: {
            type: "image",
            payload: { url: proxyImg, is_reusable: true },
          },
        },
      });
      await graphPost(pageToken, {
        recipient: { comment_id: commentId },
        message: { text: FINANCING_DM },
      });
      return; // ← return, not break — prevents trailing graphPost from running
    }

    case "human_support": {
      replyText = HANDOFF_DM;
      await captureLeadTool(
        "Тодорхойгүй", "",
        `Facebook тусламж: ${commentText.slice(0, 100)}`,
        "human_support", "fb_comment"
      ).catch(console.error);
      break;
    }

    default: {
      replyText = `Сайн байна уу! 👋 Дэлгэрэнгүй мэдээллийг эндээс харна уу: ${SITE_URL}`;
    }
  }

  await graphPost(pageToken, {
    recipient: { comment_id: commentId },
    message: { text: replyText },
  });
}

// ---------------------------------------------------------------------------
// Low-level senders
// ---------------------------------------------------------------------------

async function graphPost(token: string, body: object): Promise<void> {
  try {
    const res = await fetch(`${BASE}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[dmDispatcher] Graph API error", err);
    }
  } catch (e) {
    console.error("[dmDispatcher] fetch failed", e);
  }
}
