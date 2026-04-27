/**
 * Facebook Comment Intent Classifier
 * Rule-first — no AI, no DB calls.
 * AI fallback only for confidence < 0.6 (via conversation engine).
 */

export type CommentIntent =
  | "info_request"
  | "product_interest"
  | "financing"
  | "recommend"
  | "human_support"
  | "low_confidence"
  | "spam";

export interface ClassifyResult {
  intent: CommentIntent;
  confidence: number;
}

// ---------------------------------------------------------------------------
// Pattern banks (Mongolian Cyrillic + Latin transliteration)
// ---------------------------------------------------------------------------

const PATTERNS: Record<Exclude<CommentIntent, "low_confidence" | "spam">, RegExp[]> = {
  info_request: [
    /^(medeelel|мэдээлэл|info|delgerengui|дэлгэрэнгүй|inbox|une|үнэ|price|1|i)$/i,
    /мэдээлэл\s*(өгнө|авъя|хэрэгтэй|илгээ)/i,
    /үнэ\s*(нь\s*)?(хэд|мэдэх|болох)/i,
    /yamar\s*une|ямар\s*үнэ/i,
    /^(➕|✅|ℹ️|❓)$/,
    /дэлгэрэнгүй\s*мэдэх/i,
  ],
  product_interest: [
    /авъя|авмаар|avya|awya/i,
    /захиалъя|захиалмаар|zahialya|zahialah/i,
    /худалдаж\s*авъя/i,
    /^(order|buy|purchase|авах)$/i,
    /яаж\s*(авах|захиалах)/i,
    /авч\s*болох\s*уу/i,
  ],
  financing: [
    /зээл|zeel|loan|credit/i,
    /хувааж\s*төл|huvaaj\s*tul/i,
    /лизинг|lizing|lease/i,
    /хэсэгчлэн/i,
    /зээлээр\s*авч\s*болох/i,
    /zeeleer\s*awj/i,
    /zeel\s*bn/i,
  ],
  recommend: [
    /өөр\s*(иймэрхүү|төстэй)/i,
    /uur\s*(iimerhuu|tostei)/i,
    /хямд\s*хувилбар|hyamd\s*huwilbar/i,
    /илүү\s*(сайн|мэргэжлийн|хямд)/i,
    /ижил\s*төрлийн/i,
    /alternative|similar/i,
    /enetei\s*tostei/i,
  ],
  human_support: [
    /ажилтан|ajiltan/i,
    /оператор|operator/i,
    /staff|agent/i,
    /холбогд|holbogd/i,
    /утас|utas/i,
    /хүнтэй\s*ярих|huntei\s*yarih/i,
    /тусламж/i,
    /борлуулалт/i,
    /\b[789]\d{7}\b/, // Утасны дугаар үлдээсэн бол холбогдох хүсэлт гэж үзнэ
  ],
};

// ---------------------------------------------------------------------------
// Spam detection
// ---------------------------------------------------------------------------

function isSpam(text: string): boolean {
  const t = text.trim();
  if (t.length < 1) return true;
  
  // 8 оронтой Монгол утасны дугаар агуулсан бол спам биш
  const digitCount = t.replace(/\D/g, '').length;
  if (digitCount === 8) return false;

  if (!/\p{L}/u.test(t)) return true;          // no letters at all
  if (/^(.)\1{4,}$/.test(t)) return true;       // aaaaa or 11111
  return false;
}

// ---------------------------------------------------------------------------
// Main classifier
// ---------------------------------------------------------------------------

export function classifyComment(text: string): ClassifyResult {
  const clean = text.trim();

  if (isSpam(clean)) return { intent: "spam", confidence: 1.0 };

  // Try all rule patterns first
  for (const [intent, patterns] of Object.entries(PATTERNS) as [
    Exclude<CommentIntent, "low_confidence" | "spam">,
    RegExp[],
  ][]) {
    if (patterns.some((p) => p.test(clean))) {
      return { intent, confidence: 0.95 };
    }
  }

  // Short generic comment (≤6 chars, likely "info" or button press)
  if (clean.length <= 6) {
    return { intent: "info_request", confidence: 0.65 };
  }

  return { intent: "low_confidence", confidence: 0.3 };
}
