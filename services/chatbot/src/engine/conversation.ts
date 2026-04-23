/**
 * Rule-First Conversation Engine
 *
 * Decision tree (in order):
 *  1. Classify intent deterministically (no AI)
 *  2. Short-circuit with static response if possible
 *  3. For product intents → DB lookup + carousel
 *  4. For lead intents → capture lead + static ack
 *  5. AI ONLY for: technical_consultation, compare_products, unknown (drone-related)
 *
 * Token-saving measures:
 *  - History capped at 4 turns (8 messages)
 *  - max_tokens = 300
 *  - temperature = 0.3
 *  - Only 1–3 relevant products in context (not full catalog)
 *  - Full catalog only when no keyword match exists
 */

import type { ChatRequest, ChatResponse } from "../types.js";
import { OpenAI } from "openai";
import { classifyIntent, looksLikeDroneRelated, type Intent } from "../intents.js";
import { STATIC } from "../constants/staticResponses.js";
import { systemPrompt } from "../prompts/system.js";
import {
  matchProducts,
  getMinimalCatalogContext,
  getProductsByIds,
  toChatCards,
} from "../productMatcher.js";
import {
  captureLeadTool,
  getAllProductsTool,
  getFeaturedProductsTool,
  getSystemPromptTool,
} from "../tools/catalog.js";

// ---------------------------------------------------------------------------
// OpenAI client (lazy — only created when key is present)
// ---------------------------------------------------------------------------
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// ---------------------------------------------------------------------------
// Conversation history — capped at MAX_TURNS * 2 messages (user + assistant)
// ---------------------------------------------------------------------------
const MAX_TURNS = 4; // 4 user + 4 assistant = 8 messages max
const conversationHistory = new Map<
  string,
  Array<{ role: "assistant" | "user"; content: string }>
>();

function getHistory(sessionId: string) {
  return conversationHistory.get(sessionId) ?? [];
}

function addToHistory(
  sessionId: string,
  role: "assistant" | "user",
  content: string
) {
  const history = getHistory(sessionId);
  history.push({ role, content });
  // Keep only last MAX_TURNS * 2 messages
  if (history.length > MAX_TURNS * 2) history.splice(0, 2);
  conversationHistory.set(sessionId, history);
}

// ---------------------------------------------------------------------------
// Lead capture helper
// ---------------------------------------------------------------------------
async function captureLead(
  interest: string,
  intent: Intent,
  category?: string
) {
  try {
    await captureLeadTool("Тодорхойгүй", "", interest, intent, category);
  } catch (err) {
    console.error("captureLead error:", err);
  }
}

// ---------------------------------------------------------------------------
// AI fallback — only called for consultation / compare / unknown drone topics
// ---------------------------------------------------------------------------
async function callAI(
  sessionId: string,
  message: string,
  intent: Intent,
  contextProducts: { id: string; name: string; price: number }[]
): Promise<{ reply: string; cards: any[] }> {
  if (!openai) {
    return { reply: STATIC.llmNotConfigured, cards: [] };
  }

  try {
    // Use DB prompt if admin has customised it, else use local compact prompt
    const dbPrompt = await getSystemPromptTool();
    const basePrompt = dbPrompt || systemPrompt;

    // Only inject products if we have them (saves tokens when empty)
    const productsContext =
      contextProducts.length > 0
        ? JSON.stringify(contextProducts)
        : "[]";
    const prompt = basePrompt.replace("{productsContext}", productsContext);

    const history = getHistory(sessionId);
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: prompt },
      ...history,
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 300,      // Hard cap — was 1000
      temperature: 0.3,     // Lower = more deterministic = cheaper retries
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    console.log("🤖 AI raw:", raw);

    let result: any = {};
    try {
      result = JSON.parse(raw);
    } catch {
      return { reply: STATIC.fallback, cards: [] };
    }

    let reply =
      result.message ||
      result.response ||
      result.reply;

    if (!reply) {
      const firstStr = Object.values(result).find(v => typeof v === 'string');
      reply = firstStr ? String(firstStr) : STATIC.fallback;
    }

    // Resolve any AI-suggested product IDs to cards
    const suggestedIds: string[] = Array.isArray(result.suggested_product_ids)
      ? result.suggested_product_ids
          .map((x: any) => (typeof x === "string" ? x : x?.id))
          .filter(Boolean)
          .slice(0, 3)
      : [];

    let cards: any[] = [];
    if (suggestedIds.length > 0) {
      const found = await getProductsByIds(suggestedIds);
      cards = toChatCards(found);
    }

    return { reply, cards };
  } catch (err) {
    console.error("OpenAI error:", err);
    return { reply: STATIC.systemError, cards: [] };
  }
}

// ---------------------------------------------------------------------------
// Main conversation handler
// ---------------------------------------------------------------------------
export async function runConversation(request: ChatRequest): Promise<ChatResponse> {
  const { sessionId, message } = request;

  // ── Step 1: Classify intent deterministically ──────────────────────────
  const intent = classifyIntent(message);
  console.log(`[intent] ${intent} | "${message.slice(0, 60)}"`);

  // ── Step 2: Static short-circuit paths (ZERO AI) ──────────────────────

  if (intent === "spam") {
    return reply(sessionId, STATIC.spam);
  }

  if (intent === "off_topic") {
    return reply(sessionId, STATIC.off_topic);
  }

  if (intent === "greeting") {
    // Show featured / newest products (up to 6 for carousel)
    const featured = await getFeaturedProductsTool(6);
    const mapped = featured.map((p: any) => ({ ...p, heroNote: p.hero_note }));
    const cards = toChatCards(mapped);
    return reply(sessionId, STATIC.greeting, cards);
  }

  if (intent === "delivery") {
    return reply(sessionId, STATIC.delivery);
  }

  if (intent === "human_handoff") {
    await captureLead(message, intent);
    return reply(sessionId, STATIC.humanHandoff);
  }

  // ── Step 3: Lead capture paths (ZERO AI) ──────────────────────────────

  if (intent === "loan_request") {
    await captureLead(message, intent, "loan");
    return reply(sessionId, STATIC.loanAck);
  }

  if (intent === "lease_request") {
    await captureLead(message, intent, "lease");
    return reply(sessionId, STATIC.leaseAck);
  }

  if (intent === "rental_request") {
    await captureLead(message, intent, "rental");
    return reply(sessionId, STATIC.rentalAck);
  }

  if (intent === "quote_request") {
    await captureLead(message, intent, "quote");
    return reply(sessionId, STATIC.quoteAck);
  }

  if (intent === "bulk_order") {
    await captureLead(message, intent, "bulk_order");
    return reply(sessionId, STATIC.bulkOrderAck);
  }

  // ── Step 4: Product browse — DB only, no AI ───────────────────────────

  if (intent === "product_search" || intent === "product_detail") {
    const matched = await matchProducts(message);

    if (matched.length > 0) {
      const cards = toChatCards(matched);
      return reply(sessionId, STATIC.productsIntro, cards);
    }

    // No keyword match → show featured products up to 6
    const featured = await getFeaturedProductsTool(6);
    if (featured.length === 0) return reply(sessionId, STATIC.noProducts);
    const mapped = featured.map((p: any) => ({ ...p, heroNote: p.hero_note }));
    const cards = toChatCards(mapped);
    return reply(sessionId, STATIC.productsIntro, cards);
  }

  if (intent === "order_request") {
    // Try to identify which product they want
    const matched = await matchProducts(message);
    const siteUrl = process.env.SITE_URL || "https://deerdrone.mn";

    if (matched.length > 0) {
      const product = matched[0];
      const orderUrl = `${siteUrl}/products/${product.slug}`;
      const cards = toChatCards(matched);
      return reply(
        sessionId,
        `🛒 "${product.name}" захиалахын тулд доорх холбоосоор орно уу:\n${orderUrl}`,
        cards
      );
    }

    // Product unclear — show catalog and let them pick
    const featured = await getFeaturedProductsTool(4);
    const mapped = featured.map((p: any) => ({ ...p, slug: p.slug ?? "", heroNote: p.hero_note ?? "" }));
    const cards = toChatCards(mapped);
    return reply(
      sessionId,
      "Юу бүтээгдэхүүнийг захиалах гэж байна вэ? Доорх бүтээгдэхүүнийг сонгох уу 👇",
      cards
    );
  }

  // ── Step 5: AI fallback — consultation, compare, or unknown drone topic ─

  if (
    intent === "technical_consultation" ||
    intent === "compare_products" ||
    (intent === "unknown" && looksLikeDroneRelated(message))
  ) {
    // Get minimal context: try to match specific products first (1-3),
    // fall back to small catalog summary (max 8)
    const matched = await matchProducts(message);
    const contextProducts =
      matched.length > 0
        ? matched.map((p) => ({ id: p.id, name: p.name, price: p.price }))
        : await getMinimalCatalogContext(8);

    const { reply: aiReply, cards: aiCards } = await callAI(
      sessionId,
      message,
      intent,
      contextProducts
    );

    // Only store consultation messages in history (not static responses)
    addToHistory(sessionId, "user", message);
    addToHistory(sessionId, "assistant", aiReply);

    return {
      sessionId,
      reply: aiReply,
      cards: aiCards.length > 0 ? aiCards : undefined,
    };
  }

  // ── Step 6: True unknown — off-topic rejection (ZERO AI) ─────────────
  return reply(sessionId, STATIC.off_topic);
}

// ---------------------------------------------------------------------------
// Helper: build ChatResponse without touching history
// ---------------------------------------------------------------------------
function reply(
  sessionId: string,
  text: string,
  cards?: any[]
): ChatResponse {
  return {
    sessionId,
    reply: text,
    cards: cards && cards.length > 0 ? cards : undefined,
  };
}

// ---------------------------------------------------------------------------
// Streaming helper (unchanged API surface)
// ---------------------------------------------------------------------------
export function streamChunks(text: string): string[] {
  return text
    .split(/(?<=\.)\s+/)
    .filter(Boolean)
    .map((chunk) => (chunk.endsWith(".") ? chunk : `${chunk}.`));
}
