/**
 * Messenger webhook handler — refactored for rule-first, AI-free postbacks.
 *
 * Key changes from original:
 *  - ORDER_{id}  → capture lead + static ack (no simulated AI message)
 *  - DETAIL_{id} → fetch product from DB + static detail card (no AI)
 *  - Text messages still go through runConversation (rule-first engine)
 *  - Long text split safely at ≤ 1900 chars
 */

import { createHash } from "node:crypto";
import { runConversation } from "./engine/conversation.js";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Fallback in-memory pause state
const botPausedState = new Map<string, number>();

// ---------------------------------------------------------------------------
// Human takeover
// ---------------------------------------------------------------------------
// Every message the bot sends carries this metadata; Facebook returns it on the
// echo. An echo WITHOUT it was typed by a staff member (Page Inbox, Business
// Suite, phone app — those echoes carry Facebook's own app_id, so app_id can't
// tell bot from human).
const BOT_METADATA = "DEER_BOT";
const HUMAN_PAUSE_SECONDS = 15 * 60;
const memStore = new Map<string, number>(); // key → expiry ms, used when Redis is absent

async function kvSet(key: string, seconds: number) {
  if (redis) await redis.set(key, "1", { ex: seconds });
  else memStore.set(key, Date.now() + seconds * 1000);
}

async function kvHas(key: string): Promise<boolean> {
  if (redis) return !!(await redis.get(key));
  const exp = memStore.get(key);
  if (exp && exp > Date.now()) return true;
  memStore.delete(key);
  return false;
}

function textKey(text: string): string {
  return createHash("sha1").update(text.trim()).digest("hex").slice(0, 16);
}

/** Remember what the bot just sent, for echoes that come back without metadata (e.g. Instagram). */
async function rememberBotSend(recipientId: string, text?: string) {
  await kvSet(`bot_active_${recipientId}`, 60);
  if (text) await kvSet(`bot_text_${recipientId}_${textKey(text)}`, 120);
}

async function isOwnEcho(event: any, recipientId: string): Promise<boolean> {
  if (event.message?.metadata === BOT_METADATA) return true;
  const text: string = event.message?.text ?? "";
  if (text) return kvHas(`bot_text_${recipientId}_${textKey(text)}`);
  // Facebook always returns metadata, so a text-less FB echo without it is staff (e.g. an image).
  // Instagram echoes (no is_echo flag) may drop metadata: ours if the bot sent something just now.
  const isInstagramEcho = !event.message?.is_echo;
  return isInstagramEcho && kvHas(`bot_active_${recipientId}`);
}

export async function pauseBotFor(customerId: string) {
  await kvSet(`bot_paused_${customerId}`, HUMAN_PAUSE_SECONDS);
}

export async function isBotPausedFor(customerId: string): Promise<boolean> {
  return kvHas(`bot_paused_${customerId}`);
}
import {
  captureLeadTool,
  supabase,
} from "./tools/catalog.js";
import { getProductById } from "./productMatcher.js";
import { toChatCards } from "./tools/catalog.js";
import { STATIC } from "./constants/staticResponses.js";
import { formatMoney } from "./utils.js";

const API_VERSION = "v20.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}/me`;

// ---------------------------------------------------------------------------
// DB Logger
// ---------------------------------------------------------------------------
async function logConversation(sessionId: string, role: "user" | "bot" | "admin", content: string) {
  try {
    await supabase.from("conversations").insert({ session_id: sessionId, role, content });
  } catch (err) {
    console.error("Failed to log conversation:", err);
  }
}

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
export async function sendMessage(senderId: string, text: string, token: string, quickReplies?: { title: string; payload: string }[]) {
  if (!token) return;
  await logConversation(senderId, "bot", text);
  const chunks = splitMessage(text, 1900);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isLast = i === chunks.length - 1;

    const qr = (isLast && quickReplies && quickReplies.length > 0) ? quickReplies.map(qr => ({
      content_type: "text",
      title: qr.title.substring(0, 20), // FB quick reply title limit is 20
      payload: qr.payload
    })) : undefined;

    try {
      await rememberBotSend(senderId, chunk);
      const response = await fetch(`${BASE_URL}/messages?access_token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: {
            text: chunk,
            metadata: BOT_METADATA,
            ...(qr ? { quick_replies: qr } : {})
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Facebook API Error:", {
          status: response.status,
          data: errorData,
          tokenPreview: `...${token.slice(-5)}`
        });
      }
    } catch (err) {
      console.error("sendMessage fetch error:", err);
    }
  }
}

// ---------------------------------------------------------------------------
// Image sender
// ---------------------------------------------------------------------------
export async function sendImage(senderId: string, imageUrl: string, token: string) {
  if (!token || !imageUrl) return;
  try {
    await rememberBotSend(senderId);
    await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          metadata: BOT_METADATA,
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
// Video sender
// ---------------------------------------------------------------------------
export async function sendVideo(senderId: string, videoUrl: string, token: string) {
  if (!token || !videoUrl) return;
  console.log("[sendVideo] Sending video:", videoUrl);
  try {
    await rememberBotSend(senderId);
    const response = await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          metadata: BOT_METADATA,
          attachment: {
            type: "video",
            payload: {
              url: videoUrl,
              is_reusable: true,
            },
          },
        },
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("[sendVideo] Facebook API error:", JSON.stringify(err));
    } else {
      console.log("[sendVideo] Success");
    }
  } catch (err) {
    console.error("sendVideo error:", err);
  }
}

// ---------------------------------------------------------------------------
// Button template sender — shows a URL as a tappable button in Messenger
// ---------------------------------------------------------------------------
export async function sendButtonTemplate(
  senderId: string,
  text: string,
  buttons: { title: string; url: string }[],
  token: string
) {
  if (!token) return;
  try {
    await rememberBotSend(senderId, text.substring(0, 640));
    await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          metadata: BOT_METADATA,
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: text.substring(0, 640), // FB button template text limit
              buttons: buttons.slice(0, 3).map((b) => ({
                type: "web_url",
                title: b.title.substring(0, 20), // FB button title limit
                url: b.url,
              })),
            },
          },
        },
      }),
    });
  } catch (err) {
    console.error("sendButtonTemplate error:", err);
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

  const siteUrl = process.env.SITE_URL || "https://www.deerdrone.mn";
  const elements = products.slice(0, 10).map((p) => ({
    title: p.name,
    subtitle: `${formatMoney(p.price || 0)} — ${
      p.heroNote || p.short_description || "Дэлгэрэнгүй мэдээлэл"
    }`,
    image_url:
      p.image_url || p.image || "https://placehold.co/300x200.png?text=Drone",
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
    await rememberBotSend(senderId);
    await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          metadata: BOT_METADATA,
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

  // Хэрэглэгч захиалах товч дарсныг Lead үүсгэж бүртгэж авах
  await captureLeadTool(
    "Тодорхойгүй (Messenger)",
    "",
    `Захиалах товч дарсан: ${product.name}`,
    "order_intent",
    "messenger",
    senderId
  ).catch(console.error);

  const siteUrl = (process.env.SITE_URL || "https://www.deerdrone.mn").replace(/\/$/, "");
  const orderUrl = `${siteUrl}/products/${product.slug}`;

  // Send as a tappable button instead of plain text URL
  await sendButtonTemplate(
    senderId,
    `🛒 "${product.name.substring(0, 60)}" захиалахын тулд:`,
    [{ title: "🌐 Вэбсайтаас захиалах", url: orderUrl }],
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

  // Үзүүлэлтүүдийг жагсаалт хэлбэрээр харуулах
  let specsList = "";
  const desc = product.description || product.short_description || "";
  if (desc) {
    const hasBullets = desc.includes("•") || desc.includes("- ");
    if (hasBullets) {
      specsList = desc; 
    } else {
      const sentences = desc.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
      specsList = sentences.slice(0, 5).map(s => `• ${s}`).join("\n");
    }
  }

  const siteUrl = (process.env.SITE_URL || "https://www.deerdrone.mn").replace(/\/$/, "");
  const orderUrl = `${siteUrl}/products/${product.slug}`;

  // Text detail — no URL at the end (button template handles it below)
  const detail =
    `📦 *${product.name}*\n` +
    `💰 Үнэ: ${formatMoney(product.price)}\n\n` +
    (product.heroNote ? `✨ ${product.heroNote}\n\n` : "") +
    (specsList ? `📋 Үзүүлэлт ба давуу тал:\n${specsList}` : "");

  await sendMessage(senderId, detail.trim(), token);

  // Send tappable button for ordering
  await sendButtonTemplate(
    senderId,
    "Захиалах эсвэл дэлгэрэнгүй харах:",
    [{ title: "🛒 Захиалах", url: orderUrl }],
    token
  );
}

// ---------------------------------------------------------------------------
// Main webhook event handler
// ---------------------------------------------------------------------------
export async function handleWebhookEvent(event: any, pageToken: string, pageId?: string) {
  const senderId: string = event.sender?.id;
  if (!senderId) return;

  // ── Instagram echo detection ─────────────────────────────────────────────
  // Facebook Messenger: admin reply comes with is_echo: true
  // Instagram: is_echo flag is sometimes MISSING — detect by comparing senderId to pageId
  const isEcho: boolean = !!event.message?.is_echo || (!!pageId && senderId === pageId);

  console.log("WEBHOOK_EVENT", {
    senderId,
    pageId,
    isEcho,
    hasMessage: !!event.message,
    hasPostback: !!event.postback,
  });

  if (!pageToken) {
    console.log("MESSENGER_DISABLED: no token provided");
    return;
  }

  const token: string = pageToken;

  // ── Postback handling (ORDER / DETAIL) — deterministic, NO AI ──────────
  if (event.postback) {
    // Staff is talking to this customer → old carousel buttons stay quiet too
    if (await isBotPausedFor(senderId)) {
      console.log(`[messenger] Bot is paused for ${senderId}. Ignoring postback.`);
      return;
    }
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



// ── Echo / admin reply handling ─────────────────────────────────────────
  // isEcho = true when: Facebook is_echo flag OR Instagram senderId === pageId
  if (isEcho) {
    const text = event.message?.text || "";
    const recipientId: string | undefined = event.recipient?.id;
    if (!recipientId) return;

    // ✅ Bot-ийн өөрийн мессеж (metadata = DEER_BOT, эсвэл саяхан илгээсэн текст)
    // app_id-аар ялгах боломжгүй: Page Inbox / Business Suite-ээс ажилтны бичсэн
    // мессежид ч Facebook-ийн app_id ирдэг.
    if (await isOwnEcho(event, recipientId)) {
      console.log(`[messenger] Ignoring bot-sent echo for ${recipientId}`);
      return;
    }

    // Facebook-ийн автомат хариултуудыг алгасах
    if (
      text.includes("Бид танд тун удахгүй мэдээлэл илгээнэ") || 
      text.includes("This chat contains a reply to your ad") ||
      text.includes("Бид танд удахгүй хариу өгнө") ||
      text.includes("Та Дийр Дрон дэлгүүртэй холбогдсон байна")
    ) {
      console.log(`[messenger] Ignoring automated echo message.`);
      return;
    }

    // Staff replied by hand → bot stays silent for this customer for 15 minutes.
    // Each further staff message restarts the 15 minutes.
    console.log(`[messenger] Staff replied. Pausing bot ${HUMAN_PAUSE_SECONDS / 60} min for ${recipientId}`);
    await pauseBotFor(recipientId);
    if (text) await logConversation(recipientId, "admin", text);
    return;
  }

  // ── Helper: like-д хариу өгөх ────────────────────────────────────────────
  const CATEGORY_QUICK_REPLIES = [
    { title: "Дрон", payload: "Дрон" },
    { title: "Камер", payload: "Камер" },
    { title: "Гар төхөөрөмж", payload: "Гар төхөөрөмж" },
    { title: "Дагалдах хэрэгсэл", payload: "Дагалдах хэрэгсэл" },
  ];

  async function respondToLike() {
    // Bot паузтай байвал хариу өгөхгүй
    if (await isBotPausedFor(senderId)) { console.log(`[messenger] Paused. Ignoring like.`); return; }
    await sendTyping(senderId, token);
    await sendMessage(senderId, STATIC.fallback, token, CATEGORY_QUICK_REPLIES);
  }

  // ── Facebook Reaction event (long-press emoji reaction) ──────────────────
  // event.reaction нь event.message-гүйгээр ТУСДАА event-ийн хэлбэрт ирдэг!
  // { sender: {id}, reaction: { action: "react", reaction: "like", emoji: "👍" } }
  if (event.reaction) {
    const reactionType = event.reaction.reaction;
    const reactionAction = event.reaction.action;
    console.log("REACTION_EVENT", { senderId, reactionType, reactionAction });
    // "react" = шинэ reaction, "unreact" = reaction буцаасан
    if (reactionAction === "react" && (reactionType === "like" || reactionType === "thumbsup" || reactionType === "👍")) {
      await respondToLike();
    }
    return;
  }

  // ── Facebook native "Like" button (цэнхэр default like/thumb) ───────────
  // Facebook-ийн цэнхэр like товч дарахад text биш sticker/attachment ирдэг
  // Sticker ID-нууд: 369239263222822 (жижиг), 369239343222814 (дунд), 369239383222810 (том)
  const FACEBOOK_LIKE_STICKER_IDS = ["369239263222822", "369239343222814", "369239383222810"];
  
  const msgStickerId = event.message?.sticker_id?.toString();
  const hasStickerAttachment = event.message?.attachments?.some((a: any) => {
    const sId = a.payload?.sticker_id?.toString();
    return sId && FACEBOOK_LIKE_STICKER_IDS.includes(sId);
  });

  const isNativeLike =
    !event.message?.is_echo &&
    event.message &&
    (
      (msgStickerId && FACEBOOK_LIKE_STICKER_IDS.includes(msgStickerId)) ||
      hasStickerAttachment ||
      event.message.attachments?.some((a: any) => a.type === "like_heart")
    );

  if (isNativeLike) {
    console.log("NATIVE_LIKE_STICKER", { senderId, stickerId: event.message.sticker_id });
    await respondToLike();
    return;
  }

  if (event.message?.text && !event.message.is_echo) {
    const text: string = event.message.text;
    const mid: string = event.message.mid;
    
    // ── Deduplicate messages to prevent double replies ──────────
    if (mid) {
      if (redis) {
        // Atomic claim (NX): two concurrent deliveries of the same mid can't both pass
        const claimed = await redis.set(`msg_processed_${mid}`, "1", { ex: 60 * 60 * 24, nx: true });
        if (!claimed) {
          console.log(`[messenger] Duplicate message skipped (redis): ${mid}`);
          return;
        }
      } else {
        const isProcessed = botPausedState.has(`msg_${mid}`);
        if (isProcessed) {
          console.log(`[messenger] Duplicate message skipped (mem): ${mid}`);
          return;
        }
        botPausedState.set(`msg_${mid}`, Date.now()); // Using botPausedState map as an in-memory store for simplicity
      }
    }

    console.log("TEXT_MESSAGE", { senderId, text: text.slice(0, 80) });

    await logConversation(senderId, "user", text);

    // Staff is handling this customer → bot stays silent (message is still logged above)
    if (await isBotPausedFor(senderId)) {
      console.log(`[messenger] Bot is paused for ${senderId}. Ignoring message.`);
      return;
    }

    await sendTyping(senderId, token);

    try {
      const response = await runConversation({ sessionId: senderId, message: text });

      if (response.reply) {
        await sendMessage(senderId, response.reply, token, response.quickReplies);
      }
      if (response.image) {
        await sendImage(senderId, response.image, token);
      }
      if (response.video) {
        await sendVideo(senderId, response.video, token);
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
