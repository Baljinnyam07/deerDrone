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
} from "../productMatcher.js";
import {
  captureLeadTool,
  getAllProductsTool,
  getFeaturedProductsTool,
  getSystemPromptTool,
  getCheapestByCategory,
  toChatCards,
  incrementTokenUsage,
  supabase,
} from "../tools/catalog.js";
import { z } from "zod";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// OpenAI & Redis clients
// ---------------------------------------------------------------------------
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// ---------------------------------------------------------------------------
// Zod Schema for AI Output
// ---------------------------------------------------------------------------
const AiResponseSchema = z.object({
  message: z.string().optional(),
  response: z.string().optional(),
  reply: z.string().optional(),
  suggested_product_ids: z.array(z.union([z.string(), z.object({ id: z.string() })])).optional(),
}).catchall(z.any());

const CATEGORY_QUICK_REPLIES = [
  { title: "Дрон", payload: "Дрон" },
  { title: "Камер", payload: "Камер" },
  { title: "Гар төхөөрөмж", payload: "Гар төхөөрөмж" },
  { title: "Дагалдах хэрэгсэл", payload: "Дагалдах хэрэгсэл" }
];

// ---------------------------------------------------------------------------
// Conversation history — capped at MAX_TURNS * 2 messages (user + assistant)
// ---------------------------------------------------------------------------
const MAX_TURNS = 4; // 4 user + 4 assistant = 8 messages max
const conversationHistory = new Map<
  string,
  Array<{ role: "assistant" | "user"; content: string }>
>();

async function getHistory(sessionId: string): Promise<Array<{ role: "assistant" | "user"; content: string }>> {
  if (redis) {
    const history = await redis.get<Array<{ role: "assistant" | "user"; content: string }>>(`history_${sessionId}`);
    return history || [];
  }
  return conversationHistory.get(sessionId) ?? [];
}

async function addToHistory(
  sessionId: string,
  role: "assistant" | "user",
  content: string
) {
  const history = await getHistory(sessionId);
  history.push({ role, content });
  if (history.length > MAX_TURNS * 2) history.splice(0, 2);

  if (redis) {
    // Keep history for 24 hours
    await redis.set(`history_${sessionId}`, history, { ex: 60 * 60 * 24 });
  } else {
    conversationHistory.set(sessionId, history);
  }
}

// ---------------------------------------------------------------------------
// Lead capture helper
// ---------------------------------------------------------------------------
async function captureLead(
  sessionId: string,
  interest: string,
  intent: Intent,
  category?: string
) {
  try {
    await captureLeadTool("Тодорхойгүй", "", interest, intent, category, sessionId);
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
  contextProducts: { id: string; name: string; price: number; heroNote: string }[]
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
    let prompt = basePrompt.replace("{productsContext}", productsContext);
    prompt += `\n\nЧУХАЛ ЗААВАР:
    - Хэрэглэгчтэй маш найрсаг, "амьд" харилцаа үүсгэ.
    - Хэрэв хэрэглэгчийн хайсан онцгой зориулалтын бараа манайд байхгүй байвал "байхгүй" гэж шууд таслахын оронд, хамгийн ойр очих эсвэл өөр төстэй сайн загваруудыг ({productsContext}-д байгаа) санал болго.
    - Хариултдаа санал болгож буй барааны нэрийг заавал дурдаж, давуу талыг (heroNote) нь товч тайлбарла.
    - Хэрэглэгчийн асуугаагүй зүйлийг дурдах шаардлагагүй, зөвхөн асуултад нь яг тохируулж хариул.
    
    Та зөвхөн дараах JSON форматаар хариулах ёстой: {"message": "таны хариулт...", "suggested_product_ids": ["id1", "id2"]}. Өөр ямар ч бүтэц ашиглаж болохгүй!`;

    const history = await getHistory(sessionId);
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

    if (completion.usage?.total_tokens) {
      incrementTokenUsage(completion.usage.total_tokens).catch(console.error);
    }

    let parsed: z.infer<typeof AiResponseSchema>;
    try {
      const json = JSON.parse(raw);
      parsed = AiResponseSchema.parse(json);
    } catch (error) {
      console.error("AI Output Parse Error:", error);
      return { reply: STATIC.fallback, cards: [] };
    }

    let reply =
      parsed.message ||
      parsed.response ||
      parsed.reply ||
      STATIC.fallback;

    // Resolve any AI-suggested product IDs to cards
    const suggestedIds: string[] = Array.isArray(parsed.suggested_product_ids)
      ? parsed.suggested_product_ids
        .map((x) => (typeof x === "string" ? x : (x as any)?.id))
        .filter((id): id is string => Boolean(id))
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
    return reply(sessionId, STATIC.greeting, cards, CATEGORY_QUICK_REPLIES);
  }

  if (intent === "delivery") {
    return reply(sessionId, STATIC.delivery);
  }

  if (intent === "human_handoff") {
    await captureLead(sessionId, message, intent);
    return reply(sessionId, STATIC.humanHandoff);
  }

  if (intent === "address") {
    return reply(sessionId, STATIC.address);
  }

  if (intent === "repair") {
    return reply(sessionId, STATIC.repairInfo);
  }

  if (intent === "wind_resistance") {
    return reply(sessionId, STATIC.windResistance);
  }

  if (intent === "vat_info") {
    return reply(sessionId, STATIC.vatInfo);
  }

  if (intent === "accessories_info") {
    const matched = await matchProducts(message);
    if (matched.length > 0) {
      const siteUrl = process.env.SITE_URL || "https://www.deerdrone.mn";
      const cards = toChatCards(matched);
      return reply(
        sessionId,
        `Таны сонирхсон дагалдах хэрэгслүүд:\n\nДэлгэрэнгүйг: ${siteUrl}/products?category=accessories`,
        cards
      );
    }
    return reply(sessionId, STATIC.accessoriesInfo);
  }

  if (intent === "beginner_recommendation") {
    return reply(sessionId, STATIC.beginnerRecommendation);
  }

  if (intent === "website_info") {
    return reply(
      sessionId,
      "Та манай вэб сайтыг сонирхоно уу? 😊 Доорх холбоосоор орж манай бүх бүтээгдэхүүн, үйлчилгээний дэлгэрэнгүй мэдээллийг харах боломжтой:\n\n🌐 https://www.deerdrone.mn/"
    );
  }

  if (intent === "easy_to_control") {
    return reply(sessionId, STATIC.easyToControl);
  }

  // ── Step 3: Lead capture paths (ZERO AI) ──────────────────────────────

  if (intent === "loan_info") {
    const baseUrl = process.env.SITE_URL || "https://www.deerdrone.mn";
    const rawImg = `${baseUrl}/aaaaaaa-01.jpg`;
    const proxyImg = `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=1000&output=jpg`;

    return {
      sessionId,
      reply: STATIC.loanInfo,
      image: proxyImg
    };
  }

  if (intent === "loan_request") {
    await captureLead(sessionId, message, intent, "loan");
    const baseUrl = process.env.SITE_URL || "https://www.deerdrone.mn";
    const rawImg = `${baseUrl}/aaaaaaa-01.jpg`;
    const proxyImg = `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=1000&output=jpg`;

    return {
      sessionId,
      reply: STATIC.loanAck,
      image: proxyImg
    };
  }

  if (intent === "lease_request") {
    await captureLead(sessionId, message, intent, "lease");
    return reply(sessionId, STATIC.leaseAck);
  }

  if (intent === "rental_request") {
    await captureLead(sessionId, message, intent, "rental");
    return reply(sessionId, STATIC.rentalAck);
  }

  if (intent === "quote_request") {
    await captureLead(sessionId, message, intent, "quote");
    return reply(sessionId, STATIC.quoteAck);
  }

  if (intent === "bulk_order") {
    await captureLead(sessionId, message, intent, "bulk_order");
    return reply(sessionId, STATIC.bulkOrderAck);
  }

  // ── Cheapest drone (DB only, zero AI) ────────────────────────────────
  if (intent === "cheapest_drone") {
    const product = await getCheapestByCategory("Дрон");
    if (!product) return reply(sessionId, "Одоогоор дроны мэдээлэл олдсонгүй. Та бидэнтэй шууд холбогдоно уу.");
    const cards = toChatCards([{ ...product, hero_note: product.hero_note }]);
    return reply(
      sessionId,
      `🚁 Манай хамгийн хямдхан дрон бол *${product.name}* — ${(product.price ?? 0).toLocaleString()}₮\n\n${product.short_description || ""}`,
      cards
    );
  }

  // ── Cheapest accessory (DB only, zero AI) ─────────────────────────────
  if (intent === "cheapest_accessory") {
    const product = await getCheapestByCategory("Дагалдах хэрэгсэл");
    if (!product) return reply(sessionId, "Одоогоор дагалдах хэрэгслийн мэдээлэл олдсонгүй. Та бидэнтэй шууд холбогдоно уу.");
    const cards = toChatCards([{ ...product, hero_note: product.hero_note }]);
    return reply(
      sessionId,
      `🔧 Манай хамгийн хямдхан дагалдах хэрэгсэл бол *${product.name}* — ${(product.price ?? 0).toLocaleString()}₮\n\n${product.short_description || ""}`,
      cards
    );
  }

  // ── Cheapest camera (DB only, zero AI) ────────────────────────────────
  if (intent === "cheapest_camera") {
    const product = await getCheapestByCategory("Камер");
    if (!product) return reply(sessionId, "Одоогоор камерын мэдээлэл олдсонгүй. Та бидэнтэй шууд холбогдоно уу.");
    const cards = toChatCards([{ ...product, hero_note: product.hero_note }]);
    return reply(
      sessionId,
      `📷 Манай хамгийн хямдхан камер бол *${product.name}* — ${(product.price ?? 0).toLocaleString()}₮\n\n${product.short_description || ""}`,
      cards
    );
  }

  // ── Cheapest handheld (DB only, zero AI) ──────────────────────────────
  if (intent === "cheapest_handheld") {
    const product = await getCheapestByCategory("Гар төхөөрөмж");
    if (!product) return reply(sessionId, "Одоогоор гар төхөөрөмжийн мэдээлэл олдсонгүй. Та бидэнтэй шууд холбогдоно уу.");
    const cards = toChatCards([{ ...product, hero_note: product.hero_note }]);
    return reply(
      sessionId,
      `📱 Манай хамгийн хямдхан гар төхөөрөмж бол *${product.name}* — ${(product.price ?? 0).toLocaleString()}₮\n\n${product.short_description || ""}`,
      cards
    );
  }

  // ── Show pictures broad request ──────────────────────────────────────
  if (intent === "show_pictures") {
    return reply(
      sessionId,
      "Та ямар бүтээгдэхүүний зураг харахыг хүсэж байна вэ? 😊\n\nМанайд олон төрлийн Дрон, Камер, Гар төхөөрөмж болон Дагалдах хэрэгслүүд бэлэн байгаа. Та доорх цэснээс сонгох эсвэл нэрийг нь бичээрэй.",
      undefined,
      CATEGORY_QUICK_REPLIES
    );
  }

  // ── Step 4a: Vague price inquiry — guide user to specify product ──────

  if (intent === "price_inquiry") {
    return reply(sessionId, STATIC.priceInquiry, undefined, CATEGORY_QUICK_REPLIES);
  }

  // ── Step 4b: Product browse — DB only, no AI ──────────────────────────

  if (intent === "product_search" || intent === "product_detail") {
    const matched = await matchProducts(message);

    if (matched.length > 0) {
      const cards = toChatCards(matched);
      return reply(sessionId, STATIC.productsIntro, cards, CATEGORY_QUICK_REPLIES);
    }

    // --- ENHANCED FALLBACK ---
    // If no specific product matched, try to find products in the same category
    // by checking if the user mentioned a category name
    const lower = message.toLowerCase();
    let categoryKeyword = "";
    if (lower.includes("камер") || lower.includes("camera") || lower.includes("kamer")) categoryKeyword = "Камер";
    else if (lower.includes("дагалдах") || lower.includes("accessory") || lower.includes("mic") || lower.includes("цүнх")) categoryKeyword = "Дагалдах хэрэгсэл";
    else if (lower.includes("гар төхөөрөмж") || lower.includes("handheld") || lower.includes("gimbal")) categoryKeyword = "Гар төхөөрөмж";
    else if (lower.includes("дрон") || lower.includes("dron") || lower.includes("drone")) categoryKeyword = "Дрон";

    if (categoryKeyword) {
      const { data: catProducts } = await supabase
        .from("products")
        .select("id, name, slug, price, hero_note, short_description, product_images(url)")
        .ilike("categories.name", `%${categoryKeyword}%`) // Note: this might need join
        .limit(6);

      // Since ilike on joined table categories.name might be tricky with Supabase JS sometimes 
      // without explicit join, let's use the tool we have or do a quick subquery
      const { data: cat } = await supabase.from("categories").select("id").ilike("name", `%${categoryKeyword}%`).maybeSingle();
      if (cat) {
        const { data: products } = await supabase
          .from("products")
          .select("id, name, slug, price, hero_note, short_description, product_images(url)")
          .eq("category_id", cat.id)
          .limit(6);

        if (products && products.length > 0) {
          const cards = toChatCards(products);
          return reply(sessionId, `Манайд дараах ${categoryKeyword.toLowerCase()}үүд бэлэн байна 👇`, cards, CATEGORY_QUICK_REPLIES);
        }
      }
    }

    // No keyword match or category match → show featured products up to 6
    const featured = await getFeaturedProductsTool(6);
    if (featured.length === 0) return reply(sessionId, STATIC.noProducts, undefined, CATEGORY_QUICK_REPLIES);
    const mapped = featured.map((p: any) => ({ ...p, heroNote: p.hero_note }));
    const cards = toChatCards(mapped);
    return reply(sessionId, STATIC.productsIntro, cards, CATEGORY_QUICK_REPLIES);
  }

  if (intent === "order_request") {
    // Try to identify which product they want
    const matched = await matchProducts(message);
    const siteUrl = process.env.SITE_URL || "https://www.deerdrone.mn";

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
      "Та аль бүтээгдэхүүнийг захиалахыг хүсэж байна вэ? Доорх загваруудаас сонголтоо хийнэ үү 👇",
      cards
    );
  }

  // ── Step 5: AI fallback — consultation, compare, or unknown drone topic ─

  // Try to match products first to see if it's drone-related even if keywords miss
  const matched = await matchProducts(message);

  if (
    intent === "technical_consultation" ||
    intent === "compare_products" ||
    (intent === "unknown" && (looksLikeDroneRelated(message) || matched.length > 0))
  ) {
    // Intercept ambiguous short numeric inputs (like "1") that would confuse the AI
    if (intent === "unknown" && matched.length === 0 && /^\d+[\.\)]?$/.test(message.trim())) {
      return reply(sessionId, STATIC.clarify);
    }

    // Get minimal context: try to match specific products first (1-3),
    // fall back to small catalog summary (max 8)
    const contextProducts =
      matched.length > 0
        ? matched.map((p) => ({ id: p.id, name: p.name, price: p.price, heroNote: p.heroNote }))
        : await getMinimalCatalogContext(8);

    const { reply: aiReply, cards: aiCards } = await callAI(
      sessionId,
      message,
      intent,
      contextProducts
    );

    // Only store consultation messages in history (not static responses)
    await addToHistory(sessionId, "user", message);
    await addToHistory(sessionId, "assistant", aiReply);

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
  cards?: any[],
  quickReplies?: { title: string; payload: string }[]
): ChatResponse {
  return {
    sessionId,
    reply: text,
    cards: cards && cards.length > 0 ? cards : undefined,
    quickReplies
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
