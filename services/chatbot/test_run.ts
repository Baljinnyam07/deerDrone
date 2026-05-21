import { runConversation } from "./src/engine/conversation.js";

async function main() {
  const sessionId = "test-run-" + Date.now();
  console.log("Testing chatbot locally with: 'drone hed ve'...");
  const response = await runConversation({
    sessionId,
    message: "drone hed ve"
  });

  console.log("==================== RESPONSE ====================");
  console.log(response.reply);
  console.log("==================================================");

  if (response.cards) {
    console.log("Cards count:", response.cards.length);
  }
}

main().catch(console.error);
