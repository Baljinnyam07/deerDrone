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
import { resolveCategory } from "../categoryAliases.js";
import { systemPrompt } from "../prompts/system.js";
import {
  matchProducts,
  matchByKeywords,
  getProductsByCategory,
  getSpecsSummary,
  getMinimalCatalogContext,
  getProductsByIds,
  type MatchedProduct,
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

// ---------------------------------------------------------------------------
// Product context sent to the AI
// ---------------------------------------------------------------------------
type ContextProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  heroNote: string;
  specs?: string;
};

function toContextProduct(p: MatchedProduct): ContextProduct {
  return {
    id: p.id,
    name: p.name.trim(),
    category: p.categories?.name ?? "",
    price: p.price,
    description: (p.short_description ?? "").slice(0, 160),
    heroNote: p.heroNote,
  };
}

/**
 * True when the message is made of whole words of the product name, or equals a run of
 * consecutive name words with spaces dropped: "osmo360" ↔ "DJI OSMO 360", "lito x1" ↔
 * "DJI LITO X1 …". Not true for a fragment inside a word: "camer" ↔ "camera lens protector".
 */
function isWholeNameMatch(message: string, name: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const msg = norm(message);
  const words = norm(name).split(" ");
  if (!msg) return false;

  if (msg.split(" ").every((t) => words.includes(t))) return true;

  const compact = msg.replace(/ /g, "");
  for (let i = 0; i < words.length; i++) {
    let run = "";
    for (let j = i; j < words.length && run.length < compact.length; j++) {
      run += words[j];
      if (run === compact) return true;
    }
  }
  return false;
}

const CATEGORY_QUICK_REPLIES = [
  { title: "Дрон", payload: "Дрон" },
  { title: "Камер", payload: "Камер" },
  { title: "Гар төхөөрөмж", payload: "Гар төхөөрөмж" },
  { title: "Дагалдах хэрэгсэл", payload: "Дагалдах хэрэгсэл" },
  { title: "Power", payload: "Power" }
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
// JSON repair — handles truncated AI output due to token cutoff
// Closes any unclosed string and object so JSON.parse doesn't throw
// ---------------------------------------------------------------------------
function repairJson(raw: string): string {
  let s = raw.trim();
  // If it doesn't start with { it's not JSON at all
  if (!s.startsWith("{")) return "{}";

  // Count unclosed quotes to determine if we're inside a string
  let inString = false;
  let escaped = false;
  for (const ch of s) {
    if (escaped) { escaped = false; continue; }
    if (ch === "\\") { escaped = true; continue; }
    if (ch === "\"") inString = !inString;
  }

  // Close unterminated string first
  if (inString) s += "\"";

  // Close any unclosed arrays / objects
  const opens = (s.match(/\[/g) || []).length - (s.match(/\]/g) || []).length;
  const braces = (s.match(/\{/g) || []).length - (s.match(/\}/g) || []).length;

  // Strip trailing comma before closing
  s = s.replace(/,\s*$/, "");

  for (let i = 0; i < opens; i++) s += "]";
  for (let i = 0; i < braces; i++) s += "}";

  return s;
}

// ---------------------------------------------------------------------------
// AI fallback — only called for consultation / compare / unknown drone topics
// ---------------------------------------------------------------------------
async function callAI(
  sessionId: string,
  message: string,
  intent: Intent,
  contextProducts: ContextProduct[]
): Promise<{ reply: string; cards: any[]; needsClarification: boolean }> {
  if (!openai) {
    return { reply: STATIC.llmNotConfigured, cards: [], needsClarification: false };
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
    // Appended after any admin prompt so these grounding rules always apply
    prompt += `\n\nЧУХАЛ ДҮРЭМ (дээрх бүх зааврыг давна):
    - Бүтээгдэхүүний жагсаалтад зөвхөн дрон биш — камер, гар төхөөрөмж, дагалдах хэрэгсэл, Power зэрэг янз бүрийн ангиллын бараа байна. Бараа бүр юу болохыг "category" болон "description" талбараас нь тодорхойл. Дагалдах хэрэгслийг (линз хамгаалагч, цүнх, сэнс г.м.) хэзээ ч дрон гэж бүү нэрлэ.
    - Зөвхөн жагсаалтад өгөгдсөн мэдээлэлд (name, category, description, price, heroNote, specs) үндэслэж хариул. Жагсаалтад байхгүй онцлог, үзүүлэлт, бараа, үнийг бүү зохио.
    - Зөвхөн хэрэглэгчийн асуултад шууд хамаарах барааг санал болго. Асуултад хамааралгүй барааг нэмж бүү жагсаа.
    - Хэрэглэгчийн асуулт тодорхойгүй эсвэл жагсаалтын аль ч бараа асуултад нь тохирохгүй бол ТААМАГЛАЖ БҮҮ ХАРИУЛ. Оронд нь нэг богино тодруулах асуулт асуу (жишээ нь: "Та дрон, камер, гар төхөөрөмж, дагалдах хэрэгслийн алийг нь сонирхож байна вэ?"), suggested_product_ids = [], needs_clarification = true.
    - Найрсаг, товч, хүн шиг хариул. Messenger markdown харуулдаггүй тул **, # зэрэг тэмдэг бүү ашигла. Олон бараа жагсаахдаа бараа бүрийг "1. Нэр - Үнэ₮" хэлбэрээр, хооронд нь хоёр шинэ мөр (\\n\\n) тавьж бич.

    Зөвхөн дараах JSON форматаар хариул: {"message": "таны хариулт...", "suggested_product_ids": ["id1"], "needs_clarification": false}. Өөр бүтэц ашиглаж болохгүй!`;

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
      max_tokens: 800,      // Increased — listing 10+ drones needs ~600 tokens
      temperature: 0.3,     // Lower = more deterministic = cheaper retries
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    console.log("🤖 AI raw:", raw);

    if (completion.usage?.total_tokens) {
      incrementTokenUsage(completion.usage.total_tokens).catch(console.error);
    }

    let parsed: z.infer<typeof AiResponseSchema>;
    try {
      const json = JSON.parse(repairJson(raw));
      parsed = AiResponseSchema.parse(json);
    } catch (error) {
      console.error("AI Output Parse Error:", error);
      return { reply: STATIC.fallback, cards: [], needsClarification: false };
    }

    let reply =
      parsed.message ||
      parsed.response ||
      parsed.reply ||
      STATIC.fallback;

    // Messenger shows markdown literally; the prompt asks for none but the model slips
    reply = reply.replace(/\*\*/g, "").replace(/^#+\s*/gm, "");

    // Resolve any AI-suggested product IDs to cards
    const suggestedIds: string[] = Array.isArray(parsed.suggested_product_ids)
      ? parsed.suggested_product_ids
        .map((x) => (typeof x === "string" ? x : (x as any)?.id))
        .filter((id): id is string => Boolean(id))
        .slice(0, 3)
      : [];

    const needsClarification = parsed.needs_clarification === true;

    let cards: any[] = [];
    if (suggestedIds.length > 0 && !needsClarification) {
      const found = await getProductsByIds(suggestedIds);
      cards = toChatCards(found);
    }

    return { reply, cards, needsClarification };
  } catch (err) {
    console.error("OpenAI error:", err);
    return { reply: STATIC.systemError, cards: [], needsClarification: false };
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

  // Emoji-only messages (👍, ❤️, 😊 etc.) — show product/category menu
  if (intent === "emoji_reaction") {
    return reply(sessionId, STATIC.fallback, undefined, CATEGORY_QUICK_REPLIES);
  }

  if (intent === "off_topic") {
    return reply(sessionId, STATIC.off_topic);
  }

  // Bare category word, incl. Latin/typo variants ("Camer", "dron", "Gar tuhuurumj")
  // → that category's products. Prevents a stray name hit (e.g. "camera lens protector")
  // from reaching the AI with misleading context.
  const category = resolveCategory(message);
  if (category) {
    const products = await getProductsByCategory(category);
    if (products.length > 0) {
      return reply(
        sessionId,
        `Манайд дараах ${category === "Power" ? "Power бүтээгдэхүүн" : category.toLowerCase()} бэлэн байна 👇`,
        toChatCards(products),
        CATEGORY_QUICK_REPLIES
      );
    }
  }

  if (intent === "greeting") {
    // Show featured / newest products (up to 8 for carousel)
    const featured = await getFeaturedProductsTool(8);
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
    return reply(sessionId, STATIC.address, undefined, undefined, "https://res.cloudinary.com/dx3ymrxfs/video/upload/q_auto,vc_h264,br_500k/v1781943142/IMG_7777_foedhx.mp4");
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
    const matched = await matchProducts(message, { accessoryContext: true });
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
    const baseUrl = process.env.SITE_URL || "https://www.deerdrone.mn";
    const rawImg = `${baseUrl}/aaaaaaa-01.jpg`;
    const proxyImg = `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=1000&output=jpg`;

    return {
      sessionId,
      reply: STATIC.loanInfo,
      image: proxyImg
    };
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
    if (lower.includes("power") || lower.includes("пауэр")) categoryKeyword = "Power";
    else if (lower.includes("камер") || lower.includes("camera") || lower.includes("kamer")) categoryKeyword = "Камер";
    else if (lower.includes("дагалдах") || lower.includes("accessory") || lower.includes("mic") || lower.includes("цүнх")) categoryKeyword = "Дагалдах хэрэгсэл";
    else if (lower.includes("гар төхөөрөмж") || lower.includes("handheld") || lower.includes("gimbal")) categoryKeyword = "Гар төхөөрөмж";
    else if (lower.includes("дрон") || lower.includes("dron") || lower.includes("drone")) categoryKeyword = "Дрон";

    if (categoryKeyword) {
      const { data: catProducts } = await supabase
        .from("products")
        .select("id, name, slug, price, hero_note, short_description, product_images(url)")
        .ilike("categories.name", `%${categoryKeyword}%`) // Note: this might need join
        .limit(20);

      // Since ilike on joined table categories.name might be tricky with Supabase JS sometimes 
      // without explicit join, let's use the tool we have or do a quick subquery
      const { data: cat } = await supabase.from("categories").select("id").ilike("name", `%${categoryKeyword}%`).maybeSingle();
      if (cat) {
        const { data: products } = await supabase
          .from("products")
          .select("id, name, slug, price, hero_note, short_description, product_images(url)")
          .gt("stock_qty", 0) // out of stock → never recommend
          .eq("category_id", cat.id)
          .limit(20);

        if (products && products.length > 0) {
          const cards = toChatCards(products);
          return reply(sessionId, `Манайд дараах ${categoryKeyword.toLowerCase()}үүд бэлэн байна 👇`, cards, CATEGORY_QUICK_REPLIES);
        }
      }
    }

    // No keyword match or category match → show featured products up to 20
    const featured = await getFeaturedProductsTool(20);
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

  // Admin search keywords hit (e.g. "шилэн наалт", "хатуу цүнх") → show cards directly, no AI
  if (intent === "unknown") {
    const keywordHits = await matchByKeywords(message);
    if (keywordHits.length > 0) {
      return reply(sessionId, STATIC.productsIntro, toChatCards(keywordHits), CATEGORY_QUICK_REPLIES);
    }
  }

  // Try to match products first to see if it's drone-related even if keywords miss
  const matched = await matchProducts(message);

  if (
    intent === "technical_consultation" ||
    intent === "compare_products" ||
    (intent === "unknown" && (looksLikeDroneRelated(message) || matched.length > 0))
  ) {
    // Intercept ambiguous short numeric inputs (like "1") or very short texts
    if (intent === "unknown" && matched.length === 0 && (/^\d+[\.\)]?$/.test(message.trim()) || message.trim().length < 3)) {
      return reply(sessionId, STATIC.priceInquiry, undefined, CATEGORY_QUICK_REPLIES);
    }

    // Weak match: a short message that isn't a known intent/category/keyword and only
    // hit a product name by substring (e.g. "Camer" → "camera lens protector").
    // Ask instead of letting the AI guess from misleading context.
    // A whole-word / model-name hit ("osmo360" → "OSMO 360", "lito x1") is strong → show it.
    const wordCount = message.trim().split(/\s+/).length;
    if (intent === "unknown" && matched.length > 0 && wordCount <= 2) {
      const strong = matched.filter((p) => isWholeNameMatch(message, p.name));
      if (strong.length > 0) {
        return reply(sessionId, STATIC.productsIntro, toChatCards(strong), CATEGORY_QUICK_REPLIES);
      }
      if (!looksLikeDroneRelated(message)) {
        return reply(sessionId, STATIC.clarifyProduct, undefined, CATEGORY_QUICK_REPLIES);
      }
    }

    // Context: matched products, else a catalog summary. Each carries its category and
    // description so the AI knows what the item actually is.
    // Comparisons need every model mentioned, but matchProducts stops at the first
    // alias ("Mini 5 Pro vs Air 3S" → minis only), so give the whole drone line-up.
    const base =
      intent === "compare_products"
        ? [...matched, ...(await getProductsByCategory("Дрон", 20))]
        : matched;
    const seen = new Set<string>();
    const contextProducts: ContextProduct[] = (
      base.length > 0
        ? base.filter((p) => !seen.has(p.id) && seen.add(p.id)).map(toContextProduct)
        : await getMinimalCatalogContext(20)
    ).slice(0, 20);

    // Real specs so comparisons / technical answers come from data, not the model's memory
    // Always attached: without them the AI wrongly said no drone flies 10 km+ (Air 3S does)
    {
      const specs = await getSpecsSummary(contextProducts.map((p) => p.id), 12);
      for (const p of contextProducts) {
        const s = specs.get(p.id);
        if (s) p.specs = s;
      }
    }

    const { reply: aiReply, cards: aiCards, needsClarification } = await callAI(
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
      quickReplies: needsClarification ? CATEGORY_QUICK_REPLIES : undefined,
    };
  }

  // ── Step 6: Unrecognised — ask, don't reject (ZERO AI) ────────────────
  // Real customers write "medeelel", "nio2", "mavis 4 pro"… on a shop page; a
  // clarifying question with category buttons beats "I only talk about drones".
  // Explicit off-topic chatter is still caught earlier by the off_topic intent.
  return reply(sessionId, STATIC.clarifyProduct, undefined, CATEGORY_QUICK_REPLIES);
}

// ---------------------------------------------------------------------------
// Helper: build ChatResponse without touching history
// ---------------------------------------------------------------------------
function reply(
  sessionId: string,
  text: string,
  cards?: any[],
  quickReplies?: { title: string; payload: string }[],
  video?: string
): ChatResponse {
  return {
    sessionId,
    reply: text,
    cards: cards && cards.length > 0 ? cards : undefined,
    quickReplies,
    video,
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
