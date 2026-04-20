import { runConversation } from "./engine/conversation.js";
import { getMessengerConfigTool } from "./tools/catalog.js";

const API_VERSION = "v20.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}/me`;

// Send typing indicator
export async function sendTyping(senderId: string, token: string, on = true) {
  if (!token) return;
  try {
    await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        sender_action: on ? "typing_on" : "typing_off"
      })
    });
  } catch (err) {
    // Ignore typing errors
  }
}

// Send standard text
export async function sendMessage(senderId: string, text: string, token: string) {
  if (!token) return;
  const chunks = splitMessage(text, 1900);
  for (const chunk of chunks) {
    try {
      await fetch(`${BASE_URL}/messages?access_token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          message: { text: chunk }
        })
      });
    } catch (err) {
      console.error("Error sending message to FB:", err);
    }
  }
}

// Send Product Carousel
export async function sendProductCarousel(senderId: string, products: any[], token: string) {
  if (!token || !products.length) return;

  const elements = products.slice(0, 10).map((p) => {
    return {
      title: p.name,
      subtitle: `${(p.price || 0).toLocaleString()} ₮ - ${p.heroNote || p.short_description || "Дэлгэрэнгүй"}`,
      image_url: p.image_url || p.image || "https://placehold.co/300x200?text=Drone",
      buttons: [
        {
          type: "postback",
          title: "🛒 Захиалах",
          payload: `ORDER_${p.id}`
        },
        {
          type: "postback",
          title: "📋 Дэлгэрэнгүй",
          payload: `DETAIL_${p.id}`
        }
      ]
    };
  });

  try {
    await fetch(`${BASE_URL}/messages?access_token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements
            }
          }
        }
      })
    });
  } catch (err) {
    console.error("Error sending carousel to FB:", err);
  }
}

function splitMessage(text: string, limit = 1900) {
  if (text.length <= limit) return [text];
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = start + limit;
    if (end < text.length) {
      const lastNewline = text.lastIndexOf("\n", end);
      if (lastNewline > start + limit / 2) end = lastNewline + 1;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks;
}

export async function handleWebhookEvent(event: any) {
  const senderId = event.sender.id;

  const config = await getMessengerConfigTool();
  if (!config || !config.is_enabled) {
    if (config?.page_access_token) {
      await sendMessage(senderId, "Уучлаарай, систем засвартай байна.", config.page_access_token);
    }
    return;
  }

  const token = config.page_access_token;
  if (!token) return;

  if (event.postback) {
    const payload = event.postback.payload;
    // Simplistic handling for postbacks, can call the AI with a simulated message
    let simulatedMessage = "";
    if (payload.startsWith("ORDER_")) {
      simulatedMessage = "Би энэ дроныг захиалмаар байна";
    } else if (payload.startsWith("DETAIL_")) {
       simulatedMessage = "Дэлгэрэнгүй мэдээлэл өгөөч";
    }
    
    await sendTyping(senderId, token);
    const response = await runConversation({
      sessionId: senderId,
      message: simulatedMessage
    });
    
    if (response.reply) {
      await sendMessage(senderId, response.reply, token);
    }
    if (response.cards && response.cards.length > 0) {
      await sendProductCarousel(senderId, response.cards, token);
    }
    return;
  }

  if (event.message && event.message.text && !event.message.is_echo) {
    const text = event.message.text;
    await sendTyping(senderId, token);

    try {
      const response = await runConversation({
        sessionId: senderId,
        message: text
      });

      if (response.reply) {
        await sendMessage(senderId, response.reply, token);
      }
      if (response.cards && response.cards.length > 0) {
        await sendProductCarousel(senderId, response.cards, token);
      }
    } catch (err) {
      console.error("Conversation logic error", err);
      await sendMessage(senderId, "Систем дээр алдаа гарлаа.", token);
    }
  }
}
