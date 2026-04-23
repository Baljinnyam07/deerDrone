/**
 * Product matching layer.
 * Tries exact slug match → fuzzy name match → keyword scan.
 * Returns matched products from DB without calling OpenAI.
 */

import {
  getAllProductsTool,
  getProductsByIdsTool,
  searchProductsTool,
} from "./tools/catalog.js";

export interface MatchedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  heroNote: string;
  short_description?: string;
  image_url?: string;
}

// ---------------------------------------------------------------------------
// Known drone name mappings for Mongolian keyword matching
// (extend as catalog grows)
// ---------------------------------------------------------------------------
const DRONE_NAME_ALIASES: Record<string, string[]> = {
  agras: ["аграс", "agras", "t50", "t40", "t30", "т50", "т40", "т30"],
  mavic: ["мавик", "mavic"],
  phantom: ["фантом", "phantom"],
  matrice: ["матриц", "matrice", "m300", "m350", "м300"],
  mini: ["мини", "mini"],
  inspire: ["инспайр", "inspire"],
};

// ---------------------------------------------------------------------------
// Extract a product-like keyword from user message
// ---------------------------------------------------------------------------
function extractProductKeyword(message: string): string | null {
  const lower = message.toLowerCase();
  // Try alias groups first
  for (const [canonical, aliases] of Object.entries(DRONE_NAME_ALIASES)) {
    if (aliases.some((a) => lower.includes(a)) || lower.includes(canonical)) {
      return canonical;
    }
  }
  // Fallback: strip common filler words and return the remainder
  const filler =
    /үнэ|хэд|вэ|бэ|юу|дрон|drone|авмаар|захиалах|дэлгэрэнгүй|мэдэх|хүсэх|байна|болно|та|би|энэ|тэр/gi;
  const stripped = lower.replace(filler, "").replace(/\s+/g, " ").trim();
  return stripped.length >= 3 ? stripped : null;
}

// ---------------------------------------------------------------------------
// Primary product resolver
// ---------------------------------------------------------------------------

/**
 * Try to find products matching the user message.
 * Priority: DB slug match → DB name ilike search → full catalog scan.
 * Returns up to 3 products for carousel display.
 */
export async function matchProducts(message: string): Promise<MatchedProduct[]> {
  const keyword = extractProductKeyword(message);

  if (keyword) {
    // Attempt DB search first
    const results = await searchProductsTool(keyword);
    if (results.length > 0) {
      return normalise(results).slice(0, 3);
    }
  }

  // No match → return nothing; caller decides to show full catalog or fallback
  return [];
}

/**
 * Fetch a single product by ID (for DETAIL_ postback).
 */
export async function getProductById(id: string): Promise<MatchedProduct | null> {
  const results = await getProductsByIdsTool([id]);
  if (results.length === 0) return null;
  return normalise(results)[0];
}

/**
 * Fetch products by IDs (for AI suggestions).
 */
export async function getProductsByIds(ids: string[]): Promise<MatchedProduct[]> {
  const results = await getProductsByIdsTool(ids);
  return normalise(results);
}

/**
 * Get all products as minimal AI context objects (id + name + price only).
 * Max 10 entries to keep token count low.
 */
export async function getMinimalCatalogContext(
  limit = 10
): Promise<{ id: string; name: string; price: number }[]> {
  const all = await getAllProductsTool();
  return all.slice(0, limit).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
  }));
}

// ---------------------------------------------------------------------------
// Normaliser
// ---------------------------------------------------------------------------
function normalise(items: any[]): MatchedProduct[] {
  return items.map((p) => {
    let imageUrl = p.product_images?.[0]?.url || p.image_url || p.image;
    if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = `https://deer-drone.vercel.app${imageUrl}`;
    }
    return {
      id: p.id,
      name: p.name,
      slug: p.slug ?? "",
      price: p.price ?? 0,
      heroNote: p.hero_note ?? "",
      short_description: p.short_description ?? "",
      image_url: imageUrl || undefined,
    };
  });
}

/**
 * Convert MatchedProduct[] to chat card format used by the response.
 */
export function toChatCards(products: MatchedProduct[], limit = 6) {
  return products.slice(0, limit).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    heroNote: p.heroNote,
    image_url: p.image_url,
  }));
}
