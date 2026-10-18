import type { AppConfig } from "./config.ts";

export interface SlackResult {
  ok: boolean;
  error?: string;
}

/**
 * Posts a plain-text message to a Slack incoming webhook.
 * Uses the runtime's built-in fetch, so there are no HTTP dependencies.
 */
export async function sendSlackMessage(
  config: AppConfig,
  text: string,
): Promise<SlackResult> {
  if (config.mockSlack) {
    console.log(`[mock-slack] Would deliver to Slack:\n---\n${text}\n---`);
    return { ok: true };
  }

  if (!config.slackWebhookUrl) {
    return { ok: false, error: "SLACK_WEBHOOK_URL is not configured" };
  }

  const payload: Record<string, unknown> = {
    text,
    username: config.slackUsername,
  };
  if (config.slackChannel) {
    payload.channel = config.slackChannel;
  }

  try {
    const response = await fetch(config.slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        ok: false,
        error: `Slack responded with ${response.status}: ${body.slice(0, 200)}`,
      };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
