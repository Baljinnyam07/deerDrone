export async function sendTelegramNotification(message: string) {
  const token = "8746453956:AAEUn7mvchT3dK2tp0v6gVxU9T6Tjd4zf38";
  const chatId = "5321459669";

  if (!token || !chatId) {
    console.warn("Telegram credentials not configured. Skipping notification.");
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      console.error("Failed to send Telegram message", await response.text());
    }
  } catch (error) {
    console.error("Telegram error:", error);
  }
}
