import type {
  CartItem,
  CheckoutPayload,
  DeliveryQuote,
  Order,
  OrderItem,
  Product,
} from "@deer-drone/types";

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("mn-MN", {
    maximumFractionDigits: 0,
  }).format(value) + "₮";
}

export function formatCompactMoney(value: number): string {
  return new Intl.NumberFormat("mn-MN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function calculateLeaseEstimate(price: number, months: number): number {
  const monthlyRate = 0.018;
  return Math.round((price * (1 + monthlyRate * months)) / months);
}

export function getDeliveryQuote(zone: "ub" | "rural"): DeliveryQuote {
  if (zone === "rural") {
    return { zone, fee: 15000, eta: "3-5 хоног" };
  }

  return { zone, fee: 5000, eta: "1-2 хоног" };
}

export function filterProducts(
  list: Product[],
  query?: string,
  category?: string,
): Product[] {
  const normalizedQuery = query?.trim().toLowerCase();

  return list.filter((product) => {
    const matchesQuery =
      !normalizedQuery ||
      [
        product.name,
        product.brand,
        product.shortDescription,
        product.description,
        product.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesCategory = !category || product.categorySlug === category;

    return matchesQuery && matchesCategory && product.status === "active";
  });
}

export function pickFeaturedProducts(list: Product[], count = 4): Product[] {
  return list.filter((product) => product.isFeatured).slice(0, count);
}

export function getProductBySlug(list: Product[], slug: string): Product | undefined {
  return list.find((product) => product.slug === slug);
}

export function createOrderNumber(sequence: number, date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const suffix = String(sequence).padStart(4, "0");

  return `MND-${year}${month}${day}-${suffix}`;
}

export function buildCartItems(products: Product[], items: CheckoutPayload["items"]): CartItem[] {
  return items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);

    if (!product) {
      return [];
    }

    return [
      {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      },
    ];
  });
}

export function buildOrderFromCheckout(
  payload: CheckoutPayload,
  catalog: Product[],
  sequence: number,
): Order {
  const cartItems = buildCartItems(catalog, payload.items);
  const shipping = getDeliveryQuote(payload.shippingMethod);
  const items: OrderItem[] = cartItems.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    quantity: item.quantity,
    unitPrice: item.product.price,
  }));
  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: `ord-${sequence}`,
    orderNumber: createOrderNumber(sequence),
    status: payload.paymentMethod === "qpay" ? "pending" : "confirmed",
    contactName: payload.contactName,
    contactPhone: payload.contactPhone,
    createdAt: new Date().toISOString(),
    paymentMethod: payload.paymentMethod,
    source: "web",
    shippingAddress: payload.shippingAddress,
    shippingCost: shipping.fee,
    total: subtotal + shipping.fee,
    items,
  };
}

export function validateCheckoutPayload(payload: unknown): payload is CheckoutPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<CheckoutPayload>;

  return Boolean(
    candidate.contactName &&
      candidate.contactPhone &&
      candidate.paymentMethod &&
      candidate.shippingMethod &&
      candidate.shippingAddress?.city &&
      candidate.shippingAddress?.line1 &&
      candidate.items?.length,
  );
}
