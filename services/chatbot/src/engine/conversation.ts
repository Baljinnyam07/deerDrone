import type { ChatRequest, ChatResponse } from "@deer-drone/types";
import { formatMoney } from "@deer-drone/utils";
import { OpenAI } from "openai";
import {
  captureLeadTool,
  getAllProductsTool,
  getProductsByIdsTool,
  toChatCards,
  getSystemPromptTool,
} from "../tools/catalog.js";
import { systemPrompt } from "../prompts/system.js";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Conversation history map
const conversationHistory = new Map<string, Array<{ role: "assistant" | "user", content: string }>>();
const MAX_HISTORY = 10;

function getHistory(sessionId: string) {
  return conversationHistory.get(sessionId) || [];
}

function addToHistory(sessionId: string, role: "assistant" | "user", content: string) {
  const history = getHistory(sessionId);
  history.push({ role, content });
  if (history.length > MAX_HISTORY) history.shift();
  conversationHistory.set(sessionId, history);
}

export async function runConversation(request: ChatRequest): Promise<ChatResponse> {
  let finalReply = "Уучлаарай, би ойлгосонгүй.";
  let finalCards: any[] = [];
  let finalLead: any = null;

  if (openai) {
    try {
      const allProducts = await getAllProductsTool();
      const productsContext = allProducts.length > 0
        ? JSON.stringify(allProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price
        })))
        : "[]";

      const rawPrompt = await getSystemPromptTool();
      const promptTemplate = rawPrompt || systemPrompt;
      const prompt = promptTemplate.replace("{productsContext}", productsContext);

      console.log("📦 Products Context Length:", productsContext.length);

      const history = getHistory(request.sessionId);
      const messages: any[] = [
        { role: "system", content: prompt },
        ...history,
        { role: "user", content: request.message }
      ];

      console.log("🧠 Sending to OpenAI...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.4
      });

      const raw = completion.choices[0]?.message?.content || "{}";
      console.log("📥 Raw AI Response:", raw);
      const result = JSON.parse(raw);

      // Try to find the message in various potential fields
      finalReply = result.message || result.response || result.reply || result.text;

      // If still no reply, look for any string field in the entire object
      if (!finalReply) {
        const firstStringField = Object.values(result).find(v => typeof v === 'string');
        if (firstStringField) {
          finalReply = String(firstStringField);
        }
      }

      if (!finalReply) {
        if (result.suggested_product_ids?.length > 0 || result.recommended_drones?.length > 0) {
          finalReply = "Танд дараах загваруудыг санал болгож байна:";
        } else {
          finalReply = "Уучлаарай, би таны асуултыг ойлгосонгүй. Та дахин дэлгэрэнгүй хэлнэ үү?";
        }
      }

      addToHistory(request.sessionId, "user", request.message);
      addToHistory(request.sessionId, "assistant", finalReply);

      const intent = result.intent || "chat";

      if (intent === "lease") {
        const lead = await captureLeadTool("Тодорхойгүй", "+976--", request.message);
        finalLead = lead ? { id: lead.id, interest: lead.interest, status: lead.status } : undefined;
      }

      const rawSuggested = result.suggested_product_ids || result.recommended_drones || [];
      if (rawSuggested.length > 0) {
        // Extract IDs if objects were returned instead of just IDs
        const productIds = rawSuggested.map((item: any) => typeof item === 'string' ? item : item.id).filter(Boolean);

        if (productIds.length > 0) {
          const foundProducts = await getProductsByIdsTool(productIds);
          finalCards = toChatCards(foundProducts);
        }
      }

    } catch (err) {
      console.error("OpenAI Error:", err);
      finalReply = "Уучлаарай, системд түр саатал гарлаа. Та хэдэн минутын дараа дахин оролдоно уу 🙏";
    }
  } else {
    finalReply = "LLM тохируулаагүй байна.";
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
