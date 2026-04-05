# 🤖 MongolDrone AI Chatbot — System Design Specification
## Part 1: Strategy, Conversations, Models, Knowledge

---

## 1. Chatbot Purpose & Strategy

### Business Goal
Convert website visitors into qualified leads and paying customers by providing instant, 24/7 Mongolian-language product guidance — replacing the need for a full-time sales team to answer repetitive questions.

### Target Outcomes
| Metric | Target (Month 3) |
|--------|:-:|
| Chat-to-lead conversion | >15% |
| Lead-to-sale conversion | >8% |
| Questions requiring human handoff | <10% |
| Average response accuracy | >90% |

### User Goal
Get fast, trustworthy answers in Mongolian about drones, pricing, specs, leasing, and delivery — without waiting for a human.

### When Chatbot Should Appear

| Trigger | Behavior |
|---------|----------|
| **First visit** | Floating icon only; subtle pulse after 15s |
| **Product detail page >30s** | Tooltip: "Энэ дроны талаар асуух уу?" |
| **Cart abandonment (2+ min idle)** | Tooltip: "Захиалгатай холбоотой асуулт байвал асуугаарай" |
| **Leasing page** | Auto-tooltip: "Лизингийн нөхцлийн талаар тусална" |
| **404 / empty search** | Tooltip: "Хайж буй зүйлээ надаас асуугаарай" |
| **User clicks chat icon** | Always open immediately |

**Never auto-open** the chat window without user action. Tooltips are non-blocking.

### When to Hand Off to Human

| Condition | Action |
|-----------|--------|
| User explicitly asks for human | Immediate escalation |
| User expresses frustration (2+ negative messages) | Offer human option |
| AI confidence below threshold for 3 consecutive turns | Suggest human handoff |
| Complex leasing negotiation | Offer human after providing base info |
| Post-purchase complaint or refund request | Always escalate |
| Technical drone operation safety questions | Escalate with disclaimer |

---

## 2. Main Chatbot Capabilities

### Capability Map

| Capability | Priority | Data Source | AI Role |
|-----------|:--------:|------------|---------|
| **Product Q&A** | 🔴 Critical | Product database | Fetch + present data; never invent |
| **Recommendation** | 🔴 Critical | Product database + user input | Match user needs to products via tool |
| **Price inquiry** | 🔴 Critical | Product database | Always show current DB price |
| **Leasing Q&A** | 🟡 Important | Platform settings + leasing terms | Explain general terms; suggest application |
| **Delivery Q&A** | 🟡 Important | Platform settings | Static delivery info by region |
| **Warranty Q&A** | 🟡 Important | FAQ knowledge base | Standard answers |
| **Lead capture** | 🔴 Critical | User conversation | Detect intent, collect info progressively |
| **Order interest** | 🔴 Critical | Conversation context | Recognize buying signals, guide to cart/lead |
| **Comparison** | 🟡 Important | Product database | Fetch 2-3 products, present differences |
| **Fallback** | 🔴 Critical | None | Graceful failure + offer alternatives |

### What Chatbot Does NOT Do
- ❌ Process actual payments
- ❌ Modify existing orders
- ❌ Approve or process leasing applications
- ❌ Give drone piloting advice (safety liability)
- ❌ Discuss competitor pricing
- ❌ Negotiate prices or offer unauthorized discounts

---

## 3. Conversation Design

### Flow 1: Greeting

```
🤖: Сайн байна уу! 👋
    Би MongolDrone-ийн AI зөвлөх.
    Танд яаж туслах вэ?

    [Дрон хайх] [Үнэ мэдэх] [Лизинг] [Хүргэлт]

👤: Сайн уу

🤖: Сайн байна уу! Та ямар зорилгоор дрон авах 
    сонирхолтой байна вэ? Жишээ нь:
    
    📸 Зураг, видео бичлэг
    🏗️ Уул уурхай, барилгын хяналт  
    🌾 Хөдөө аж ахуй
    🎮 Хувийн хэрэглээ, хобби
    
    Эсвэл тодорхой бүтээгдэхүүний талаар асуух уу?
```

### Flow 2: Asking for Suitable Drone

```
👤: Хувийн хэрэглээнд дрон авмаар байна

🤖: Хувийн хэрэглээнд тохирох дронуудыг санал болгоё! 
    Хэдэн зүйл асууж болох уу? 😊

    Та ямар зорилгоор голчлон ашиглах вэ?
    [Зураг/Видео] [Аялал] [Спорт бичлэг] [Хобби]

👤: Аялалд видео бичлэг хийх

🤖: Маш сайн! Дахин нэг асуулт:
    Төсвийн хязгаар байна уу?
    [₮2 сая хүртэл] [₮2-5 сая] [₮5 сая+] [Хамаагүй]

👤: 2-5 сая

🤖: Танд тохирох дронуудыг шүүж байна...

    [calls search_products({purpose: "travel_video", min_price: 2000000, max_price: 5000000})]

    Таны хэрэгцээнд тохирох 3 дроныг санал болгоё:

    ┌──────────────────────────────────────┐
    │ [DJI Air 3]  [DJI Mini 4 Pro]  [+1] │  ← carousel
    │  ₮4,200,000   ₮2,800,000            │
    │  [Дэлгэрэнгүй] [Дэлгэрэнгүй]      │
    └──────────────────────────────────────┘

    🏆 Миний зөвлөмж: DJI Air 3
    ✅ 46 мин нислэгийн хугацаа
    ✅ 4K/60fps видео
    ✅ Аялалд тохиромжтой хэмжээ (720г)
    
    Аль нэгний талаар дэлгэрэнгүй мэдэх үү?
```

### Flow 3: Product Recommendation (Commercial)

```
👤: Уул уурхайн хяналтад ямар дрон тохирох вэ?

🤖: Уул уурхайн хяналтад мэргэжлийн зэргийн дрон хэрэгтэй.
    Голчлон ямар ажил хийх вэ?
    
    [Газрын зураглал] [Thermal хяналт] [Видео мониторинг] [Бүгд]

👤: Газрын зураглал, thermal хяналт хоёулаа хэрэгтэй

🤖: [calls search_products({category: "commercial", features: ["thermal", "mapping"]})]

    Thermal + газрын зураглалд тохирох дронууд:

    ┌──────────────────────────────────────────┐
    │ [DJI Matrice 350] [DJI Mavic 3T]  [+1]  │
    │  ₮18,500,000       ₮8,900,000           │
    │  [Дэлгэрэнгүй]    [Дэлгэрэнгүй]       │
    └──────────────────────────────────────────┘

    📋 Товч харьцуулалт:
    
    │ Шинж чанар      │ Matrice 350  │ Mavic 3T    │
    │ Thermal камер    │ H20T (640×512)│ 640×512    │
    │ Нислэгийн хугацаа│ 55 мин      │ 45 мин     │
    │ Салхины тэсвэр   │ 15 м/с      │ 12 м/с     │
    │ Үнэ             │ ₮18.5 сая   │ ₮8.9 сая   │
    
    💡 Matrice 350 нь илүү хүчирхэг, харин Mavic 3T 
    нь зөөж авч явахад илүү хялбар.
    
    Аль нь танд илүү тохирох вэ? Эсвэл лизингийн 
    нөхцлийг мэдэх үү?
```

### Flow 4: Product Comparison

```
👤: Mavic 3 Pro, Air 3 хоёрыг харьцуулаад өгөөч

🤖: [calls get_product_details("mavic-3-pro")]
    [calls get_product_details("air-3")]

    DJI Mavic 3 Pro vs DJI Air 3 харьцуулалт:

    │                  │ Mavic 3 Pro  │ Air 3       │
    │ Үнэ              │ ₮8,500,000  │ ₮4,200,000 │
    │ Камер            │ Hasselblad   │ 1/1.3" CMOS│
    │ Видео            │ 5.1K/50fps  │ 4K/60fps   │
    │ Нислэгийн хугацаа│ 43 мин      │ 46 мин     │
    │ Жин              │ 958 г       │ 720 г      │
    │ Зай              │ 28 км       │ 20 км      │
    │ Лизинг           │ ✅          │ ✅          │

    🎯 Хэн авах вэ:
    • Mavic 3 Pro → Мэргэжлийн видеограф, кино зураг авалт
    • Air 3 → Аялал, хобби, спорт бичлэг
    
    Аль нэгний талаар дэлгэрэнгүй мэдэх үү?
```

### Flow 5: Leasing Inquiry

```
👤: Лизингээр авч болох уу?

🤖: Тийм ээ! Манай лизингийн нөхцөл:

    📋 Ерөнхий нөхцөл:
    • Хугацаа: 3-24 сарын хооронд
    • Урьдчилгаа: Үнийн 20-30%
    • Бизнесийн бүртгэл шаардлагатай
    
    Ямар бүтээгдэхүүний лизингийн талаар мэдэх вэ?
    [Mavic 3 Pro] [Air 3] [Бусад]

👤: Mavic 3 Pro лизинг

🤖: [calls get_leasing_info("mavic-3-pro")]

    DJI Mavic 3 Pro — Лизингийн тооцоо:
    
    Бүтээгдэхүүний үнэ: ₮8,500,000
    
    │ Хугацаа │ Урьдчилгаа (20%) │ Сарын төлбөр │
    │ 6 сар   │ ₮1,700,000       │ ₮1,200,000  │
    │ 12 сар  │ ₮1,700,000       │ ₮620,000    │
    │ 24 сар  │ ₮1,700,000       │ ₮330,000    │
    
    📝 Лизингийн хүсэлт илгээх үү?
    [Хүсэлт илгээх] [Дэлгэрэнгүй мэдэх] [Менежертэй ярих]

👤: Хүсэлт илгээх

🤖: Лизингийн хүсэлтэнд дараах мэдээлэл хэрэгтэй:
    
    Таны нэрийг хэлнэ үү?

👤: Ганбаатар

🤖: Баярлалаа, Ганбаатар! 
    Утасны дугаараа хэлнэ үү?

👤: 99001122

🤖: Компанийн нэр (хувь хүн бол "хувь хүн" гэж бичнэ үү):

👤: Монгол Майнинг ХХК

🤖: [calls capture_lead({name: "Ганбаатар", phone: "99001122", 
     company: "Монгол Майнинг ХХК", interest: "DJI Mavic 3 Pro", 
     type: "leasing"})]

    ✅ Баярлалаа, Ганбаатар!
    
    Таны лизингийн хүсэлт амжилттай бүртгэгдлээ.
    Манай менежер 1-2 ажлын цагийн дотор 
    99001122 дугаарт холбогдоно.
    
    Өөр асуух зүйл байна уу?
```

### Flow 6: Delivery Inquiry

```
👤: Хүргэлт хэдэн өдөр болдог вэ?

🤖: [calls get_delivery_info()]

    🚚 Хүргэлтийн мэдээлэл:
    
    │ Бүс нутаг        │ Хугацаа    │ Хүргэлтийн хураамж │
    │ Улаанбаатар       │ 1-2 өдөр  │ ₮5,000            │
    │ Дархан, Эрдэнэт   │ 2-3 өдөр  │ ₮15,000           │
    │ Бусад аймаг       │ 3-7 өдөр  │ ₮25,000           │
    
    💡 ₮500,000-аас дээш захиалгад УБ хүргэлт ҮНЭГҮЙ!
    
    Та хаанаас захиалах вэ?
    [Улаанбаатар] [Хөдөө орон нутаг]
```

### Flow 7: Lead Capture (Natural)

```
👤: DJI Mavic 3 Pro үнэ хэд вэ?

🤖: [calls get_product_details("mavic-3-pro")]
    
    DJI Mavic 3 Pro-ийн үнэ ₮8,500,000 байна.
    
    ┌──────────────────────┐
    │ [DJI Mavic 3 Pro]    │
    │ ₮8,500,000           │
    │ ● Нөөцөд байгаа      │
    │ [Дэлгэрэнгүй →]     │
    └──────────────────────┘
    
    Авах сонирхолтой юу? 😊

👤: Тийм ээ авмаар байна

🤖: Маш сайн! 🎉 
    Та шууд вэбсайтаас захиалах боломжтой, эсвэл 
    манай менежер тантай холбогдож дэлгэрэнгүй 
    зөвлөгөө өгнө.
    
    [Вэбсайтаас захиалах] [Менежер холбогдоно]

👤: Менежер холбогдоно

🤖: Мэдээж! Нэрээ хэлнэ үү?

👤: Бат

🤖: Баярлалаа, Бат! Утасны дугаараа хэлнэ үү?

👤: 88119922

🤖: [calls capture_lead({name: "Бат", phone: "88119922", 
     interest: "DJI Mavic 3 Pro", type: "purchase"})]
     [triggers admin notification]
    
    ✅ Бүртгэгдлээ, Бат!
    Менежер ажлын цагаар 88119922 дугаарт холбогдоно.
    
    📞 Яаралтай бол: 7700-1234 руу залгана уу.
```

### Flow 8: Admin Escalation

```
👤: Миний захиалга хаана байгааг мэдэхгүй байна, 
    3 хоногоос хэтэрсэн

🤖: Уучлаарай, таны захиалга саатсанд харамсаж байна 😔
    Захиалгын дугаараа хэлж чадах уу?

👤: MND-20260328-0005

🤖: Баярлалаа. Захиалгын дэлгэрэнгүй мэдээллийг 
    шалгахын тулд менежертэй холбогдох хэрэгтэй.
    
    [calls escalate_to_human({
        reason: "delivery_delay", 
        order: "MND-20260328-0005",
        sentiment: "frustrated"
    })]
    
    🔄 Менежер рүү шилжүүлж байна...
    
    Таны асуудлыг менежер аль болох хурдан шийдвэрлэнэ.
    Ажлын цагаар (09:00-18:00) шууд хариу өгнө.
    
    📞 Яаралтай бол: 7700-1234
```

### Flow 9: Fallback / Unknown

```
👤: Монгол дахь дроны хууль эрхзүйн талаар хэлнэ үү

🤖: Энэ асуултад би бүрэн хариулах боломжгүй байна 😅
    
    Дроны журам, зохицуулалтын талаар Иргэний 
    нисэхийн ерөнхий газрын вэбсайтаас мэдээлэл 
    авах боломжтой.
    
    Харин би танд дараах зүйлсэд тусалж чадна:
    [Дрон хайх] [Үнэ мэдэх] [Лизинг] [Менежертэй ярих]

---

👤: asdfghjkl

🤖: Уучлаарай, ойлгосонгүй 😊
    Дараах сэдвүүдээр тусалж чадна:
    
    [Дрон хайх] [Үнэ мэдэх] [Лизинг] [Хүргэлт]
    
    Эсвэл менежертэй ярилцах уу? [Менежертэй ярих]
```

---

## 4. Product Carousel Behavior

### When to Show Carousel
| Trigger | Max Cards |
|---------|:---------:|
| User asks for recommendation (category/budget match) | 3-4 |
| User asks "ямар дрон байдаг вэ?" (what drones do you have) | 4-5 |
| User asks to compare products | 2-3 |
| Single product inquiry | 1 (single card) |
| "Хямдралтай дрон" (discounted drones) | 3-4 |

### Product Card Structure

```
┌─────────────────────────┐
│ [Product Image 16:9]    │
│                         │
│ DJI Mavic 3 Pro         │  ← name (bold)
│ Мэргэжлийн дрон         │  ← category (small, muted)
│                         │
│ ₮8,500,000              │  ← price (large, bold)
│ ₮9,200,000 (-8%)        │  ← compare price + discount (if applicable)
│                         │
│ ⏱ 43 мин · 📷 5.1K     │  ← 2 key specs (compact)
│ ● Нөөцөд байгаа        │  ← stock status
│                         │
│ [Дэлгэрэнгүй →]        │  ← CTA: opens product page
│ [🛒 Сагсанд]            │  ← CTA: add to cart (optional)
└─────────────────────────┘
```

### Card Fields Priority
1. **Always show**: Image, name, price, primary CTA
2. **Show if space**: 2 key specs, stock status, discount badge
3. **Never show in card**: Full description, all specs, leasing calculator

### CTA Buttons per Card
- **Primary**: "Дэлгэрэнгүй →" — opens product detail page in new context
- **Secondary** (optional): "🛒 Сагсанд" — adds to cart directly from chat
- For leasing-eligible: show "Лизинг ✓" badge on card, not as separate CTA

### Mobile UX
- Cards: **full-width horizontal scroll** with snap behavior
- Dot indicators showing current position
- Swipe gesture for navigation
- Card width: 280px on mobile (shows peek of next card)
- Tap entire card to navigate (not just CTA button)
- Image lazy-loaded, skeleton placeholder until ready

---

## 5. Lead Capture Logic

### Data Points to Collect

| Field | Required | When to Ask | How to Ask |
|-------|:--------:|-------------|------------|
| **Name** | ✅ | After user shows interest | "Нэрээ хэлнэ үү?" |
| **Phone** | ✅ | Right after name | "Утасны дугаараа хэлнэ үү?" |
| **Interested product** | ✅ | Auto-detected from context | Don't ask — infer from conversation |
| **City** | ❌ | Only if discusses delivery | "Та хаанаас захиалах вэ?" |
| **Budget** | ❌ | Only during recommendation flow | "Төсвийн хязгаар байна уу?" |
| **Use case** | ❌ | Only during recommendation flow | "Ямар зорилгоор ашиглах вэ?" |
| **Leasing interest** | ❌ | Only if user mentions | Auto-tagged if leasing discussed |
| **Company name** | ❌ | Only for leasing requests | "Компанийн нэрээ хэлнэ үү?" |

### Progressive Disclosure Strategy

```
Level 1 (Minimum — always collect):
    Name + Phone + Product interest (from context)
    → This is enough to create a lead

Level 2 (If user is engaged):
    + Use case + Budget
    → This helps sales team prioritize

Level 3 (Leasing only):
    + Company name + Registration number
    → Required for leasing application
```

### Rules to Keep Conversion High

1. **Never ask all fields at once** — one question per message
2. **Never ask for info already given** — if user said "Бат, 99119911" in one message, parse both
3. **Maximum 3 questions** to complete a lead — name, phone, and one qualifying question
4. **Always explain WHY** — "Менежер тантай холбогдохын тулд утасны дугаар хэрэгтэй"
5. **Offer alternatives** — "Вэбсайтаас шууд захиалах уу, эсвэл менежер тантай холбогдох уу?"
6. **Confirm at the end** — "✅ Бүртгэгдлээ! Менежер 1-2 цагт холбогдоно"
7. **Don't block browsing** — lead form is inline in chat, not a modal
8. **Don't ask if logged in** — auto-fill name/phone from profile if available

### Lead Qualification Signals (Auto-Detected)

| Signal | Score | Action |
|--------|:-----:|--------|
| Asked about a specific product price | +2 | Track as warm lead |
| Used "авмаар" / "авах" (want to buy) | +5 | Trigger lead capture |
| Asked about leasing | +4 | Tag as leasing lead, capture |
| Asked about multiple products | +3 | Track as comparing/serious |
| Returned visitor (has previous session) | +2 | Prioritize |
| Viewed 3+ products (page tracking) | +1 | Suggest assistance |

**Threshold**: Score ≥ 5 → initiate lead capture flow

---

## 6. Model Management Design

### Multi-Model Architecture

```
┌─────────────────────────────────────────┐
│  Admin Panel — Model Settings           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ● GPT-4o-mini    [DEFAULT] [ON]│    │
│  │ ○ GPT-4o                  [ON] │    │
│  │ ○ Claude 3.5 Haiku        [OFF]│    │
│  └─────────────────────────────────┘    │
│                                         │
│  Fallback model: GPT-4o-mini            │
│  Daily cost cap: $5.00                  │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Model Router                           │
│                                         │
│  1. Check if chatbot is enabled         │
│  2. Load default model config from DB   │
│  3. If default model fails → fallback   │
│  4. If fallback fails → static response │
│  5. Log model used per session          │
└─────────────────────────────────────────┘
```

### Model Selection Logic

```
Request comes in:
  │
  ├── Is chatbot enabled? 
  │   NO → return "Одоогоор чатбот ажиллахгүй байна"
  │
  ├── Load default active model
  │   │
  │   ├── Send to model API
  │   │   │
  │   │   ├── Success → return response
  │   │   │
  │   │   └── Failure (timeout/error) →
  │   │       │
  │   │       ├── Load fallback model
  │   │       │   │
  │   │       │   ├── Success → return response + log fallback event
  │   │       │   │
  │   │       │   └── Failure → return static fallback message
  │   │       │       "Уучлаарай, техникийн саатал гарлаа.
  │   │       │        Утсаар холбогдоно уу: 7700-1234"
  │   │       │
  │   │       └── Alert admin: "AI model down"
  │   │
  │   └── Daily cost exceeded →
  │       Switch to cheapest model + alert admin
```

### Admin Model Controls

| Control | Description |
|---------|-------------|
| **Set default** | Choose which model handles new sessions |
| **Enable/disable** | Toggle model availability |
| **Set fallback** | Choose fallback model (cannot be disabled) |
| **Edit config** | Temperature, max_tokens, top_p per model |
| **Cost monitoring** | Daily/monthly API cost tracking |
| **A/B testing** | Route % of traffic to different models (v2) |

### Per-Session Logging

Every session records:
- `model_id` — which model was used
- `total_tokens` — total tokens consumed
- `message_count` — number of exchanges
- `latency_ms` — average response time
- `fallback_used` — whether fallback was triggered

---

## 7. Knowledge & Response Strategy

### Response Source Hierarchy

```
User asks a question
  │
  ├── 1. Is this about a specific product?
  │   YES → call search_products / get_product_details
  │   → ONLY use returned database data
  │   → NEVER generate product info from AI memory
  │
  ├── 2. Is this a common FAQ?
  │   YES → match against FAQ entries in platform_settings
  │   → Return structured FAQ answer
  │   → Examples: warranty, return policy, delivery, payment methods
  │
  ├── 3. Is this about leasing terms?
  │   YES → call get_leasing_info
  │   → Use terms from platform_settings
  │   → Explain, calculate, but never approve
  │
  ├── 4. Is this general drone advice?
  │   YES → AI can generate general knowledge response
  │   → ADD disclaimer: "Дэлгэрэнгүй мэдээллийг менежерээс лавлана уу"
  │
  └── 5. Outside scope?
      YES → Graceful fallback + suggest alternatives
```

### Anti-Hallucination Rules

| Rule | Implementation |
|------|---------------|
| **Product data = database only** | All product tools return DB data; system prompt says "NEVER generate product details from your training data" |
| **Price = database only** | System prompt: "If the tool doesn't return a price, say 'Үнийн мэдээлэл одоогоор байхгүй байна'" |
| **Stock = database only** | Never say "available" without checking DB |
| **Leasing terms = settings only** | Never invent interest rates or monthly payments |
| **Delivery times = settings only** | Never promise specific delivery dates beyond configured ranges |
| **Specs = database only** | If a spec isn't in the database, say "Энэ мэдээлэл одоогоор байхгүй байна" |

### System Prompt Anti-Hallucination Block

```
ЧУХАЛ ДҮРМҮҮД:
1. Бүтээгдэхүүний нэр, үнэ, техникийн үзүүлэлт, нөөцийн 
   мэдээллийг ЗӨВХӨН tool-аас авсан мэдээллээр хариулна.
2. Tool дуудаагүй үед бүтээгдэхүүний талаар ярихгүй.
3. Хэрэв tool хариу ирэхгүй бол "Мэдээлэл олдсонгүй" гэж хэлнэ.
4. Үнийн хэлбэр: ₮X,XXX,XXX (Монгол төгрөгөөр).
5. Хэрэв итгэлтэй бус бол менежертэй холбогдохыг санал болго.
```

### When to Use Static vs AI Responses

| Question Type | Response Method | Example |
|--------------|-----------------|---------|
| "Үнэ хэд вэ?" | Tool call → database | Always dynamic |
| "Баталгааны хугацаа?" | Static FAQ | "Бүх бүтээгдэхүүнд 1 жилийн баталгаа" |
| "Хэзээ хүргэх вэ?" | Static settings | Delivery table from platform_settings |
| "Ямар дрон сайн вэ?" | AI + tool hybrid | AI interprets intent → tool fetches → AI recommends |
| "Монголд дрон нислэг зөвшөөрөлтэй юу?" | AI general knowledge + disclaimer | Brief answer + "Лавлах газар: ИНЕГ" |
| "Mavic 3 vs Air 3?" | Tool call × 2 → AI compares | Tools fetch both → AI creates comparison table |
