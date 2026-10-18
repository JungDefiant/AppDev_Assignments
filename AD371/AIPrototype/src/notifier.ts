import type { AppConfig } from "./config.ts";
import type { DiscoursePost, DiscourseWebhookPayload } from "./types.ts";
import { sendSlackMessage, type SlackResult } from "./slack.ts";

const MAX_EXCERPT_LENGTH = 300;

/** Strips HTML tags and decodes common entities into plain text. */
export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** Builds a link back to the post, preferring the URL in the payload. */
export function postLink(post: DiscoursePost, discourseUrl: string): string {
  if (post.url) {
    return post.url;
  }
  if (discourseUrl && post.topic_id) {
    const slug = post.topic_slug ?? post.topic_id;
    const postNumber = post.post_number ? `/${post.post_number}` : "";
    return `${discourseUrl}/t/${slug}/${post.topic_id}${postNumber}`;
  }
  return "";
}

/** Formats a Discourse post payload as a human-readable Slack message. */
export function buildSlackMessageFromPost(
  post: DiscoursePost,
  discourseUrl: string,
): string {
  const author = post.username ?? "unknown user";
  const title = post.topic_title ?? "a topic";
  const link = postLink(post, discourseUrl);

  const source = post.excerpt ?? post.cooked ?? post.raw ?? "";
  let excerpt = stripHtml(source)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
  if (excerpt.length > MAX_EXCERPT_LENGTH) {
    excerpt = `${excerpt.slice(0, MAX_EXCERPT_LENGTH)}…`;
  }

  const lines: string[] = [`*New post in "${title}"* by ${author}`];
  if (excerpt.length > 0) {
    lines.push("", excerpt);
  }
  if (link.length > 0) {
    lines.push("", link);
  }
  return lines.join("\n");
}

/**
 * Handles a single Discourse webhook event: builds a Slack message from the
 * payload and delivers it. Non-post events are rejected by the caller, and
 * payloads without a post object are reported as undeliverable.
 */
export async function notifyDiscourseEvent(
  config: AppConfig,
  event: string,
  payload: DiscourseWebhookPayload,
): Promise<SlackResult> {
  if (!payload.post) {
    return { ok: false, error: `event ${event} has no post object in payload` };
  }
  const text = buildSlackMessageFromPost(payload.post, config.discourseUrl);
  return sendSlackMessage(config, text);
}
