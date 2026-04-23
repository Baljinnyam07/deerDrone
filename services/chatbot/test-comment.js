/**
 * Comment automation local test script.
 * Facebook-тай холбогдохгүйгээр webhook-г шууд тест хийнэ.
 *
 * Ажиллуулах: node test-comment.js
 * Шаардлага: chatbot сервер localhost:8787 дээр ажиллаж байх ёстой
 */

const CHATBOT_URL = "http://localhost:8787";

// ─── Тестийн comment payload-ууд ─────────────────────────────────────────────
const TEST_COMMENTS = [
  { text: "мэдээлэл",             expectedIntent: "info_request" },
  { text: "үнэ хэд вэ",           expectedIntent: "info_request" },
  { text: "авъя",                 expectedIntent: "product_interest" },
  { text: "зээлээр авч болох уу", expectedIntent: "financing" },
  { text: "zeel bn uu",           expectedIntent: "financing" },
  { text: "өөр иймэрхүү байна уу",expectedIntent: "recommend" },
  { text: "ажилтантай холбогдъё", expectedIntent: "human_support" },
  { text: "nice post 👍",          expectedIntent: "low_confidence" },
  { text: "ааааааааа",            expectedIntent: "spam" },
];

// ─── Fake Facebook webhook payload үүсгэх ────────────────────────────────────
function buildCommentPayload(commentText, commentId, userId) {
  return {
    object: "page",
    entry: [
      {
        id: "PAGE_ID_TEST",
        time: Date.now(),
        changes: [
          {
            field: "feed",
            value: {
              item: "comment",
              verb: "add",
              comment_id: commentId || `TEST_COMMENT_${Date.now()}`,
              sender_id: userId || "TEST_USER_123",
              post_id: "TEST_POST_ID",
              parent_id: "TEST_POST_ID",
              message: commentText,
              created_time: Math.floor(Date.now() / 1000),
            },
          },
        ],
      },
    ],
  };
}

// ─── Тест ажиллуулах ──────────────────────────────────────────────────────────
async function runTest(commentText, expectedIntent) {
  const payload = buildCommentPayload(
    commentText,
    `CID_${Math.random().toString(36).slice(2)}`,
    `UID_${Math.random().toString(36).slice(2)}`
  );

  try {
    const res = await fetch(`${CHATBOT_URL}/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const status = res.status;
    const body = await res.text();

    const icon = status === 200 ? "✅" : "❌";
    console.log(`${icon} [${expectedIntent}] "${commentText}"`);
    console.log(`   → HTTP ${status} | Response: ${body}`);
  } catch (err) {
    console.log(`❌ [${expectedIntent}] "${commentText}"`);
    console.log(`   → Error: ${err.message}`);
  }
}

// ─── Classifier-г тусдаа тест хийх (сервергүй) ───────────────────────────────
async function testClassifierOnly() {
  console.log("\n━━━ Classifier тест (сервергүй) ━━━\n");

  // Dynamic import тул ESM дэмжинэ
  try {
    const { classifyComment } = await import("./src/comments/classifier.js");

    for (const { text, expectedIntent } of TEST_COMMENTS) {
      const { intent, confidence } = classifyComment(text);
      const match = intent === expectedIntent;
      const icon = match ? "✅" : "⚠️";
      console.log(
        `${icon} "${text}"\n   expected: ${expectedIntent} | got: ${intent} (conf: ${confidence.toFixed(2)})`
      );
    }
  } catch (e) {
    console.log("Classifier import алдаа (TypeScript build шаардлагатай):", e.message);
  }
}

// ─── Webhook тест (сервер шаардлагатай) ──────────────────────────────────────
async function testWebhook() {
  console.log("\n━━━ Webhook тест (localhost:8787 шаардлагатай) ━━━\n");

  // Health check
  try {
    const health = await fetch(`${CHATBOT_URL}/health`);
    const data = await health.json();
    console.log("🟢 Сервер ажиллаж байна:", data);
  } catch {
    console.log("🔴 Сервер ажиллахгүй байна! npm run dev ажиллуулна уу.\n");
    return;
  }

  console.log("\n─── Comment webhook тестүүд ───\n");

  for (const { text, expectedIntent } of TEST_COMMENTS) {
    await runTest(text, expectedIntent);
    // 300ms завсарлага — rate limit тест хийхгүйн тулд өөр userId ашиглана
    await new Promise((r) => setTimeout(r, 300));
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const mode = process.argv[2] || "webhook";

if (mode === "classifier") {
  testClassifierOnly();
} else {
  testWebhook();
}
