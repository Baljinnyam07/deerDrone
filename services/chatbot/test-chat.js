// Using global fetch (Node 20+)

const CHAT_URL = 'http://localhost:8787/chat';

async function testChat(message) {
  console.log(`👤 User: ${message}`);

  try {
    const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: 'test-user-001',
        message: message
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`🤖 AI: ${data.reply}`);
      if (data.cards && data.cards.length > 0) {
        console.log(`📦 Suggested Products: ${data.cards.length} items`);
        data.cards.forEach((c, i) => {
          console.log(`   ${i + 1}. ${c.name} — ${(c.price ?? 0).toLocaleString()}₮`);
        });
      }
    } else {
      console.error(`❌ Error (${response.status}):`, data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('🔥 Request failed:', error.message);
  }
}

// Зарим туршилтын асуултууд - Бодит хэрэглэгчийн кэйсүүд
const questions = [
  "Сайн байна уу?",
  "Камер", // Case 1: Button click or direct text that failed before
  "үнэ мэдээлэл авъя", // Case 2: Vague price inquiry that returned accessories before
  "Dronii une asuuj bna hed be", // Case 3: Drone price inquiry with latin letters
  "Une bolmjiin udirdhad hamgiin amrhn dron hmr dron bga bol", // Case 4: AI hallucination case about cargo drones
  "Хамгийн хямдхан нь хэд вэ?", // Broad AI test
  "Захиалга өгье", // Order intent test
];

async function runTests() {
  for (const q of questions) {
    await testChat(q);
    console.log('---');
  }
}

runTests();
