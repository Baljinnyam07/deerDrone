/**
 * Product matching layer.
 * Tries category-scoped search first to avoid cross-category noise,
 * then falls back to global keyword search.
 */

import {
  getAllProductsTool,
  getFeaturedProductsTool,
  getProductsByIdsTool,
  nameOrKeywordFilter,
  searchProductsTool,
  supabase,
} from "./tools/catalog.js";

export interface MatchedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  heroNote: string;
  short_description?: string;
  description?: string;
  image_url?: string;
  categories?: { name?: string } | null;
}

// ---------------------------------------------------------------------------
// Known model name aliases → canonical keyword
// ---------------------------------------------------------------------------
const DRONE_NAME_ALIASES: Record<string, string[]> = {
  agras: ["аграс", "agras", "t50", "t40", "t30", "т50", "т40", "т30"],
  mavic: ["мавик", "mavic", "mavis", "mavei", "mavik"],
  phantom: ["фантом", "phantom"],
  matrice: ["матриц", "matrice", "m300", "m350", "м300"],
  mini: ["мини", "mini"],
  inspire: ["инспайр", "inspire"],
  air: ["air"],
  avata: ["avata"],
  neo: ["neo", "нио", "nio2", "nio 2", "нео"],
  atom: ["атом", "atom"],
  fpv: ["fpv"],
  flip: ["flip"],
};

// ---------------------------------------------------------------------------
// Category keyword routing
// Maps user message patterns → DB category name (exact match required)
// This prevents "DJI Drone LED Light" from appearing when user searches "дрон"
// ---------------------------------------------------------------------------
const CATEGORY_KEYWORDS: { patterns: RegExp[]; category: string }[] = [
  {
    // Checked before model aliases so "DJI POWER 1000 MINI" isn't routed to drones via "mini"
    category: "Power",
    patterns: [
      /\bpower\b/i, /пауэр/i, /цахилгаан\s*станц/i, /power\s*station/i,
      /зөөврийн\s*цэнэг/i,
    ],
  },
  {
    category: "Дрон",
    patterns: [
      /дрон/i, /\bdrone\b/i, /\bdron/i, /нисдэг/i, /нисгэх/i,
      /mavic/i, /\bmini\b/i, /\bair\b/i, /\bneo\b/i, /avata/i,
      /\bflip\b/i, /agras/i, /phantom/i, /matrice/i, /inspire/i,
      /\bfpv\b/i, /\batom\b/i,
    ],
  },
  {
    category: "Камер",
    patterns: [
      /камер/i, /\bcamera\b/i, /camer/i, /kamer/i, /pocket/i, /poket/i, /покет/i,
      /osmo\s*360/i, /осмо/i, /action\s*\d/i, /\bnano\b/i, /нано/i,
    ],
  },
  {
    category: "Гар төхөөрөмж",
    patterns: [
      /\bmic\b/i, /мик/i, /микрофон/i, /microphone/i,
      /rs\s*[345]/i, /\bgimbal\b/i, /stabilizer/i, /osmo\s*mobile/i,
    ],
  },
  {
    category: "Дагалдах хэрэгсэл",
    patterns: [
      /пропеллер/i, /далавч/i, /propeller/i,
      /\bcase\b/i, /цүнх/i, /\bbag\b/i,
      /guard/i, /landing\s*pad/i, /\bstrap\b/i,
      /батарей/i, /battery/i, /цэнэглэгч/i, /charger/i,
      /пульт/i, /remote\s*control/i,
    ],
  },
];

// ---------------------------------------------------------------------------
// Extract keyword + category from user message
// ---------------------------------------------------------------------------
function extractProductKeyword(
  message: string
): { keyword: string; category?: string } | null {
  const lower = message.toLowerCase();

  // 0. Power stations and mics — their names contain drone aliases ("POWER 1000 MINI",
  //    "MIC MINI 2S"), so they must win before the model-alias pass routes them to drones
  for (const category of ["Power", "Гар төхөөрөмж"]) {
    const entry = CATEGORY_KEYWORDS.find((c) => c.category === category)!;
    const hit = entry.patterns.map((p) => lower.match(p)).find(Boolean);
    if (hit) return { keyword: hit[0].trim(), category };
  }

  // 1. Specific model aliases (most precise)
  for (const [canonical, aliases] of Object.entries(DRONE_NAME_ALIASES)) {
    if (aliases.some((a) => lower.includes(a)) || lower.includes(canonical)) {
      const cat = CATEGORY_KEYWORDS.find((c) =>
        c.patterns.some((p) => p.test(canonical))
      );
      return { keyword: canonical, category: cat?.category };
    }
  }

  // 2. Category-level keyword routing
  for (const { patterns, category } of CATEGORY_KEYWORDS) {
    if (patterns.some((p) => p.test(lower))) {
      const matched = patterns.map((p) => lower.match(p)).find(Boolean);
      const keyword = matched?.[0]?.trim() || category;
      return { keyword, category };
    }
  }

  // 3. Strip filler and use what remains
  const filler =
    /(?<!\p{L})(үнэ|хэд|вэ|бэ|юу|дрон|drone|авмаар|захиалах|дэлгэрэнгүй|мэдэх|хүсэх|байна|baina|болно|та|би|энэ|тэр|уу|юу|үү|ээ|оо|une|vne|hed|vnehed|unehed|be|we|uu|yu|wehed|behed|bnu|bnuu|bnu|yum|gej)(?!\p{L})/giu;
  const stripped = lower.replace(filler, " ").replace(/\s+/g, " ").trim();
  if (stripped.length >= 2) return { keyword: stripped };

  return null;
}

// ---------------------------------------------------------------------------
// Primary product resolver
// ---------------------------------------------------------------------------

/**
 * Priority:
 *   1. category_id filter + keyword ilike  ← no cross-category noise
 *   2. All products in that category       ← broad keyword like "дрон"
 *   3. Global keyword search               ← no category detected
 */
export async function matchProducts(
  message: string,
  /**
   * accessoryContext: the user asked about accessories. A drone model mention
   * ("Air 3S-д ямар дагалдах") then searches accessories for that model, while a
   * product in its own category ("DJI Mic Mini 2S" → Гар төхөөрөмж) stays as is.
   */
  options: { accessoryContext?: boolean } = {}
): Promise<MatchedProduct[]> {
  // 0. Admin-entered search keywords ("шилэн наалт" → Screen Protector)
  const byAdminKeywords = await matchByKeywords(message);
  if (byAdminKeywords.length > 0) return byAdminKeywords;

  const extracted = extractProductKeyword(message);
  if (!extracted && !options.accessoryContext) return [];

  const keyword = extracted?.keyword ?? "";
  const detected = extracted?.category;
  // Cases/bags/protectors are accessories even for handhelds ("Osmo Mobile 7 case")
  const isGearForProduct = /case|цүнх|\bbag\b|хайрцаг|protector|хамгаалагч|наалт/i.test(message);
  const category =
    options.accessoryContext && (!detected || detected === "Дрон" || isGearForProduct)
      ? "Дагалдах хэрэгсэл"
      : detected;

  if (category) {
    const { data: cats } = await supabase
      .from("categories")
      .select("id")
      .eq("name", category);

    const catIds = (cats ?? []).map((c: any) => c.id);

    if (catIds.length > 0) {
      // Try: category + keyword
      const { data: byKeyword } = await supabase
        .from("products")
        .select("id, name, slug, price, hero_note, short_description, product_images(url), categories(name)")
        .gt("stock_qty", 0) // out of stock → never recommend
        .in("category_id", catIds)
        .or(nameOrKeywordFilter(keyword))
        .limit(20);

      if (byKeyword && byKeyword.length > 0) return normalise(byKeyword);

      // Fallback: all products in category (keyword was broad, e.g. "дрон")
      const { data: allInCat } = await supabase
        .from("products")
        .select("id, name, slug, price, hero_note, short_description, product_images(url), categories(name)")
        .gt("stock_qty", 0) // out of stock → never recommend
        .in("category_id", catIds)
        .order("created_at", { ascending: false })
        .limit(20);

      if (allInCat && allInCat.length > 0) return normalise(allInCat);
    }
  }

  // Global fallback
  const results = await searchProductsTool(keyword, 20);
  return normalise(results).slice(0, 20);
}

// ---------------------------------------------------------------------------
// Specs as compact text per product id ("Камер: 1-inch CMOS 50MP; Нислэгийн цаг: 45 минут")
// ---------------------------------------------------------------------------
export async function getSpecsSummary(ids: string[], maxSpecs = 10): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (ids.length === 0) return result;

  const { data } = await supabase
    .from("product_specs")
    .select("product_id, label, value, display_order")
    .in("product_id", ids)
    .order("display_order", { ascending: true });

  const grouped = new Map<string, string[]>();
  for (const s of data ?? []) {
    const list = grouped.get(s.product_id) ?? [];
    if (list.length < maxSpecs) list.push(`${s.label}: ${s.value}`);
    grouped.set(s.product_id, list);
  }
  for (const [id, list] of grouped) result.set(id, list.join("; "));
  return result;
}

// ---------------------------------------------------------------------------
// All products in a category (by exact DB category name)
// ---------------------------------------------------------------------------
export async function getProductsByCategory(category: string, limit = 20): Promise<MatchedProduct[]> {
  const { data: cats } = await supabase.from("categories").select("id").eq("name", category);
  const catIds = (cats ?? []).map((c: any) => c.id);
  if (catIds.length === 0) return [];

  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, product_images(url), categories(name)")
    .gt("stock_qty", 0) // out of stock → never recommend
    .in("category_id", catIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  return normalise(data ?? []);
}

// ---------------------------------------------------------------------------
// Admin-entered search keywords
// ---------------------------------------------------------------------------

/**
 * Matches the message against each product's comma-separated search_keywords.
 * A product hits when the message contains one of its keywords
 * ("дроны хатуу цүнх" ⊃ "хатуу цүнх"), or when the message is a whole word /
 * phrase inside a keyword ("хатуу" ⊂ "хатуу цүнх"). Whole-word only in the
 * second direction so "дрон" doesn't match a keyword like "дроны цүнх".
 */
export async function matchByKeywords(message: string): Promise<MatchedProduct[]> {
  const text = message.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  if (text.length < 2) return [];

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, short_description, search_keywords, product_images(url), categories(name)")
    .gt("stock_qty", 0) // out of stock → never recommend
    .not("search_keywords", "is", null);

  // Column missing (migration not run yet) or other DB error → no keyword hits
  if (error || !data) return [];

  const scored = data
    .map((p: any) => {
      const keywords: string[] = String(p.search_keywords)
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
      let score = 0;
      for (const kw of keywords) {
        if (kw === text) score = Math.max(score, 1000);
        else if (text.includes(kw)) score = Math.max(score, 100 + kw.length);
        else if (` ${kw} `.includes(` ${text} `)) score = Math.max(score, 10);
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];

  // Keep only the best tier so a precise hit isn't diluted by loose ones
  const best = scored[0].score >= 100 ? 100 : scored[0].score;
  return normalise(scored.filter((x) => x.score >= best).slice(0, 10).map((x) => x.p));
}

// ---------------------------------------------------------------------------
// Single product by ID (for DETAIL_ postback)
// ---------------------------------------------------------------------------
export async function getProductById(id: string): Promise<MatchedProduct | null> {
  const results = await getProductsByIdsTool([id]);
  if (results.length === 0) return null;
  return normalise(results)[0];
}

// ---------------------------------------------------------------------------
// Multiple products by IDs (for AI suggestions)
// ---------------------------------------------------------------------------
export async function getProductsByIds(ids: string[]): Promise<MatchedProduct[]> {
  const results = await getProductsByIdsTool(ids, true);
  return normalise(results);
}

// ---------------------------------------------------------------------------
// Minimal catalog context for AI prompt
// ---------------------------------------------------------------------------
export async function getMinimalCatalogContext(limit = 10): Promise<
  { id: string; name: string; category: string; price: number; description: string; heroNote: string }[]
> {
  const toContext = (p: any) => ({
    id: p.id,
    name: String(p.name ?? "").trim(),
    category: p.categories?.name ?? "",
    price: p.price,
    description: String(p.short_description ?? "").slice(0, 160),
    heroNote: p.hero_note || "",
  });

  try {
    const featured = await getFeaturedProductsTool(limit);
    if (featured && featured.length > 0) return featured.map(toContext);
  } catch (err) {
    console.error("Error fetching featured products for context:", err);
  }

  const all = await getAllProductsTool();
  return all.slice(0, limit).map(toContext);
}

// ---------------------------------------------------------------------------
// Normaliser
// ---------------------------------------------------------------------------
function normalise(items: any[]): MatchedProduct[] {
  return items.map((p) => {
    let imageUrl = p.product_images?.[0]?.url || p.image_url || p.image;
    if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = `https://www.deerdrone.mn${imageUrl}`;
    }
    if (imageUrl && imageUrl.includes(".webp") && !imageUrl.includes("wsrv.nl")) {
      imageUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&output=jpg`;
    }
    return {
      id: p.id,
      name: p.name,
      slug: p.slug ?? "",
      price: p.price ?? 0,
      heroNote: p.hero_note ?? "",
      short_description: p.short_description ?? "",
      description: p.description ?? "",
      image_url: imageUrl || undefined,
      categories: p.categories,
    };
  });
}