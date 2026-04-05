import Fastify from "fastify";
import type { ChatRequest } from "@deer-drone/types";
import { systemPrompt } from "./prompts/system";
import { runConversation, streamChunks } from "./engine/conversation";

const server = Fastify({
  logger: true,
});

server.get("/health", async () => ({
  ok: true,
  model: "gpt-4o-mini",
  promptLoaded: systemPrompt.length > 0,
}));

server.post("/chat", async (request, reply) => {
  const body = request.body as ChatRequest;

  if (!body?.sessionId || !body?.message) {
    return reply.status(400).send({
      error: "sessionId болон message шаардлагатай.",
    });
  }

  const response = runConversation(body);

  return reply.send({
    ...response,
    streamPreview: streamChunks(response.reply),
  });
});

async function start() {
  try {
    await server.listen({
      port: Number(process.env.PORT ?? 8787),
      host: "0.0.0.0",
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

void start();
