/**
 * Application configuration, loaded from environment variables.
 */
export interface AppConfig {
  /** Port the HTTP server listens on. */
  port: number;
  /** Base URL of the Discourse instance, used to build post links. */
  discourseUrl: string;
  /** Optional shared secret used to verify Discourse webhook signatures. */
  discourseWebhookSecret?: string;
  /** X-Discourse-Event values that should be forwarded to Slack. */
  discourseEvents: string[];
  /** Slack incoming webhook URL. */
  slackWebhookUrl?: string;
  /** Optional channel override (only works for workspace-level webhooks). */
  slackChannel?: string;
  /** Display name used for the Slack message sender. */
  slackUsername: string;
  /** When true, log messages instead of delivering them to Slack. */
  mockSlack: boolean;
}

const DEFAULT_EVENTS = ["post_created"];

function parseEvents(raw: string | undefined): string[] {
  if (!raw) {
    return [...DEFAULT_EVENTS];
  }
  const events = raw
    .split(",")
    .map((event) => event.trim())
    .filter((event) => event.length > 0);
  return events.length > 0 ? events : [...DEFAULT_EVENTS];
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const mockSlack = (env.MOCK_SLACK ?? "") === "1";
  const slackWebhookUrl = env.SLACK_WEBHOOK_URL;

  if (!mockSlack && !slackWebhookUrl) {
    throw new Error(
      "SLACK_WEBHOOK_URL is required (or set MOCK_SLACK=1 for local testing).",
    );
  }

  return {
    port: Number(env.PORT ?? 3000),
    discourseUrl: (env.DISCOURSE_URL ?? "").replace(/\/+$/, ""),
    discourseWebhookSecret: env.DISCOURSE_WEBHOOK_SECRET || undefined,
    discourseEvents: parseEvents(env.DISCOURSE_EVENTS),
    slackWebhookUrl: slackWebhookUrl || undefined,
    slackChannel: env.SLACK_CHANNEL || undefined,
    slackUsername: env.SLACK_USERNAME || "Discourse Notifier",
    mockSlack,
  };
}
