const TOKEN = "8746453956:AAEUn7mvchT3dK2tp0v6gVxU9T6Tjd4zf38";
const CHAT_ID = "5321459669";

async function sendTelegramNotification(message) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  });

  const result = await response.json();
  console.log("Telegram response:", JSON.stringify(result, null, 2));
  return result;
}

// Simulate a real order notification
const testMsg =
  `🔔 <b>Шинэ захиалга орж ирлээ!</b>\n\n` +
  `<b>Захиалга:</b> #TEST-001\n` +
  `<b>Хэрэглэгч:</b> Болд Бат\n` +
  `<b>Утас:</b> 9911-1234\n` +
  `<b>Төлбөр:</b> QPay\n` +
  `<b>Нийт дүн:</b> 1,480,000₮\n\n` +
  `<b>Бараа:</b>\n• 1x DJI NEO 2 FLYMORE COMBO`;

console.log("Sending test notification to Telegram...\n");
sendTelegramNotification(testMsg)
  .then((res) => {
    if (res.ok) {
      console.log("\n✅ Амжилттай! Танд Telegram мессеж ирсэн байх ёстой.");
    } else {
      console.log("\n❌ Алдаа:", res.description);
    }
  })
  .catch((err) => console.error("Fetch алдаа:", err));
