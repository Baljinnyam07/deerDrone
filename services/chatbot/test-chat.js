// Using global fetch (Node 20+)

const CHAT_URL = 'https://chatbot-phi-neon-55.vercel.app/chat';

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
      if (data.cards) {
        console.log(`📦 Suggested Products: ${data.cards.length} items`);
      }
    } else {
      console.error(`❌ Error (${response.status}):`, data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('🔥 Request failed:', error.message);
  }
}

// Зарим туршилтын асуултууд
const questions = [
  "Сайн байна уу?",
  "Хамгийн хямдхан дрон юу байна?",
  "Мэргэжлийн зураг авдаг дрон сонирхож байна."
];

async function runTests() {
  for (const q of questions) {
    await testChat(q);
    console.log('---');
  }
}

runTests();
