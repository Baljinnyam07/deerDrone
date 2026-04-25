/**
 * Messenger webhook handler — refactored for rule-first, AI-free postbacks.
 *
 * Key changes from original:
 *  - ORDER_{id}  → capture lead + static ack (no simulated AI message)
 *  - DETAIL_{id} → fetch product from DB + static detail card (no AI)
 *  - Text messages still go through runConversation (rule-first engine)
 *  - Long text split safely at ≤ 1900 chars
 */

import { runConversation } from "./engine/conversation.js";
import {
  getMessengerConfigTool,
  captureLeadTool,
} from "./tools/catalog.js";
import { getProductById, toChatCards } from "./productMatcher.js";
import { STATIC } from "./constants/staticResponses.js";
import { formatMoney } from "./utils.js";

const API_VERSION = "v20.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}/me`;

// ---------------------------------------------------------------------------
// Typing indicator
// ---------------------------------------------------------------------------
export async function sendTyping(senderId: string, token: string, on = true) {
  if (!token) return;
  try {
    await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        sender_action: on ? "typing_on" : "typing_off",
      }),
    });
  } catch {
    // Non-fatal — ignore typing errors
  }
}

// ---------------------------------------------------------------------------
// Text message sender (with safe chunking)
// ---------------------------------------------------------------------------
export async function sendMessage(senderId: string, text: string, token: string) {
  if (!token) return;
  const chunks = splitMessage(text, 1900);
  for (const chunk of chunks) {
    try {
      await fetch(`${BASE_URL}/messages?access_token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: chunk },
        }),
      });
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  }
}

// ---------------------------------------------------------------------------
// Image sender
// ---------------------------------------------------------------------------
export async function sendImage(senderId: string, imageUrl: string, token: string) {
  if (!token || !imageUrl) return;
  try {
    await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          attachment: {
            type: "image",
            payload: {
              url: imageUrl,
              is_reusable: true,
            },
          },
        },
      }),
    });
  } catch (err) {
    console.error("sendImage error:", err);
  }
}

// ---------------------------------------------------------------------------
// Product carousel sender
// ---------------------------------------------------------------------------
export async function sendProductCarousel(
  senderId: string,
  products: any[],
  token: string
) {
  if (!token || !products.length) return;

  const siteUrl = process.env.SITE_URL || "https://deerdrone.mn";
  const elements = products.slice(0, 10).map((p) => ({
    title: p.name,
    subtitle: `${formatMoney(p.price || 0)} — ${
      p.heroNote || p.short_description || "Дэлгэрэнгүй мэдээлэл"
    }`,
    image_url:
      p.image_url || p.image || "https://placehold.co/300x200?text=Drone",
    buttons: [
      {
        type: "web_url",
        title: "🛒 Захиалах",
        url: `${siteUrl}/products/${p.slug || p.id}`,
      },
      {
        type: "postback",
        title: "📋 Дэлгэрэнгүй",
        payload: `DETAIL_${p.id}`,
      },
    ],
  }));

  try {
    await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          attachment: {
            type: "template",
            payload: { template_type: "generic", elements },
          },
        },
      }),
    });
  } catch (err) {
    console.error("sendProductCarousel error:", err);
  }
}

// ---------------------------------------------------------------------------
// Postback handlers — NO AI involved
// ---------------------------------------------------------------------------

async function handleOrderPostback(
  senderId: string,
  productId: string,
  token: string
) {
  const product = await getProductById(productId);

  if (!product) {
    await sendMessage(senderId, STATIC.productNotFound, token);
    return;
  }

  const siteUrl = process.env.SITE_URL || "https://deerdrone.mn";
  const orderUrl = `${siteUrl}/products/${product.slug}`;

  await sendMessage(
    senderId,
    `🛒 "${product.name}" захиалахын тулд доорх холбоосоор орно уу:\n${orderUrl}`,
    token
  );
}

async function handleDetailPostback(
  senderId: string,
  productId: string,
  token: string
) {
  const product = await getProductById(productId);

  if (!product) {
    await sendMessage(senderId, STATIC.productNotFound, token);
    return;
  }

  // Build a compact detail message (static template)
  const detail =
    `📦 ${product.name}\n` +
    `💰 Үнэ: ${formatMoney(product.price)}\n` +
    (product.heroNote ? `✨ ${product.heroNote}\n` : "") +
    (product.short_description ? `📝 ${product.short_description}\n` : "") +
    `\nДэлгэрэнгүй мэдэх эсвэл захиалах бол доорх товчийг дарна уу.`;

  await sendMessage(senderId, detail, token);
  // Send single-item carousel so they can ORDER or ask for more DETAIL
  await sendProductCarousel(senderId, toChatCards([product]), token);
}

// ---------------------------------------------------------------------------
// Main webhook event handler
// ---------------------------------------------------------------------------
export async function handleWebhookEvent(event: any) {
  const senderId: string = event.sender?.id;
  if (!senderId) return;

  console.log("WEBHOOK_EVENT", {
    senderId,
    hasMessage: !!event.message,
    hasPostback: !!event.postback,
  });

  const config = await getMessengerConfigTool();

  if (!config || !config.is_enabled) {
    console.log("MESSENGER_DISABLED", { hasConfig: !!config });
    if (config?.page_access_token) {
      await sendMessage(senderId, STATIC.systemDisabled, config.page_access_token);
    }
    return;
  }

  const token: string = config.page_access_token;
  if (!token) return;

  // ── Postback handling (ORDER / DETAIL) — deterministic, NO AI ──────────
  if (event.postback) {
    const payload: string = event.postback.payload ?? "";

    if (payload.startsWith("ORDER_")) {
      const productId = payload.slice(6);
      await sendTyping(senderId, token);
      await handleOrderPostback(senderId, productId, token);
      return;
    }

    if (payload.startsWith("DETAIL_")) {
      const productId = payload.slice(7);
      await sendTyping(senderId, token);
      await handleDetailPostback(senderId, productId, token);
      return;
    }

    // Unknown postback — ignore silently
    return;
  }

  // ── Text message handling ───────────────────────────────────────────────
  if (event.message?.text && !event.message.is_echo) {
    const text: string = event.message.text;
    console.log("TEXT_MESSAGE", { senderId, text: text.slice(0, 80) });

    await sendTyping(senderId, token);

    try {
      const response = await runConversation({ sessionId: senderId, message: text });

      if (response.reply) {
        await sendMessage(senderId, response.reply, token);
      }
      if (response.image) {
        await sendImage(senderId, response.image, token);
      }
      if (response.cards && response.cards.length > 0) {
        await sendProductCarousel(senderId, response.cards, token);
      }
    } catch (err) {
      console.error("Conversation error:", err);
      await sendMessage(senderId, STATIC.systemError, token);
    }
  }
}

// ---------------------------------------------------------------------------
// Internal: safe text splitter
// ---------------------------------------------------------------------------
function splitMessage(text: string, limit = 1900): string[] {
  if (text.length <= limit) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + limit;
    if (end < text.length) {
      // Prefer splitting at newline or space
      const lastNL = text.lastIndexOf("\n", end);
      const lastSP = text.lastIndexOf(" ", end);
      const breakAt = lastNL > start + limit / 2 ? lastNL + 1 : lastSP > start + limit / 2 ? lastSP + 1 : end;
      end = breakAt;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks.filter(Boolean);
}
