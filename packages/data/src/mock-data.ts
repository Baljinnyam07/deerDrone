import type {
  Brand,
  Category,
  ChatLead,
  ChatMessage,
  DashboardMetric,
  FaqItem,
  Order,
  Product,
  Testimonial,
} from "@deer-drone/types";

export const categories: Category[] = [
  {
    id: "cat-pro",
    name: "Мэргэжлийн дрон",
    slug: "professional",
    description: "Уул уурхай, зураглал, хяналт шалгалтад зориулсан шийдлүүд.",
    productCount: 2,
  },
  {
    id: "cat-consumer",
    name: "Хувийн дрон",
    slug: "consumer",
    description: "Контент бүтээгч болон аялалд зориулсан хөнгөн ангилал.",
    productCount: 2,
  },
  {
    id: "cat-accessory",
    name: "Дагалдах хэрэгсэл",
    slug: "accessories",
    description: "Батерей, контроллер, хамгаалалтын иж бүрдэл.",
    productCount: 4,
  },
];

export const brands: Brand[] = [
  {
    id: "brand-dji",
    name: "DJI",
    slug: "dji",
    story: "Мэргэжлийн болон хэрэглээний дроны зах зээлд тэргүүлэгч брэнд.",
  },
  {
    id: "brand-autel",
    name: "Autel",
    slug: "autel",
    story: "Thermal, inspection ангилалд хүчтэй enterprise шийдлүүдтэй брэнд.",
  },
  {
    id: "brand-skydio",
    name: "Skydio",
    slug: "skydio",
    story: "Автомат нислэг болон obstacle avoidance системээрээ ялгардаг.",
  },
];

export const products: Product[] = [
  {
    id: "prd-matrice-350",
    sku: "DJI-M350-RTK",
    slug: "dji-matrice-350-rtk",
    name: "DJI Matrice 350 RTK",
    brand: "DJI",
    categorySlug: "professional",
    categoryName: "Мэргэжлийн дрон",
    shortDescription: "Уул уурхай, зураглал, үйлдвэрлэл дээр ажиллах RTK платформ.",
    description:
      "Хүнд нөхцөлд тогтвортой ажиллах dual-battery системтэй, урт нислэгийн хугацаатай аж үйлдвэрийн платформ.",
    price: 28500000,
    comparePrice: 29900000,
    currency: "MNT",
    stockQty: 3,
    isLeasable: true,
    isFeatured: true,
    status: "active",
    heroNote: "Enterprise RTK платформ",
    tags: ["rtk", "mapping", "inspection"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
        alt: "DJI Matrice 350 RTK drone",
        isThumbnail: true,
      },
    ],
    specs: [
      { group: "Ерөнхий", label: "Нислэгийн хугацаа", value: "55 мин" },
      { group: "Ерөнхий", label: "IP ангилал", value: "IP55" },
      { group: "Камер", label: "Payload support", value: "H20N / L2 / P1" },
      { group: "Аюулгүй байдал", label: "Obstacle sensing", value: "6 чиглэл" },
    ],
  },
  {
    id: "prd-mavic-3-pro",
    sku: "DJI-MAVIC3-PRO",
    slug: "dji-mavic-3-pro",
    name: "DJI Mavic 3 Pro",
    brand: "DJI",
    categorySlug: "consumer",
    categoryName: "Хувийн дрон",
    shortDescription: "Hasselblad камертай, урт нислэгтэй премиум контент дрон.",
    description:
      "Зураг авалт, маркетинг, event production-д тохирох гурван камер бүхий premium creator drone.",
    price: 8500000,
    comparePrice: 9200000,
    currency: "MNT",
    stockQty: 7,
    isLeasable: true,
    isFeatured: true,
    status: "active",
    heroNote: "Creator flagship",
    tags: ["4k", "creator", "camera"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
        alt: "DJI Mavic 3 Pro",
        isThumbnail: true,
      },
    ],
    specs: [
      { group: "Ерөнхий", label: "Нислэгийн хугацаа", value: "43 мин" },
      { group: "Камер", label: "Видео", value: "5.1K / 50fps" },
      { group: "Камер", label: "Үндсэн камер", value: "Hasselblad 4/3" },
      { group: "Холболт", label: "Дээд зай", value: "28 км" },
    ],
  },
  {
    id: "prd-autel-max-4t",
    sku: "AUTEL-EVO-MAX4T",
    slug: "autel-evo-max-4t",
    name: "Autel EVO Max 4T",
    brand: "Autel",
    categorySlug: "professional",
    categoryName: "Мэргэжлийн дрон",
    shortDescription: "Дулаан мэдрэгчтэй, inspection болон safety ажиллагаанд зориулсан.",
    description:
      "Thermal payload, low-light камер, AI дүрс танилттай industrial inspection drone.",
    price: 19800000,
    currency: "MNT",
    stockQty: 2,
    isLeasable: true,
    isFeatured: true,
    status: "active",
    heroNote: "Thermal inspection ready",
    tags: ["thermal", "inspection", "security"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=1200&q=80",
        alt: "Autel EVO Max 4T",
        isThumbnail: true,
      },
    ],
    specs: [
      { group: "Ерөнхий", label: "Нислэгийн хугацаа", value: "42 мин" },
      { group: "Камер", label: "Thermal", value: "640 x 512" },
      { group: "Камер", label: "Zoom", value: "10x optical" },
      { group: "Аюулгүй байдал", label: "Navigation", value: "GNSS-denied capable" },
    ],
  },
  {
    id: "prd-mini-4-pro",
    sku: "DJI-MINI4-PRO",
    slug: "dji-mini-4-pro",
    name: "DJI Mini 4 Pro",
    brand: "DJI",
    categorySlug: "consumer",
    categoryName: "Хувийн дрон",
    shortDescription: "Хөнгөн жинтэй, аялал болон өдөр тутмын контентод тохиромжтой.",
    description:
      "Хурдан суралцахад тохиромжтой, obstacle sensing болон social content-д хүчтэй хөнгөн дрон.",
    price: 4300000,
    currency: "MNT",
    stockQty: 11,
    isLeasable: false,
    isFeatured: true,
    status: "active",
    heroNote: "Travel friendly",
    tags: ["portable", "creator", "camera"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
        alt: "DJI Mini 4 Pro",
        isThumbnail: true,
      },
    ],
    specs: [
      { group: "Ерөнхий", label: "Нислэгийн хугацаа", value: "34 мин" },
      { group: "Камер", label: "Видео", value: "4K / 100fps" },
      { group: "Аюулгүй байдал", label: "Obstacle sensing", value: "Omnidirectional" },
      { group: "Жин", label: "Нийт жин", value: "249 гр" },
    ],
  },
  {
    id: "prd-dji-rc2",
    sku: "DJI-RC2",
    slug: "dji-rc-2-controller",
    name: "DJI RC 2 Controller",
    brand: "DJI",
    categorySlug: "accessories",
    categoryName: "Дагалдах хэрэгсэл",
    shortDescription: "Илүү тогтвортой control link-тэй ухаалаг удирдлага.",
    description:
      "Mini series болон Mavic цувралтай тохирох premium controller. Дэлгэц, дамжуулалт, холболтын мэдрэмж сайтай.",
    price: 1850000,
    currency: "MNT",
    stockQty: 9,
    isLeasable: false,
    isFeatured: false,
    status: "active",
    heroNote: "Smart remote control",
    tags: ["accessories", "controller", "remote"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
        alt: "DJI RC 2 controller",
        isThumbnail: true,
      },
    ],
    specs: [
      { group: "Ерөнхий", label: "Дэлгэц", value: "5.5 inch FHD" },
      { group: "Холболт", label: "Transmission", value: "O4" },
    ],
  },
  {
    id: "prd-dji-battery",
    sku: "DJI-BATTERY-PLUS",
    slug: "dji-intelligent-flight-battery-plus",
    name: "DJI Intelligent Flight Battery Plus",
    brand: "DJI",
    categorySlug: "accessories",
    categoryName: "Дагалдах хэрэгсэл",
    shortDescription: "Урт нислэгийн хугацаанд зориулсан нөөц battery module.",
    description:
      "Field operation-д зориулагдсан extra battery. Урт session болон орон нутгийн ажилд илүү тохиромжтой.",
    price: 620000,
    currency: "MNT",
    stockQty: 21,
    isLeasable: false,
    isFeatured: false,
    status: "active",
    heroNote: "Extended flight support",
    tags: ["accessories", "battery", "power"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&w=900&q=80",
        alt: "DJI battery accessory",
        isThumbnail: true,
      },
    ],
    specs: [
      { group: "Эрчим", label: "Capacity", value: "3850 mAh" },
      { group: "Ерөнхий", label: "Тохирох цуврал", value: "Mini / Air selected models" },
    ],
  },
  {
    id: "prd-autel-controller",
    sku: "AUTEL-SMART-CONTROLLER-V3",
    slug: "autel-smart-controller-v3",
    name: "Autel Smart Controller V3",
    brand: "Autel",
    categorySlug: "accessories",
    categoryName: "Дагалдах хэрэгсэл",
    shortDescription: "Enterprise mission ажилд зориулсан high-brightness controller.",
    description:
      "Inspection урсгал, thermal payload control, mission planning-д зориулагдсан rugged controller.",
    price: 2490000,
    currency: "MNT",
    stockQty: 5,
    isLeasable: false,
    isFeatured: false,
    status: "active",
    heroNote: "Enterprise field control",
    tags: ["accessories", "controller", "enterprise"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=900&q=80",
        alt: "Autel smart controller",
        isThumbnail: true,
      },
    ],
    specs: [
      { group: "Дэлгэц", label: "Brightness", value: "2000 nits" },
      { group: "Ерөнхий", label: "Ingress", value: "Field ready" },
    ],
  },
  {
    id: "prd-skydio-case",
    sku: "SKYDIO-X10-CASE",
    slug: "skydio-x10-hard-case",
    name: "Skydio X10 Hard Case",
    brand: "Skydio",
    categorySlug: "accessories",
    categoryName: "Дагалдах хэрэгсэл",
    shortDescription: "Payload болон flight kit-ийг хамгаалах travel hard case.",
    description:
      "Outdoor transport, storage, and deployment speed-ийг сайжруулах foam-lined protective case.",
    price: 780000,
    currency: "MNT",
    stockQty: 4,
    isLeasable: false,
    isFeatured: false,
    status: "active",
    heroNote: "Protected field transport",
    tags: ["accessories", "case", "transport"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        alt: "Hard case accessory",
        isThumbnail: true,
      },
    ],
    specs: [
      { group: "Материал", label: "Shell", value: "Impact resistant polymer" },
      { group: "Ерөнхий", label: "Layout", value: "Drone + battery + controller" },
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "tm-mining",
    name: "Г. Тэмүүжин",
    company: "Steppe Mining Services",
    quote:
      "Inspection багт богино хугацаанд зөв дрон сонгоход маш их тус болсон. Хүргэлт, зөвлөгөө хоёулаа найдвартай байсан.",
  },
  {
    id: "tm-media",
    name: "Н. Энэрэл",
    company: "Blue Sky Media",
    quote:
      "Контент багтаа Mavic 3 Pro авсан. Үнэ, баталгаа, AI зөвлөгөөний урсгал нь ойлгомжтой байсан.",
  },
  {
    id: "tm-agri",
    name: "Б. Амарсайхан",
    company: "Agri Vision Mongolia",
    quote:
      "Лизингийн сонголтыг эхнээс нь тодорхой харуулсан нь B2B худалдан авалт хийхэд амар болгосон.",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Улаанбаатарт хүргэлт хэд хоног вэ?",
    answer: "Улаанбаатар дотор ихэнх захиалга 1-2 хоногт хүрнэ. Агуулахад бэлэн бараа бол илүү хурдан гарна.",
  },
  {
    question: "Орон нутагт хүргэлт хийдэг үү?",
    answer: "Тийм. Аймаг руу хүргэлтийг тээврийн нөхцлөөс хамааран 3-5 хоногийн дотор зохион байгуулна.",
  },
  {
    question: "Лизингээр авах боломжтой юу?",
    answer: "Тийм. Лизингийн боломжтой бүтээгдэхүүн дээр сарын тооцоолуур болон хүсэлтийн урсгал харагдана.",
  },
  {
    question: "Төлбөрийн ямар хэлбэрүүдийг дэмжих вэ?",
    answer: "MVP хувилбар дээр QPay үндсэн урсгал ажиллана. Bank transfer fallback мөн бэлэн байна.",
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Өнөөдрийн борлуулалт",
    value: "₮18.4M",
    hint: "3 баталгаажсан захиалга",
    tone: "accent",
  },
  {
    label: "Шинэ лид",
    value: "12",
    hint: "Chatbot-оос орж ирсэн",
    tone: "success",
  },
  {
    label: "Хүлээгдэж буй захиалга",
    value: "9",
    hint: "Payment pending болон packing",
    tone: "warning",
  },
  {
    label: "Catalog health",
    value: "8 active",
    hint: "2 low stock product",
    tone: "neutral",
  },
];

export const recentOrders: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "MND-20260401-0001",
    status: "confirmed",
    contactName: "Батболд",
    contactPhone: "+97699119911",
    createdAt: "2026-04-01T03:10:00.000Z",
    paymentMethod: "qpay",
    source: "web",
    shippingAddress: {
      city: "Улаанбаатар",
      district: "Сүхбаатар",
      khoroo: "1-р хороо",
      line1: "Central Tower, 8 давхар",
    },
    shippingCost: 5000,
    total: 8505000,
    items: [
      {
        productId: "prd-mavic-3-pro",
        productName: "DJI Mavic 3 Pro",
        quantity: 1,
        unitPrice: 8500000,
      },
    ],
  },
  {
    id: "ord-1002",
    orderNumber: "MND-20260401-0002",
    status: "pending",
    contactName: "Мөнхзул",
    contactPhone: "+97688112233",
    createdAt: "2026-04-01T04:15:00.000Z",
    paymentMethod: "qpay",
    source: "chatbot",
    shippingAddress: {
      city: "Дархан",
      line1: "6-р баг, үйлдвэрийн бүс",
      note: "Ажлын цагаар хүлээн авна",
    },
    shippingCost: 15000,
    total: 19815000,
    items: [
      {
        productId: "prd-autel-max-4t",
        productName: "Autel EVO Max 4T",
        quantity: 1,
        unitPrice: 19800000,
      },
    ],
  },
  {
    id: "ord-1003",
    orderNumber: "MND-20260401-0003",
    status: "packing",
    contactName: "Энхтөр",
    contactPhone: "+97699118822",
    createdAt: "2026-04-01T05:20:00.000Z",
    paymentMethod: "bank_transfer",
    source: "admin",
    shippingAddress: {
      city: "Улаанбаатар",
      district: "Хан-Уул",
      line1: "Japan Town, 205-р байр",
    },
    shippingCost: 5000,
    total: 4305000,
    items: [
      {
        productId: "prd-mini-4-pro",
        productName: "DJI Mini 4 Pro",
        quantity: 1,
        unitPrice: 4300000,
      },
    ],
  },
];

export const sampleLeads: ChatLead[] = [
  {
    id: "lead-001",
    name: "Ариунболд",
    phone: "+97690901234",
    interest: "Mining inspection drone",
    status: "new",
    sourcePage: "/products/dji-matrice-350-rtk",
    createdAt: "2026-04-01T02:15:00.000Z",
  },
  {
    id: "lead-002",
    name: "Саруул",
    phone: "+97688110022",
    interest: "Mavic 3 Pro үнэ, лизинг",
    status: "qualified",
    sourcePage: "/products/dji-mavic-3-pro",
    createdAt: "2026-04-01T02:48:00.000Z",
  },
  {
    id: "lead-003",
    name: "Эрдэнэбат",
    phone: "+97695004411",
    interest: "Thermal camera бүхий шийдэл",
    status: "contacted",
    sourcePage: "/products/autel-evo-max-4t",
    createdAt: "2026-04-01T03:22:00.000Z",
  },
];

export const sampleChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Сайн байна уу. Ямар зориулалтаар дрон хайж байна вэ?",
    createdAt: "2026-04-01T01:00:00.000Z",
  },
  {
    id: "msg-2",
    role: "user",
    content: "Зураглал хийхэд тохиромжтой загвар сонирхож байна.",
    createdAt: "2026-04-01T01:00:20.000Z",
  },
  {
    id: "msg-3",
    role: "assistant",
    content: "Тэгвэл RTK ангиллын Matrice 350 эсвэл Autel EVO Max 4T тохирно.",
    createdAt: "2026-04-01T01:00:35.000Z",
    cards: [
      {
        id: "prd-matrice-350",
        name: "DJI Matrice 350 RTK",
        slug: "dji-matrice-350-rtk",
        price: 28500000,
        heroNote: "Enterprise RTK платформ",
      },
      {
        id: "prd-autel-max-4t",
        name: "Autel EVO Max 4T",
        slug: "autel-evo-max-4t",
        price: 19800000,
        heroNote: "Thermal inspection ready",
      },
    ],
  },
];
