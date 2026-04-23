/**
 * Sends a Messenger DM to the commenter based on detected intent.
 * Uses the existing Graph API sender pattern from messenger.ts.
 */

import type { CommentIntent } from "./classifier.js";
import { getFeaturedProductsTool, captureLeadTool } from "../tools/catalog.js";
import { formatMoney } from "../utils.js";

const BASE = "https://graph.facebook.com/v20.0/me";
const SITE_URL = process.env.SITE_URL || "https://deerdrone.mn";

// ---------------------------------------------------------------------------
// Static DM templates
// ---------------------------------------------------------------------------

const FINANCING_DM =
  "💰 Зээлийн нөхцөл:\n\n" +
  "• Хас банк: 0% хүүтэй, 12 сар хүртэл\n" +
  "• ТБД: 6–24 сарын хугацаатай\n" +
  "• Манай дэлгүүр: 3–6 сарын хуваалт\n\n" +
  "Дараагийн алхамаа сонгоно уу 👇";

const HANDOFF_DM =
  "✅ Таны хүсэлтийг хүлээн авлаа.\n\n" +
  "Манай ажилтан удахгүй холбоо барих болно.\n" +
  "☎ 8815-7242";

const INTRO_DM   = "Манай бүтээгдэхүүнүүдийг харна уу 👇";
const SIMILAR_DM = "Танд санал болгох бүтээгдэхүүнүүд 👇";

// ---------------------------------------------------------------------------
// Main dispatcher
// ---------------------------------------------------------------------------

export async function dispatchCommentDM(
  recipientId: string,
  intent: CommentIntent,
  commentText: string,
  pageToken: string
): Promise<void> {
  switch (intent) {
    case "info_request":
    case "product_interest": {
      const products = await getFeaturedProductsTool(6);
      await sendText(recipientId, INTRO_DM, pageToken);
      await sendCarousel(recipientId, products, pageToken);
      break;
    }

    case "financing": {
      await sendText(recipientId, FINANCING_DM, pageToken);
      await sendFinancingActions(recipientId, pageToken);
      // Silent lead capture
      await captureLeadTool(
        "Тодорхойгүй", "",
        `Facebook зээл: ${commentText.slice(0, 100)}`,
        "financing", "fb_comment"
      ).catch(console.error);
      break;
    }

    case "recommend": {
      const products = await getFeaturedProductsTool(4);
      await sendText(recipientId, SIMILAR_DM, pageToken);
      await sendCarousel(recipientId, products, pageToken);
      break;
    }

    case "human_support": {
      await sendText(recipientId, HANDOFF_DM, pageToken);
      await captureLeadTool(
        "Тодорхойгүй", "",
        `Facebook тусламж: ${commentText.slice(0, 100)}`,
        "human_support", "fb_comment"
      ).catch(console.error);
      break;
    }

    default: {
      // low_confidence → show products, soft approach
      const products = await getFeaturedProductsTool(4);
      await sendCarousel(recipientId, products, pageToken);
    }
  }
}

// ---------------------------------------------------------------------------
// Low-level senders
// ---------------------------------------------------------------------------

async function sendText(
  recipientId: string,
  text: string,
  token: string
): Promise<void> {
  await graphPost(token, {
    recipient: { id: recipientId },
    message: { text },
  });
}

async function sendCarousel(
  recipientId: string,
  products: any[],
  token: string
): Promise<void> {
  if (!products.length) return;

  const elements = products.slice(0, 10).map((p) => ({
    title: p.name,
    subtitle: `${formatMoney(p.price || 0)} — ${p.hero_note || p.short_description || ""}`.slice(0, 80),
    image_url: p.image_url || "https://placehold.co/300x200?text=Drone",
    buttons: [
      {
        type: "web_url",
        title: "🛒 Захиалах",
        url: `${SITE_URL}/products/${p.slug || p.id}`,
      },
      {
        type: "postback",
        title: "📋 Дэлгэрэнгүй",
        payload: `DETAIL_${p.id}`,
      },
      {
        type: "postback",
        title: "💰 Зээлээр авах",
        payload: `FINANCE_${p.id}`,
      },
    ],
  }));

  await graphPost(token, {
    recipient: { id: recipientId },
    message: {
      attachment: {
        type: "template",
        payload: { template_type: "generic", elements },
      },
    },
  });
}

async function sendFinancingActions(
  recipientId: string,
  token: string
): Promise<void> {
  await graphPost(token, {
    recipient: { id: recipientId },
    message: {
      text: "Та дараагийн алхамаа сонгоно уу:",
      quick_replies: [
        {
          content_type: "text",
          title: "🏦 Зээлийн байгууллага",
          payload: "FINANCE_INSTITUTION",
        },
        {
          content_type: "text",
          title: "👤 Ажилтантай ярих",
          payload: "LEAD_FORM_START",
        },
        {
          content_type: "text",
          title: "📞 8815-7242 Утасдах",
          payload: "CALL_US",
        },
      ],
    },
  });
}

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
