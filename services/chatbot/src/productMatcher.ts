/**
 * Product matching layer.
 * Tries category-scoped search first to avoid cross-category noise,
 * then falls back to global keyword search.
 */

import {
  getAllProductsTool,
  getFeaturedProductsTool,
  getProductsByIdsTool,
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
}

// ---------------------------------------------------------------------------
// Known model name aliases → canonical keyword
// ---------------------------------------------------------------------------
const DRONE_NAME_ALIASES: Record<string, string[]> = {
  agras: ["аграс", "agras", "t50", "t40", "t30", "т50", "т40", "т30"],
  mavic: ["мавик", "mavic"],
  phantom: ["фантом", "phantom"],
  matrice: ["матриц", "matrice", "m300", "m350", "м300"],
  mini: ["мини", "mini"],
  inspire: ["инспайр", "inspire"],
  air: ["air"],
  avata: ["avata"],
  neo: ["neo"],
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
    category: "Дрон",
    patterns: [
      /дрон/i, /\bdrone\b/i, /нисдэг/i, /нисгэх/i,
      /mavic/i, /\bmini\b/i, /\bair\b/i, /\bneo\b/i, /avata/i,
      /\bflip\b/i, /agras/i, /phantom/i, /matrice/i, /inspire/i,
      /\bfpv\b/i, /\batom\b/i,
    ],
  },
  {
    category: "Камер",
    patterns: [
      /камер/i, /\bcamera\b/i, /pocket/i,
      /osmo\s*360/i, /action\s*\d/i, /\bnano\b/i,
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
export async function matchProducts(message: string): Promise<MatchedProduct[]> {
  const extracted = extractProductKeyword(message);
  if (!extracted) return [];

  const { keyword, category } = extracted;

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
        .in("category_id", catIds)
        .ilike("name", `%${keyword}%`)
        .limit(20);

      if (byKeyword && byKeyword.length > 0) return normalise(byKeyword);

      // Fallback: all products in category (keyword was broad, e.g. "дрон")
      const { data: allInCat } = await supabase
        .from("products")
        .select("id, name, slug, price, hero_note, short_description, product_images(url), categories(name)")
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
  const results = await getProductsByIdsTool(ids);
  return normalise(results);
}

// ---------------------------------------------------------------------------
// Minimal catalog context for AI prompt
// ---------------------------------------------------------------------------
export async function getMinimalCatalogContext(
  limit = 10
): Promise<{ id: string; name: string; price: number; heroNote: string }[]> {
  try {
    const featured = await getFeaturedProductsTool(limit);
    if (featured && featured.length > 0) {
      return featured.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        heroNote: p.hero_note || "",
      }));
    }
  } catch (err) {
    console.error("Error fetching featured products for context:", err);
  }

  const all = await getAllProductsTool();
  return all.slice(0, limit).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    heroNote: p.hero_note || "",
  }));
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