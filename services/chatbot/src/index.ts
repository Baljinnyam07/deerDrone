import "dotenv/config";
import Fastify from "fastify";
import type { ChatRequest } from "@deer-drone/types";
import { runConversation, streamChunks } from "./engine/conversation.js";
import { systemPrompt } from "./prompts/system.js";

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

  const response = await runConversation(body);

  return reply.send({
    ...response,
    streamPreview: streamChunks(response.reply),
  });
});

import { handleWebhookEvent } from "./messenger.js";
import { getMessengerConfigTool } from "./tools/catalog.js";

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
    
    for (const entry of body.entry || []) {
      const webhookEvent = entry.messaging?.[0];
      if (webhookEvent) {
        promises.push(handleWebhookEvent(webhookEvent));
      }
    }

    await Promise.all(promises);
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
  server.listen({ port: 8787, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}
