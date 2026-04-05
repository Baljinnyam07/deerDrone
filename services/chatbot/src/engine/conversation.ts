import type { ChatRequest, ChatResponse } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import {
  captureLeadTool,
  getDeliveryInfoTool,
  getProductDetailsTool,
  searchProductsTool,
  toChatCards,
} from "../tools/catalog";

function inferUseCase(message: string): "inspection" | "consumer" | "delivery" | "price" | "lease" | "generic" {
  const normalized = message.toLowerCase();

  if (normalized.includes("inspection") || normalized.includes("thermal") || normalized.includes("зураглал")) {
    return "inspection";
  }

  if (normalized.includes("хүргэлт") || normalized.includes("delivery")) {
    return "delivery";
  }

  if (normalized.includes("үнэ") || normalized.includes("price")) {
    return "price";
  }

  if (normalized.includes("лизинг")) {
    return "lease";
  }

  if (normalized.includes("анхан") || normalized.includes("контент") || normalized.includes("аялал")) {
    return "consumer";
  }

  return "generic";
}

export function runConversation(request: ChatRequest): ChatResponse {
  const mode = inferUseCase(request.message);
  const directProduct = getProductDetailsTool(request.message);

  if (directProduct && mode === "price") {
    return {
      sessionId: request.sessionId,
      reply: `${directProduct.name} одоогоор ${formatMoney(directProduct.price)} байна.`,
      cards: toChatCards([directProduct]),
    };
  }

  if (mode === "inspection") {
    const items = searchProductsTool("inspection").concat(searchProductsTool("thermal"));

    return {
      sessionId: request.sessionId,
      reply: "Inspection, зураглал, thermal хэрэглээнд industrial ангиллын эдгээр шийдлүүд хамгийн ойр таарна.",
      cards: toChatCards(items),
    };
  }

  if (mode === "consumer") {
    const items = searchProductsTool("creator").concat(searchProductsTool("portable"));

    return {
      sessionId: request.sessionId,
      reply: "Контент болон аяллын хэрэглээнд жин багатай, хурдан эзэмших загварууд илүү тохиромжтой.",
      cards: toChatCards(items),
    };
  }

  if (mode === "delivery") {
    const ub = getDeliveryInfoTool("ub");
    const rural = getDeliveryInfoTool("rural");

    return {
      sessionId: request.sessionId,
      reply: `УБ хүргэлт ${ub.eta} (${formatMoney(ub.fee)}), орон нутаг ${rural.eta} (${formatMoney(
        rural.fee,
      )}) байна.`,
    };
  }

  if (mode === "lease") {
    const lead = captureLeadTool("Шинэ хэрэглэгч", "+97600000000", request.message);

    return {
      sessionId: request.sessionId,
      reply:
        "Лизинг сонирхож байвал утас, байгууллагын хэрэгцээгээ үлдээгээрэй. Sales баг холбогдох урсгал руу бэлэн байна.",
      lead: {
        id: lead.id,
        interest: lead.interest,
        status: lead.status,
      },
      cards: toChatCards(searchProductsTool("rtk")),
    };
  }

  if (directProduct) {
    return {
      sessionId: request.sessionId,
      reply: `${directProduct.name} нь ${directProduct.heroNote.toLowerCase()} ангилалд багтдаг. Дэлгэрэнгүй үзвэл specs, хүргэлт, checkout мэдээлэл харагдана.`,
      cards: toChatCards([directProduct]),
    };
  }

  return {
    sessionId: request.sessionId,
    reply:
      "Ямар хэрэглээнд авах гэж байгаагаа хэлбэл илүү зөв санал өгнө. Жишээ нь уул уурхайн inspection, контент зураг авалт, эсвэл анхан хэрэглээ гэж бичиж болно.",
    cards: toChatCards(searchProductsTool("drone")),
  };
}

export function streamChunks(text: string): string[] {
  return text.split(". ").filter(Boolean).map((chunk) => (chunk.endsWith(".") ? chunk : `${chunk}.`));
}
