# 🚁 MongolDrone — UI/UX Design Specification (Part 2)
## Sections 6-10: Checkout, Chatbot, Admin, Conversion, Priorities

---

## 6. Checkout UX

### Structure: Single-Page Checkout

```
┌──────────────────────────────────────────────────────┐
│  MongolDrone · Захиалга                              │
│  ← Сагс руу буцах                                   │
├────────────────────────┬─────────────────────────────┤
│                        │                             │
│  ① Хүргэлтийн мэдээлэл│  ЗАХИАЛГЫН ХУРААНГУЙ       │
│  ┌──────────────────┐  │                             │
│  │ Нэр              │  │  DJI Mavic 3 Pro    ×1     │
│  │ Утас (+976)      │  │  ₮8,500,000               │
│  │ Хот/Аймаг [▼]    │  │                             │
│  │ Дүүрэг/Сум [▼]   │  │  Хүргэлт: ₮5,000          │
│  │ Дэлгэрэнгүй хаяг │  │  ─────────────────         │
│  └──────────────────┘  │  НИЙТ: ₮8,505,000          │
│                        │                             │
│  ② Төлбөрийн хэлбэр   │  ┌─────────────────────┐   │
│  ┌──────────────────┐  │  │  🔒 Аюулгүй төлбөр  │   │
│  │ ○ QPay           │  │  │  ✅ 14 хоног буцаалт │   │
│  │ ○ SocialPay      │  │  │  ✅ Албан ёсны барааа │   │
│  │ ○ Банкны шилжүүлэг│  │  └─────────────────────┘   │
│  └──────────────────┘  │                             │
│                        │                             │
│  [  Захиалга баталгаажуулах  ]                       │
│                        │                             │
│  🔒 QPay · SocialPay · Khan Bank · Golomt           │
└────────────────────────┴─────────────────────────────┘
```

### Payment Flow by Method

**QPay / SocialPay:**
1. User selects QPay → clicks "Захиалга баталгаажуулах"
2. System creates order + generates QR code
3. **Full-screen QR modal** with instructions: "Банкны аппаар уншуулна уу"
4. Auto-polling every 5 seconds for payment confirmation
5. On success → animated checkmark → redirect to confirmation page
6. Timeout (15 min) → show "Дахин оролдох" + manual check button

**Bank Transfer:**
1. Show bank details (account name, number, bank)
2. Show exact amount + unique reference code
3. "Шилжүүлэг хийсэн" button → opens upload receipt photo
4. Admin manually verifies → updates order status

### Order Confirmation Page
- Large green checkmark animation
- Order number prominently displayed: `MND-20260401-0001`
- Order summary
- Expected delivery timeline
- "Захиалга хянах" (Track Order) button
- "Үргэлжлүүлэн худалдаа хийх" (Continue Shopping) secondary link
- Trigger: chatbot pops up with "Захиалгатай холбоотой асуулт байна уу?"

### Trust Elements in Checkout
- 🔒 Lock icon + "Аюулгүй төлбөр" (Secure Payment) at top
- Payment provider logos (QPay, SocialPay, bank logos)
- "14 хоног эргүүлэн буцаалт" (14-day return) reminder
- No surprise fees — show delivery cost BEFORE checkout
- Phone number field prefilled with +976

### Mobile Checkout
- **Single column**, form fields full-width
- Order summary collapsible (shown as single line: "₮8,505,000 · 1 бараа" with expand)
- QPay QR: large display, screen brightness auto-increases
- Sticky bottom: total price + submit button always visible
- Keyboard-aware: form scrolls properly when keyboard opens

---

## 7. Chatbot Widget UX

### Default State (Collapsed)
```
                              ┌───────────────────────┐
                              │ 💬 Асуух зүйл байна уу?│
                              │    Туслах уу?          │
                              └───────────────────────┘
                                        ┌──┐
                                        │💬│  ← Floating button
                                        └──┘     (bottom-right)
```
- Blue floating circle, 56px, subtle pulse animation on first visit
- Auto-show tooltip after 10 seconds on product pages: "Энэ дроны талаар асуух уу?"
- Badge dot if there's a previous unread message
- Mobile: bottom-right, 48px, respects thumb reach zone

### Opened State (Expanded Panel)
```
┌─────────────────────────────┐
│  🤖 MongolDrone AI          │
│  ● Онлайн                  │  ← header
│                         [✕] │
├─────────────────────────────┤
│                             │
│  Сайн байна уу! 👋          │
│  Би MongolDrone-ийн AI     │
│  зөвлөх. Танд яаж туслах   │
│  вэ?                        │
│                             │
│  ┌─────────┐ ┌───────────┐ │
│  │Дрон хайх│ │Үнэ мэдэх  │ │  ← quick replies
│  └─────────┘ └───────────┘ │
│  ┌─────────┐ ┌───────────┐ │
│  │Лизинг   │ │Хүргэлт    │ │
│  └─────────┘ └───────────┘ │
│                             │
├─────────────────────────────┤
│  [Мессеж бичих...      ] 📎│  ← input
└─────────────────────────────┘
```

- Desktop: 380px wide × 520px tall, anchored bottom-right
- Mobile: **full-screen overlay** with back arrow (not just a panel)
- Smooth slide-up animation when opening
- Header shows AI name + online status

### Quick Reply Suggestions
- "Дрон хайх" (Search drones)
- "Үнэ мэдэх" (Check prices)
- "Лизингийн мэдээлэл" (Leasing info)
- "Хүргэлт хэзээ вэ?" (When is delivery?)
- "Захиалга хянах" (Check my order)
- Context-aware: on product pages, show "Энэ дроны талаар асуух" (Ask about this drone)

### Product Carousel in Chat
```
│  Танд тохирох дронууд:     │
│                             │
│  ┌────────┐┌────────┐┌──── │
│  │[Image] ││[Image] ││[Im  │  ← horizontal scroll
│  │Mavic 3 ││Mini 4  ││Air  │
│  │₮8.5M   ││₮2.1M   ││₮4  │
│  │[Үзэх →]││[Үзэх →]││[Үз │
│  └────────┘└────────┘└──── │
```
- Horizontal scrollable cards
- Each card: thumbnail + name + price + "Үзэх" link (opens product page)
- Max 5 cards per carousel
- Cards are tappable on mobile (entire card is link)

### Lead Capture Flow
```
│  ✎ Та энэ бүтээгдэхүүнийг  │
│  авах сонирхолтой байна уу? │
│  Нэр, утасны дугаараа       │
│  үлдээвэл манай менежер     │
│  тантай холбогдоно.         │
│                             │
│  ┌─────────────────────┐   │
│  │ Нэр                 │   │
│  ├─────────────────────┤   │
│  │ Утас (+976)          │   │
│  ├─────────────────────┤   │
│  │ [Илгээх]            │   │
│  └─────────────────────┘   │
```
- Triggered when AI detects purchase intent (2+ messages about specific product)
- Inline form within chat (not a popup/redirect)
- After submit: "Баярлалаа! Менежер 1-2 цагийн дотор холбогдоно 📞"
- Lead data stored + Telegram notification to sales team

### Fallback Flow
- When AI can't answer (3 consecutive low-confidence responses):
  - "Уучлаарай, энэ асуултад хариулж чадахгүй байна."
  - Show quick actions: "Менежертэй холбогдох" · "Утсаар залгах" · "Дахин асуух"

### Human Handoff UX
- User clicks "Менежертэй холбогдох"
- Chat shows: "Менежер рүү шилжүүлж байна... ⏳"
- Notification sent to support_manager via Telegram + in-app
- Chat header changes: "👤 Менежер · Хүлээж байна..."
- If no response in 5 min: "Менежер одоо завгүй байна. Утас: 7700-1234"

---

## 8. Admin Panel UX

### Overall Style
- **Light theme** with subtle blue accents (admins work in this all day)
- Left sidebar navigation with icons + Mongolian labels
- Top bar: search, notification bell (badge count), user avatar/name
- Responsive: sidebar collapses to icons on tablet, hamburger on mobile

### Sidebar Navigation
```
┌──────────────────────┐
│ 🚁 MongolDrone Admin │
│                      │
│ 📊 Хянах самбар      │  Dashboard
│ 📦 Бүтээгдэхүүн     │  Products
│ 🛒 Захиалга         │  Orders
│ 🚚 Хүргэлт          │  Delivery
│ 📋 Лизинг           │  Leasing
│ 👥 Хэрэглэгч        │  Customers
│ 💬 Чатбот           │  Chatbot
│ 🔔 Мэдэгдэл        │  Notifications
│ ⚙️ Тохиргоо         │  Settings
│                      │
│ ──────────────────── │
│ 👤 Админ нэр         │
│ Гарах               │
└──────────────────────┘
```

### Dashboard Structure
```
┌──────────────────────────────────────────────────────┐
│  Сайн байна уу, Админ 👋              🔔(3) 👤       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ 156  │ │₮45M  │ │ 23   │ │ 8    │               │
│  │Захиалга│ │Орлого │ │Лид   │ │Лизинг│               │
│  │+12%▲ │ │+8%▲  │ │+34%▲ │ │Шинэ  │               │
│  └──────┘ └──────┘ └──────┘ └──────┘               │
│                                                      │
│  ┌─────────────────────┐ ┌────────────────────────┐ │
│  │ Орлогын график       │ │ Сүүлийн захиалгууд    │ │
│  │ (7/30/90 day chart)  │ │ (recent orders list)   │ │
│  └─────────────────────┘ └────────────────────────┘ │
│                                                      │
│  ┌─────────────────────┐ ┌────────────────────────┐ │
│  │ Шилдэг бүтээгдэхүүн │ │ Чатбот статистик      │ │
│  │ (top selling)        │ │ (sessions/leads today)  │ │
│  └─────────────────────┘ └────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Table Views (Orders, Products, Customers)
- Standard data table with: search, filters, column sorting, pagination
- Bulk actions: checkbox select + action dropdown
- Status shown as colored badges
- Row click → navigate to detail page
- Mobile: card-based list view instead of table (tables don't work on mobile)

### Chatbot Monitoring Page
- **Live sessions panel**: active conversations with user message preview
- **Session detail**: full conversation transcript, lead data, model used
- **Filters**: date range, lead captured (yes/no), escalated (yes/no), model used
- **Stats**: total sessions today, avg messages per session, lead capture rate, escalation rate

### Model Settings Page
```
┌──────────────────────────────────────────────┐
│  Чатбот тохиргоо                             │
├──────────────────────────────────────────────┤
│                                              │
│  Чатбот идэвхтэй: [🟢 ON/OFF toggle]        │
│                                              │
│  Модель сонголт:                             │
│  ┌──────────────────────────────────────┐    │
│  │ ● GPT-4o-mini  — Хурдан, хямд       │    │
│  │ ○ GPT-4o       — Чанартай, үнэтэй   │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Системийн промпт:                           │
│  ┌──────────────────────────────────────┐    │
│  │ Та бол MongolDrone компанийн AI...   │    │
│  │ (editable textarea)                   │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Token хязгаар (сессион бүрт): [4000]       │
│  Температур: [0.7] ──●────────              │
│                                              │
│  [Хадгалах]                                  │
└──────────────────────────────────────────────┘
```

---

## 9. Conversion Optimization

### Trust Signals (Place Throughout)
- **Header**: "🛡️ Албан ёсны дистрибьютор" badge — always visible
- **Product cards**: "✅ Баталгаатай" micro-badge
- **Product detail**: warranty info, return policy, secure payment icons
- **Checkout**: lock icon, payment logos, "Аюулгүй" label
- **Footer**: physical address, phone number, social links, partner logos

### Leasing CTA Placement
1. **Home page**: dedicated section between featured products and testimonials
2. **Product detail**: "Лизингээр авах" button next to "Сагсанд нэмэх"
3. **Product cards**: amber "Лизинг ✓" badge on eligible products
4. **Cart page**: "Лизингээр төлөх боломжтой" note below total
5. **Chatbot**: AI proactively suggests leasing for products >₮3,000,000

### Chatbot CTA Placement
1. **Floating widget**: all pages, bottom-right
2. **Product detail**: "💬 AI-аас асуух" button in CTA group
3. **Home page**: dedicated section with sample conversation preview
4. **Product listing**: "Тохирох дрон олоход тусална" banner after 6th product
5. **404 / empty search**: "Хайж буй зүйлээ чатботоос асуугаарай"

### Urgency (Tasteful, Not Spammy)
- **Low stock indicator**: "Зөвхөн 3 ширхэг үлдсэн" (Only 3 left) — only when true
- **Recently viewed by others**: "Өнөөдөр 12 хүн үзсэн" — only on popular items
- **Seasonal relevance**: "Хаврын улирлын хямдрал" banners when applicable
- **NO**: fake countdown timers, fake "someone just purchased", pressure tactics

### Mobile Conversion Tricks
1. **Sticky CTA bars**: price + primary button always visible on scroll
2. **Click-to-call**: phone icon in header, always one tap on mobile
3. **Simplified forms**: use phone number auto-detection, minimal fields
4. **QPay deep link**: on mobile, offer to open bank app directly (not just QR)
5. **Save for later**: if user scrolls product >60s without action, show "Хадгалах" prompt
6. **Cart persistence**: localStorage cart survives app close, syncs on login

---

## 10. UX Mistakes to Avoid

### For Mongolian Ecommerce Users
| ❌ Mistake | ✅ Instead |
|-----------|-----------|
| English-only UI or untranslated sections | 100% Mongolian UI with proper Cyrillic typography |
| Hiding phone number / requiring email-only contact | Show phone prominently; many prefer calling |
| Complex registration before browsing | Allow full browsing without account; require login only at checkout |
| Only international payment options (Stripe, PayPal) | QPay + SocialPay + bank transfer — the only methods that matter |
| Ignoring Facebook as primary social platform | Facebook login as the PRIMARY method, not "also available" |
| Generic stock photos for trust section | Real local business photos, Mongolian customer names |
| Pricing in USD | Always MNT (₮) with proper thousand separators: ₮8,500,000 |
| Assuming reliable fast internet | Optimize images, lazy load, skeleton screens, offline cart capability |

### For Mobile Users
| ❌ Mistake | ✅ Instead |
|-----------|-----------|
| Desktop-first then "make it responsive" | Design mobile wireframes FIRST, then expand to desktop |
| Tiny tap targets (<44px) | All interactive elements minimum 44×44px |
| Horizontal scrolling tables | Card-based layouts on mobile |
| Popups that are hard to dismiss | Bottom sheets with clear close/swipe-down |
| Forms with too many fields | Progressive disclosure — only essential fields visible |
| Fixed position elements covering content | Smart show/hide on scroll direction |
| No loading states | Skeleton screens for every data-dependent section |

### For AI Chatbot on Shopping Sites
| ❌ Mistake | ✅ Instead |
|-----------|-----------|
| Chatbot auto-opens and interrupts browsing | Subtle pulse on icon; auto-open only after 30+ seconds of inactivity on product page |
| Chatbot blocks page content | Chatbot is dismissible; on mobile, full-screen with easy back |
| AI invents product details or prices | Strict tool-calling — AI NEVER generates product data from memory |
| No way to reach a human | Clear "Менежертэй ярих" option always accessible |
| Chatbot looks like a generic widget | Custom-branded with MongolDrone colors and tone |
| Forcing lead capture too early | Only suggest lead form after 2+ engaged messages about a product |
| No conversation persistence | Logged-in users see history; anonymous users get session-based persistence |
| Chatbot handles complaints poorly | For negative sentiment → immediate human handoff option |

---

## Best UI Priorities for MVP

### Tier 1 — Ship These First (Week 1-4)
| Priority | Item | Why |
|:--------:|------|-----|
| 1 | **Mobile-first responsive layout system** | 80%+ of Mongolian users are on mobile |
| 2 | **Product card component** | Reused on home, listing, search, chatbot, admin |
| 3 | **Product detail page** | This is where buying decisions happen |
| 4 | **Mongolian typography + formatting** | ₮ currency, Cyrillic fonts, proper line heights |
| 5 | **Facebook login flow** | Lowest friction auth for Mongolian users |
| 6 | **Checkout + QPay QR** | Revenue depends on this working perfectly |

### Tier 2 — Ship These Next (Week 5-6)
| Priority | Item | Why |
|:--------:|------|-----|
| 7 | **Chatbot widget + basic conversation** | 24/7 sales assistant, lead capture |
| 8 | **Home page with hero + featured products** | First impression and SEO landing |
| 9 | **Admin: product CRUD + order list** | Team needs to manage catalog and orders |
| 10 | **Cart + sticky mobile CTA bars** | Reduce add-to-cart-to-purchase drop-off |

### Tier 3 — Polish Before Launch (Week 7-8)
| Priority | Item | Why |
|:--------:|------|-----|
| 11 | **Trust elements** (badges, warranty, return policy) | Mongolian ecommerce trust is still developing |
| 12 | **Admin notifications** (in-app + Telegram) | Team can't miss orders or leads |
| 13 | **Loading states** (skeletons, transitions) | Perceived performance on slower connections |
| 14 | **Error states** (empty, offline, 404) | Polish that prevents user confusion |
| 15 | **Chatbot product cards + lead capture** | Convert browsing into actionable leads |

### What to SKIP in MVP
- ❌ Dark mode toggle (ship light mode only)
- ❌ Product comparison feature
- ❌ Wishlist / favorites
- ❌ Review / rating system
- ❌ Advanced analytics charts in admin
- ❌ Multi-language support (Mongolian only first)
- ❌ Email notifications (Telegram is enough for small team)
- ❌ Complex role-based admin (2 roles is enough: super_admin + admin)

---

*This design spec is Part 2 of 2. See Part 1 for Design Direction, Page-by-Page UX, Home/Listing/Detail structure.*
