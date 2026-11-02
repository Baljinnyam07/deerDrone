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
  /** Show images whole (no crop): for square or text-bearing artwork. */
  natural?: boolean;
}

export interface ProductMedia {
  folder: string;
  hero: MediaImage;
  /** Muted looping background for the hero; `poster` is an image id in the same folder. */
  heroVideo?: { id: string; poster: string };
  /** Light text over a dark scrim on the hero image (always true when there is a hero video). */
  /** Play the official YouTube film (muted, looping) behind the hero when there is no clip file. */
  heroYoutube?: boolean;
  /** Shorter hero heading when the product name is a long SKU. */
  heroTitle?: string;
  heroDark?: boolean;
  /** Full film opened from the hero's "watch video" button (video id in the same folder). */
  film?: string;
  /** Official YouTube video id; the hero's "watch video" button plays it in an embedded viewer. */
  youtube?: string;
  chapters: MediaChapter[];
  galleryTitle: string;
  gallery: MediaImage[];
}

/** Images uploaded from the admin are stored as absolute URLs instead of Cloudinary ids. */
function isAbsoluteUrl(id: string): boolean {
  return /^https?:\/\//i.test(id);
}

export function mediaUrl(folder: string, id: string, width: number): string {
  if (isAbsoluteUrl(id)) return id;
  return `${CLOUD_BASE}/f_auto,q_auto,w_${width}/deerdrone/${folder}/${id}`;
}

export function mediaVideoUrl(folder: string, id: string): string {
  if (isAbsoluteUrl(id)) return id;
  return `${CLOUD_BASE.replace("/image/", "/video/")}/deerdrone/${folder}/${id}.mp4`;
}

export function mediaSrcSet(folder: string, id: string, widths = [800, 1400, 2400]): string {
  if (isAbsoluteUrl(id)) return id;
  return widths.map((w) => `${mediaUrl(folder, id, w)} ${w}w`).join(", ");
}

const LITO_X1: ProductMedia = {
  folder: "lito-x1",
  youtube: "NbrlNSoSC78",
  hero: { id: "hero-kv", alt: "DJI Lito X1 нисэж байна" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  film: "film",
  chapters: [
    {
      title: "Хөнгөн, авсаархан, нисэхэд бэлэн",
      text: "Ердөө 249 грамм жинтэй тул аялал бүрдээ хамт авч явахад хялбар. Далайн эрэг, зам талбай — хаана ч нис.",
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
  youtube: "jRzpagPx6uY",
  hero: { id: "hero-flight", alt: "Ойн дунд нисч буй DJI Mini 5 Pro" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "Аялал бүрт хамт",
      text: "Нуга, уул, далайн эрэг — хаана ч дрон тань хамт нисч, гайхалтай кадр буулгана.",
      images: [{ id: "hero-kv", alt: "Нуга дээгүүр нисч буй DJI Mini 5 Pro" }],
    },
    {
      title: "Хаана ч авч явахад хялбар",
      text: "Авсаархан эвхэгддэг биетэй тул халаас, цүнхэндээ хийчихээд аялалд гарахад амархан.",
      images: [
        { id: "light-1", alt: "Дроныг халаасанд хийж буй байдал" },
        { id: "light-2", alt: "Дроныг цүнхэнд хийж буй байдал" },
      ],
    },
    {
      title: "Дэлгээд л шууд нис",
      text: "Эвхэгдсэн гараа дэлгээд дроноо асаахад хэдхэн секундэд нисэхэд бэлэн болно.",
      images: [
        { id: "unfold", alt: "Дроныг дэлгэж буй байдал" },
        { id: "unfolded", alt: "Дэлгэгдсэн дрон" },
      ],
    },
    {
      title: "Хөдөлгөөнийг дагаж буулга",
      text: "Дугуй унах, явган аялах үед таныг дагаж, кадрын төвд барина. Та зөвхөн агшнаа мэдрэхэд анхаар.",
      images: [{ id: "cycling-follow", alt: "Дугуйчныг дагаж буй дрон" }],
    },
    {
      title: "Нэг товшилтоор кино мэт агшин",
      text: "QuickShots горимууд дроныг өөрөө хөдөлгөж, мэргэжлийн түвшний богино бичлэгийг хэдхэн секундэд бүтээнэ.",
      images: [{ id: "quickshots", alt: "QuickShots горимоор тойрч буй дрон" }],
    },
    {
      title: "Өөрт тохирсон удирдлага",
      text: "Дэлгэцтэй DJI RC 2 эсвэл утсаа холбон ашиглах DJI RC-N3. Танд эвтэйхэн аль нь вэ, түүнийгээ сонго.",
      images: [
        { id: "rc2", alt: "DJI RC 2 удирдлага", caption: "DJI RC 2 · дэлгэцтэй удирдлага" },
        { id: "rcn3", alt: "DJI RC-N3 удирдлага", caption: "DJI RC-N3 · утсаар хянана" },
      ],
    },
    {
      title: "Утсандаа шууд, ND шүүлтүүртэй",
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
  youtube: "4fhl9F8DZDU",
  hero: { id: "hero-kv", alt: "Үдшийн бүрэнхийд нисч буй DJI Air 3S" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "1 инчийн CMOS ба хос камер",
      text: "1 инчийн CMOS мэдрэгч, өргөн өнцөгт болон 70 мм-ийн дунд телефото линзтэй хос камераар ойр болон холын агшныг тод, цэвэр буулгана.",
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
      text: "Урд талын LiDAR болон бүх чиглэлийн саад мэдрэгч нь шөнө, сул гэрэлтэй орчинд ч саадыг таньж, нислэгийг аюулгүй болгоно.",
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
      text: "Нэг цэнэгээр 45 минут хүртэл нисч, илүү их агшин буулгаж, илүү хол нис.",
      images: [
        { id: "flight-time", alt: "45 минутын нислэгийн хугацаа", caption: "45 минут хүртэл нислэг" },
        { id: "battery", alt: "Ухаалаг нислэгийн батерей", caption: "Ухаалаг батерей" },
      ],
    },
    {
      title: "Өөрт тохирсон удирдлага",
      text: "Дэлгэцтэй DJI RC 2 эсвэл утсаа холбон ашиглах DJI RC-N3. Танд эвтэйхэн аль нь вэ, түүнийгээ сонго.",
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
      text: "Сэнсний хамгаалалт, ND шүүлтүүрийн иж бүрдлээр орчиндоо тохируулан бичлэгийнхээ чанарыг сайжруул.",
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
  youtube: "1mXwci-_uWc",
  hero: { id: "hero-kv", alt: "Гүйгчийг дагаж буй DJI Neo 2" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "Алган дээрээсээ нис",
      text: "Алган дээрээс шууд хөөрч, бууж чаддаг авсаархан дрон. Аялал, хөдөлгөөн, өдөр тутмын агшин бүрийг хялбар буулга.",
      images: [{ id: "hand", alt: "Алган дээр барьсан DJI Neo 2" }],
    },
    {
      title: "Бүх чиглэлээс хамгаална",
      text: "Бүх чиглэлийн саад мэдрэгч нь эргэн тойрны саадыг мэдэрч, нислэгийг найдвартай болгоно.",
      images: [
        { id: "omni-1", alt: "Саад мэдэрч буй дрон", caption: "Саад мэдрэгч" },
        { id: "omni-2", alt: "Бүх чиглэлд нисч буй дрон", caption: "Бүх чиглэлийн нислэг" },
      ],
    },
    {
      title: "Дохиогоор удирд",
      text: "Гарын дохиогоор дроныг удирдаж, зураг авах, бичлэг эхлүүлэх боломжтой. Утас, удирдлагагүйгээр ч болно.",
      images: [
        { id: "gesture-1", alt: "Гараа өргөж дохио өгч буй хүн", caption: "Гарын дохио" },
        { id: "gesture-2", alt: "Дохиогоор дрон удирдаж буй хүн", caption: "Дохиогоор удирдлага" },
      ],
    },
    {
      title: "Хөдөлгөөнийг дагана",
      text: "Дугуй унах, гүйх үед таныг дагаж, кадрын төвд барина. Та зөвхөн хөдөлгөөндөө анхаар.",
      images: [
        { id: "cycling", alt: "Дугуйчныг дагаж буй дрон", caption: "Дугуйчныг дагана" },
        { id: "running", alt: "Гүйгчийг дагаж буй дрон", caption: "Гүйгчийг дагана" },
      ],
    },
    {
      title: "Гэр бүл, найзуудтайгаа",
      text: "Гэр бүл, найзуудтайгаа хамт өвөрмөц кадрыг хялбархан буулга.",
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
      text: "RC-N3 удирдлагад утсаа холбож, илүү нарийн удирдаж, илүү хол зайд нисэх боломжтой.",
      images: [{ id: "rcn3", alt: "DJI RC-N3 удирдлага барьсан хүн" }],
    },
    {
      title: "Цэнэглэх төв ба иж бүрдэл",
      text: "Fly More Combo-д нэмэлт батерей болон цэнэглэх төв багтсан тул нэг удаагийн нислэгээр хязгаарлагдахгүй.",
      images: [
        { id: "hub", alt: "Цэнэглэх төв", caption: "Цэнэглэх төв" },
        { id: "combo", alt: "DJI Neo 2 иж бүрдэл", caption: "Иж бүрдэл" },
      ],
    },
  ],
  galleryTitle: "DJI Neo 2-оор авсан",
  gallery: [1, 2, 3, 4].map((n) => ({ id: `shot-${n}`, alt: `DJI Neo 2-оор авсан зураг ${n}` })),
};

const POCKET_4: ProductMedia = {
  folder: "pocket-4",
  youtube: "PTo3cn0Gkzw",
  hero: { id: "hero-kv", alt: "DJI Osmo Pocket 4" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  chapters: [
    {
      title: "Алган дээрээ багтана",
      text: "Гарт эвтэйхэн баригдах авсаархан, 3 тэнхлэгт тогтворжуулалттай гар камер. Хаана ч авч яваад агшин бүрийг буулга.",
      images: [
        { id: "hand", alt: "Талбай дунд зогсож буй Osmo Pocket 4" },
        { id: "hand-2", alt: "Хотын дундах хөрөг vlog" },
      ],
    },
    {
      title: "ActiveTrack-аар дагаж буулга",
      text: "Сонгосон объектоо ActiveTrack-аар дагаж, кадрын төвд барина. Та зөвхөн агшнаа мэдрэхэд анхаар.",
      images: [{ id: "activetrack", alt: "Явган аялагчийг дагаж буй Osmo Pocket 4" }],
    },
    {
      title: "Дохиогоор удирд",
      text: "Гарын дохиогоор камераа гар хүрэлгүй удирдаж, зураг авах, бичлэг эхлүүлэх боломжтой.",
      images: [
        { id: "vgesture", alt: "V дохио үзүүлж буй хүн", caption: "V дохио" },
        { id: "palm", alt: "Алгаа харуулж буй хүн", caption: "Алгаа харуулах дохио" },
      ],
    },
    {
      title: "Өргөн өнцөг, босоо ба хэвтээ",
      text: "Өргөн өнцөгт линзээр илүү их зүйлийг кадрт багтааж, босоо болон хэвтээ горимын аль алинд нь шууд бич.",
      images: [
        { id: "wide", alt: "Өргөн өнцөгт линзээр авсан кадр", caption: "Өргөн өнцөгт линз" },
        { id: "vertical", alt: "Босоо горимд бичиж буй байдал", caption: "Босоо горим" },
      ],
    },
    {
      title: "Бага гэрэлд ч тод",
      text: "Бага гэрэлтэй орчинд ч цэвэр дүрс гаргаж, дүүргэгч гэрлээр хөргийг илүү гэрэлтэй болгоно.",
      images: [
        { id: "lowlight", alt: "Шөнийн хотод авсан бичлэг", caption: "Бага гэрлийн бичлэг" },
        { id: "fill", alt: "Дүүргэгч гэрэл", caption: "Дүүргэгч гэрэл" },
      ],
    },
    {
      title: "Цэвэр дуу",
      text: "DJI Mic 3-тай холбогдож, OsmoAudio-оор дуугаа бичлэгтэйгээ хамт цэвэр бичнэ.",
      images: [
        { id: "mic", alt: "DJI Mic 3-тай холбогдсон Osmo Pocket 4", caption: "DJI Mic 3" },
        { id: "audio", alt: "OsmoAudio экосистем", caption: "OsmoAudio" },
      ],
    },
    {
      title: "Шүүлтүүрээр өнгө төрхөө бүтээ",
      text: "ND болон Black Mist шүүлтүүрээр гэрэл, өнгөө тохируулан кино мэт дүр төрх гарга.",
      images: [
        { id: "nd", alt: "ND шүүлтүүр", caption: "ND шүүлтүүр" },
        { id: "mist", alt: "Black Mist шүүлтүүр", caption: "Black Mist шүүлтүүр" },
      ],
    },
    {
      title: "Дотоод санах ой, шууд дамжуулалт",
      text: "Өндөр хурдны дотоод санах ойд шууд хадгалж, Wi-Fi-аар шууд дамжуулалт (live stream) хийнэ.",
      images: [
        { id: "storage", alt: "Дотоод санах ой", caption: "Дотоод санах ой" },
        { id: "live", alt: "Wi-Fi-аар шууд дамжуулалт хийж буй байдал", caption: "Шууд дамжуулалт" },
      ],
    },
    {
      title: "Тавиур ба иж бүрдэл",
      text: "Мини тавиур болон дагалдах хэрэгслүүдтэй иж бүрдлээр аялал, vlog бүрдээ бэлэн яв.",
      images: [
        { id: "tripod", alt: "Мини тавиур дээрх Osmo Pocket 4", caption: "Мини тавиур" },
        { id: "combo", alt: "Osmo Pocket 4 иж бүрдэл", caption: "Иж бүрдэл" },
      ],
    },
  ],
  galleryTitle: "Osmo Pocket 4-өөр авсан",
  gallery: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `shot-${n}`, alt: `Osmo Pocket 4-өөр авсан зураг ${n}` })),
};

const POCKET_4P: ProductMedia = {
  folder: "pocket-4p",
  youtube: "iCtowq5PKr8",
  hero: { id: "hero-kv", alt: "Лондонд Osmo Pocket 4P барьсан эмэгтэй" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "Хар ба Pearl White",
      text: "Сонгодог хар болон сувдан цагаан (Pearl White) гэсэн хоёр өнгөөр ирнэ. Хэв маягаа өөрөө сонго.",
      images: [
        { id: "colors", alt: "Хар ба Pearl White Osmo Pocket 4P", caption: "Хар ба Pearl White" },
        { id: "pearl", alt: "Pearl White өнгөтэй Osmo Pocket 4P", caption: "Pearl White" },
      ],
    },
    {
      title: "Эргэдэг дэлгэц",
      text: "Дэлгэцийг эргүүлээд л босоо эсвэл хэвтээ кадраа сонгож, шууд бичлэгээ эхлүүл.",
      images: [
        { id: "screen", alt: "Эргэдэг дэлгэц", caption: "Эргэдэг дэлгэц" },
        { id: "vertical", alt: "Босоо горим", caption: "Босоо горим" },
      ],
    },
    {
      title: "Дохиогоор удирд",
      text: "Гарын дохиогоор бичлэг эхлүүлэх, зураг авах үйлдлийг хол зайнаас хялбар хийнэ.",
      images: [
        { id: "gesture", alt: "Гарын дохиогоор удирдаж буй эмэгтэй", caption: "Гарын дохио" },
        { id: "gesture-v", alt: "V дохио үзүүлж буй эмэгтэй", caption: "V дохио" },
      ],
    },
    {
      title: "Өргөн өнцөгт линз",
      text: "Өргөн өнцөгт линзээр ойр зайнаас илүү их зүйлийг кадрт багтаа.",
      images: [
        { id: "wide-1", alt: "Өргөн өнцөгт линз бэхэлсэн камер" },
        { id: "wide-2", alt: "Өргөн өнцөгт линзээр бичиж буй байдал" },
      ],
    },
    {
      title: "Дүүргэгч гэрэл",
      text: "Бага гэрэлтэй орчинд ч хөргийг тод, гэрэлтэй болгоно.",
      images: [
        { id: "fill-1", alt: "Дүүргэгч гэрэлтэй Osmo Pocket 4P", caption: "Дүүргэгч гэрэл" },
        { id: "fill-2", alt: "Pearl White дүүргэгч гэрэл", caption: "Pearl White" },
      ],
    },
    {
      title: "Цэвэр дуу",
      text: "DJI Mic 3-тай холбогдож, OsmoAudio-оор цэвэр дуу бичнэ.",
      images: [
        { id: "mic", alt: "DJI Mic 3-тай холбогдсон камер", caption: "DJI Mic 3" },
        { id: "audio", alt: "OsmoAudio", caption: "OsmoAudio" },
      ],
    },
    {
      title: "Шүүлтүүр ба батерей бариул",
      text: "ND шүүлтүүрээр гэрлээ тохируулж, батерей бариулаар бичлэгийн хугацаагаа уртасга.",
      images: [
        { id: "nd", alt: "ND шүүлтүүрийн иж бүрдэл", caption: "ND шүүлтүүр" },
        { id: "battery", alt: "Батерей бариул", caption: "Батерей бариул" },
      ],
    },
    {
      title: "800MB/s дамжуулалт, вебкам",
      text: "Утас, компьютер руу 800MB/s хурдтай дамжуулж, мөн вебкам болгон ашиглана.",
      images: [
        { id: "speed", alt: "Утсанд 800MB/s хурдтай дамжуулж буй байдал", caption: "800MB/s дамжуулалт" },
        { id: "webcam", alt: "Вебкам болгон ашиглаж буй байдал", caption: "Вебкам" },
      ],
    },
    {
      title: "Цүнх ба дагалдах хэрэгсэл",
      text: "Хар савхин цүнх болон бусад дагалдах хэрэгслээр камераа хамгаалж, авч явахад тохиромжтой болго.",
      images: [
        { id: "accessories", alt: "Дагалдах хэрэгслүүд", caption: "Дагалдах хэрэгсэл" },
        { id: "bag", alt: "Хар савхин цүнх", caption: "Савхин цүнх" },
      ],
    },
  ],
  galleryTitle: "Osmo Pocket 4P-ээр авсан",
  gallery: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `shot-${n}`, alt: `Osmo Pocket 4P-ээр авсан зураг ${n}` })),
};

const OSMO_360_II: ProductMedia = {
  folder: "osmo-360-ii",
  youtube: "QDsCQclNckE",
  hero: { id: "hero-kv", alt: "Мотоциклоор аялж буй хүн, Osmo 360 II бэхэлсэн" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "Авсаархан, линз нь солигдоно",
      text: "Гарт багтах авсаархан бүтэцтэй 360° камер. Линз нь солигддог тул гэмтсэн үед хялбар сольж болно.",
      images: [
        { id: "compact", alt: "Гарт барьсан авсаархан Osmo 360 II", caption: "Авсаархан бүтэц" },
        { id: "lens", alt: "Солигддог линз", caption: "Солигддог линз" },
      ],
    },
    {
      title: "Үл үзэгдэх селфи саваа",
      text: "Селфи саваа 360° кадрт харагдахгүй тул дроноос буулгасан мэт өнцгийг өөрөө буулгана.",
      images: [
        { id: "stick", alt: "Үл үзэгдэх селфи сааванд бэхэлсэн камер", caption: "1.2 м селфи саваа" },
        { id: "drone-view", alt: "Дроноос авсан мэт өнцөг", caption: "Дроны өнцөг" },
      ],
    },
    {
      title: "Мотоциклоор аялахад",
      text: "Мотоциклдоо бат бэхлээд, замын агшныг бүх чиглэлд буулга.",
      images: [
        { id: "moto", alt: "Мотоциклийн замаар явж буй байдал", caption: "Мотоциклийн аялал" },
        { id: "moto-mount", alt: "Мотоциклийн хүнд даацын бэхэлгээ", caption: "Хүнд даацын бэхэлгээ" },
      ],
    },
    {
      title: "Адал явдлын орчинд",
      text: "Мөсөн авиралт, каяк зэрэг идэвхтэй спортод тохирсон бэхэлгээгээр өвөрмөц кадр буулга.",
      images: [
        { id: "ice", alt: "Мөсөн авиралтад Osmo 360 II ашиглаж буй байдал", caption: "Мөсөн авиралт" },
        { id: "kayak", alt: "Каякаар аялж буй байдал", caption: "Каяк" },
      ],
    },
    {
      title: "Бэхэлгээний сонголт",
      text: "Хүзүүний болон үүргэвчний бэхэлгээгээр хоёр гараа чөлөөтэй байлгаж, явж байхдаа бич.",
      images: [
        { id: "neck", alt: "Хүзүүнд зүүсэн Osmo 360 II", caption: "Хүзүүний бэхэлгээ" },
        { id: "backpack", alt: "Үүргэвчний оосорт бэхэлсэн камер", caption: "Үүргэвчний бэхэлгээ" },
      ],
    },
    {
      title: "Холболт ба батерей",
      text: "NFC-ээр утастайгаа хурдан холбогдож, батерейтай сунадаг саваагаар бичлэгийн хугацаагаа уртасга.",
      images: [
        { id: "nfc", alt: "NFC-ээр утастай холбогдож буй байдал", caption: "NFC холболт" },
        { id: "rod", alt: "Батерейтай сунадаг саваа", caption: "Батерейтай саваа" },
      ],
    },
    {
      title: "Цэвэр дуу",
      text: "Микрофонтой шууд холбогдож, DJI Mic Mini-тэй хамт цэвэр дуу бичнэ.",
      images: [
        { id: "mic", alt: "Микрофон шууд холбосон камер", caption: "Микрофон холболт" },
        { id: "micmini", alt: "DJI Mic Mini ашиглаж буй байдал", caption: "DJI Mic Mini" },
      ],
    },
  ],
  galleryTitle: "Osmo 360 II-оор авсан",
  gallery: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `shot-${n}`, alt: `Osmo 360 II-оор авсан зураг ${n}` })),
};

const ACTION_6: ProductMedia = {
  folder: "action-6",
  youtube: "XI7nlAaf4iA",
  hero: { id: "hero-kv", alt: "Уулын дугуйгаар хурдан давхиж буй Osmo Action 6" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "Усан доор ч бич",
      text: "Усны даралт мэдрэгчтэй, усны хамгаалалтын хайрцагтай тул шумбалтын агшныг ч буулгана.",
      images: [
        { id: "dive-1", alt: "Усан доор Osmo Action 6", caption: "Усны даралт мэдрэгч" },
        { id: "dive-2", alt: "Шумбагч Osmo Action 6-аар бичиж буй байдал", caption: "Шумбалт" },
      ],
    },
    {
      title: "182° хэт өргөн өнцөг",
      text: "182° харах өнцгөөр хурдан хөдөлгөөн, өргөн орчныг нэг кадрт багтаа.",
      images: [
        { id: "fov-moto", alt: "Мотоциклийн 182° кадр", caption: "Мотоцикль" },
        { id: "fov-ski", alt: "Цанын 182° кадр", caption: "Цана" },
      ],
    },
    {
      title: "Цас, хүйтэнд найдвартай",
      text: "Хүйтэнд тэсвэртэй, HorizonSteady горимоор тэнгэрийн хаяг тэгш хэвээр байж, цасан дээр ч жигд бичлэг хийнэ.",
      images: [
        { id: "cold", alt: "Цасан дээр байрлах Osmo Action 6", caption: "Хүйтэнд тэсвэртэй" },
        { id: "horizon", alt: "HorizonSteady-ээр авсан цанын кадр", caption: "HorizonSteady" },
      ],
    },
    {
      title: "Мотоцикль ба дугуй",
      text: "Мотоцикль, замын дугуйн аялалд зориулсан бэхэлгээгээр замын агшныг буулга.",
      images: [
        { id: "moto-life", alt: "Мотоциклоор аялж буй байдал", caption: "Мотоцикль" },
        { id: "cycling", alt: "Замын дугуй", caption: "Замын дугуй" },
      ],
    },
    {
      title: "Урд дэлгэц, 4 горим",
      text: "Урд талын дэлгэцээр өөрийгөө хараад, олон бичлэгийн горимыг хялбар сонго.",
      images: [
        { id: "screen", alt: "Урд талын дэлгэц", caption: "Урд дэлгэц" },
        { id: "modes", alt: "Дөрвөн бичлэгийн горим", caption: "Бичлэгийн горим" },
      ],
    },
    {
      title: "Шүүлтүүр ба макро линз",
      text: "ND шүүлтүүрээр гэрлээ тохируулж, макро линзээр жижиг зүйлийг ойроос бич.",
      images: [
        { id: "nd", alt: "ND шүүлтүүрийн иж бүрдэл", caption: "ND шүүлтүүр" },
        { id: "macro", alt: "Макро линз", caption: "Макро линз" },
      ],
    },
    {
      title: "Цэвэр дуу",
      text: "DJI Mic 3, DJI Mic Mini-тэй холбогдож бичлэгтээ цэвэр дуу нэм.",
      images: [
        { id: "mic3", alt: "DJI Mic 3 холбосон камер", caption: "DJI Mic 3" },
        { id: "micmini", alt: "DJI Mic Mini ашиглаж буй байдал", caption: "DJI Mic Mini" },
      ],
    },
    {
      title: "Бэхэлгээний өргөн сонголт",
      text: "Жолоо, дуулганы эрүүний болон бусад бэхэлгээгээр хүссэн өнцгөөсөө бич.",
      images: [
        { id: "handlebar", alt: "Жолооны бэхэлгээ", caption: "Жолооны бэхэлгээ" },
        { id: "chin", alt: "Дуулганы эрүүний бэхэлгээ", caption: "Дуулганы бэхэлгээ" },
      ],
    },
    {
      title: "Шууд дамжуулалт, 10-bit D-Log",
      text: "Wi-Fi-аар шууд дамжуулалт хийж, 10-bit D-Log-оор өнгө засахад уян хатан бичлэг хийнэ.",
      images: [
        { id: "wifi", alt: "Wi-Fi-аар шууд дамжуулалт хийж буй байдал", caption: "Wi-Fi дамжуулалт" },
        { id: "dlog", alt: "10-bit D-Log-оор авсан кадр", caption: "10-bit D-Log" },
      ],
    },
  ],
  galleryTitle: "Osmo Action 6-аар авсан",
  gallery: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `shot-${n}`, alt: `Osmo Action 6-аар авсан зураг ${n}` })),
};

const MOBILE_8P: ProductMedia = {
  folder: "mobile-8p",
  youtube: "E9oNJrbkiIE",
  hero: { id: "hero-kv", alt: "DJI Osmo Mobile 8P" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  chapters: [
    {
      title: "Суурилсан сунадаг саваа",
      text: "Суурилсан сунадаг саваагаар нам болон өндөр өнцгөөс бүтээлч кадр авч, селфиг илүү өргөн болго.",
      images: [
        { id: "pole", alt: "Суурилсан сунадаг саваатай Osmo Mobile 8P", caption: "Сунадаг саваа" },
        { id: "lowangle", alt: "Нам өнцгөөс авсан кадр", caption: "Нам өнцөг" },
      ],
    },
    {
      title: "Суурилсан тавиур",
      text: "Суурилсан тавиурыг дэлгээд утсаа тогтвортой байрлуулж, гараа чөлөөлж, бүлгээрээ ч бич.",
      images: [{ id: "tripod", alt: "Суурилсан тавиур дээрх Osmo Mobile 8P" }],
    },
    {
      title: "Гэрэл ба дэлгэц",
      text: "Дүүргэгч гэрлээр бага гэрэлд ч хөргийг тод болгож, утасны дэлгэцээ тусган харна.",
      images: [
        { id: "fill", alt: "Дүүргэгч гэрэл", caption: "Дүүргэгч гэрэл" },
        { id: "mirror", alt: "Утасны дэлгэцийг тусгаж буй байдал", caption: "Дэлгэц тусгал" },
      ],
    },
    {
      title: "Цагаараа удирд",
      text: "Ухаалаг цагаараа бичлэг эхлүүлэх, зураг авах үйлдлийг хол зайнаас удирдана.",
      images: [{ id: "watch", alt: "Цагаар Osmo Mobile 8P удирдаж буй байдал" }],
    },
    {
      title: "FrameTap-аар селфи",
      text: "FrameTap функцээр селфи, ойроос авалтыг хялбар, хурдан хийнэ.",
      images: [
        { id: "frametap", alt: "FrameTap-аар селфи авч буй байдал", caption: "FrameTap селфи" },
        { id: "frametap-2", alt: "FrameTap ойроос", caption: "FrameTap" },
      ],
    },
    {
      title: "Шууд дамжуулалт ба дуу",
      text: "Шууд дамжуулалт хийж, DJI Mic 2 Mini-тэй хамт цэвэр дуу бичнэ.",
      images: [
        { id: "live", alt: "Шууд дамжуулалт хийж буй байдал", caption: "Шууд дамжуулалт" },
        { id: "mic", alt: "DJI Mic 2 Mini холбосон Osmo Mobile 8P", caption: "DJI Mic 2 Mini" },
      ],
    },
    {
      title: "Соронзон хурдан бэхэлгээ",
      text: "Соронзон хурдан бэхэлгээгээр утсаа нэг хөдөлгөөнээр суулгаж, салгана.",
      images: [
        { id: "magnetic", alt: "Соронзон хурдан бэхэлгээ", caption: "Соронзон бэхэлгээ" },
        { id: "accessories", alt: "Дагалдах хэрэгслүүд", caption: "Дагалдах хэрэгсэл" },
      ],
    },
    {
      title: "Samsung, iPhone аль алинд нь",
      text: "Samsung, iPhone зэрэг өргөн хүрээний гар утсанд тохирч ажиллана.",
      images: [
        { id: "samsung", alt: "Samsung утастай Osmo Mobile 8P", caption: "Samsung" },
        { id: "apple", alt: "iPhone-той Osmo Mobile 8P", caption: "iPhone" },
      ],
    },
  ],
  galleryTitle: "Osmo Mobile 8P-тэй",
  gallery: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `shot-${n}`, alt: `Osmo Mobile 8P-тэй авсан зураг ${n}` })),
};

const FLIP: ProductMedia = {
  folder: "flip",
  youtube: "KmEdcFcJUuo",
  hero: { id: "hero-kv", alt: "Намрын нуурын дээгүүр нисч буй DJI Flip" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "249 граммаас бага жинтэй",
      text: "Эвхэгддэг, 249 граммаас бага жинтэй бүтэц тул цүнхэндээ хийчихээд хаана ч авч явахад хялбар.",
      images: [
        { id: "light-1", alt: "Гар дээрээ барьсан DJI Flip", caption: "249 граммаас бага" },
        { id: "light-2", alt: "Цүнхэнд хийсэн DJI Flip", caption: "Цүнхэнд багтана" },
      ],
    },
    {
      title: "Алган дээрээс хөөр, алган дээрээ буу",
      text: "Алган дээрээсээ шууд хөөрч, алган дээрээ бууна. Газар, нисэх зурвас шаардлагагүй.",
      images: [{ id: "palm", alt: "Алган дээрээс хөөрч буй дрон" }],
    },
    {
      title: "31 минут хүртэл нислэг",
      text: "Нэг цэнэгээр 31 минут хүртэл нисэж, цэнэглэх төвөөр батерейгаа хурдан цэнэглэнэ.",
      images: [
        { id: "flight-time", alt: "31 минутын нислэгийн хугацаа", caption: "31 минут хүртэл" },
        { id: "hub", alt: "Цэнэглэх төв", caption: "Цэнэглэх төв" },
      ],
    },
    {
      title: "Саадаас зайлж, өөрөө буцна",
      text: "Саад мэдэрч аюулгүй нисч, холбоо тасарсан үед ч өөрөө эхлэх цэг рүүгээ буцна.",
      images: [
        { id: "avoid", alt: "Саадаас зайлж буй дрон", caption: "Саад мэдрэгч" },
        { id: "rth", alt: "Автоматаар буцаж буй дрон", caption: "Автоматаар буцах" },
      ],
    },
    {
      title: "QuickShots горимууд",
      text: "Dronie, Helix, Circle зэрэг QuickShots-оор нэг товшилтоор кино мэт хөдөлгөөнтэй бичлэг гарга.",
      images: [
        { id: "dronie", alt: "Dronie QuickShot", caption: "Dronie" },
        { id: "helix", alt: "Helix QuickShot", caption: "Helix" },
      ],
    },
    {
      title: "Өөрт тохирсон удирдлага",
      text: "Дэлгэцтэй DJI RC 2 эсвэл утсаа холбон ашиглах DJI RC-N3. Танд эвтэйхэн аль нь вэ, түүнийгээ сонго.",
      images: [
        { id: "rc2", alt: "DJI RC 2 удирдлага", caption: "DJI RC 2 · дэлгэцтэй" },
        { id: "rcn3", alt: "DJI RC-N3 удирдлага", caption: "DJI RC-N3 · утсаар хянана" },
      ],
    },
    {
      title: "Утсаараа удирд, шууд шилжүүл",
      text: "Утсан дээрх апп-аар нислэгээ удирдаж, Wi-Fi-аар зураг, бичлэгээ хурдан шилжүүл.",
      images: [
        { id: "app", alt: "Утсан дээрх апп-аар удирдаж буй байдал", caption: "Апп удирдлага" },
        { id: "wifi", alt: "Wi-Fi-аар зураг шилжүүлж буй байдал", caption: "Wi-Fi дамжуулалт" },
      ],
    },
    {
      title: "Бүрэн хамгаалалттай сэнс, дуу",
      text: "Эвхэгддэг бүрэн хамгаалалттай сэнсээр аюулгүй нисч, DJI Mic-ээр дуугаа цэвэр бичнэ.",
      images: [
        { id: "guard", alt: "Эвхэгддэг сэнсний хамгаалалт", caption: "Сэнсний хамгаалалт" },
        { id: "mic", alt: "DJI Mic-ээр дуу бичиж буй байдал", caption: "DJI Mic" },
      ],
    },
    {
      title: "ND шүүлтүүр ба иж бүрдэл",
      text: "ND шүүлтүүрээр гэрлээ тохируулна. Fly More Combo-д нэмэлт батерей, цэнэглэх төв багтана.",
      images: [
        { id: "nd", alt: "ND шүүлтүүрийн иж бүрдэл", caption: "ND шүүлтүүр" },
        { id: "combo", alt: "DJI Flip Fly More Combo", caption: "Fly More Combo" },
      ],
    },
  ],
  galleryTitle: "DJI Flip-ээр авсан",
  gallery: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `shot-${n}`, alt: `DJI Flip-ээр авсан зураг ${n}` })),
};

const AVATA_360: ProductMedia = {
  folder: "avata-360",
  youtube: "LFZmfqA48ec",
  hero: { id: "hero-kv", alt: "Элсэн дээгүүр машиныг дагаж буй DJI Avata 360" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "Хурдан хөдөлгөөнийг дагана",
      text: "Дугуйчин, дрифт хийж буй машин зэрэг хурдан хөдөлгөөнийг дагаж, FPV мэдрэмжтэй кадр буулгана.",
      images: [
        { id: "cycling", alt: "Дугуйчныг дагаж буй дрон", caption: "Дугуйчныг дагана" },
        { id: "hero-kv", alt: "Дрифт хийж буй машиныг дагаж буй дрон", caption: "Машиныг дагана" },
      ],
    },
    {
      title: "Толгойн хөдөлгөөнөөр 360° нис",
      text: "FPV шилээ зүүгээд толгойгоо хөдөлгөхөд камер даган эргэж, 360° орчныг мэдэрч нис.",
      images: [{ id: "head", alt: "Далайн эрэгт FPV шилтэй нисгэгч" }],
    },
    {
      title: "Нам өндөр, ойр нислэг",
      text: "Газрын ойр нам өндөрт нисч, хурдны мэдрэмжийг кино мэт кадраар буулга.",
      images: [
        { id: "low", alt: "Нам өндөрт нисч буй дрон", caption: "Нам өндөр нислэг" },
        { id: "street", alt: "Хотын гудамжаар нисч буй дрон", caption: "Хотын гудамж" },
      ],
    },
    {
      title: "Хамгаалалттай, авсаархан",
      text: "Авсаархан бүтэц, хамгаалалттай сэнстэй тул ойр зайд, явцуу орчинд ч аюулгүй нисч болно.",
      images: [{ id: "attitude", alt: "Хамгаалалттай сэнстэй DJI Avata 360" }],
    },
    {
      title: "Удирдлага",
      text: "Дэлгэцтэй DJI RC 2 удирдлагаар нислэгээ шууд харж, хянана.",
      images: [{ id: "rc2", alt: "DJI RC 2 удирдлага барьсан хүн" }],
    },
    {
      title: "Иж бүрдлийн сонголт",
      text: "Танд тохирсон иж бүрдлийг сонгоод шууд нисэхэд бэлэн болго.",
      images: [
        { id: "sku1", alt: "DJI Avata 360 иж бүрдэл 1", caption: "Иж бүрдэл 1" },
        { id: "sku3", alt: "DJI Avata 360 иж бүрдэл 2", caption: "Иж бүрдэл 2" },
      ],
    },
  ],
  galleryTitle: "",
  gallery: [],
};

const MAVIC_4_PRO: ProductMedia = {
  folder: "mavic-4-pro",
  youtube: "BNEmDcQr6hk",
  hero: { id: "hero-kv", alt: "Цастай уулсын дээгүүр нисч буй DJI Mavic 4 Pro" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "Аливаа орчинд нис",
      text: "Цас мөс, хад асга, хүйтэн цаг агаарт ч гурван камертай флагман дроноороо хүссэн кадраа буулга.",
      images: [
        { id: "polar", alt: "Туйлын орчинд дрон барьж буй нисгэгч", caption: "Туйлын судалгаа" },
        { id: "fly-1", alt: "Уулын дээгүүр нисч буй DJI Mavic 4 Pro", caption: "Уулын нислэг" },
      ],
    },
    {
      title: "Олон өнцгөөс буулга",
      text: "Хүрхрээний дэргэд, хавцлын дундуур ч тогтвортой нисч, олон өнцгөөс кино мэт кадр буулгана.",
      images: [
        { id: "fly-2", alt: "Хүрхрээний дэргэд нисч буй дрон" },
        { id: "fly-3", alt: "Хавцлын дундуур нисч буй дрон" },
      ],
    },
    {
      title: "Эвхэгддэг, авсаархан",
      text: "Эвхэгдэх бүтэцтэй тул цүнхэндээ хийж, хаана ч хялбар авч явна. Задлаад шууд хөөрөхөд бэлэн.",
      images: [
        { id: "folded", alt: "Эвхсэн DJI Mavic 4 Pro", caption: "Эвхсэн байдал" },
        { id: "unfolded", alt: "Дэлгэсэн DJI Mavic 4 Pro", caption: "Дэлгэсэн байдал" },
      ],
    },
    {
      title: "Дээш харсан кадр",
      text: "Камерыг дээш чиглүүлж, мөсөн хана, өндөр барилга, мод зэрэг босоо объектыг хэлбэрийг нь алдалгүй буулгана.",
      images: [{ id: "upward", alt: "Дээш харсан кадр буулгаж буй дрон" }],
    },
    {
      title: "Нарийн, мэдрэмжтэй удирдлага",
      text: "Удирдлагаар дрон болон камераа нарийн хянаж, хүссэн кадрдаа яг тааруулж авна.",
      images: [
        { id: "ctrl-1", alt: "Удирдлагаар дроноо хянаж буй нисгэгч" },
        { id: "ctrl-2", alt: "Нисгэгч дроноо харж, удирдаж буй байдал" },
        { id: "ctrl-3", alt: "Дэлгэцтэй удирдлагаар хянаж буй нисгэгч" },
      ],
    },
    {
      title: "Машинаас ч удирд",
      text: "Хүйтэнд гадаа зогсолгүй, машины дотроос шууд дроноо удирдан нисгэж болно.",
      images: [{ id: "vehicle", alt: "Машины дотроос дрон удирдаж буй байдал" }],
    },
    {
      title: "DJI RC 2 ба RC Pro 2",
      text: "Дэлгэцтэй удирдлагаар нислэгээ шууд харж, бичлэгээ тэр дор нь үзнэ.",
      images: [
        { id: "rc2", alt: "DJI RC 2 удирдлага", caption: "DJI RC 2" },
        { id: "rcpro-unfold", alt: "RC Pro 2 удирдлагын дэлгэц задлах", caption: "RC Pro 2" },
        { id: "rcpro-album", alt: "RC Pro 2 дээр альбом үзэх", caption: "Альбом" },
      ],
    },
    {
      title: "Хурдан дамжуулалт, 4G холболт",
      text: "Нислэгийн дараа бичлэгээ утас руугаа шууд шилжүүлж, 4G dongle-оор холболтоо өргөтгөнө.",
      images: [
        { id: "transfer", alt: "Утас руу бичлэг шилжүүлж буй байдал", caption: "Шууд дамжуулалт" },
        { id: "dongle", alt: "4G dongle-той дрон", caption: "4G Dongle" },
      ],
    },
    {
      title: "Сэнсний хамгаалалт ба цүнх",
      text: "Сэнсний хамгаалалтаар явцуу орчинд аюулгүй нисч, зориулалтын цүнхээр бүх хэрэгслээ нэг дор авч явна.",
      images: [
        { id: "guard", alt: "Сэнсний хамгаалалттай дрон", caption: "Сэнсний хамгаалалт" },
        { id: "bag", alt: "Дагалдах цүнх", caption: "Зөөврийн цүнх" },
      ],
    },
    {
      title: "Иж бүрдлийн сонголт",
      text: "Хэрэгцээндээ тохирсон иж бүрдлээ сонгоод шууд нисэхэд бэлэн болго.",
      images: [
        { id: "sku1", alt: "DJI Mavic 4 Pro иж бүрдэл 1", caption: "Иж бүрдэл 1" },
        { id: "sku2", alt: "DJI Mavic 4 Pro иж бүрдэл 2", caption: "Иж бүрдэл 2" },
        { id: "sku3", alt: "DJI Mavic 4 Pro иж бүрдэл 3", caption: "Иж бүрдэл 3" },
      ],
    },
  ],
  galleryTitle: "",
  gallery: [],
};

const POWER_2000: ProductMedia = {
  folder: "power-2000",
  youtube: "7oNAIv-yhBA",
  hero: { id: "hero-kv", alt: "Үдшийн бүрийд, уулын өмнө тавьсан DJI Power 2000" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "2048Wh багтаамж, 3000W хүч",
      text: "Авсаархан биед 2048Wh эрчим хүч агуулсан. 3000W гаралтаараа гэрийн ихэнх цахилгаан хэрэгслийг хялбархан ажиллуулна.",
      images: [
        { id: "workshop", alt: "Модон ажлын талбарт ажиллаж буй DJI Power 2000", caption: "Ажлын талбай" },
        { id: "kitchen", alt: "Гал тогоонд кофе чанаж буй хүн", caption: "Гэрийн хэрэгсэл" },
      ],
    },
    {
      title: "Гэрийн нөөц цахилгаан",
      text: "Цахилгаан тасрахад гэрийн чухал хэрэгслийг ажиллуулна. Багтаамжийг 22,528Wh хүртэл өргөтгөх боломжтой.",
      images: [
        { id: "living", alt: "Зочны өрөөнд ажиллаж буй DJI Power 2000", caption: "Гэртээ" },
        { id: "night", alt: "Шөнө машинд тавьсан DJI Power 2000", caption: "Шөнийн цагт" },
      ],
    },
    {
      title: "Аялал, зусланд хаана ч",
      text: "Кемпинг, зусланд зөөврийн компьютер, чийдэн, кофены аппаратаа цэнэглэнэ. Нарны панел болон машинаар ч цэнэглэх боломжтой.",
      images: [
        { id: "camp", alt: "Кемпингийн ширээн дээр ажиллаж буй DJI Power 2000", caption: "Кемпинг" },
        { id: "picnic", alt: "Нарны панелийн хажууд кофе уугаад буй хүн", caption: "Нарны цахилгаан" },
      ],
    },
    {
      title: "Автомашин, RV аялалд",
      text: "Нарны панелтай хамт RV, автомашин аялалд тасралтгүй цахилгаан өгнө.",
      images: [{ id: "rv", alt: "Нарны панелтай RV дэргэд тавьсан DJI Power 2000" }],
    },
    {
      title: "Бүтээлч ажилд",
      text: "Зураг авалт, засвар, дрон, камерын төхөөрөмжүүдийг нэг дор цэнэглэнэ.",
      images: [
        { id: "edit", alt: "Видео засварлаж буй хүн", caption: "Видео засвар" },
        { id: "drones", alt: "DJI дрон болон DJI Power 2000", caption: "Дрон, камер" },
      ],
    },
    {
      title: "55 минутад 80% цэнэглэнэ",
      text: "Цахилгааны сүлжээнээс 55 минутад 0–80% хүртэл цэнэглэгдэнэ. Цэнэглэхээ мартсан ч удаан хүлээх шаардлагагүй.",
      images: [{ id: "fleet", alt: "DJI Power 2000 болон олон төхөөрөмж" }],
    },
    {
      title: "Чимээгүй, аюулгүй",
      text: "30dB-ийн чимээгүй ажиллагаатай тул унтаж байхад ч саад болохгүй. Хэлхээний хавтанд нано түвшний бүрээс хийж аюулгүй байдлыг нэмэгдүүлсэн. Апп-аар алсаас удирдана.",
      images: [
        { id: "cells", alt: "DJI Power 2000-ийн батерейн эсүүд" },
        { id: "explode", alt: "DJI Power 2000-ийн дотоод бүтэц" },
      ],
    },
  ],
  galleryTitle: "",
  gallery: [],
};

const POWER_1000_MINI: ProductMedia = {
  folder: "power-1000-mini",
  youtube: "Qh1Gj3CJsQs",
  hero: { id: "hero-kv", alt: "Уулын оройд DJI Power 1000 Mini барьсан хүн" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "1кВт·ц, хагас хэмжээтэй",
      text: "DJI Power 1000-аас хагас хэмжээтэй ч 1008Wh багтаамжтай. DJI-ийн өнөөг хүртэлх хамгийн авсаархан 1кВт·ц цахилгаан станц.",
      images: [
        { id: "compare", alt: "DJI Power 1000 Mini болон том станцын харьцуулалт", caption: "Хагас хэмжээ" },
        { id: "walk", alt: "DJI Power 1000 Mini барьж яваа хүн", caption: "Авч явахад хөнгөн" },
      ],
    },
    {
      title: "Кемпинг, аялалд",
      text: "Ван, жийп, зусланд хөргөгч, чийдэн, зөөврийн төхөөрөмжөө цэнэглэнэ. Стандарт цэнэглэх үед 30dB-ээс хэтрэхгүй чимээтэй ажиллана.",
      images: [
        { id: "rv", alt: "Ван дотор хөргөгчийг тэжээж буй DJI Power 1000 Mini", caption: "Ван аялал" },
        { id: "truck", alt: "Пикап машины дэргэд DJI Power 1000 Mini", caption: "Кемпинг" },
      ],
    },
    {
      title: "Суурилуулсан 400W машин цэнэглэгч ба MPPT",
      text: "Машины батерей эсвэл нарны панелтай шууд холбож цэнэглэнэ, нэмэлт адаптер хэрэггүй (холбох кабель тусад нь).",
      images: [
        { id: "car", alt: "Машины дотор цэнэглэж буй DJI Power 1000 Mini", caption: "Машинаар цэнэглэх" },
        { id: "solar", alt: "Нарны панелийн хажууд DJI Power 1000 Mini", caption: "Нарны панел" },
      ],
    },
    {
      title: "100W буцаж орох USB-C кабель",
      text: "Суурилуулсан 0.8м USB-C кабелийг татаад л утас, таблет, зөөврийн компьютераа 100W хүртэл цэнэглэнэ. Ашиглаад тавихад өөрөө буцаж орно.",
      images: [{ id: "phone", alt: "Утасаа цэнэглэж буй хүн, дэргэд нь DJI Power 1000 Mini" }],
    },
    {
      title: "Гэрийн нөөц, ширээний цахилгаан",
      text: "Роутер, чийдэн, зөөврийн компьютерийг цахилгаан тасрахад ч тасралтгүй ажиллуулна. UPS горимд 0.01 секундэд шилжинэ.",
      images: [{ id: "router", alt: "Шүүгээн дээр роутер, чийдэнтэй DJI Power 1000 Mini" }],
    },
    {
      title: "Дроны батерейг цэнэглэнэ",
      text: "DJI Power SDC кабелийн (тусад нь) тусламжтайгаар DJI Air 3 цувралын батерейг 10%-аас 95% хүртэл 30 минутад цэнэглэнэ. Лабораторийн хэмжилт.",
      images: [{ id: "pilot", alt: "Дрон нисгэж буй хүн, DJI Power 1000 Mini-тэй" }],
    },
    {
      title: "58 минутад 80% цэнэглэнэ",
      text: "Хурдан цэнэглэх горимд сүлжээгээр 0–80%-ийг 58 минут, 100%-ийг 75 минутад цэнэглэнэ.",
      images: [{ id: "peak", alt: "Хадан дээр тавьсан DJI Power 1000 Mini" }],
    },
    {
      title: "Аюулгүй, удаан эдэлгээтэй",
      text: "LFP эстэй, 4000 цикл цэнэглэсний дараа ч багтаамжийнхаа 80 орчим хувийг хадгална. BMS хамгаалалт, 5000м хүртэлх өндөрт ажиллана.",
      images: [
        { id: "cells", alt: "DJI Power 1000 Mini-ийн LFP эс" },
        { id: "bms", alt: "Ухаалаг BMS хамгаалалт" },
        { id: "split", alt: "DJI Power 1000 Mini-ийн дотоод бүтэц" },
      ],
    },
  ],
  galleryTitle: "",
  gallery: [],
};

const POWER_1000_V2: ProductMedia = {
  folder: "power-1000-v2",
  youtube: "5aJciQFtEQg",
  hero: { id: "hero-kv", alt: "Харанхуйд тодорсон DJI Power 1000 V2" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "2600W тогтвортой гаралт",
      text: "1024Wh багтаамжтай, 2600W-ыг тасралтгүй гаргана. Өдөр тутмын төхөөрөмжүүдийн 99 гаруй хувийг найдвартай ажиллуулна.",
      images: [{ id: "ports", alt: "DJI Power 1000 V2-ийн гаралтын портууд" }],
    },
    {
      title: "Хоёр 140W USB-C порт",
      text: "Хоёр USB-C порт тус бүр 140W хүртэл хурдан цэнэглэнэ. Таблет, зөөврийн компьютерээ хурдан цэнэглэнэ (төхөөрөмж PD 3.1 дэмждэг байх шаардлагатай).",
      images: [{ id: "tablet", alt: "Таблет цэнэглэж буй DJI Power 1000 V2" }],
    },
    {
      title: "26dB чимээгүй",
      text: "26dB-ийн чимээтэй тул унтлагын өрөөнд ч, кемпингт ч саад болохгүй.",
      images: [{ id: "lamp", alt: "Чийдэнтэй өрөөнд ажиллаж буй DJI Power 1000 V2" }],
    },
    {
      title: "Гэрийн нөөц цахилгаан",
      text: "2048Wh-ийн 5 нэмэлт батерейг холбож багтаамжийг 11,264Wh хүртэл өргөтгөнө. Гэрийн цахилгааны найдвартай нөөц болно.",
      images: [{ id: "home", alt: "Орон сууцанд нөөц цахилгаан болж буй DJI Power 1000 V2" }],
    },
    {
      title: "Дроны батерейг хурдан цэнэглэнэ",
      text: "DJI Power SDC-ээр дроны батерейг хурдан цэнэглэнэ (тохирох кабель тусад нь). Нислэгийн завсар цаг алдахгүй.",
      images: [{ id: "drones", alt: "DJI дронууд болон DJI Power 1000 V2" }],
    },
    {
      title: "Ажил, аялалд",
      text: "Ажлын талбай, гэрийн засвар, аялалд цахилгаан багаж болон төхөөрөмжөө ажиллуулна. Нарны панел, машинаар ч цэнэглэнэ.",
      images: [
        { id: "workshop", alt: "Ажлын талбарт DJI Power 1000 V2", caption: "Ажлын талбай" },
        { id: "solar", alt: "Нарны панелтай DJI Power 1000 V2", caption: "Нарны цахилгаан" },
      ],
    },
    {
      title: "37 минутад 80% цэнэглэнэ",
      text: "0–80%-ийг 37 минутад, бүрэн цэнэглэлтийг 56 минутад хийнэ. DJI Home аппаар алсаас удирдана.",
      images: [{ id: "phone", alt: "Утсаараа DJI Power 1000 V2-ийг удирдаж буй хүн" }],
    },
    {
      title: "Аюулгүй, 10 жилийн эдэлгээ",
      text: "LFP эстэй, шинэчилсэн аюулгүй байдлын системтэй. Ердийн хэрэглээнд 10 жил орчим ашиглах боломжтой.",
      images: [
        { id: "inside", alt: "DJI Power 1000 V2-ийн дотоод бүтэц" },
        { id: "cells", alt: "LFP батерейн эс" },
      ],
    },
  ],
  galleryTitle: "",
  gallery: [],
};

const OSMO_NANO: ProductMedia = {
  folder: "osmo-nano",
  youtube: "yECD9TzmW-A",
  hero: { id: "hero-kv", alt: "Замын дугуйн жолоо дээр бэхлэгдсэн DJI Osmo Nano" },
  heroVideo: { id: "hero-video", poster: "hero-poster" },
  heroDark: true,
  chapters: [
    {
      title: "Хаана ч наалддаг авсаархан камер",
      text: "Хоёр талт соронзон бүтэцтэй, жижигхэн камер хувцас, малгай, тулгуурт шууд наалдана. Хэрэгтэй үедээ нэг хөдөлгөөнөөр авч, дахин бэхэлнэ.",
      images: [
        { id: "hat", alt: "Малгайнд соронзоор бэхлэгдсэн DJI Osmo Nano", caption: "Малгайнд" },
        { id: "pole", alt: "Тулгуур шон дээр бэхлэгдсэн DJI Osmo Nano", caption: "Хаана ч" },
      ],
    },
    {
      title: "Өнцгөө чөлөөтэй сонго",
      text: "Селфи болон урд талын дүрслэлийг хэдхэн секундэд сольж, өөрийгөө болон эргэн тойрныхоо агшинг хамтад нь буулгана.",
      images: [
        { id: "hands", alt: "Хоёр гараараа DJI Osmo Nano барьж буй хүн", caption: "Хоёр талт соронз" },
        { id: "stick", alt: "Үл үзэгдэх селфи тулгууртай vlog хийж буй хүн", caption: "Vlog" },
      ],
    },
    {
      title: "Дугуй, замын аялалд",
      text: "Дугуйны жолоо, дуулган дээр бэхлээд замын хөдөлгөөнийг тогтвортой, өргөн өнцгөөр буулгана. RockSteady 3.0 болон хэвтээ тэнцвэрийг хадгалах горимтой.",
      images: [
        { id: "road", alt: "Замын дугуйн жолоо дээрх DJI Osmo Nano", caption: "Жолоон дээр" },
        { id: "cyclist", alt: "Замаар хурдтай давхиж буй дугуйчин", caption: "Замын дугуй" },
      ],
    },
    {
      title: "Бие дээрээ зүүгээд гараа чөлөөлнө",
      text: "Цээжний бүс, соронзон хавчаараар бие дээрээ зүүгээд гараа чөлөөтэй байлгана. Нэг товшоод бичлэгээ эхлүүлнэ.",
      images: [
        { id: "chest", alt: "Цээжний бүсэнд бэхлэгдсэн камер", caption: "Цээжний бүс" },
        { id: "tap", alt: "Хувцсанд соронзоор наалдсан камер, нэг товшилтоор бичлэг эхэлнэ", caption: "Нэг товшилт" },
      ],
    },
    {
      title: "Явган аялалд",
      text: "Үүргэвчний оосор, толгойн бүсэнд бэхлээд явган аяллын агшнуудыг гараа хөдөлгөхгүйгээр буулгана.",
      images: [
        { id: "hike", alt: "Үүргэвчний оосорт бэхлэгдсэн камертай явган аялагч", caption: "Үүргэвчинд" },
        { id: "headband", alt: "Толгойн бүсэнд бэхэлсэн камер", caption: "Толгойн бүс" },
      ],
    },
    {
      title: "Машин, усан дээр",
      text: "Машины их бие, завины ирмэгт бэхлээд сонирхолтой агшныг буулгана. Камер 10м хүртэл усанд тэсвэртэй, Vision Dock нь шүрших усанд тэсвэртэй (IPX4).",
      images: [
        { id: "car", alt: "Машины их бие дээр бэхлэгдсэн камер", caption: "Машинд" },
        { id: "kayak", alt: "Завины хошуунд бэхлэгдсэн камер", caption: "Усан дээр" },
      ],
    },
    {
      title: "Өдөр тутмын vlog",
      text: "Өдөр тутмын агшнуудаа 4K-аар буулгаж, олон нийтэд хуваалцана. Авсаархан хэмжээтэй тул халаасанд ч багтана.",
      images: [
        { id: "vlog", alt: "Цээжин дээрээ DJI Osmo Nano барьж буй vlog хийгч" },
        { id: "flat", alt: "Ширээн дээрх DJI Osmo Nano болон бусад хэрэгсэл" },
      ],
    },
  ],
  galleryTitle: "",
  gallery: [],
};

const POTENSIC_ATOM_3: ProductMedia = {
  folder: "potensic-atom-3",
  youtube: "iwa4dKC3U0o",
  heroTitle: "Potensic Atom 3",
  heroYoutube: true,
  hero: { id: "hero-photo", alt: "Нуур, уулын дунд нисч буй Potensic Atom 3" },
  heroDark: true,
  chapters: [
    {
      title: "Тод, цэвэр дүрс",
      text: "1/1.3″ CMOS мэдрэгчтэй камер 4K 60fps HDR бичлэг, 50MP зураг авна. P-Log горимоор өнгө засварт уян хатан бичлэг хийж, шөнийн AI горимоор хотын гэрлийг 4K/30fps-ээр тод буулгана.",
      natural: true,
      images: [
        { id: "s-sensor", alt: "Potensic Atom 3-ын 1/1.3 инчийн мэдрэгч, 4K 60fps, 50MP" },
        { id: "s-night", alt: "Шөнийн хотын гэрлийг буулгасан Atom 3-ын кадр" },
      ],
    },
    {
      title: "16км дамжуулалт, 50 минутын нислэг",
      text: "PixSync 5.0 технологи нь гурван давтамжаар 1080p/60fps дүрсийг 16км хүртэл тогтвортой дамжуулна. Стандарт батерейгаар 40 минут, өргөтгөсөн батерейгаар 50 минут хүртэл нисэх боломжтой.",
      natural: true,
      images: [
        { id: "s-range", alt: "Уулын дээгүүр нисч буй Atom 3, 16км дамжуулалт" },
        { id: "s-battery", alt: "Atom 3-ын өргөтгөсөн батерей: 50 минут, стандарт: 40 минут" },
      ],
    },
    {
      title: "249 граммаас хөнгөн, AI-аар дагана",
      text: "249 граммаас бага жинтэй, эвхэгддэг тул цүнх, үүргэвчинд амархан багтана. AI Tracking 2.0 нь дугуйчин, явган хүнийг дагаж буулгана, дрифт, Spin Ascend, Dolly Zoom зэрэг AI Quickshot горимтой.",
      natural: true,
      images: [
        { id: "s-light", alt: "Цүнхнээс Atom 3 дроныг гаргаж буй хүн" },
        { id: "s-track", alt: "Замаар дугуй унаж буй хүнийг дагаж буй Atom 3" },
      ],
    },
  ],
  galleryTitle: "",
  gallery: [],
};

const MEDIA_CATEGORIES = new Set(["drones", "cameras", "handheld", "power"]);

/** Accessories share model names with their drone (e.g. "…lito-x1-battery"), so only real products match. */
export function getProductMedia(slug: string, categorySlug: string): ProductMedia | null {
  if (!MEDIA_CATEGORIES.has(categorySlug)) return null;
  if (/potensic-atom-3/i.test(slug)) return POTENSIC_ATOM_3;
  if (/dji-nano/i.test(slug)) return OSMO_NANO;
  if (/power-1000-mini/i.test(slug)) return POWER_1000_MINI;
  if (/power-1000-v2/i.test(slug)) return POWER_1000_V2;
  if (/power-2000/i.test(slug)) return POWER_2000;
  if (/lito-x1/i.test(slug)) return LITO_X1;
  if (/mini-5-pro/i.test(slug)) return MINI_5_PRO;
  if (/air-3s/i.test(slug)) return AIR_3S;
  if (/neo-2/i.test(slug)) return NEO_2;
  if (/pocket-4p/i.test(slug)) return POCKET_4P;
  if (/osmo-360-ii/i.test(slug)) return OSMO_360_II;
  if (/action-6/i.test(slug)) return ACTION_6;
  if (/mobile-8p/i.test(slug)) return MOBILE_8P;
  if (/avata-360/i.test(slug)) return AVATA_360;
  if (/dji-flip/i.test(slug)) return FLIP;
  if (/mavic-4/i.test(slug)) return MAVIC_4_PRO;
  if (/pocket-4(?!p)/i.test(slug)) return POCKET_4;
  return null;
}

const asText = (v: unknown, max = 2000): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

function normalizeImage(raw: unknown): MediaImage | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = asText(r.id, 1000);
  if (!id) return null;
  const caption = asText(r.caption, 200);
  return { id, alt: asText(r.alt, 300), ...(caption ? { caption } : {}) };
}

/** Validates content saved from the admin; returns null when it cannot render a page. */
export function normalizeProductMedia(raw: unknown): ProductMedia | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const hero = normalizeImage(r.hero);
  if (!hero) return null;

  const images = (list: unknown): MediaImage[] =>
    Array.isArray(list) ? list.map(normalizeImage).filter((i): i is MediaImage => !!i) : [];

  const chapters: MediaChapter[] = (Array.isArray(r.chapters) ? r.chapters : [])
    .map((c): MediaChapter | null => {
      if (!c || typeof c !== "object") return null;
      const ch = c as Record<string, unknown>;
      const chapterImages = images(ch.images);
      const title = asText(ch.title, 200);
      if (!title && chapterImages.length === 0) return null;
      return {
        title,
        text: asText(ch.text, 2000),
        images: chapterImages,
        ...(ch.natural === true ? { natural: true } : {}),
      };
    })
    .filter((c): c is MediaChapter => !!c);

  const heroVideo = r.heroVideo as { id?: unknown; poster?: unknown } | undefined;
  const youtube = asText(r.youtube, 20);

  return {
    folder: asText(r.folder, 80),
    hero,
    ...(heroVideo && asText(heroVideo.id, 1000) && asText(heroVideo.poster, 1000)
      ? { heroVideo: { id: asText(heroVideo.id, 1000), poster: asText(heroVideo.poster, 1000) } }
      : {}),
    ...(asText(r.film, 120) ? { film: asText(r.film, 120) } : {}),
    ...(/^[\w-]{11}$/.test(youtube) ? { youtube } : {}),
    ...(r.heroYoutube === true && /^[\w-]{11}$/.test(youtube) ? { heroYoutube: true } : {}),
    ...(asText(r.heroTitle, 120) ? { heroTitle: asText(r.heroTitle, 120) } : {}),
    ...(r.heroDark === true ? { heroDark: true } : {}),
    chapters,
    galleryTitle: asText(r.galleryTitle, 200),
    gallery: images(r.gallery),
  };
}
