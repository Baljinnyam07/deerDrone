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
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Deduplication & rate-limiting (Redis with fallback to in-memory)
// ---------------------------------------------------------------------------

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const processedComments = new Set<string>();         // Fallback in-memory
const userCooldowns     = new Map<string, number>(); // Fallback in-memory
const COOLDOWN_SEC      = 60 * 60;                   // 1 hour

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
  const senderId:    string = val.from?.id   ?? val.sender_id ?? "";
  const commentText: string = val.message    ?? "";

  if (!commentId || !senderId || !commentText.trim()) return;

  // Skip the Page's own comments (prevents echo loop)
  if (senderId === pageId) return;

  // Skip if this is a reply to a comment (not a top-level post comment)
  // parent_id for top-level is just the post_id (no underscore after post id)
  const parentId: string = val.parent_id ?? "";
  if (parentId && parentId !== val.post_id) return;

  // Deduplication
  if (redis) {
    const isProcessed = await redis.get(`comment_processed_${commentId}`);
    if (isProcessed) {
      console.log(`[comment] duplicate skipped (redis): ${commentId}`);
      return;
    }
    // Set with expiration (7 days) to avoid unbounded growth
    await redis.set(`comment_processed_${commentId}`, "1", { ex: 60 * 60 * 24 * 7 });
  } else {
    if (processedComments.has(commentId)) {
      console.log(`[comment] duplicate skipped (mem): ${commentId}`);
      return;
    }
    processedComments.add(commentId);
  }

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

  if (redis) {
    const lastDM = await redis.get<number>(`cooldown_${senderId}`);
    if (lastDM && Date.now() - lastDM < COOLDOWN_SEC * 1000) {
      console.log(`[comment] DM skipped (cooldown redis): ${senderId}`);
      return;
    }
    await redis.set(`cooldown_${senderId}`, Date.now(), { ex: COOLDOWN_SEC });
  } else {
    const lastDM = userCooldowns.get(senderId) ?? 0;
    if (Date.now() - lastDM < COOLDOWN_SEC * 1000) {
      console.log(`[comment] DM skipped (cooldown mem): ${senderId}`);
      return;
    }
    userCooldowns.set(senderId, Date.now());
  }
  await dispatchCommentDM(commentId, intent, commentText, pageToken);
}
