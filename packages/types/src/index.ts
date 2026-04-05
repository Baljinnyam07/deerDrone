export type PaymentMethod = "qpay" | "bank_transfer";
export type ProductStatus = "draft" | "active" | "archived";
export type OrderStatus =
  | "pending"
  | "paid"
  | "confirmed"
  | "packing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type LeadStatus = "new" | "qualified" | "contacted" | "closed";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  story: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isThumbnail?: boolean;
}

export interface ProductSpec {
  group: string;
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  price: number;
  comparePrice?: number;
  currency: "MNT";
  stockQty: number;
  isLeasable: boolean;
  isFeatured: boolean;
  status: ProductStatus;
  heroNote: string;
  tags: string[];
  images: ProductImage[];
  specs: ProductSpec[];
}

export interface CartLineInput {
  productId: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface ShippingAddress {
  city: string;
  district?: string;
  khoroo?: string;
  line1: string;
  note?: string;
}

export interface CheckoutPayload {
  contactName: string;
  contactPhone: string;
  paymentMethod: PaymentMethod;
  shippingMethod: "ub" | "rural";
  shippingAddress: ShippingAddress;
  notes?: string;
  items: CartLineInput[];
}

export interface PaymentIntent {
  method: PaymentMethod;
  invoiceUrl?: string;
  qrCode?: string;
  accountName?: string;
  accountNumber?: string;
  reference?: string;
  expiresAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  source: "web" | "chatbot" | "admin";
  shippingAddress: ShippingAddress;
  shippingCost: number;
  total: number;
  items: OrderItem[];
}

export interface CheckoutResponse {
  order: Order;
  payment: PaymentIntent;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  quote: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  hint: string;
  tone: "neutral" | "accent" | "success" | "warning";
}

export interface ChatCardProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  heroNote: string;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
  createdAt: string;
  cards?: ChatCardProduct[];
}

export interface ChatLead {
  id: string;
  name: string;
  phone: string;
  interest: string;
  status: LeadStatus;
  sourcePage: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  visitorId: string;
  status: "active" | "closed";
  modelUsed: "gpt-4o-mini";
  messages: ChatMessage[];
}

export interface DeliveryQuote {
  zone: "ub" | "rural";
  fee: number;
  eta: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  sourcePage?: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  cards?: ChatCardProduct[];
  lead?: Partial<ChatLead>;
}
