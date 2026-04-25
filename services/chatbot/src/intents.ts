/**
 * Rule-First Intent Classifier
 * Pure functions — no AI, no DB calls, no side-effects.
 * Runs BEFORE any OpenAI call to short-circuit expensive paths.
 */

export type Intent =
  | "greeting"
  | "off_topic"
  | "spam"
  | "product_search"
  | "product_detail"
  | "order_request"
  | "technical_consultation"
  | "compare_products"
  | "delivery"
  | "lease_request"
  | "loan_info"
  | "loan_request"
  | "rental_request"
  | "quote_request"
  | "bulk_order"
  | "human_handoff"
  | "unknown";

// ---------------------------------------------------------------------------
// Keyword banks (Mongolian + common transliterations)
// ---------------------------------------------------------------------------

const GREETING = [
  /^сайн\s*байна\s*уу/i,
  /^сайн\s*уу/i,
  /^сайн\s*байцгаана\s*уу/i,
  /^нийт\s*сайн\s*уу/i,
  /^мэнд/i,
  /^мэндлэ/i,
  /^hello/i,
  /^hi\b/i,
  /^hey\b/i,
  /^привет/i,
  /^эхлэх/i,
  /^дахин\s*эхлэх/i,
];

const OFF_TOPIC = [
  /чи\s*хэн\s*бэ/i,
  /та\s*хэн\s*бэ/i,
  /найз/i,
  /нөхөр/i,
  /хайрт/i,
  /инээд/i,
  /тоглоом/i,
  /кино/i,
  /дуу\s*сонс/i,
  /улс\s*төр/i,
  /сонгуул/i,
  /засгийн\s*газар/i,
  /ерөнхийлөгч/i,
  /парламент/i,
  /weather/i,
  /цаг\s*агаар/i,
  /хоол\s*жор/i,
  /рецепт/i,
  /мем/i,
  /joke/i,
  /анекдот/i,
  /шив\s*шив/i,
  /гоёл/i,
  /загвар\s*өмсөгч/i,
  /хайр\s*дурлал/i,
  /гэрлэ/i,
  /энийг\s*тайлбарла/i,
  /шигтэй\s*яриа/i,
];

const LOAN_INFO = [
  /зээлээр\s*авч\s*болох\s*уу/i,
  /zeeleer\s*awj\s*boloh\s*uu/i,
  /зээл\s*байдаг\s*уу/i,
  /zeel\s*baidag\s*uu/i,
  /зээл\s*байгаа\s*юу/i,
  /zeel\s*baigaa\s*yu/i,
  /зээл\s*гардаг\s*уу/i,
  /zeel\s*gardag\s*uu/i,
];



const LOAN = [
  /зээл/i,
  /zeel/i,
  /зээлээр\s*авч\s*болох/i,
  /zeeleer/i,
  /зээлдэх/i,
  /loan/i,
  /credit/i,
  /хэсэгчлэн\s*төлөх/i,
  /danjuulah/i,
  /дансжуулах/i,
];

const LEASE = [
  /түрээс/i,
  /lease/i,
  /санхүүгийн\s*түрээс/i,
  /хугацаатай\s*авах/i,
];

const RENTAL = [
  /хөлс\s*авах/i,
  /хөлслөх/i,
  /rent/i,
  /rental/i,
  /өдрөөр\s*авах/i,
  /цагаар\s*авах/i,
  /ашиглах\s*хугацааны/i,
];

const QUOTE = [
  /үнийн\s*санал/i,
  /quote/i,
  /quotation/i,
  /offer/i,
  /тендер/i,
  /үнийн\s*тооцоо/i,
];

const BULK = [
  /олноор/i,
  /багц/i,
  /bulk/i,
  /бөөн/i,
  /олон\s*ширхэг/i,
  /\d+\s*(ширхэг|шт|unit)/i,
];

const HUMAN_HANDOFF = [
  /оператор/i,
  /operator/i,
  /ажилтан/i,
  /ajiltan/i,
  /менежер/i,
  /manager/i,
  /хүнтэй\s*яриа/i,
  /холбогдох/i,
  /holbogd/i,
  /утсаар\s*ярих/i,
  /live\s*agent/i,
  /staff/i,
  /борлуулалтын\s*баг/i,
];

const DELIVERY = [
  /хүргэл/i,
  /хүргэх/i,
  /delivery/i,
  /shipping/i,
  /тээвэр/i,
  /хэдэн\s*хоног/i,
  /хэдэн\s*цаг/i,
  /хүлэ?эн\s*авах/i,
];

const COMPARE = [
  /харьцуул/i,
  /compare/i,
  // "аль нь" is a universal Mongolian comparison phrase.
  // Note: \b doesn't work with Cyrillic in JS, so use (?:\s|$) instead.
  /аль\s+нь(?:\s|$)/i,
  /аль\s+нь\s+дээр/i,
  /аль\s+нь\s+сайн/i,
  /аль\s+нь\s+илүү/i,
  /аль\s+нь\s+хямд/i,
  /ялгаа/i,
  /ялгаатай/i,
  /яагаад\s*дээр/i,
  /vs\.?\s/i,
  /versus/i,
  /хоёрыг/i,
];

const TECHNICAL = [
  /rth\b/i,
  /rtk\b/i,
  /thermal/i,
  /payload/i,
  /камер/i,
  /сенсор/i,
  /батарей/i,
  /battery/i,
  /нислэгийн\s*цаг/i,
  /нислэгийн\s*зай/i,
  /мэргэжлийн\s*зөвлөг/i,
  /зураглал/i,
  /mapping/i,
  /inspection/i,
  /шүүрч\s*авах/i,
  /гектар/i,
  /тариалан/i,
  /ургамал\s*хамгаалал/i,
  /хөдөө\s*аж\s*ахуй/i,
  /барилга\s*шалгах/i,
  /хэрхэн\s*ажилла/i,
  /яаж\s*ашигла/i,
  /техник/i,
  /давуу\s*тал/i,
  /дутагдал/i,
];

const PRODUCT_SEARCH = [
  /үнэ\s*хэд/i,
  /хэдэн\s*төгрөг/i,
  /хэдэн\s*мянга/i,
  /үнэ\s*нь/i,
  /бүтээгдэхүүн/i,
  /каталог/i,
  /дроноор\s*юу\s*байна/i,
  /ямар\s*дрон/i,
  /дрон\s*харах/i,
  /жагсаалт/i,
  /загвар\s*харах/i,
  /бүгдийг\s*харах/i,
  /танилцуулах/i,
  /юу\s*байна\s*вэ/i,
];

const ORDER = [
  /захиалах/i,
  /захиалга\s*хийх/i,
  /авмаар\s*байна/i,
  /худалдаж\s*авах/i,
  /order/i,
  /buy/i,
  /purchase/i,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function matches(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

/**
 * Spam detection using Unicode-aware letter check.
 * JavaScript's \W is ASCII-only and incorrectly treats Mongolian Cyrillic
 * characters as non-word characters, so we use \p{L} with the u flag instead.
 */
function isSpam(text: string): boolean {
  const trimmed = text.trim();
  // Empty / single char
  if (trimmed.length < 2) return true;
  // No Unicode letter at all (emoji-only, symbol-only, pure punctuation)
  // \p{L} with u flag correctly recognises Mongolian / Cyrillic as letters
  if (!/\p{L}/u.test(trimmed)) return true;
  // Single character repeated 5+ times (aaaaaaa, аааааааа, 111111)
  if (/^(.)\1{5,}$/.test(trimmed)) return true;
  // Classic keyboard-mash patterns
  if (/test\s*test\s*test/i.test(trimmed)) return true;
  if (/asdf{2,}/i.test(trimmed)) return true;
  // Same single word repeated ≥5 times
  const words = trimmed.split(/\s+/);
  if (words.length >= 5 && new Set(words).size === 1) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Main classifier
// ---------------------------------------------------------------------------

export function classifyIntent(message: string): Intent {
  const text = message.trim();
  if (!text) return "spam";

  if (isSpam(text)) return "spam";
  if (matches(text, GREETING)) return "greeting";
  if (matches(text, OFF_TOPIC)) return "off_topic";

  // Finance / handoff routes (high priority — must capture leads)
  if (matches(text, LOAN_INFO)) return "loan_info";
  if (matches(text, LOAN)) return "loan_request";
  if (matches(text, LEASE)) return "lease_request";
  if (matches(text, RENTAL)) return "rental_request";
  if (matches(text, QUOTE)) return "quote_request";
  if (matches(text, BULK)) return "bulk_order";
  if (matches(text, HUMAN_HANDOFF)) return "human_handoff";

  if (matches(text, DELIVERY)) return "delivery";
  if (matches(text, COMPARE)) return "compare_products";
  if (matches(text, TECHNICAL)) return "technical_consultation";
  if (matches(text, ORDER)) return "order_request";
  if (matches(text, PRODUCT_SEARCH)) return "product_search";

  return "unknown";
}

/**
 * Quick heuristic: does the message look drone-related at all?
 * Used to decide whether to escalate "unknown" to AI.
 */
export function looksLikeDroneRelated(message: string): boolean {
  const droneKeywords = [
    /дрон/i,
    /drone/i,
    /квадрокоптер/i,
    /uav/i,
    /uas/i,
    /нисгэх/i,
    /нисдэг/i,
    /deer/i,
    /агро/i,
    /агрикультур/i,
    /dji/i,
    /agras/i,
    /phantom/i,
    /mavic/i,
    /матриц/i,
    /матрис/i,
    /пропеллер/i,
  ];
  return droneKeywords.some((p) => p.test(message));
}
