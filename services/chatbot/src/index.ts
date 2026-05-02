import "dotenv/config";
import Fastify from "fastify";
import type { ChatRequest } from "@deer-drone/types";
import { runConversation, streamChunks } from "./engine/conversation.js";
import { systemPrompt } from "./prompts/system.js";
import { handleWebhookEvent } from "./messenger.js";
import { getMessengerConfigTool, supabase } from "./tools/catalog.js";
import { handleCommentChange } from "./comments/webhookHandler.js";

export const server = Fastify({
  logger: true,
});

const serviceSecret = process.env.CHATBOT_SERVICE_SECRET?.trim();

server.get("/health", async () => {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  return {
    ok: true,
    model: "gpt-4o-mini",
    promptLoaded: systemPrompt.length > 0,
    openaiConfigured: hasApiKey,
    envCount: Object.keys(process.env).filter(k => k.startsWith("NEXT_PUBLIC_") || k === "OPENAI_API_KEY").length
  };
});

server.post("/chat", async (request, reply) => {
  if (serviceSecret) {
    const incomingSecret = request.headers["x-deer-service-secret"];

    if (incomingSecret !== serviceSecret) {
      return reply.status(401).send({
        error: "Unauthorized chatbot request.",
      });
    }
  }

  const body = request.body as ChatRequest;

  if (!body?.sessionId || !body?.message) {
    return reply.status(400).send({
      error: "sessionId болон message шаардлагатай.",
    });
  }

  // Log user message
  const { error: userErr } = await supabase.from("conversations").insert({ 
    session_id: body.sessionId, 
    role: "user", 
    content: body.message 
  });
  if (userErr) console.error("Web chat log err:", userErr);

  const response = await runConversation(body);

  // Log bot response
  if (response.reply) {
    const { error: botErr } = await supabase.from("conversations").insert({ 
      session_id: body.sessionId, 
      role: "bot", 
      content: response.reply 
    });
    if (botErr) console.error("Web chat log err:", botErr);
  }

  return reply.send({
    ...response,
    streamPreview: streamChunks(response.reply),
  });
});


server.get("/webhook", async (request: any, reply: any) => {
  const config = await getMessengerConfigTool();
  if (!config) return reply.status(403).send();

  const mode = request.query["hub.mode"];
  const token = request.query["hub.verify_token"];
  const challenge = request.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === config.verify_token) {
      server.log.info("WEBHOOK_VERIFIED");
      return reply.send(challenge);
    } else {
      return reply.status(403).send();
    }
  }
  return reply.status(400).send();
});

server.post("/webhook", async (request: any, reply: any) => {
  const body = request.body;

  if (body.object === "page") {
    const promises = [];

    // Load config from DB — fallback to env if DB not configured
    const dbConfig = await getMessengerConfigTool().catch(() => null);
    const pageToken: string =
      dbConfig?.page_access_token || process.env.PAGE_ACCESS_TOKEN || "";
    const pageId: string =
      dbConfig?.page_id || process.env.MESSENGER_PAGE_ID || "";

    if (!pageToken) {
      server.log.warn("PAGE_ACCESS_TOKEN not set — webhook skipped");
      return reply.status(200).send("EVENT_RECEIVED");
    }

    for (const entry of body.entry || []) {
      // ── Messenger events (DMs, postbacks) ───────────────────────────────
      const webhookEvent = entry.messaging?.[0];
      if (webhookEvent && dbConfig?.is_enabled !== false) {
        promises.push(handleWebhookEvent(webhookEvent));
      }

      // ── Page feed events (comments on posts) ────────────────────────────
      for (const change of entry.changes || []) {
        if (change.field === "feed") {
          promises.push(handleCommentChange(change, pageToken, pageId));
        }
      }
    }

    await Promise.allSettled(promises);
    return reply.status(200).send("EVENT_RECEIVED");
  }

  return reply.status(404).send();
});

// Export the server instance for Vercel
export default async (req: any, res: any) => {
  await server.ready();
  server.server.emit('request', req, res);
};

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8787;
  server.listen({ port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}
