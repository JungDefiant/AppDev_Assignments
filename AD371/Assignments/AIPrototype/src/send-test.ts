import { loadConfig } from "./config.ts";
import { sendSlackMessage } from "./slack.ts";

/**
 * Smoke-test script: sends one message through the configured Slack webhook
 * (or logs it in mock mode) so you can confirm delivery end-to-end.
 *
 * Usage: npm run send-test
 */
const config = loadConfig();

const result = await sendSlackMessage(
  config,
  "✅ Test notification from discourse-slack-notifier — your Discourse → Slack bridge is working.",
);

if (result.ok) {
  console.log("Test message delivered.");
} else {
  console.error(`Failed to deliver test message: ${result.error}`);
  process.exit(1);
}
