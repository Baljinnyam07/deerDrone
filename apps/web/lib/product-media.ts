/**
 * Rich, dji.com-style media for products that have an official asset kit.
 * Images live on Cloudinary under `deerdrone/<folder>/<id>`; the page text still
 * comes from the product record. Products without an entry here keep the plain layout.
 */

const CLOUD_BASE = "https://res.cloudinary.com/dx3ymrxfs/image/upload";

export interface MediaImage {
  id: string;
  alt: string;
  caption?: string;
}

export interface MediaChapter {
  title: string;
  text: string;
  images: MediaImage[];
}

export interface ProductMedia {
  folder: string;
  hero: MediaImage;
  /** Muted looping background for the hero; `poster` is an image id in the same folder. */
  heroVideo?: { id: string; poster: string };
  /** Light text over a dark scrim on the hero image (always true when there is a hero video). */
  heroDark?: boolean;
  /** Full film opened from the hero's "watch video" button (video id in the same folder). */
  film?: string;
  chapters: MediaChapter[];
  galleryTitle: string;
  gallery: MediaImage[];
}

export function mediaUrl(folder: string, id: string, width: number): string {
  return `${CLOUD_BASE}/f_auto,q_auto,w_${width}/deerdrone/${folder}/${id}`;
}

export function mediaVideoUrl(folder: string, id: string): string {
  return `${CLOUD_BASE.replace("/image/", "/video/")}/deerdrone/${folder}/${id}.mp4`;
}

export function mediaSrcSet(folder: string, id: string, widths = [800, 1400, 2400]): string {
  return widths.map((w) => `${mediaUrl(folder, id, w)} ${w}w`).join(", ");
}

const LITO_X1: ProductMedia = {
  folder: "lito-x1",
  hero: { id: "hero-kv", alt: "DJI Lito X1 нисэж байна" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  film: "film",
  chapters: [
    {
      title: "Хөнгөн, авсаархан, нисэхэд бэлэн",
      text: "Ердөө 249 грамм жинтэй тул аялал бүрдээ хамт авч явахад хялбар. Салхи, далайн эрэг, зам талаар — хаана ч нис.",
      images: [{ id: "takeoff-van", alt: "Далайн эрэгт хөөрч буй DJI Lito X1" }],
    },
    {
      title: "ActiveTrack-аар хөдөлгөөнийг дага",
      text: "Сонгосон объектыг автоматаар дагаж, кадрын төвд барина. Та зөвхөн агшин зуурыг мэдрэхэд анхаар.",
      images: [{ id: "activetrack", alt: "ActiveTrack горимоор дагаж буй дрон" }],
    },
    {
      title: "Ухаалаг буцах (RTH)",
      text: "Нэг товшилтоор дрон эхлэх цэг рүүгээ аюулгүй буцна. Холбоо тасарсан үед ч найдвартай.",
      images: [{ id: "return-home", alt: "Эхлэх цэг рүү буцаж буй дрон" }],
    },
    {
      title: "Өөрт тохирсон удирдлага",
      text: "DJI RC 2 дэлгэцтэй удирдлага эсвэл утсаа холбон ашиглах DJI RC-N3. Сонголт таных.",
      images: [
        { id: "rc2-hold", alt: "DJI RC 2 удирдлага", caption: "DJI RC 2 · дэлгэцтэй удирдлага" },
        { id: "rcn3-hold", alt: "DJI RC-N3 удирдлага", caption: "DJI RC-N3 · утсаар хянана" },
      ],
    },
    {
      title: "Холын зайд тогтвортой дамжуулалт",
      text: "DJI RC 2 удирдлагатай үед 15 км хүртэлх зайд зураг дамжуулна. Мөн 4G дамжуулалтаар холболтоо өргөтгөж болно.",
      images: [
        { id: "rc2-controller", alt: "DJI RC 2 удирдлага", caption: "15 км зураг дамжуулалт" },
        { id: "transmission-4g", alt: "4G дамжуулалттай дрон", caption: "4G дамжуулалт" },
      ],
    },
    {
      title: "Дотоод 42GB санах ой",
      text: "Санах ойн карт нэмж авахгүйгээр зураг, бичлэгээ шууд хадгалаад, утсандаа хурдан шилжүүлнэ.",
      images: [
        { id: "storage-42gb", alt: "Дотоод 42GB санах ой", caption: "42GB дотоод санах ой" },
        { id: "phone-transfer", alt: "Утсанд хурдан дамжуулж буй байдал", caption: "Утсанд хурдан дамжуулалт" },
      ],
    },
    {
      title: "Fly More Combo",
      text: "Нэмэлт батерей, цэнэглэгч төв, цүнх зэрэг бүгд багтсан иж бүрдэлтэй. Худалдаж аваад шууд нис.",
      images: [{ id: "combo-shot", alt: "DJI Lito X1 Fly More Combo иж бүрдэл" }],
    },
  ],
  galleryTitle: "DJI Lito X1-ээр авсан",
  gallery: [1, 2, 3, 4, 5, 6].map((n) => ({ id: `shot-${n}`, alt: `DJI Lito X1-ээр авсан зураг ${n}` })),
};

const MINI_5_PRO: ProductMedia = {
  folder: "mini-5-pro",
  hero: { id: "hero-flight", alt: "Ойн дунд нисч буй DJI Mini 5 Pro" },
  heroDark: true,
  chapters: [
    {
      title: "Аялал бүрт хамт",
      text: "Нуга, уул, далайн эрэг — хаана ч дрон тань хамт нисч, гайхалтай кадрыг буулгана.",
      images: [{ id: "hero-kv", alt: "Нуга дээгүүр нисч буй DJI Mini 5 Pro" }],
    },
    {
      title: "Хаана ч авч явахад хялбар",
      text: "Авсаархан эвхэгддэг биетэй тул халаас, цүнхэндээ хийчихээд аялалд гарахад бэрх зүйл алга.",
      images: [
        { id: "light-1", alt: "Дроныг халаасанд хийж буй байдал" },
        { id: "light-2", alt: "Дроныг цүнхэнд хийж буй байдал" },
      ],
    },
    {
      title: "Дэлгээд л шууд нис",
      text: "Эвхэгдсэн гараа дэлгэхэд дрон автоматаар асч, хором тоолох зуур нисэхэд бэлэн болно.",
      images: [
        { id: "unfold", alt: "Дроныг дэлгэж буй байдал" },
        { id: "unfolded", alt: "Дэлгэгдсэн дрон" },
      ],
    },
    {
      title: "Хөдөлгөөнийг дагаж буулга",
      text: "Дугуй унах, явган аялах үед объектоо дагаж, кадрын төвд барина. Та зөвхөн агшнаа мэдрэхэд анхаар.",
      images: [{ id: "cycling-follow", alt: "Дугуйчныг дагаж буй дрон" }],
    },
    {
      title: "Нэг товшилтоор кино мэт агшин",
      text: "QuickShots горимууд өөрөө хөдөлж, мэргэжлийн хөдөлгөөнтэй богино бичлэгийг хормын дотор гаргана.",
      images: [{ id: "quickshots", alt: "QuickShots горимоор тойрч буй дрон" }],
    },
    {
      title: "Өөрт тохирсон удирдлага",
      text: "Дэлгэцтэй DJI RC 2 эсвэл утсаа холбон ашиглах DJI RC-N3. Аль нь танд эвтэйхэн бэ, түүнийг сонго.",
      images: [
        { id: "rc2", alt: "DJI RC 2 удирдлага", caption: "DJI RC 2 · дэлгэцтэй удирдлага" },
        { id: "rcn3", alt: "DJI RC-N3 удирдлага", caption: "DJI RC-N3 · утсаар хянана" },
      ],
    },
    {
      title: "Утсандаа шууд, шүүлтүүртэйгээр",
      text: "Зураг, бичлэгээ утсандаа хурдан шилжүүлж, ND шүүлтүүрээр гэрлээ тохируулан илүү цэвэр бичлэг ав.",
      images: [
        { id: "transfer", alt: "Утас руу хурдан дамжуулж буй байдал", caption: "Утсанд хурдан дамжуулалт" },
        { id: "nd-filter", alt: "ND шүүлтүүрийн иж бүрдэл", caption: "ND шүүлтүүр" },
      ],
    },
    {
      title: "Батерей ба дагалдах хэрэгсэл",
      text: "Нэмэлт батерей болон дагалдах хэрэгслээр нислэгийн хугацаагаа уртасгаж, илүү их агшин буулга.",
      images: [
        { id: "battery", alt: "Батерей солиж буй байдал", caption: "Нэмэлт батерей" },
        { id: "accessories", alt: "Дагалдах хэрэгслүүд", caption: "Дагалдах хэрэгслүүд" },
      ],
    },
    {
      title: "Танд тохирсон иж бүрдэл",
      text: "Fly More Combo-д нэмэлт батерей, цэнэглэх төв, цүнх зэрэг нислэгт хэрэгтэй бүх зүйл багтсан.",
      images: [{ id: "combo", alt: "DJI Mini 5 Pro иж бүрдэл" }],
    },
  ],
  galleryTitle: "DJI Mini 5 Pro-оор авсан",
  gallery: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `shot-${n}`, alt: `DJI Mini 5 Pro-оор авсан зураг ${n}` })),
};

const AIR_3S: ProductMedia = {
  folder: "air-3s",
  hero: { id: "hero-kv", alt: "Үдшийн бүрэнхийд нисч буй DJI Air 3S" },
  heroDark: true,
  chapters: [
    {
      title: "1 инчийн CMOS ба хос камер",
      text: "1 инчийн CMOS мэдрэгч, өргөн өнцөгт болон 70 мм-ийн дунд телефото линзтэй хос камераар ойр, холын агшныг хоёуланг нь тод, цэвэр буулгана.",
      images: [
        { id: "cmos", alt: "1 инчийн CMOS мэдрэгч", caption: "1 инчийн CMOS" },
        { id: "wide", alt: "Өргөн өнцөгт линзээр авсан кадр", caption: "Өргөн өнцөгт линз" },
      ],
    },
    {
      title: "Хөдөлгөөнийг 360°-аар дага",
      text: "ActiveTrack 360 нь сонгосон объектыг аль ч талаас нь дагаж, хурдтай хөдөлгөөн дунд ч кадрын төвд барина.",
      images: [{ id: "activetrack", alt: "Цаначныг дагаж буй дрон" }],
    },
    {
      title: "Харанхуйд ч саадыг мэдэрнэ",
      text: "Урд талын LiDAR болон бүх чиглэлийн саад мэдрэгч нь шөнө, сул гэрэлтэй орчинд ч саадыг таньж, аюулгүй нислэгт тусална.",
      images: [
        { id: "lidar-day", alt: "Хаданд ойрхон нисч буй дрон", caption: "Бүх чиглэлийн саад мэдрэгч" },
        { id: "lidar-night", alt: "LiDAR-аар шөнийн харанхуйд сканнердаж буй дрон", caption: "Урд талын LiDAR" },
      ],
    },
    {
      title: "Ухаалаг буцах (RTH)",
      text: "Нэг товшилтоор дрон эхлэх цэг рүүгээ саадыг тойрч, аюулгүй буцна.",
      images: [{ id: "rth", alt: "Эхлэх цэг рүү буцаж буй дрон" }],
    },
    {
      title: "45 минут хүртэл нислэг",
      text: "Урт хугацааны нислэгийн батерейгаар нэг цэнэгээр илүү их агшин буулгаж, илүү хол нис.",
      images: [
        { id: "flight-time", alt: "45 минутын нислэгийн хугацаа", caption: "45 минут хүртэл нислэг" },
        { id: "battery", alt: "Ухаалаг нислэгийн батерей", caption: "Ухаалаг батерей" },
      ],
    },
    {
      title: "Өөрт тохирсон удирдлага",
      text: "Дэлгэцтэй DJI RC 2 эсвэл утсаа холбон ашиглах DJI RC-N3. Аль нь танд эвтэйхэн бэ, түүнийг сонго.",
      images: [
        { id: "rc2", alt: "DJI RC 2 удирдлага", caption: "DJI RC 2 · дэлгэцтэй" },
        { id: "rcn3", alt: "DJI RC-N3 удирдлага", caption: "DJI RC-N3 · утсаар хянана" },
      ],
    },
    {
      title: "Утсанд шууд, 4G-ээр ч",
      text: "Зураг, бичлэгээ утсандаа хурдан шилжүүлж, 4G dongle-оор холболтоо өргөтгөж болно.",
      images: [
        { id: "transfer", alt: "Утсанд хурдан шилжүүлж буй байдал", caption: "Утсанд хурдан дамжуулалт" },
        { id: "cellular", alt: "4G dongle-той дрон", caption: "4G дамжуулалт" },
      ],
    },
    {
      title: "Дагалдах хэрэгсэл",
      text: "Сэлбэг сэнсний хамгаалалт болон ND шүүлтүүрийн иж бүрдлээр орчиндоо тохируулан бичлэгийн чанараа сайжруул.",
      images: [
        { id: "prop-guard", alt: "Сэнсний хамгаалалттай дрон", caption: "Сэнсний хамгаалалт" },
        { id: "nd-filter", alt: "ND шүүлтүүрийн иж бүрдэл", caption: "ND шүүлтүүр" },
      ],
    },
    {
      title: "Fly More Combo",
      text: "Нэмэлт батерей, цэнэглэх төв, цүнх зэрэг нислэгт хэрэгтэй бүгд багтсан иж бүрдэл.",
      images: [{ id: "combo", alt: "DJI Air 3S Fly More Combo иж бүрдэл" }],
    },
  ],
  galleryTitle: "DJI Air 3S-ээр авсан",
  gallery: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `shot-${n}`, alt: `DJI Air 3S-ээр авсан зураг ${n}` })),
};

const NEO_2: ProductMedia = {
  folder: "neo-2",
  hero: { id: "hero-kv", alt: "Гүйгчийг дагаж буй DJI Neo 2" },
  heroDark: true,
  chapters: [
    {
      title: "Алган дээрээсээ нис",
      text: "Алган дээрээс шууд хөөрч, буудаг авсаархан дрон. Аялал, хөдөлгөөн, өдөр тутмын агшин бүрийг хялбар буулга.",
      images: [{ id: "hand", alt: "Алган дээр барьсан DJI Neo 2" }],
    },
    {
      title: "Бүх чиглэлээс хамгаална",
      text: "Бүх чиглэлийн саад мэдрэгч нь дроныг эргэн тойрны саадаас хамгаалж, найдвартай нислэг өгнө.",
      images: [
        { id: "omni-1", alt: "Саад мэдэрч буй дрон", caption: "Саад мэдрэгч" },
        { id: "omni-2", alt: "Бүх чиглэлд нисч буй дрон", caption: "Бүх чиглэлийн нислэг" },
      ],
    },
    {
      title: "Дохиогоор удирд",
      text: "Гарын дохиогоор дроныг удирдаж, зураг авах, бичлэг эхлүүлэх боломжтой. Утас, удирдлага шаардлагагүй.",
      images: [
        { id: "gesture-1", alt: "Гараа өргөж дохио өгч буй хүн", caption: "Гарын дохио" },
        { id: "gesture-2", alt: "Дохиогоор дрон удирдаж буй хүн", caption: "Дохиогоор удирдлага" },
      ],
    },
    {
      title: "Хөдөлгөөнийг дагана",
      text: "Дугуй унах, гүйх үед объектоо дагаж, кадрын төвд барина. Та зөвхөн хөдөлгөөндөө анхаар.",
      images: [
        { id: "cycling", alt: "Дугуйчныг дагаж буй дрон", caption: "Дугуйчныг дагана" },
        { id: "running", alt: "Гүйгчийг дагаж буй дрон", caption: "Гүйгчийг дагана" },
      ],
    },
    {
      title: "Гэр бүл, найзуудтайгаа",
      text: "Ухаалаг селфи горимоор гэр бүл, найзуудтайгаа нийлж кадраа хялбар, өвөрмөц буулга.",
      images: [{ id: "selfie", alt: "Гэр бүлийн аялал дахь ухаалаг селфи" }],
    },
    {
      title: "Утсаараа удирд, шууд шилжүүл",
      text: "Утсан дээрээс нислэгээ хянаж, зураг, бичлэгээ утсандаа хурдан шилжүүл.",
      images: [
        { id: "mobile", alt: "Утсаар дрон удирдаж буй байдал", caption: "Утсаар удирдлага" },
        { id: "transfer", alt: "Утсанд хурдан шилжүүлж буй байдал", caption: "Хурдан дамжуулалт" },
      ],
    },
    {
      title: "DJI RC-N3 удирдлагатай",
      text: "RC-N3 удирдлагад утсаа холбон ашиглаж, илүү нарийн удирдлага, холын зайг авна.",
      images: [{ id: "rcn3", alt: "DJI RC-N3 удирдлага барьсан хүн" }],
    },
    {
      title: "Цэнэглэх төв ба иж бүрдэл",
      text: "Fly More Combo-д нэмэлт батерей болон цэнэглэх төв багтсан тул нэг удаагийн нислэгээр зогсохгүй.",
      images: [
        { id: "hub", alt: "Цэнэглэх төв", caption: "Цэнэглэх төв" },
        { id: "combo", alt: "DJI Neo 2 иж бүрдэл", caption: "Иж бүрдэл" },
      ],
    },
  ],
  galleryTitle: "DJI Neo 2-оор авсан",
  gallery: [1, 2, 3, 4].map((n) => ({ id: `shot-${n}`, alt: `DJI Neo 2-оор авсан зураг ${n}` })),
};

const MEDIA_CATEGORIES = new Set(["drones", "cameras", "handheld", "power"]);

/** Accessories share model names with their drone (e.g. "…lito-x1-battery"), so only real products match. */
export function getProductMedia(slug: string, categorySlug: string): ProductMedia | null {
  if (!MEDIA_CATEGORIES.has(categorySlug)) return null;
  if (/lito-x1/i.test(slug)) return LITO_X1;
  if (/mini-5-pro/i.test(slug)) return MINI_5_PRO;
  if (/air-3s/i.test(slug)) return AIR_3S;
  if (/neo-2/i.test(slug)) return NEO_2;
  return null;
}
