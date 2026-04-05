# 🚁 MongolDrone — UI/UX Design Specification

---

## 1. Design Direction

### Visual Style
**"Technical Luxury"** — The intersection of aerospace precision and premium ecommerce. Think Apple Store meets DJI Store, localized for Mongolia.

- Clean, spacious layouts with generous whitespace
- Dark-mode-first hero sections transitioning to light product areas
- Subtle glassmorphism on cards and overlays
- Micro-animations on scroll and interaction (not decorative — functional)
- Photography-driven: large drone imagery is the star

### Mood Keywords
`Precision` · `Trust` · `Professional` · `Futuristic` · `Accessible`

### Color Strategy

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0A0A0F` | Dark hero sections, header |
| `--bg-surface` | `#FFFFFF` | Main content background |
| `--bg-surface-alt` | `#F5F7FA` | Alternating sections, cards |
| `--accent-primary` | `#2563EB` | Primary CTA buttons, links |
| `--accent-hover` | `#1D4ED8` | Button hover states |
| `--accent-secondary` | `#06B6D4` | Secondary actions, chatbot accent |
| `--accent-success` | `#10B981` | Stock available, success states |
| `--accent-warning` | `#F59E0B` | Low stock, leasing badges |
| `--accent-danger` | `#EF4444` | Errors, out of stock |
| `--text-primary` | `#111827` | Body text on light |
| `--text-secondary` | `#6B7280` | Secondary text, labels |
| `--text-on-dark` | `#F9FAFB` | Text on dark backgrounds |
| `--border` | `#E5E7EB` | Card borders, dividers |

**Why blue?** Blue conveys trust and technology. Critical for ecommerce in a market where online purchasing trust is still developing.

### Typography

| Role | Font | Weight | Size (Desktop / Mobile) |
|------|------|--------|------------------------|
| Display (Hero) | Inter | 700 | 56px / 32px |
| H1 | Inter | 700 | 36px / 28px |
| H2 | Inter | 600 | 28px / 22px |
| H3 | Inter | 600 | 22px / 18px |
| Body | Inter | 400 | 16px / 15px |
| Body Small | Inter | 400 | 14px / 13px |
| Caption | Inter | 500 | 12px / 11px |
| Button | Inter | 600 | 15px / 14px |
| Price | Inter | 700 | 24px / 20px |

**Why Inter?** Excellent Cyrillic support for Mongolian text, clean and professional, free.

### Spacing System (8px base)

```
4px   → xs  (icon gaps)
8px   → sm  (tight spacing)
16px  → md  (standard padding)
24px  → lg  (card padding)
32px  → xl  (section gaps)
48px  → 2xl (between sections mobile)
64px  → 3xl (between sections desktop)
96px  → 4xl (hero padding)
```

### Component Style Guide

| Component | Style |
|-----------|-------|
| **Buttons (Primary)** | Solid blue, 8px radius, 48px height, subtle shadow, scale(1.02) on hover |
| **Buttons (Secondary)** | Ghost/outline, blue border, transparent fill |
| **Cards** | White bg, 1px border, 12px radius, subtle shadow on hover, lift animation |
| **Inputs** | 44px min height (mobile touch target), 8px radius, focus ring blue |
| **Badges** | Pill shape, small, color-coded (green=stock, amber=lease, red=sold out) |
| **Modals** | Centered, backdrop blur, slide-up on mobile |
| **Toast/Alerts** | Top-right desktop, bottom-center mobile, auto-dismiss 4s |

### Trust-Building UI Approach
1. **Warranty badges** next to every product price
2. **"Албан ёсны дистрибьютор"** (Official Distributor) badge in header
3. **Secure payment icons** (QPay, bank logos) in footer and checkout
4. **Real customer photos** (not stock) in testimonials
5. **Physical address + phone** always visible in footer
6. **Order tracking transparency** — clear status steps
7. **Professional photography** — no low-res or watermarked images

---

## 2. Website Page-by-Page UX

### Home Page

| Attribute | Detail |
|-----------|--------|
| **Goal** | Build trust, showcase hero products, drive to product pages or chatbot |
| **Key Sections** | Hero → Categories → Featured Products → Why Us → Leasing CTA → Testimonials → FAQ → Footer CTA |
| **Primary CTA** | "Бүтээгдэхүүн үзэх" (View Products) |
| **Secondary CTA** | "Лизингээр авах" (Get with Leasing) |
| **Mobile** | Sticky bottom bar with "Чат" and "Дуудлага" (Call) buttons |

### Product Listing Page

| Attribute | Detail |
|-----------|--------|
| **Goal** | Help users find the right drone quickly |
| **Key Sections** | Search bar → Active filters → Sort → Product grid → Pagination |
| **Layout** | Desktop: sidebar filters + 3-col grid. Mobile: top filter bar + 2-col grid |
| **Conversion** | "Хурдан харах" (Quick View) modal on card hover/tap |
| **Mobile** | Bottom sheet filter panel (not a separate page), sticky sort bar |

### Product Detail Page

| Attribute | Detail |
|-----------|--------|
| **Goal** | Convince the customer to buy or inquire |
| **Key Sections** | Gallery → Price/CTA → Specs → Leasing Calculator → Related Products |
| **Layout** | Desktop: 55% gallery / 45% info. Mobile: stacked, sticky bottom CTA |
| **Conversion** | Primary: "Сагсанд нэмэх" (Add to Cart). Secondary: "Лизинг", "Асуух" (Ask via chat) |
| **Mobile** | Sticky bottom bar: price + "Сагсанд нэмэх" button always visible |

### Leasing Info Page

| Attribute | Detail |
|-----------|--------|
| **Goal** | Educate about leasing, drive leasing applications |
| **Key Sections** | How it works (steps) → Calculator → Requirements → Application CTA → FAQ |
| **Conversion** | "Хүсэлт илгээх" (Submit Request) form |
| **Mobile** | Interactive calculator is primary engagement element |

### Cart Page

| Attribute | Detail |
|-----------|--------|
| **Goal** | Review items, proceed to checkout with confidence |
| **Key Sections** | Item list → Quantity controls → Subtotal → Delivery estimate → Checkout CTA |
| **Conversion** | Single prominent "Захиалга хийх" (Place Order) button |
| **Mobile** | Sticky bottom summary bar with total + CTA |

### Checkout Page

| Attribute | Detail |
|-----------|--------|
| **Goal** | Complete purchase with minimum friction |
| **Key Sections** | Address → Payment method → Order summary → Confirm |
| **Layout** | Single-page checkout (not multi-step). Desktop: 2-col (form + summary). Mobile: stacked |
| **Conversion** | Trust badges, secure payment icons, clear total breakdown |
| **Mobile** | Large touch targets, autofill-friendly inputs, QPay QR fullscreen |

### Login/Register

| Attribute | Detail |
|-----------|--------|
| **Goal** | Fastest possible account creation |
| **Layout** | Centered card, Facebook button prominent, email as fallback |
| **Conversion** | Facebook one-click is default CTA (90%+ of Mongolian users have FB) |
| **Mobile** | Full-width Facebook button, minimal form fields |

### User Profile

| Attribute | Detail |
|-----------|--------|
| **Goal** | Account management, build loyalty |
| **Key Sections** | Personal info → Addresses → Saved payment methods |
| **Mobile** | Simple list/card layout, edit via bottom sheet modals |

### My Orders

| Attribute | Detail |
|-----------|--------|
| **Goal** | Track orders, build trust through transparency |
| **Key Sections** | Order list (card format) → Order detail with status timeline |
| **Layout** | Visual status stepper: Хүлээгдэж буй → Баталгаажсан → Хүргэлтэнд → Хүргэгдсэн |
| **Mobile** | Tap card to expand or navigate to detail |

### Contact / FAQ

| Attribute | Detail |
|-----------|--------|
| **Goal** | Answer questions, provide direct contact |
| **Key Sections** | FAQ accordion → Contact form → Map (UB office) → Phone/Social links |
| **Conversion** | Chatbot CTA "Шууд асуух" (Ask directly) above FAQ |
| **Mobile** | Click-to-call button, click-to-chat prominent |

---

## 3. Home Page Structure (Detailed)

### Section 1: Hero (Full viewport)
- **Background**: Dark gradient with subtle drone silhouette or video loop
- **Headline**: `"Монголын тэргүүлэгч дрон худалдааны платформ"` (Mongolia's Leading Drone Sales Platform)
- **Subheadline**: `"Мэргэжлийн болон хувийн хэрэглээний дрон — албан ёсны баталгаатай"`
- **Primary CTA**: "Бүтээгдэхүүн үзэх" → product listing
- **Secondary CTA**: "Лизингээр авах" → leasing page
- **Trust strip below hero**: Logo bar — DJI, Autel, Skydio partner logos

### Section 2: Category Navigation (3-4 cards)
- Cards: "Мэргэжлийн дрон" · "Хувийн дрон" · "Дагалдах хэрэгсэл" · "Засвар үйлчилгээ"
- Each card: icon/image + name + product count
- Mobile: horizontal scroll

### Section 3: Featured Products (4-8 products)
- Section title: "Онцлох бүтээгдэхүүн"
- Product cards with image, name, price, "Шинэ" / "Хямдралтай" badges
- Desktop: 4-col grid. Mobile: 2-col grid or horizontal carousel
- Each card: hover → show "Дэлгэрэнгүй" (Details) button

### Section 4: Why Choose Us (3-4 value props)
- Icons + titles + short descriptions
- Props: "Албан ёсны баталгаа" · "Мэргэжлийн зөвлөгөө" · "Хүргэлт" · "Лизинг"
- Layout: icon grid, centered text, subtle background color

### Section 5: Leasing CTA (Split section)
- Left: Drone image at angle
- Right: "Лизингээр дрон аваарай" heading + 3 bullet benefits + CTA button
- Background: light blue gradient
- Mobile: stacked, image on top

### Section 6: Chatbot CTA
- "Асуух зүйл байна уу?" (Have questions?)
- Mini chat preview showing sample conversation
- CTA: "AI зөвлөхтэй ярилцах" (Chat with AI advisor)
- This section primes users to use the chatbot widget

### Section 7: Testimonials / Trust
- 2-3 customer testimonials with photo, name, company
- Focus on B2B customers: mining, agriculture, media companies
- Trust badges: payment logos, warranty info

### Section 8: FAQ (4-6 questions)
- Accordion style
- Questions: delivery, warranty, leasing, return policy, payment methods
- Each answer is 2-3 sentences max

### Section 9: Footer
- Columns: Products · Leasing · FAQ · Contact
- Contact: phone, email, address, Facebook page link
- Payment method icons: QPay, SocialPay, Khan Bank, Golomt
- Copyright + legal links

---

## 4. Product Listing UX

### Filters (Sidebar on Desktop, Bottom Sheet on Mobile)

| Filter | Type | Values |
|--------|------|--------|
| Ангилал (Category) | Checkbox | Мэргэжлийн, Хувийн, Дагалдах хэрэгсэл |
| Үнэ (Price) | Range slider | ₮0 — ₮20,000,000 |
| Брэнд (Brand) | Checkbox | DJI, Autel, Skydio, etc. |
| Нислэгийн хугацаа (Flight time) | Range | 10min — 60min |
| Камер (Camera) | Checkbox | 4K, 6K, 8K, Thermal |
| Лизинг (Leasing available) | Toggle | Yes/No |
| Нөөцөд байгаа (In stock) | Toggle | Yes/No |

### Sorting Options
- Зөвлөмж (Recommended) — default
- Үнэ: Бага → Их (Price: Low → High)
- Үнэ: Их → Бага (Price: High → Low)
- Шинэ (Newest)
- Алдартай (Popular)

### Product Card Anatomy
```
┌─────────────────────────┐
│  [Product Image]        │
│  ┌─────┐                │
│  │ШИН  │ (badge)        │
│  └─────┘                │
│                         │
│  DJI Mavic 3 Pro        │  ← product name
│  Мэргэжлийн дрон        │  ← category
│                         │
│  ₮8,500,000             │  ← price (bold, large)
│  ₮9,200,000             │  ← compare price (strikethrough)
│                         │
│  ● Нөөцөд байгаа        │  ← stock status (green dot)
│  📦 Лизинг боломжтой    │  ← leasing badge (amber)
│                         │
│  [Дэлгэрэнгүй →]       │  ← CTA link
└─────────────────────────┘
```

### Mobile Filter Behavior
1. **Filter button** fixed at top of listing → opens bottom sheet
2. **Active filters** shown as dismissible chips below search bar
3. **Apply** button at bottom sheet footer with result count: "24 бүтээгдэхүүн харуулах"
4. **Sort** is a separate dropdown, always accessible without opening filter panel
5. **Grid toggle**: 1-col (list) or 2-col (grid) — user preference saved

### Search
- Search bar at top of page with placeholder: `"Дроны нэр, брэнд хайх..."`
- Debounced (300ms), shows instant results dropdown
- Results grouped: Products (top 5) → Categories (if match)
- Mobile: full-screen search overlay on tap

---

## 5. Product Detail UX

### Layout (Desktop: Two Column)
```
┌────────────────────────────────────────────────────────┐
│ Breadcrumb: Нүүр > Мэргэжлийн дрон > DJI Mavic 3 Pro │
├──────────────────────┬─────────────────────────────────┤
│                      │                                 │
│   [Image Gallery]    │  DJI Mavic 3 Pro               │
│                      │  ★★★★★ (4.8) · 12 үнэлгээ      │
│   Main image         │                                 │
│   (zoom on hover)    │  ₮8,500,000                    │
│                      │  ₮9,200,000 (strikethrough)     │
│   Thumbnails below   │  -8% хямдрал                    │
│                      │                                 │
│                      │  ● Нөөцөд байгаа (green)       │
│                      │                                 │
│                      │  [Сагсанд нэмэх     ] (primary)│
│                      │  [Лизингээр авах     ] (outline)│
│                      │  [💬 AI-аас асуух    ] (ghost)  │
│                      │                                 │
│                      │  ─── Хүргэлт ───                │
│                      │  🚚 УБ: 1-2 хоног · ₮5,000    │
│                      │  🚚 Аймаг: 3-5 хоног · ₮15,000│
│                      │                                 │
│                      │  ─── Баталгаа ───               │
│                      │  ✅ 1 жилийн баталгаа           │
│                      │  ✅ Албан ёсны бүтээгдэхүүн     │
│                      │  ✅ 14 хоногийн буцаалт         │
├──────────────────────┴─────────────────────────────────┤
│                                                        │
│  [Tabs: Тайлбар | Техникийн үзүүлэлт | Лизинг]       │
│                                                        │
│  Техникийн үзүүлэлт (Specs Table):                    │
│  ┌──────────────────┬────────────────┐                 │
│  │ Жин              │ 958g           │                 │
│  │ Нислэгийн хугацаа│ 43 мин         │                 │
│  │ Камер            │ Hasselblad 4/3"│                 │
│  │ Видео            │ 5.1K/50fps     │                 │
│  │ Зай              │ 28 км          │                 │
│  └──────────────────┴────────────────┘                 │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Лизинг тооцоолуур (Leasing Calculator):              │
│  Сар: [6] [12] [18] [24]                              │
│  Сарын төлбөр: ₮425,000                               │
│  [Лизингийн хүсэлт илгээх →]                          │
├────────────────────────────────────────────────────────┤
│  Холбоотой бүтээгдэхүүн (Related Products)            │
│  [Card] [Card] [Card] [Card]                          │
└────────────────────────────────────────────────────────┘
```

### Mobile Layout
- Image gallery → full-width swipeable carousel with dots
- **Sticky bottom bar**: `₮8,500,000  [Сагсанд нэмэх]`
- Specs table scrollable horizontally
- Tabs collapse to accordion
- Leasing calculator: full-width slider

### Image Gallery
- Main image: tap to open fullscreen lightbox with pinch-zoom
- 4-6 thumbnails below (scroll horizontal on mobile)
- Include at least one "in-use" photo (drone flying, aerial shot)
- Video thumbnail if available (play icon overlay)
