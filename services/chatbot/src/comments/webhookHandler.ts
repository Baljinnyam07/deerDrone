/**
 * Facebook Page comment webhook handler.
 *
 * Called for every entry.changes[] event where field === "feed".
 * Handles new top-level comments only (not replies to replies).
 *
 * Safety rules:
 *  - Deduplication: each commentId processed once (in-memory Set)
 *  - Rate-limit: 1 DM per userId per hour
 *  - Confidence gate: confidence < 0.4 → no action
 *  - Spam gate: spam intent → no action
 *  - Skip own Page's comments (bot echo prevention)
 */

import { classifyComment, type CommentIntent } from "./classifier.js";
import { postPublicReply, PUBLIC_REPLIES } from "./publicReply.js";
import { dispatchCommentDM } from "./dmDispatcher.js";

// ---------------------------------------------------------------------------
// Deduplication & rate-limiting (in-memory; replace with Redis in production)
// ---------------------------------------------------------------------------

const processedComments = new Set<string>();        // commentId → processed
const userCooldowns     = new Map<string, number>(); // userId   → last DM timestamp
const COOLDOWN_MS       = 60 * 60 * 1000;           // 1 hour

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function handleCommentChange(
  change: any,
  pageToken: string,
  pageId: string
): Promise<void> {
  const val = change?.value;

  // Only handle new top-level comments on posts
  if (val?.item !== "comment" || val?.verb !== "add") return;

  const commentId:   string = val.comment_id ?? "";
  const senderId:    string = val.sender_id  ?? "";
  const commentText: string = val.message    ?? "";

  if (!commentId || !senderId || !commentText.trim()) return;

  // Skip the Page's own comments (prevents echo loop)
  if (senderId === pageId) return;

  // Skip if this is a reply to a comment (not a top-level post comment)
  // parent_id for top-level is just the post_id (no underscore after post id)
  const parentId: string = val.parent_id ?? "";
  if (parentId && parentId !== val.post_id) return;

  // Deduplication
  if (processedComments.has(commentId)) {
    console.log(`[comment] duplicate skipped: ${commentId}`);
    return;
  }
  processedComments.add(commentId);

  // Classify
  const { intent, confidence } = classifyComment(commentText);
  console.log(
    `[comment] id=${commentId} user=${senderId} intent=${intent} conf=${confidence.toFixed(2)} ` +
    `text="${commentText.slice(0, 50)}"`
  );

  // Hard gates
  if (intent === "spam") return;
  if (confidence < 0.4)  return;

  // Public reply (always, if confidence ≥ 0.4)
  const publicText = PUBLIC_REPLIES[intent];
  if (publicText) {
    await postPublicReply(commentId, publicText, pageToken);
  }

  // DM — only if confidence is high enough AND user not on cooldown
  if (confidence < 0.6) {
    console.log(`[comment] DM skipped (low confidence): ${confidence}`);
    return;
  }

  const lastDM = userCooldowns.get(senderId) ?? 0;
  if (Date.now() - lastDM < COOLDOWN_MS) {
    console.log(`[comment] DM skipped (cooldown): ${senderId}`);
    return;
  }

  userCooldowns.set(senderId, Date.now());
  await dispatchCommentDM(senderId, intent, commentText, pageToken);
}
