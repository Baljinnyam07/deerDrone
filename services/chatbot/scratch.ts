import "dotenv/config";

async function run() {
  // Нэг дугаарын PAGE ID + TOKEN ашигла
  const pageToken = process.env.PAGE_ACCESS_TOKEN_3!;
  const fbPageId = process.env.MESSENGER_PAGE_ID_3!;
  const igId = "17841404983274122";

  console.log("=== 0. Token belongs to which Page? ===");
  const rt = await fetch(
    `https://graph.facebook.com/v20.0/me?fields=id,name&access_token=${pageToken}`
  );
  const dt = await rt.json() as any;
  console.log(JSON.stringify(dt, null, 2));

  console.log("\n=== 1. Page -> Instagram link check ===");
  const r0 = await fetch(
    `https://graph.facebook.com/v20.0/${fbPageId}?fields=id,name,instagram_business_account&access_token=${pageToken}`
  );
  const d0 = await r0.json() as any;
  console.log(JSON.stringify(d0, null, 2));

  console.log("\n=== 2. Facebook Page subscribed_apps BEFORE ===");
  const r1 = await fetch(
    `https://graph.facebook.com/v20.0/${fbPageId}/subscribed_apps?fields=id,name,subscribed_fields&access_token=${pageToken}`
  );
  const d1 = await r1.json() as any;
  console.log(JSON.stringify(d1, null, 2));

  console.log("\n=== 3. Instagram account basic info ===");
  const r2 = await fetch(
    `https://graph.facebook.com/v20.0/${igId}?fields=id,name,username,followers_count&access_token=${pageToken}`
  );
  const d2 = await r2.json() as any;
  console.log(JSON.stringify(d2, null, 2));

  console.log("\n=== 4. Re-subscribe Page to webhook fields ===");
  const r3 = await fetch(
    `https://graph.facebook.com/v20.0/${fbPageId}/subscribed_apps`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscribed_fields: ["messages", "messaging_postbacks", "message_reads"],
        access_token: pageToken,
      }),
    }
  );
  const d3 = await r3.json() as any;
  console.log(JSON.stringify(d3, null, 2));

  console.log("\n=== 5. Facebook Page subscribed_apps AFTER ===");
  const r4 = await fetch(
    `https://graph.facebook.com/v20.0/${fbPageId}/subscribed_apps?fields=id,name,subscribed_fields&access_token=${pageToken}`
  );
  const d4 = await r4.json() as any;
  console.log(JSON.stringify(d4, null, 2));
}

run().catch(console.error);