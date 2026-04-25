import "dotenv/config";
import { getMessengerConfigTool } from "./src/tools/catalog.js";
import { handleCommentChange } from "./src/comments/webhookHandler.js";

async function main() {
  const conf = await getMessengerConfigTool().catch(() => null);
  const token = conf?.page_access_token || process.env.PAGE_ACCESS_TOKEN;
  const pageId = conf?.page_id || process.env.MESSENGER_PAGE_ID;

  if (!token || !pageId) {
    console.error("No token or page ID!");
    return;
  }

  console.log("Fetching posts for page:", pageId);
  const res = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed?access_token=${token}`);
  const data = await res.json();
  
  if (!data.data || data.data.length === 0) {
    console.log("No posts found", data);
    return;
  }

  const postId = data.data[0].id;
  console.log("Latest post:", postId);

  const commentsRes = await fetch(`https://graph.facebook.com/v20.0/${postId}/comments?access_token=${token}`);
  const commentsData = await commentsRes.json();

  if (!commentsData.data || commentsData.data.length === 0) {
    console.log("No comments found on this post.");
    return;
  }

  console.log("Latest comments:");
  console.log(JSON.stringify(commentsData.data, null, 2));

  // Try to simulate a webhook for the FIRST comment
  const comment = commentsData.data[0];
  console.log("\nSimulating webhook for comment ID:", comment.id);

  const mockChange = {
    field: "feed",
    value: {
      item: "comment",
      verb: "add",
      comment_id: comment.id,
      post_id: postId,
      from: comment.from,
      message: comment.message,
    }
  };

  await handleCommentChange(mockChange, token, pageId);
  console.log("Test finished.");
}

main().catch(console.error);
