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
  | "price_inquiry"
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
  | "address"
  | "repair"
  | "wind_resistance"
  | "vat_info"
  | "accessories_info"
  | "beginner_recommendation"
  | "easy_to_control"
  | "cheapest_drone"
  | "cheapest_accessory"
  | "cheapest_camera"
  | "cheapest_handheld"
  | "show_pictures"
  | "website_info"
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
  /лизинг/i,
  /lizing/i,
  /leasing/i,
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
  /hurgelt/i,
  /hurgeltiin/i,
  /hurgelt\s*baigaa/i,
  /hurgelt\s*hii/i,
  /hurgelt\s*shideh/i,
  /teever/i,
  /teewer/i,
];

const ADDRESS = [
  /хаяг/i,
  /hayag/i,
  /hayg/i,
  /хаана\s*байдаг/i,
  /haana\s*we/i,
  /haana\s*be/i,
  /haana\s*baidag/i,
  /location/i,
  /address/i,
  /байршил/i,
  /bairshil/i,
  /дүүрэг/i,
  /plaza/i,
  /плаза/i,
  /очих/i,
  /утас/i,
  /utas/i,
  /utasni\s*dugaar/i,
  /\bphone\b/i,
  /\bnumber\b/i,
  /холбоо\s*барих/i,
  /цагийн\s*хуваарь/i,
  /tsagiin\s*huwaar/i,
  /huvaar/i,
  /schedule/i,
  /opening/i,
  /duureg/i,
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

const REPAIR = [
  /засвар/i,
  /zaswar/i,
  /zasbar/i,
  /эвдэр/i,
  /эвдэрсэн/i,
  /засах/i,
  /zasah/i,
  /сэлбэг/i,
  /selbeg/i,
];

const WIND_RESISTANCE = [
  /салхи/i,
  /salhi/i,
  /салхины/i,
  /тэсвэр/i,
  /teswer/i,
];

const VAT_INFO = [
  /нөат/i,
  /noat/i,
  /ebarimt/i,
  /ибаримт/i,
  /ебаримт/i,
  /баталгаа/i,
  /batalgaa/i,
];

const ACCESSORIES_INFO = [
  /батарей/i,
  /batarei/i,
  /batter/i,
  /bater/i,
  /дагалдах/i,
  /dagaldah/i,
  /led\s*gerel/i,
  /led/i,
  // Mic / handheld accessories
  /\bmic\b/i,
  /мик/i,
  /микрофон/i,
  /microphone/i,
  // Remote / controller
  /пульт/i,
  /controller/i,
  /remote/i,
  // Bag / case
  /цүнх/i,
  /сумк/i,
  /\bcase\b/i,
  /\bbag\b/i,
  // Propeller / guard
  /пропеллер/i,
  /далавч/i,
  /propeller/i,
  /prop\b/i,
  /guard/i,
  /landing\s*pad/i,
  // Charger
  /цэнэглэгч/i,
  /charger/i,
  /charging/i,
  // Gimbal (handheld stabilizer — not RS series drones)
  /gimbal/i,
  /stabilizer/i,
  /osmo\s*mobile/i,
  // Strap / carry
  /strap/i,
];

const BEGINNER_RECOMMENDATION = [
  /эхлэн\s*суралцагч/i,
  /эхлэгч/i,
  /ehlegch/i,
  /шинээр\s*авах/i,
  /анх\s*удаа/i,
  /анхлан/i,
  /anhlan/i,
  /anh\s*surch/i,
  /anh\s*udaa/i,
  /beginner/i,
  /first\s*time/i,
  /\banh\b/i,
];

const WEBSITE_INFO = [
  /бусад\s*мэдээлэл/i,
  /busad\s*medeelel/i,
  /web\s*site/i,
  /вэб\s*сайт/i,
  /website/i,
  /илүү\s*мэдээлэл/i,
];

const EASY_TO_CONTROL = [
  /удирд[а-я]*\s*(хялбар|амар)/i,
  /ud[ir]+d[a-z]*\s*(hylbar|hyalbar|amar)/i,
  /нисгэхэд\s*(хялбар|амар)/i,
  /сурахад\s*(хялбар|амар)/i,
  /хэр\s*хэцүү/i,
  /хэцүү\s*юу/i,
  /hetsuu\s*yu/i,
];

const TECHNICAL = [
  /rth\b/i,
  /rtk\b/i,
  /thermal/i,
  /payload/i,
  /сенсор/i,
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

// ---------------------------------------------------------------------------
// Price inquiry — user asks "how much" WITHOUT naming a specific product
// These MUST be checked BEFORE PRODUCT_SEARCH to avoid false-positive dumps
// ---------------------------------------------------------------------------
const PRICE_INQUIRY = [
  // Mongolian Cyrillic
  /^үнэ\.?\s*\??$/i,
  /^хэд\s*вэ\s*\??$/i,
  /бүтээгдэхүүнүүд\s*ямар\s*үнэтэй\s*вэ/i,
  /^үнэ\s*мэдээлэл/i,
  /үнийн\s*мэдээлэл/i,
  /үнэ\s*асуу/i,
  /үнэ\s*сонирх/i,
  /^үнэ\s*хэд\s*(вэ|бэ|юм|вэ|вээ|бээ)?\s*\??$/i,
  /^үнэ\s*нь\s*хэд(\s*вэ|\s*бэ|\s*вэ)?\s*\??$/i,
  /^хэдэн\s*төгрөг\s*(вэ|бэ|юм)?\s*\??$/i,
  /^хэдэн\s*мянга\s*(вэ|бэ|юм)?\s*\??$/i,
  /^ямар\s*үнэтэй\s*(юм|вэ|бэ)?\s*\??$/i,
  /хамгийн\s*хямд(хан)?\s*нь/i,
  /хамгийн\s*хямдхан/i,
  /үнэ\s*боломжийн/i,
  /une\s*bolomjiin/i,
  /une\s*bolmjiin/i,
  /vne\s*bolomjiin/i,
  // Transliteration variants
  /^une\s*hed\s*(ve|we|be|yu|vee|wee|we|vэ)?\s*\??$/i,
  /^vne\s*hed\s*(ve|we|be|yu|vee|wee|we|vэ)?\s*\??$/i,
  /^unehed\s*(ve|we|be|yu)?\s*\??$/i,
  /^vnehed\s*(ve|we|be|yu)?\s*\??$/i,
  /^hed\s*(ve|we|be|yum|vэ)?\s*\??$/i,
  /^heden\s*tugreg\s*\??$/i,
  /^heden\s*myanga\s*\??$/i,
];

const PRODUCT_SEARCH = [
  /^дрон$/i,
  /^камер$/i,
  /^гар\s*төхөөрөмж$/i,
  /^дагалдах\s*хэрэгсэл$/i,
  /^дагалдах$/i,
  // Price with a category/product keyword attached — specific enough
  /үнэ.*(дрон|камер|гар\s*төхөөрөмж|дагалдах)/i,
  /(дрон|камер|гар\s*төхөөрөмж|дагалдах).*үнэ/i,
  /price.*(dron|drone|kamer)/i,
  /(dron|drone|kamer).*price/i,
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
  /мэдээлэл\s*авах/i,
  /medeelel\s*avah/i,
  /мэдээлэл\s*өг/i,
  /medeelel\s*ug/i,
  /dji.*мэдээлэл/i,
  // Product type keywords — specific accessories / products
  /\bmic\b/i,
  /мик\b/i,
  /микрофон/i,
  /пульт/i,
  /цэнэглэгч/i,
  /пропеллер/i,
  /далавч/i,
  /цүнх/i,
  // Availability-check suffix patterns: "X байна уу?", "X bnu", "X bnuu"
  /байна\s*уу/i,
  /\bbnu\b/i,
  /\bbnuu\b/i,
  /\bavah\s*bolomjtoi\b/i,
];

// "Видео бичлэг хийх дрон" use-case → product_search (Дрон категори)
// Accessories гарахаас сэргийлж тусдаа pattern-д байрлуулсан
const DRONE_USECASE = [
  /видео.*бичлэг/i,
  /бичлэг.*хийх/i,
  /video.*shoot/i,
  /bichleg.*hiih/i,
  /зураг.*авах.*дрон/i,
  /агаараас.*зураг/i,
  /агаараас.*бичлэг/i,
  /aerial.*photo/i,
  /aerial.*video/i,
  /дрон.*зураг/i,
  /дрон.*бичлэг/i,
  /дрон.*видео/i,
  /нисгэж.*зураг/i,
  /нисгэж.*бичлэг/i,
];


const CHEAPEST_DRONE = [
  /хамгийн\s*хямд.*дрон/i,
  /хямд.*дрон/i,
  /дрон.*хямд/i,
  /хямдхан\s*дрон/i,
  /хямдхан.*дрон/i,
  /cheapest\s*drone/i,
  /budget\s*drone/i,
  /хамгийн\s*(бага|доод)\s*үнэтэй\s*дрон/i,
];

const CHEAPEST_ACCESSORY = [
  /хамгийн\s*хямд.*дагалдах/i,
  /хямд.*дагалдах/i,
  /дагалдах.*хямд/i,
  /хямдхан.*дагалдах/i,
  /хамгийн\s*хямд.*хэрэгсэл/i,
  /cheapest\s*accessor/i,
];

const CHEAPEST_CAMERA = [
  /хамгийн\s*хямд.*камер/i,
  /хямд.*камер/i,
  /камер.*хямд/i,
  /хямдхан.*камер/i,
  /хамгийн\s*(бага|доод)\s*үнэтэй\s*камер/i,
  /cheapest\s*camera/i,
];

const CHEAPEST_HANDHELD = [
  /хамгийн\s*хямд.*гар\s*төхөөрөмж/i,
  /хямд.*гар\s*төхөөрөмж/i,
  /гар\s*төхөөрөмж.*хямд/i,
  /хямдхан.*гар\s*төхөөрөмж/i,
  /cheapest\s*(handheld|gimbal|stabilizer)/i,
];

const SHOW_PICTURES = [
  /зураг\s*харъя/i,
  /зураг\s*үзмээр/i,
  /зураг\s*байна\s*уу/i,
  /zurag\s*harii/i,
  /zurag\s*uzmee/i,
  /зураг\s*үзэх/i,
  /бүтээгдэхүүний\s*зураг/i,
];

const ORDER = [
  /захиалах/i,
  /захиалга\s*хийх/i,
  /захиалга\s*өгье/i,
  /захиалъя/i,
  /zahialga/i,
  /zahialy/i,
  /zahialay/i,
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
  if (!trimmed) return true;

  // Allow short numeric inputs (e.g. 1, 2, 1., 2))
  if (/^\d+[\.\)]?$/.test(trimmed)) return false;

  // Empty / single char
  if (trimmed.length < 2) return true;
  // No Unicode letter or digit at all (emoji-only, symbol-only, pure punctuation)
  // \p{L} with u flag correctly recognises Mongolian / Cyrillic as letters
  if (!/[\p{L}\d]/u.test(trimmed)) return true;
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
  if (matches(text, ADDRESS)) return "address";
  if (matches(text, REPAIR)) return "repair";
  if (matches(text, WIND_RESISTANCE)) return "wind_resistance";
  if (matches(text, VAT_INFO)) return "vat_info";
  if (matches(text, ACCESSORIES_INFO)) return "accessories_info";
  if (matches(text, BEGINNER_RECOMMENDATION)) return "beginner_recommendation";
  if (matches(text, EASY_TO_CONTROL)) return "easy_to_control";
  if (matches(text, COMPARE)) return "compare_products";
  if (matches(text, TECHNICAL)) return "technical_consultation";
  if (matches(text, CHEAPEST_DRONE)) return "cheapest_drone";
  if (matches(text, CHEAPEST_ACCESSORY)) return "cheapest_accessory";
  if (matches(text, CHEAPEST_CAMERA)) return "cheapest_camera";
  if (matches(text, CHEAPEST_HANDHELD)) return "cheapest_handheld";
  if (matches(text, SHOW_PICTURES)) return "show_pictures";
  if (matches(text, WEBSITE_INFO)) return "website_info";
  if (matches(text, ORDER)) return "order_request";
  // Check vague price inquiries BEFORE product_search to avoid false dumps
  if (matches(text, PRICE_INQUIRY)) return "price_inquiry";
  if (matches(text, DRONE_USECASE)) return "product_search";
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
    /зураг/i,
    /бичлэг/i,
    /видео/i,
    /ачаа/i,
    /тээвэр/i,
    /тариа/i,
    /цацах/i,
    /shooting/i,
    /photo/i,
    /video/i,
    /agriculture/i,
    /zurag/i,
    /bichleg/i,
    /achaa/i,
    /teewer/i,
    /teever/i,
    /taria/i,
    /tsatsah/i,
    /nisgeh/i,
    /nisdeg/i,
    /air/i,
    /mini/i,
    /mavic/i,
    /phantom/i,
    /avata/i,
    /neo/i,
    /atom/i,
    /fpv/i,
    /inspire/i,
    /mic/i,
    /мик/i,
    /атом/i,
    /atom/i,
    /neo/i,
    /potensic/i,
    /батарей/i,
    /batter/i,
    /bater/i,
    /led/i,
    /gerel/i,
    /цүнх/i,
    /case/i,
    /хэд\s*(вэ|бэ)/i,
    /үнэ/i,
    /vne/i,
    /une/i,
    /хямд/i,
    /hyamd/i,
    /захиалга/i,
    /zahialga/i,
    /hurgelt/i,
    /hurgeltiin/i,
    /^\d+[\.\)]?$/, // Route standalone numbers to AI (e.g., when replying to menus)
  ];
  return droneKeywords.some((p) => p.test(message.trim()));
}