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
  // ── Price transliteration fix ──────────────────────────────────────────
  "Vne",           // bare "vne" → must hit price_inquiry (NOT AI dump)
  "Une",           // bare "une" → same
  "vne?",          // with question mark
  "Vne hed ve",    // "хэд вэ" variant
  // ── Greeting ───────────────────────────────────────────────────────────
  "Сайн байна уу", // greeting → featured products carousel
  // ── Specific product price ─────────────────────────────────────────────
  "DJI Mini 5 Pro үнэ хэд вэ",
  // ── Category browse ───────────────────────────────────────────────────
  "Дрон",
  "Хамгийн хямд дрон",
];

async function runTests() {
  for (const q of questions) {
    await testChat(q);
    console.log('---');
  }
}

runTests();
