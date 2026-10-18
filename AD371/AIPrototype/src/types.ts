/**
 * Minimal typings for the parts of the Discourse webhook payload we use.
 *
 * Discourse webhook payloads vary slightly between versions, so every field
 * is optional and the notifier code treats missing data defensively.
 *
 * Docs: https://meta.discourse.org/t/17247 (webhooks overview)
 */
export interface DiscoursePost {
  id?: number;
  name?: string;
  username?: string;
  post_number?: number;
  topic_id?: number;
  topic_title?: string;
  topic_slug?: string;
  excerpt?: string;
  cooked?: string;
  raw?: string;
  url?: string;
  created_at?: string;
}

export interface DiscourseWebhookPayload {
  post?: DiscoursePost;
}
