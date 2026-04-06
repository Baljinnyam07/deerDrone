import type { ChatRequest, ChatResponse } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import OpenAI from "openai";
import {
  captureLeadTool,
  getDeliveryInfoTool,
  getProductDetailsTool,
  searchProductsTool,
  toChatCards,
} from "../tools/catalog";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function inferUseCase(message: string): "inspection" | "consumer" | "delivery" | "price" | "lease" | "generic" {
  const normalized = message.toLowerCase();

  if (normalized.includes("inspection") || normalized.includes("thermal") || normalized.includes("зураглал")) {
    return "inspection";
  }
  if (normalized.includes("хүргэлт") || normalized.includes("delivery")) {
    return "delivery";
  }
  if (normalized.includes("үнэ") || normalized.includes("price") || normalized.includes("хэд вэ")) {
    return "price";
  }
  if (normalized.includes("лизинг") || normalized.includes("lease")) {
    return "lease";
  }
  if (normalized.includes("анхан") || normalized.includes("контент") || normalized.includes("аялал")) {
    return "consumer";
  }
  return "generic";
}

export async function runConversation(request: ChatRequest): Promise<ChatResponse> {
  const mode = inferUseCase(request.message);
  
  // Basic semantic DB queries
  const directProduct = await getProductDetailsTool(request.message);
  let relevantProducts: any[] = [];

  if (mode === "inspection") {
    const p1 = await searchProductsTool("mavic");
    const p2 = await searchProductsTool("matrice");
    relevantProducts = [...p1, ...p2];
  } else if (mode === "consumer") {
    const p1 = await searchProductsTool("mini");
    const p2 = await searchProductsTool("action");
    relevantProducts = [...p1, ...p2];
  } else if (directProduct) {
    relevantProducts = [directProduct];
  } else {
    relevantProducts = await searchProductsTool(request.message.split(" ")[0]);
  }

  // Define fallback response variables
  let finalReply = "";
  let finalCards: any[] = [];
  let finalLead: any = null;

  // 1. Process Lease separately
  if (mode === "lease") {
    const lead = await captureLeadTool("Тодорхойгүй", "+976--", request.message);
    return {
      sessionId: request.sessionId,
      reply: "Лизинг сонирхож байвал утасны дугаараа үлдээгээрэй. Манай Sales баг тантай удахгүй холбогдох болно.",
      lead: lead ? { id: lead.id, interest: lead.interest, status: lead.status } : undefined,
      cards: toChatCards(await searchProductsTool("rtk")),
    };
  }

  // 2. Try OpenAI for a smart answer
  if (openai) {
    try {
      const dbContext = relevantProducts.map(p => `- ${p.name}: ${p.price}₮. ${p.short_description || ''}`).join("\n");
      const deliveryContext = "УБ хүргэлт 5000₮ (24-48 цаг), Орон нутаг 10000₮ (3-5 хоног).";
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: `You are the DEER Drone Mongolian sales assistant. Suggest products based on user needs. Answer in Mongolian. 
Context Info:
${dbContext}
${deliveryContext}
Be highly concise. If they ask for price, give the price formatting it to MNT.` 
          },
          { role: "user", content: request.message }
        ],
        max_tokens: 150,
      });

      finalReply = completion.choices[0]?.message?.content || "Уучлаарай, би ойлгосонгүй.";
      finalCards = toChatCards(relevantProducts);
    } catch (err) {
      console.error("OpenAI Error:", err);
    }
  }

  // 3. Fallback to rule-based processing if no OpenAI or if it failed
  if (!finalReply) {
    if (directProduct && mode === "price") {
      finalReply = `${directProduct.name} одоогоор ${formatMoney(directProduct.price)} байна.`;
      finalCards = toChatCards([directProduct]);
    } else if (mode === "inspection") {
      finalReply = "Inspection, зураглал, thermal хэрэглээнд industrial ангиллын эдгээр шийдлүүд хамгийн ойр таарна.";
      finalCards = toChatCards(relevantProducts);
    } else if (mode === "consumer") {
      finalReply = "Контент болон аяллын хэрэглээнд жин багатай, хурдан эзэмших загварууд илүү тохиромжтой.";
      finalCards = toChatCards(relevantProducts);
    } else if (mode === "delivery") {
      const ub = getDeliveryInfoTool("ub");
      const rural = getDeliveryInfoTool("rural");
      finalReply = `УБ хүргэлт ${ub.eta} (${formatMoney(ub.fee)}), орон нутаг ${rural.eta} (${formatMoney(rural.fee)}) байна.`;
    } else if (directProduct) {
      finalReply = `${directProduct.name} нь ${directProduct.hero_note?.toLowerCase() || 'шилдэг'} ангилалд багтдаг. Дэлгэрэнгүй үзвэл specs, хүргэлт, checkout мэдээлэл харагдана.`;
      finalCards = toChatCards([directProduct]);
    } else {
      finalReply = "Ямар хэрэглээнд авах гэж байгаагаа хэлбэл илүү зөв санал өгнө. Жишээ нь уул уурхайн inspection, контент зураг авалт, эсвэл анхан хэрэглээ гэж бичиж болно.";
      finalCards = toChatCards(await searchProductsTool("drone"));
    }
  }

  return {
    sessionId: request.sessionId,
    reply: finalReply,
    cards: finalCards.length > 0 ? finalCards : undefined,
    lead: finalLead,
  };
}

export function streamChunks(text: string): string[] {
  return text.split(". ").filter(Boolean).map((chunk) => (chunk.endsWith(".") ? chunk : `${chunk}.`));
}
