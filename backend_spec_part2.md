# 🗄️ MongolDrone — Backend Specification (Part 2)
## REST API Design + Example Payloads

---

## 4. REST API Design

### Base URL: `/api/v1`

### 4.1 Auth

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/auth/facebook` | Initiate Facebook OAuth | None |
| GET | `/auth/callback` | OAuth callback handler | None |
| POST | `/auth/login` | Admin email/password login | None |
| POST | `/auth/logout` | Logout, clear session | User |
| GET | `/auth/me` | Get current user profile | User |
| PUT | `/auth/me` | Update own profile | User |

### 4.2 Products (Public)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/products` | List products (paginated, filterable) | None |
| GET | `/products/:slug` | Product detail by slug | None |
| GET | `/products/search?q=` | Full-text search | None |
| GET | `/products/featured` | Featured products | None |
| GET | `/categories` | List active categories | None |
| GET | `/categories/:slug` | Category with products | None |
| GET | `/brands` | List active brands | None |

**Query params for `GET /products`:**
```
?category=commercial-drones
&brand=dji
&min_price=1000000
&max_price=10000000
&is_leasable=true
&in_stock=true
&sort=price_asc|price_desc|newest|popular
&page=1
&limit=12
```

### 4.3 Cart

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/cart` | Get current cart | User* |
| POST | `/cart/items` | Add item to cart | User* |
| PUT | `/cart/items/:id` | Update quantity | User* |
| DELETE | `/cart/items/:id` | Remove item | User* |
| POST | `/cart/merge` | Merge anonymous cart on login | User |
| DELETE | `/cart` | Clear entire cart | User* |

*User or session-based for anonymous carts

### 4.4 Checkout & Orders

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/checkout` | Create order from cart | User |
| GET | `/orders` | List my orders | User |
| GET | `/orders/:id` | Order detail | User |
| POST | `/orders/:id/cancel` | Cancel own pending order | User |

### 4.5 Payments

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/payments/qpay/create` | Create QPay invoice | User |
| POST | `/payments/qpay/check/:id` | Manual status check | User |
| POST | `/payments/qpay/callback` | QPay webhook | Webhook |
| POST | `/payments/socialpay/create` | Create SocialPay invoice | User |
| POST | `/payments/socialpay/callback` | SocialPay webhook | Webhook |
| POST | `/payments/bank-transfer/upload` | Upload bank receipt | User |

### 4.6 Leasing

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/leasing/requests` | Submit leasing application | User |
| GET | `/leasing/requests` | List my leasing requests | User |
| GET | `/leasing/requests/:id` | Request detail | User |
| POST | `/leasing/requests/:id/documents` | Upload documents | User |
| GET | `/leasing/calculator` | Calculate monthly payment | None |

### 4.7 Chatbot

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/chatbot/sessions` | Start new session | None* |
| POST | `/chatbot/sessions/:id/messages` | Send message (returns streamed response) | None* |
| GET | `/chatbot/sessions/:id/messages` | Get session history | None* |
| POST | `/chatbot/sessions/:id/close` | Close session | None* |

*Accepts user_id if logged in, visitor_id if anonymous

### 4.8 Notifications

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/notifications` | List my notifications | User |
| PUT | `/notifications/:id/read` | Mark as read | User |
| PUT | `/notifications/read-all` | Mark all as read | User |
| GET | `/notifications/unread-count` | Unread count | User |

### 4.9 Admin — Products

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/products` | List all products (inc. drafts) | Admin+ |
| POST | `/admin/products` | Create product | ContentMgr+ |
| PUT | `/admin/products/:id` | Update product | ContentMgr+ |
| DELETE | `/admin/products/:id` | Archive product (soft delete) | Admin+ |
| POST | `/admin/products/:id/images` | Upload images | ContentMgr+ |
| DELETE | `/admin/products/:id/images/:imgId` | Delete image | ContentMgr+ |
| PUT | `/admin/products/bulk-status` | Bulk status change | Admin+ |
| POST | `/admin/categories` | Create category | ContentMgr+ |
| PUT | `/admin/categories/:id` | Update category | ContentMgr+ |
| DELETE | `/admin/categories/:id` | Delete category | Admin+ |

### 4.10 Admin — Orders

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/orders` | List all orders (filterable) | SalesMgr+ |
| GET | `/admin/orders/:id` | Order detail with full history | SalesMgr+ |
| PUT | `/admin/orders/:id/status` | Update order status | SalesMgr+ |
| PUT | `/admin/orders/:id/assign` | Assign to sales manager | Admin+ |
| POST | `/admin/orders/:id/notes` | Add admin note | SalesMgr+ |
| GET | `/admin/orders/export` | Export orders CSV | Admin+ |

### 4.11 Admin — Deliveries

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/deliveries` | List deliveries | SalesMgr+ |
| PUT | `/admin/deliveries/:id` | Update delivery status/tracking | SalesMgr+ |

### 4.12 Admin — Leasing

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/leasing` | List all requests | SalesMgr+ |
| GET | `/admin/leasing/:id` | Full request detail | SalesMgr+ |
| PUT | `/admin/leasing/:id/status` | Approve/reject | Admin+ |
| PUT | `/admin/leasing/:id/assign` | Assign reviewer | Admin+ |

### 4.13 Admin — Customers

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/customers` | List customers | SalesMgr+ |
| GET | `/admin/customers/:id` | Customer detail (orders, chats, leads) | SalesMgr+ |
| PUT | `/admin/customers/:id` | Update customer notes | SalesMgr+ |

### 4.14 Admin — Chatbot

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/chatbot/sessions` | List all chat sessions | SupportMgr+ |
| GET | `/admin/chatbot/sessions/:id` | Full conversation log | SupportMgr+ |
| GET | `/admin/chatbot/leads` | List all captured leads | SalesMgr+ |
| PUT | `/admin/chatbot/leads/:id` | Update lead status | SalesMgr+ |
| GET | `/admin/chatbot/stats` | Chatbot analytics | Admin+ |

### 4.15 Admin — Models & Settings

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/chatbot/models` | List available models | SupportMgr+ |
| PUT | `/admin/chatbot/models/:id` | Update model config | Admin+ |
| PUT | `/admin/chatbot/models/:id/default` | Set as default model | Admin+ |
| PUT | `/admin/chatbot/models/:id/toggle` | Enable/disable model | Admin+ |
| GET | `/admin/chatbot/settings` | Get all chatbot settings | SupportMgr+ |
| PUT | `/admin/chatbot/settings` | Update chatbot settings | Admin+ |

### 4.16 Admin — Dashboard

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/dashboard/stats` | KPI summary | Admin+ |
| GET | `/admin/dashboard/revenue` | Revenue chart data | Admin+ |
| GET | `/admin/dashboard/top-products` | Best selling products | Admin+ |
| GET | `/admin/dashboard/recent-orders` | Latest orders | SalesMgr+ |

### 4.17 Admin — Users & Settings

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/admin/users` | List admin users | SuperAdmin |
| POST | `/admin/users` | Create admin user | SuperAdmin |
| PUT | `/admin/users/:id/role` | Change user role | SuperAdmin |
| PUT | `/admin/users/:id/active` | Enable/disable user | SuperAdmin |
| GET | `/admin/settings` | Platform settings | Admin+ |
| PUT | `/admin/settings/:key` | Update setting | Admin+ |
| GET | `/admin/audit-logs` | View audit trail | SuperAdmin |

---

## 5. Example Request/Response Shapes

### Product Detail Response
```json
// GET /api/v1/products/dji-mavic-3-pro
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "DJI-M3P-001",
  "name_mn": "DJI Mavic 3 Pro",
  "slug": "dji-mavic-3-pro",
  "short_desc_mn": "Hasselblad камертай мэргэжлийн дрон",
  "description_mn": "DJI Mavic 3 Pro нь гурван камертай...",
  "price": 8500000,
  "compare_price": 9200000,
  "currency": "MNT",
  "stock_qty": 5,
  "is_leasable": true,
  "is_featured": true,
  "status": "active",
  "category": {
    "id": "...",
    "name_mn": "Мэргэжлийн дрон",
    "slug": "commercial-drones"
  },
  "brand": {
    "id": "...",
    "name": "DJI",
    "logo_url": "https://storage.../dji-logo.png"
  },
  "images": [
    { "id": "...", "url": "https://storage.../mavic3-1.webp", "is_thumbnail": true, "sort_order": 0 },
    { "id": "...", "url": "https://storage.../mavic3-2.webp", "is_thumbnail": false, "sort_order": 1 }
  ],
  "specs": [
    { "group_name": "Нислэг", "label_mn": "Нислэгийн хугацаа", "value": "43 мин" },
    { "group_name": "Нислэг", "label_mn": "Хамгийн их зай", "value": "28 км" },
    { "group_name": "Камер", "label_mn": "Камерын нягтрал", "value": "20 MP Hasselblad" },
    { "group_name": "Камер", "label_mn": "Видео", "value": "5.1K/50fps" },
    { "group_name": "Ерөнхий", "label_mn": "Жин", "value": "958 г" }
  ],
  "tags": ["professional", "hasselblad", "4k"],
  "view_count": 342
}
```

### Create Order
```json
// POST /api/v1/checkout
// Request:
{
  "address_id": "addr-uuid-here",
  "contact_name": "Батболд",
  "contact_phone": "+97699119911",
  "payment_method": "qpay",
  "notes": "Оффис руу хүргэнэ үү",
  "shipping_method": "standard"
}

// Response:
{
  "order": {
    "id": "order-uuid",
    "order_number": "MND-20260401-0003",
    "status": "pending",
    "total": 8505000,
    "items": [
      { "product_name": "DJI Mavic 3 Pro", "quantity": 1, "unit_price": 8500000 }
    ],
    "shipping_cost": 5000
  },
  "payment": {
    "id": "payment-uuid",
    "method": "qpay",
    "status": "pending",
    "invoice_url": "https://qpay.mn/invoice/...",
    "qr_code": "data:image/png;base64,...",
    "expires_at": "2026-04-01T03:00:00Z"
  }
}
```

### Create Leasing Request
```json
// POST /api/v1/leasing/requests
{
  "product_id": "product-uuid",
  "contact_name": "Ганбаатар",
  "contact_phone": "+97688001234",
  "contact_email": "ganbaatar@company.mn",
  "company_name": "Монгол Майнинг ХХК",
  "register_number": "5012345",
  "requested_months": 12,
  "monthly_budget": 800000,
  "purpose": "Уул уурхайн хяналт, судалгааны ажилд ашиглана"
}

// Response:
{
  "id": "leasing-uuid",
  "request_number": "LSR-20260401-0001",
  "status": "submitted",
  "product": { "name_mn": "DJI Mavic 3 Pro", "price": 8500000 },
  "requested_months": 12,
  "estimated_monthly": 780000,
  "message": "Таны хүсэлт амжилттай хүлээн авлаа. 1-2 ажлын өдөрт хариу өгнө."
}
```

### Chatbot Lead Creation
```json
// POST /api/v1/chatbot/sessions/:id/messages
// (Lead is captured via tool calling, not direct API)
// Internal tool call result stored:
{
  "tool_call": {
    "name": "capture_lead",
    "arguments": {
      "name": "Бат",
      "phone": "99119911",
      "interest": "DJI Mavic 3 Pro",
      "product_id": "product-uuid"
    },
    "result": {
      "lead_id": "lead-uuid",
      "status": "new",
      "notification_sent": true
    }
  }
}
```

### Admin Order Status Update
```json
// PUT /api/v1/admin/orders/:id/status
{
  "status": "confirmed",
  "note": "QPay төлбөр баталгаажлаа"
}

// Response:
{
  "id": "order-uuid",
  "order_number": "MND-20260401-0003",
  "status": "confirmed",
  "previous_status": "pending",
  "updated_at": "2026-04-01T10:30:00Z",
  "status_history": [
    { "status": "pending", "changed_at": "2026-04-01T10:00:00Z", "note": null },
    { "status": "confirmed", "changed_at": "2026-04-01T10:30:00Z", "note": "QPay төлбөр баталгаажлаа", "changed_by": "Админ" }
  ]
}
```

### Chatbot Model Switch
```json
// PUT /api/v1/admin/chatbot/models/:id/default
// Request: (no body needed, model ID is in URL)

// Response:
{
  "id": "model-uuid",
  "model_name": "gpt-4o",
  "display_name": "GPT-4o — Чанартай",
  "is_default": true,
  "is_active": true,
  "config": { "temperature": 0.5, "max_tokens": 4096 },
  "previous_default": {
    "id": "other-model-uuid",
    "model_name": "gpt-4o-mini"
  },
  "message": "Идэвхтэй модель амжилттай солигдлоо"
}
```
