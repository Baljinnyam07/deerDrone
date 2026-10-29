import type { Product } from "@deer-drone/types";

/**
 * DJI-style product "series" shown on the home page and in the header mega
 * menu. Each series is matched against live catalog products by name, so the
 * link, image and price always come from the database. Edit copy/order here.
 */
export interface SeriesConfig {
  id: string;
  category: "drones" | "cameras" | "handheld" | "power";
  /** Matched against product names; the first in-stock match wins. */
  match: RegExp;
  title: string;
  /** Short name shown under the icon in the mega menu. */
  shortName: string;
  eyebrow: string;
  tagline: string;
  /** Optional background video for hero slides. */
  video?: string;
  /** Theme of the banner background. */
  theme?: "light" | "dark";
}

export interface Series extends Omit<SeriesConfig, "match"> {
  slug: string;
  image: string;
  price: number;
  productCount: number;
}

export const HERO_VIDEO =
  "https://pub-d35869f82a8446f7ae9101d79069e8b1.r2.dev/M77_WA150_30s_EN_1920x1080.mp4";
export const SHOT_ON_VIDEOS = [
  "https://res.cloudinary.com/dx3ymrxfs/video/upload/f_auto,q_auto,w_1400/F81_OW001__E2_89_A410s_DJI_home_page_Shot_on_Video_CLEAN_2400x1440_N_N_zr8flp.mp4",
  "https://pub-d35869f82a8446f7ae9101d79069e8b1.r2.dev/M17_WA020_30s_EN_1080x1920.mp4",
  HERO_VIDEO,
];

export const SERIES: SeriesConfig[] = [
  {
    id: "mini-5-pro",
    category: "drones",
    match: /mini 5 pro/i,
    title: "DJI MINI 5 PRO",
    shortName: "DJI Mini 5 Pro",
    eyebrow: "1 инчийн CMOS мэдрэгчтэй мини дрон",
    tagline: "Жижиг биетэй, том боломжтой",
    video: HERO_VIDEO,
    theme: "dark",
  },
  {
    id: "mavic-4-pro",
    category: "drones",
    match: /mavic 4 ?pro/i,
    title: "DJI MAVIC 4 PRO",
    shortName: "DJI Mavic 4 Pro",
    eyebrow: "Гурван камертай флагман дрон",
    tagline: "Spin Your World",
  },
  {
    id: "pocket-4p",
    category: "cameras",
    match: /pocket 4p/i,
    title: "OSMO POCKET 4P",
    shortName: "Osmo Pocket 4P",
    eyebrow: "Хос линзтэй кино гимбал камер",
    tagline: "See More. Tell More.",
  },
  {
    id: "air-3s",
    category: "drones",
    match: /air 3s/i,
    title: "DJI AIR 3S",
    shortName: "DJI Air 3S",
    eyebrow: "Аяллын зураг авалтад зориулсан хос камертай дрон",
    tagline: "Chase the View",
  },
  {
    id: "avata-360",
    category: "drones",
    match: /avata 360/i,
    title: "DJI AVATA 360",
    shortName: "DJI Avata 360",
    eyebrow: "8K 360° флагман дрон",
    tagline: "Above It All, See It All",
  },
  {
    id: "lito-x1",
    category: "drones",
    match: /lito x1/i,
    title: "DJI LITO X1",
    shortName: "DJI Lito X1",
    eyebrow: "Анхлан суралцагчдад зориулсан камер дрон",
    tagline: "Just Fly.",
  },
  {
    id: "pocket-4",
    category: "cameras",
    match: /pocket 4(?!p)/i,
    title: "OSMO POCKET 4",
    shortName: "Osmo Pocket 4",
    eyebrow: "1″ CMOS халаасны гимбал камер",
    tagline: "The World In My Pocket",
  },
  {
    id: "osmo-360-ii",
    category: "cameras",
    match: /osmo 360 ii/i,
    title: "OSMO 360 II",
    shortName: "Osmo 360 II",
    eyebrow: "8K 360° камер",
    tagline: "All Angles. All Epic.",
  },
  {
    id: "action-6",
    category: "cameras",
    match: /action 6/i,
    title: "OSMO ACTION 6",
    shortName: "Osmo Action 6",
    eyebrow: "Бүгдийг багтаасан флагман экшн камер",
    tagline: "Square Up, Nail the Move",
  },
  {
    id: "flip",
    category: "drones",
    match: /dji flip/i,
    title: "DJI FLIP",
    shortName: "DJI Flip",
    eyebrow: "Эвхэгддэг, хамгаалалттай влог дрон",
    tagline: "Хаана ч, хэзээ ч нисгэ",
  },
  {
    id: "neo-2",
    category: "drones",
    match: /neo 2/i,
    title: "DJI NEO 2",
    shortName: "DJI Neo 2",
    eyebrow: "Алган дээрээс хөөрдөг влог дрон",
    tagline: "Таны хувийн камерчин",
  },
  {
    id: "mobile-8p",
    category: "handheld",
    match: /mobile 8p/i,
    title: "OSMO MOBILE 8P",
    shortName: "Osmo Mobile 8P",
    eyebrow: "Мэргэжлийн хүрээ, хяналттай утасны гимбал",
    tagline: "Wonders in Your Palm",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  drones: "Дрон",
  cameras: "Камер",
  handheld: "Гар төхөөрөмж",
  power: "Power",
  accessories: "Дагалдах хэрэгсэл",
};

function productImage(product: Product) {
  const thumb = product.images.find((img) => img.isThumbnail) ?? product.images[0];
  return thumb?.url || "/assets/drone-product.png";
}

/** Resolve series against the live catalog; series with no product are dropped. */
export function resolveSeries(products: Product[]): Series[] {
  const live = products.filter((p) => p.status !== "archived");
  return SERIES.flatMap(({ match, ...config }) => {
    // Same category only: accessories ("Mavic 4 Pro hard case") share names.
    const matches = live.filter((p) => p.categorySlug === config.category && match.test(p.name));
    if (matches.length === 0) return [];
    const lead = matches.find((p) => p.stockQty > 0) ?? matches[0];
    return [
      {
        ...config,
        slug: lead.slug,
        image: productImage(lead),
        price: Math.min(...matches.map((p) => p.price)),
        productCount: matches.length,
      },
    ];
  });
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("en-US")}₮`;
}
