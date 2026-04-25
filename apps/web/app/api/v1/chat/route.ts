import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client (server-side) ───────────────────────────────────────────
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ────────────────────────────────────────────────────────────────────
type Intent =
  | "greeting" | "off_topic" | "spam" | "product_search" | "product_detail"
  | "order_request" | "technical_consultation" | "compare_products"
  | "delivery" | "lease_request" | "loan_info" | "loan_request"
  | "rental_request" | "quote_request" | "bulk_order" | "human_handoff"
  | "unknown";

interface ChatCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  heroNote: string;
  image_url?: string;
}

// ─── Static responses ─────────────────────────────────────────────────────────
const STATIC = {
  greeting: "Сайн байна уу! 👋 Би DEER Drone-ийн виртуал зөвлөх болно.\n\nТанд дрон сонгоход туслах, үнэ мэдэх, техникийн зөвлөгөө өгөх боломжтой. Юу асуумаар байна вэ?",
  off_topic: "Уучлаарай, би зөвхөн дрон болон DEER Drone-ийн үйлчилгээтэй холбоотой асуултад хариулах боломжтой. 🙏",
  spam: "Уучлаарай, таны мессежийг боловсруулах боломжгүй байна. Дрон болон манай бүтээгдэхүүнтэй холбоотой асуулт асуугаарай.",
  fallback: "Уучлаарай, таны асуултыг ойлгосонгүй. Дрон, үнэ, захиалга, эсвэл техникийн зөвлөгөөний талаар асуугаарай.",
  delivery: "🚚 Хүргэлтийн мэдээлэл:\n\n• Улаанбаатар: 5,000₮ — 24-48 цагт\n• Орон нутаг: 10,000₮ — 3-5 хоног\n\nЗахиалгын дараа манай ажилтан холбоо барина.",
  humanHandoff: "✅ Таны хүсэлтийг хүлээн авлаа.\n\nМанай мэргэжилтэн удахгүй тантай холбоо барих болно. Баярлалаа! 🙏",
  loanInfo: "Тийм ээ, манайх зээлээр авах боломжтой. Бид Pocket zero, Store pay, Ard-Pick Pay, Simple, Sono зэрэг аппликейшнүүдээр хувааж төлөх нөхцөл санал болгодог.\n\nЗээлийн дэлгэрэнгүй мэдээлэл авах эсвэл зээлээр авахыг хүсвэл 'зээлээр авъя' гэж бичнэ үү.",
  loanAck: "Та ажил эрхлэгч нийгмийн даатгал төлдөг бол НОГООН зээлээ Хаан банкны app-аар 1-5 минутанд шийдэх боломжтой. Мөн Pocket zero, Store pay, Ard-Pick Pay, Simple-Pay, Sono application-аар авах боломжтой.",
  leaseAck: "✅ Түрээсийн хүсэлтийг хүлээн авлаа.\n\nМанай ажилтан нарийвчилсан мэдээлэл өгөхөөр удахгүй холбоо барих болно. 🙏",
  rentalAck: "✅ Хөлслөлтийн хүсэлтийг хүлээн авлаа.\n\nМанай баг тантай холбоо барих болно. 🙏",
  quoteAck: "✅ Үнийн санал авах хүсэлтийг хүлээн авлаа.\n\nМанай борлуулалтын баг 24 цагийн дотор тантай холбоо барих болно. 🙏",
  bulkOrderAck: "✅ Бөөний захиалгын хүсэлтийг хүлээн авлаа.\n\nМанай баг тантай нарийвчилсан үнийн саналтайгаар холбоо барих болно. 🙏",
  productsIntro: "Танд дараах дронуудыг санал болгож байна 👇",
  noProducts: "Одоогоор бүртгэлтэй бүтээгдэхүүн байхгүй байна. Удахгүй шинэчлэгдэх болно.",
};

// ─── Intent classifier ────────────────────────────────────────────────────────
const PATTERNS: Record<string, RegExp[]> = {
  greeting: [/^сайн\s*байна\s*уу/i, /^сайн\s*уу/i, /^мэнд/i, /^hello/i, /^hi\b/i, /^hey\b/i, /^привет/i, /^эхлэх/i],
  loan_info: [/зээлээр\s*авч\s*болох\s*уу/i, /зээл\s*байдаг\s*уу/i, /зээл\s*байгаа\s*юу/i, /зээл\s*гардаг\s*уу/i],
  loan_request: [/зээл/i, /zeel/i, /loan/i, /credit/i, /хэсэгчлэн\s*төлөх/i],
  lease_request: [/түрээс/i, /lease/i, /санхүүгийн\s*түрээс/i],
  rental_request: [/хөлс\s*авах/i, /хөлслөх/i, /rent/i, /rental/i],
  quote_request: [/үнийн\s*санал/i, /quote/i, /quotation/i, /тендер/i],
  bulk_order: [/олноор/i, /багц/i, /bulk/i, /бөөн/i, /олон\s*ширхэг/i],
  human_handoff: [/оператор/i, /ажилтан/i, /менежер/i, /хүнтэй\s*яриа/i, /холбогдох/i, /live\s*agent/i],
  delivery: [/хүргэл/i, /хүргэх/i, /delivery/i, /shipping/i, /тээвэр/i],
  compare_products: [/харьцуул/i, /compare/i, /аль\s+нь/i, /ялгаа/i, /vs\.?\s/i],
  technical_consultation: [/камер/i, /сенсор/i, /батарей/i, /battery/i, /нислэгийн\s*цаг/i, /mapping/i, /техник/i, /хэрхэн\s*ажилла/i],
  order_request: [/захиалах/i, /захиалга/i, /авмаар\s*байна/i, /худалдаж\s*авах/i, /order/i, /buy/i],
  product_search: [/үнэ\s*хэд/i, /хэдэн\s*төгрөг/i, /бүтээгдэхүүн/i, /ямар\s*дрон/i, /дрон\s*харах/i, /загвар/i, /юу\s*байна\s*вэ/i],
  off_topic: [/найз/i, /нөхөр/i, /тоглоом/i, /кино/i, /улс\s*төр/i, /цаг\s*агаар/i, /weather/i, /хоол\s*жор/i],
};

function isSpam(text: string): boolean {
  if (text.trim().length < 2) return true;
  if (!/\p{L}/u.test(text)) return true;
  if (/^(.)\1{5,}$/.test(text.trim())) return true;
  return false;
}

function classifyIntent(message: string): Intent {
  const text = message.trim();
  if (!text || isSpam(text)) return "spam";
  for (const [intent, patterns] of Object.entries(PATTERNS)) {
    if (patterns.some((p) => p.test(text))) return intent as Intent;
  }
  return "unknown";
}

// ─── DB helpers ───────────────────────────────────────────────────────────────
function normalizeCards(items: any[]): ChatCard[] {
  return items.slice(0, 6).map((p) => {
    let imageUrl = p.product_images?.[0]?.url ?? p.image_url ?? "";
    if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = `https://deer-drone.vercel.app${imageUrl}`;
    }
    return {
      id: p.id,
      name: p.name,
      slug: p.slug ?? "",
      price: p.price ?? 0,
      heroNote: p.hero_note ?? "",
      image_url: imageUrl || undefined,
    };
  });
}

async function getFeaturedProducts(limit = 6): Promise<ChatCard[]> {
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, product_images(url)")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (data && data.length > 0) return normalizeCards(data);

  const { data: fallback } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, product_images(url)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return normalizeCards(fallback ?? []);
}

async function searchProducts(keyword: string, limit = 4): Promise<ChatCard[]> {
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, hero_note, product_images(url)")
    .ilike("name", `%${keyword}%`)
    .limit(limit);
  return normalizeCards(data ?? []);
}

async function captureLead(interest: string, intent: string) {
  try {
    await supabase.from("leads").insert({
      name: "Тодорхойгүй",
      phone: "",
      interest,
      status: "new",
      source_page: "chatbot-widget",
      intent,
    });
  } catch {
    // silent
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId?: string; message?: string; sourcePage?: string };

    if (!body?.sessionId || !body?.message) {
      return NextResponse.json(
        { error: "sessionId болон message шаардлагатай." },
        { status: 400 }
      );
    }

    const { sessionId, message } = body;
    const intent = classifyIntent(message);

    console.log(`[chat-api] intent=${intent} msg="${message.slice(0, 60)}"`);

    // ── Spam / off-topic ─────────────────────────────────────────────────────
    if (intent === "spam") {
      return NextResponse.json({ sessionId, reply: STATIC.spam });
    }
    if (intent === "off_topic") {
      return NextResponse.json({ sessionId, reply: STATIC.off_topic });
    }

    // ── Greeting — show featured products ────────────────────────────────────
    if (intent === "greeting") {
      const cards = await getFeaturedProducts(6);
      return NextResponse.json({ sessionId, reply: STATIC.greeting, cards });
    }

    // ── Delivery ─────────────────────────────────────────────────────────────
    if (intent === "delivery") {
      return NextResponse.json({ sessionId, reply: STATIC.delivery });
    }

    // ── Human handoff ─────────────────────────────────────────────────────────
    if (intent === "human_handoff") {
      await captureLead(message, intent);
      return NextResponse.json({ sessionId, reply: STATIC.humanHandoff });
    }

    // ── Loan info ─────────────────────────────────────────────────────────────
    if (intent === "loan_info") {
      return NextResponse.json({ sessionId, reply: STATIC.loanInfo });
    }
    if (intent === "loan_request") {
      await captureLead(message, intent);
      return NextResponse.json({ sessionId, reply: STATIC.loanAck });
    }
    if (intent === "lease_request") {
      await captureLead(message, intent);
      return NextResponse.json({ sessionId, reply: STATIC.leaseAck });
    }
    if (intent === "rental_request") {
      await captureLead(message, intent);
      return NextResponse.json({ sessionId, reply: STATIC.rentalAck });
    }
    if (intent === "quote_request") {
      await captureLead(message, intent);
      return NextResponse.json({ sessionId, reply: STATIC.quoteAck });
    }
    if (intent === "bulk_order") {
      await captureLead(message, intent);
      return NextResponse.json({ sessionId, reply: STATIC.bulkOrderAck });
    }

    // ── Product search ────────────────────────────────────────────────────────
    if (intent === "product_search" || intent === "product_detail" || intent === "order_request") {
      // Try to extract keyword from message
      const lower = message.toLowerCase();
      const droneAliases = ["agras", "mavic", "phantom", "matrice", "mini", "inspire", "air", "dji", "мини", "агр", "мавик"];
      let keyword = droneAliases.find((a) => lower.includes(a)) ?? null;

      if (keyword) {
        const found = await searchProducts(keyword, 4);
        if (found.length > 0) {
          return NextResponse.json({ sessionId, reply: STATIC.productsIntro, cards: found });
        }
      }

      // Fallback: featured products
      const cards = await getFeaturedProducts(6);
      if (cards.length === 0) {
        return NextResponse.json({ sessionId, reply: STATIC.noProducts });
      }
      return NextResponse.json({ sessionId, reply: STATIC.productsIntro, cards });
    }

    // ── Technical / compare / unknown — simple AI-free response ──────────────
    // Show featured products with a helpful message
    const cards = await getFeaturedProducts(4);
    return NextResponse.json({
      sessionId,
      reply: "Техникийн дэлгэрэнгүй мэдээлэл авахыг хүсвэл манай мэргэжилтэнтэй холбоо барина уу. Дараах бүтээгдэхүүнүүдийг харах боломжтой 👇",
      cards: cards.length > 0 ? cards : undefined,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "AI зөвлөх түр ажиллагаагүй байна. Дараа дахин оролдоно уу." },
      { status: 503 }
    );
  }
}
