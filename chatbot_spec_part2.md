# 🤖 MongolDrone AI Chatbot — System Design (Part 2)
## Sections 8-12: Safety, Admin, Data, KPIs, MVP

---

## 8. Safety & Quality Rules

### Content Restrictions

| Category | Rule | Response When Triggered |
|----------|------|------------------------|
| **Product invention** | Never describe a product not in the database | "Энэ бүтээгдэхүүний мэдээлэл системд олдсонгүй" |
| **Price invention** | Never state a price without tool data | "Үнийн мэдээллийг менежерээс лавлана уу" |
| **Delivery promises** | Never promise exact dates | Use ranges from settings only |
| **Leasing approval** | Never imply pre-approval | "Хүсэлтийг хянасны дараа хариу өгнө" |
| **Discount promises** | Never offer unauthorized discounts | "Хямдралын мэдээллийг менежерээс лавлана уу" |
| **Competitor bashing** | Never criticize other brands/stores | Redirect to MongolDrone strengths |
| **Drone regulations** | Never give legal advice on flying | "ИНЕГ-ийн вэбсайтаас лавлана уу" |
| **Safety advice** | Never recommend unsafe flying practices | "Аюулгүй ажиллагааны зааврыг бүтээгдэхүүний гарын авлагаас харна уу" |

### Confidence Detection

```
High confidence (respond directly):
  - Product exists in DB, tool returned data
  - Question matches FAQ exactly
  - Straightforward greeting/thanks

Medium confidence (respond + qualify):
  - General drone advice → add "Дэлгэрэнгүй мэдээллийг менежерээс лавлана уу"
  - Partial product match → show closest results + "Та энийг хайж байна уу?"

Low confidence (escalate):
  - 3 consecutive turns where user says "Үгүй", "Тийм биш", "Ойлгосонгүй"
  - Complex multi-part questions
  - Angry tone detected (repeated punctuation, negative phrases)
  → Offer: "Менежертэй ярилцах уу?"
```

### Response Quality Guidelines

| Guideline | Details |
|-----------|---------|
| **Max length** | 3-4 short paragraphs per response; prefer structured data (tables, lists) |
| **Tone** | Professional but warm; use 😊👋🎉 sparingly (max 1-2 per message) |
| **Language** | 100% Mongolian; technical terms like "DJI" stay in English |
| **Currency** | Always ₮X,XXX,XXX format with comma separators |
| **Avoid** | Repetitive intros ("Мэдээж!", "Тийм ээ!") — vary openers |
| **Quick replies** | Always end with actionable options or next-step buttons |
| **No walls of text** | If response would be >5 paragraphs, split with a "Дэлгэрэнгүй мэдэх үү?" prompt |

### Prohibited Topics

The chatbot must immediately decline and redirect if asked about:
- Political topics
- Personal financial advice (beyond leasing info)
- Medical/health uses of drones
- Military or surveillance applications
- Hacking or circumventing drone restrictions
- Other stores' pricing or inventory

Response: "Энэ сэдвийн талаар туслах боломжгүй. Дроны бүтээгдэхүүн, үнэ, лизинг, хүргэлтийн талаар туслах уу?"

---

## 9. Admin-Facing Chatbot Controls

### 9.1 Model Settings Page

```
┌──────────────────────────────────────────────┐
│  AI Модель тохиргоо                          │
├──────────────────────────────────────────────┤
│                                              │
│  Чатбот идэвхтэй: [🟢 ON]                   │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ Модель          Төлөв    Үйлдэл     │    │
│  │ GPT-4o-mini     🟢 ON    [DEFAULT]   │    │
│  │ GPT-4o          🟢 ON    [Set default]│    │
│  │ Claude Haiku    🔴 OFF   [Enable]    │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Нөөц модель: GPT-4o-mini                   │
│  Өдрийн зардлын хязгаар: $[5.00]            │
│                                              │
│  ── Идэвхтэй модельийн тохиргоо ──          │
│  Temperature:     [0.7] ──●──────            │
│  Max tokens:      [2048]                     │
│  Top P:           [0.9]                      │
│                                              │
│  [Хадгалах]                                  │
└──────────────────────────────────────────────┘
```

### 9.2 Prompt Settings Page

```
┌──────────────────────────────────────────────┐
│  Системийн промпт тохиргоо                    │
├──────────────────────────────────────────────┤
│                                              │
│  Идэвхтэй промпт хувилбар: v3                │
│  Сүүлд өөрчилсөн: 2026-03-30, Админ          │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │ Та бол MongolDrone компанийн AI     │    │
│  │ туслах юм. Таны үүрэг бол:         │    │
│  │ - Дроны бүтээгдэхүүний мэдээлэл өгөх│    │
│  │ - Зөвлөгөө өгөх                    │    │
│  │ - Захиалга хийхэд туслах           │    │
│  │ ...                                 │    │
│  │ (editable textarea, 500+ lines)     │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Угтах мессеж:                                │
│  [Сайн байна уу! 👋 Би MongolDrone-ийн...]   │
│                                              │
│  Түргэн хариулт товчлуурууд:                  │
│  [Дрон хайх] [×] [Үнэ мэдэх] [×]            │
│  [Лизинг] [×] [Хүргэлт] [×]                 │
│  [+ Нэмэх]                                   │
│                                              │
│  [Тест хийх ↗] [Хадгалах]                    │
└──────────────────────────────────────────────┘
```

### 9.3 Lead Inbox

```
┌────────────────────────────────────────────────────────┐
│  Лидүүд (Chatbot)                    Шүүлтүүр [▼]     │
├────────────────────────────────────────────────────────┤
│ Шинэ (8) │ Холбогдсон (12) │ Чанартай (5) │ Бүгд (31)│
├────────────────────────────────────────────────────────┤
│                                                        │
│  🟢 Бат · 88119922                          5 мин өмнө│
│  DJI Mavic 3 Pro · Худалдан авах                      │
│  [Холбогдсон ✓] [Чатын түүх →]                        │
│                                                        │
│  🟢 Ганбаатар · 99001122                   1 цаг өмнө│
│  DJI Mavic 3 Pro · Лизинг · Монгол Майнинг ХХК       │
│  [Холбогдсон ✓] [Чатын түүх →]                        │
│                                                        │
│  🟡 Сараа · 95551234                       3 цаг өмнө│
│  DJI Mini 4 Pro · Худалдан авах                       │
│  [Холбогдох] [Чатын түүх →]                           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 9.4 Conversation Review

```
┌────────────────────────────────────────────────────────┐
│  Чатбот ярилцлагууд                                    │
├────────────────────────────────────────────────────────┤
│ Шүүлтүүр: [Огноо ▼] [Лид ✓] [Эскалаци ▼] [Модель ▼] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Session #a1b2c3 · Өнөөдөр 14:32 · 8 мессеж          │
│  Модель: GPT-4o-mini · Токен: 1,240 · 🟢 Лид авсан   │
│  [Дэлгэрэнгүй →]                                     │
│                                                        │
│  Session #d4e5f6 · Өнөөдөр 13:15 · 12 мессеж         │
│  Модель: GPT-4o-mini · Токен: 2,100 · 🔴 Эскалаци    │
│  [Дэлгэрэнгүй →]                                     │
│                                                        │
│  Session #g7h8i9 · Өчигдөр 17:45 · 4 мессеж          │
│  Модель: GPT-4o · Токен: 890 · ⚪ Ердийн              │
│  [Дэлгэрэнгүй →]                                     │
└────────────────────────────────────────────────────────┘
```

**Session detail view** shows full conversation transcript with:
- Each message with timestamp
- Tool calls highlighted (which tools were used, what data returned)
- Lead data captured (if any)
- Model used and token counts
- Escalation event (if any)

### 9.5 Notification Triggers (Chatbot → Admin)

| Event | Channel | Recipient | Content |
|-------|---------|-----------|---------|
| New lead captured | Telegram + In-app | sales_manager | "🟢 Шинэ лид: Бат (88119922) — DJI Mavic 3 Pro" |
| Escalation requested | Telegram + In-app | support_manager | "🔴 Эскалаци: Захиалгын асуудал — MND-20260328-0005" |
| Daily cost limit 80% | Telegram | admin | "⚠️ Чатбот зардал $4.00/$5.00 — өдрийн хязгаарт ойртож байна" |
| AI model failure | Telegram | admin | "🚨 GPT-4o алдаа — нөөц модель руу шилжлээ" |
| High escalation rate (>20% today) | Telegram | admin | "📊 Өнөөдрийн эскалацийн түвшин 25% — промптыг шалгана уу" |

---

## 10. Backend Data Structures

### `chat_sessions`

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID (PK) | Session identifier |
| user_id | UUID (FK → profiles, nullable) | Logged-in user |
| visitor_id | TEXT | Anonymous fingerprint |
| status | TEXT | 'active', 'closed', 'escalated' |
| model_id | UUID (FK → chat_models) | Model used |
| total_tokens | INT | Total tokens consumed |
| message_count | INT | Number of exchanges |
| avg_latency_ms | INT | Average response time |
| source_page | TEXT | URL where chat started |
| lead_captured | BOOLEAN | Whether a lead was captured |
| escalated | BOOLEAN | Whether escalation occurred |
| created_at | TIMESTAMPTZ | Session start |
| closed_at | TIMESTAMPTZ | Session end |

### `chat_messages`

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID (PK) | Message ID |
| session_id | UUID (FK) | Parent session |
| role | TEXT | 'user', 'assistant', 'system', 'tool' |
| content | TEXT | Message text |
| rich_content | JSONB | `{type: "product_carousel", products: [...]}` |
| tool_calls | JSONB | `[{name: "search_products", args: {...}, result: {...}}]` |
| tokens_input | INT | Input tokens for this turn |
| tokens_output | INT | Output tokens for this turn |
| latency_ms | INT | Time to generate response |
| created_at | TIMESTAMPTZ | Timestamp |

### `chat_leads`

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID (PK) | Lead ID |
| session_id | UUID (FK) | Source session |
| user_id | UUID (FK, nullable) | If user was logged in |
| name | TEXT | Customer name |
| phone | TEXT | Phone (required) |
| email | TEXT | Email (optional) |
| interest | TEXT | Product/topic interest description |
| product_id | UUID (FK, nullable) | Specific product if identified |
| lead_type | TEXT | 'purchase', 'leasing', 'inquiry', 'support' |
| status | TEXT | 'new', 'contacted', 'qualified', 'converted', 'lost' |
| score | INT | Lead qualification score (auto-calculated) |
| assigned_to | UUID (FK, nullable) | Assigned sales manager |
| admin_notes | TEXT | Internal notes |
| contacted_at | TIMESTAMPTZ | When first contacted |
| converted_at | TIMESTAMPTZ | When converted to order |
| created_at | TIMESTAMPTZ | Lead creation time |

### `chat_models`

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID (PK) | Model ID |
| provider | TEXT | 'openai', 'anthropic' |
| model_name | TEXT | API model name: 'gpt-4o-mini' |
| display_name | TEXT | UI name: 'GPT-4o Mini — Хурдан' |
| is_active | BOOLEAN | Can be selected |
| is_default | BOOLEAN | Currently active model (one only) |
| is_fallback | BOOLEAN | Used when default fails |
| config | JSONB | `{temperature, max_tokens, top_p}` |
| cost_input_per_1k | NUMERIC | Cost tracking |
| cost_output_per_1k | NUMERIC | Cost tracking |
| created_at | TIMESTAMPTZ | — |

### `chat_settings`

| Key | Value Type | Example |
|-----|-----------|---------|
| `enabled` | boolean | `true` |
| `system_prompt` | string | Full Mongolian system prompt |
| `system_prompt_version` | number | `3` |
| `welcome_message` | string | "Сайн байна уу! 👋..." |
| `quick_replies` | string[] | `["Дрон хайх", "Үнэ мэдэх", ...]` |
| `max_tokens_per_session` | number | `8000` |
| `max_messages_per_session` | number | `50` |
| `lead_capture_threshold` | number | `5` (score to trigger) |
| `daily_cost_limit` | number | `5.00` (USD) |
| `escalation_auto_message` | string | "Менежер рүү шилжүүлж байна..." |
| `offline_message` | string | "Одоогоор чатбот ажиллахгүй..." |

### `escalation_events`

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID (PK) | Event ID |
| session_id | UUID (FK) | Source session |
| reason | TEXT | 'user_requested', 'low_confidence', 'frustrated', 'complex_query', 'complaint' |
| description | TEXT | AI's summary of why escalated |
| context_summary | TEXT | Last 5 messages summarized |
| order_reference | TEXT | Related order number (if applicable) |
| status | TEXT | 'pending', 'assigned', 'resolved', 'expired' |
| assigned_to | UUID (FK, nullable) | Support manager |
| resolved_at | TIMESTAMPTZ | When resolved |
| resolution_notes | TEXT | How it was resolved |
| created_at | TIMESTAMPTZ | When escalated |

---

## 11. KPI / Success Metrics

### Primary KPIs

| KPI | Definition | Target | Measurement |
|-----|-----------|:------:|-------------|
| **Chat-to-lead rate** | Sessions resulting in lead capture / total sessions | >15% | `leads_captured / total_sessions` |
| **Product click-through** | Product card clicks / product cards shown | >30% | Track `rich_content` clicks |
| **Lead completion rate** | Completed leads / lead capture initiated | >70% | Started vs submitted leads |
| **Escalation rate** | Escalated sessions / total sessions | <10% | `escalated_sessions / total_sessions` |
| **Unanswered rate** | Fallback responses / total responses | <5% | Track fallback tool usage |

### Secondary KPIs

| KPI | Definition | Target |
|-----|-----------|:------:|
| **Avg messages per session** | Total messages / sessions | 4-8 (sweet spot) |
| **Avg response time** | Mean latency_ms | <3s |
| **Return visitor rate** | Users with 2+ sessions | >20% |
| **Lead-to-sale conversion** | Converted leads / total leads | >8% |
| **Cost per lead** | API cost / leads captured | <$0.30 |
| **Model fallback rate** | Fallback events / total requests | <2% |

### Dashboard Widgets (Admin)

```
┌─────────────────────────────────────────────┐
│  Чатбот статистик · Өнөөдөр                  │
├──────┬──────┬──────┬──────┬──────┐          │
│  45  │  8   │  3   │  2   │ $1.20│          │
│ Чат  │ Лид  │ Эск  │ Борл │Зардал│          │
│ 17.8%│ 6.7% │      │      │      │          │
└──────┴──────┴──────┴──────┴──────┘          │
│                                              │
│  📈 7 хоногийн чат-лид хувиарлалт           │
│  [Line chart: sessions vs leads over time]   │
│                                              │
│  🏆 Их хайгдсан бүтээгдэхүүн:              │
│  1. DJI Mavic 3 Pro (23 удаа)               │
│  2. DJI Mini 4 Pro (18 удаа)               │
│  3. DJI Air 3 (12 удаа)                    │
│                                              │
│  ❓ Хариулж чадаагүй асуултууд:             │
│  • "Дроны даатгал байдаг уу?" (4 удаа)     │
│  • "Хуучин дрон солилцох боломжтой юу" (3)  │
└──────────────────────────────────────────────┘
```

### Weekly Review Process
1. Review top 10 unanswered questions → add to FAQ or system prompt
2. Review escalated conversations → identify prompt improvement opportunities
3. Check cost per lead trend → switch models if needed
4. Review lead quality with sales team → adjust lead scoring

---

## 12. MVP Chatbot Scope

### ✅ Must-Have (Launch)

| Feature | Details |
|---------|---------|
| **Chat widget** | Floating button, expandable panel, mobile fullscreen |
| **Mongolian greeting** | Welcome message + 4 quick reply buttons |
| **Product search tool** | `search_products` — search by name, category, budget |
| **Product detail tool** | `get_product_details` — fetch single product info |
| **Single product card** | Display one product as rich card in chat |
| **Price inquiry** | Answer "хэд вэ?" using database |
| **Lead capture** | Name + phone collection with intent detection |
| **Admin notification** | Telegram notification on new lead |
| **Fallback handling** | Graceful "I don't know" + quick reply options |
| **Conversation logging** | All messages stored in `chat_messages` |
| **Session management** | Create/close sessions, logged-in user association |
| **One model (GPT-4o-mini)** | Single model, configured in settings |
| **Streaming responses** | Token-by-token display for natural feel |
| **Basic admin: chat logs** | View conversation transcripts |
| **Basic admin: lead list** | View and manage captured leads |

### 📋 Should-Have (v1.1, weeks 9-12)

| Feature | Details |
|---------|---------|
| **Product carousel** | Multiple cards in horizontal scroll |
| **Delivery info tool** | `get_delivery_info` — cost and timeline by region |
| **Leasing info tool** | `get_leasing_info` — terms and calculator |
| **Human escalation** | Full escalation flow with admin assignment |
| **Model selection** | Multiple models, admin can switch default |
| **Model fallback** | Auto-fallback when primary model fails |
| **Lead scoring** | Auto-score based on conversation signals |
| **Admin: model settings** | Enable/disable, set default, configure |
| **Admin: prompt editor** | Edit system prompt from UI |
| **Quick reply context** | Page-aware quick replies (product page shows "Энэ дроны талаар") |
| **Comparison tool** | Compare 2-3 products side by side in chat |

### 🔮 Later Phase (v2+)

| Feature | Details |
|---------|---------|
| A/B model testing | Route % traffic to different models |
| Conversation analytics dashboard | Full KPI tracking |
| FAQ auto-learning | Detect common unanswered questions |
| Voice input | Mongolian speech-to-text |
| Facebook Messenger integration | Multi-channel chatbot |
| Order status tool | Check order status from chat |
| Proactive engagement | Smart triggers based on user behavior |
| Chat handoff | Live admin chat takeover with full context |
| Sentiment analysis | Track customer satisfaction per session |
| Fine-tuned model | Custom Mongolian drone sales model |

---

## Recommended Chatbot MVP Summary

**Build in 2 weeks** (parallel with website development):

```
Week 1:
├── Chatbot service setup (Node.js + Express/Fastify)
├── OpenAI integration with streaming (GPT-4o-mini)
├── System prompt in Mongolian (v1)
├── Tool: search_products
├── Tool: get_product_details
├── Chat widget component (React)
├── Session + message DB tables
└── Basic conversation flow

Week 2:
├── Lead capture tool + detection logic
├── Single product card rendering
├── Telegram notification on lead capture
├── Fallback handling
├── Admin: conversation log viewer
├── Admin: lead inbox
├── Mobile fullscreen chat UX
└── Testing with real Mongolian conversations
```

**Critical success factors:**
1. System prompt quality — spend real time on Mongolian natural language
2. Tool-only product data — never let AI hallucinate specs/prices
3. Lead capture timing — not too early, not too late (score ≥ 5)
4. Telegram notifications — admin must get leads instantly on mobile
5. Mobile UX — 80%+ of users will chat on phone
