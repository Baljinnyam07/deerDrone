import { runConversation } from "./src/engine/conversation.js";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sessionId = "human-test-session-" + Date.now();

console.log("================================================");
console.log("🤖 DEER Drone Chatbot - Яг хүн шиг чатлах горим");
console.log("   (Гарахыг хүсвэл 'exit' эсвэл 'quit' гэж бичнэ үү)");
console.log("================================================\n");

function askQuestion() {
  rl.question("👤 Сийлэн (Та): ", async (text) => {
    const msg = text.trim();
    if (msg.toLowerCase() === 'exit' || msg.toLowerCase() === 'quit') {
      console.log("Баяртай! 👋");
      rl.close();
      process.exit(0);
    }

    if (!msg) {
      askQuestion();
      return;
    }

    try {
      process.stdout.write("🤖 Бот бодож байна...\r");
      const resp = await runConversation({ sessionId, message: msg });
      
      // Clear the "thinking" text
      process.stdout.write("                     \r");
      console.log("🤖 ДронеБот:");
      console.log(resp.reply);
      
      if (resp.cards && resp.cards.length > 0) {
        console.log("\n   [Бүтээгдэхүүний Картууд]:");
        resp.cards.forEach((c: any, i: number) => {
          console.log(`   ${i + 1}. ${c.name} - ${c.price?.toLocaleString()}₮`);
        });
      }
      
      if (resp.lead) {
        console.log(`\n   [Систем: Хүсэлт Lead санд бүртгэгдлээ (Interest: ${resp.lead.interest})]`);
      }
      
      if (resp.image) {
        console.log(`\n   [Зураг илгээгдлээ: ${resp.image}]`);
      }
      console.log("\n------------------------------------------------");
    } catch (err) {
      console.error("Алдаа гарлаа:", err);
    }
    
    askQuestion();
  });
}

askQuestion();
