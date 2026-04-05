import { products, sampleLeads } from "@deer-drone/data";
import type { ChatLead, ChatResponse, DeliveryQuote, Product } from "@deer-drone/types";
import { getDeliveryQuote } from "@deer-drone/utils";

export function searchProductsTool(query: string): Product[] {
  const normalized = query.trim().toLowerCase();

  return products.filter((product) =>
    [product.name, product.brand, product.shortDescription, product.description, product.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export function getProductDetailsTool(slugOrName: string): Product | undefined {
  const normalized = slugOrName.trim().toLowerCase();

  return products.find(
    (product) => product.slug === normalized || product.name.toLowerCase().includes(normalized),
  );
}

export function getDeliveryInfoTool(zone: "ub" | "rural"): DeliveryQuote {
  return getDeliveryQuote(zone);
}

export function captureLeadTool(name: string, phone: string, interest: string): ChatLead {
  return {
    id: `lead-${sampleLeads.length + 1}`,
    name,
    phone,
    interest,
    status: "new",
    sourcePage: "/chatbot",
    createdAt: new Date().toISOString(),
  };
}

export function toChatCards(items: Product[]): ChatResponse["cards"] {
  return items.slice(0, 2).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    heroNote: product.heroNote,
  }));
}
