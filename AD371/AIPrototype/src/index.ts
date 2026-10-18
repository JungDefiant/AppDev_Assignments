import { loadConfig } from "./config.ts";
import { createServer } from "./server.ts";

const config = loadConfig();
const server = createServer(config);

server.listen(config.port, () => {
  console.log(`discourse-slack-notifier listening on http://localhost:${config.port}`);
  console.log(`  Webhook endpoint: POST /webhooks/discourse`);
  console.log(`  Events handled:   ${config.discourseEvents.join(", ")}`);
  console.log(`  Slack delivery:   ${config.mockSlack ? "MOCK (log only)" : "live incoming webhook"}`);
  console.log(
    `  Signature check:  ${
      config.discourseWebhookSecret
        ? "enabled (HMAC-SHA256)"
        : "disabled (no DISCOURSE_WEBHOOK_SECRET set)"
    }`,
  );
});

function shutdown(): void {
  console.log("\nShutting down...");
  server.close(() => process.exit(0));
  // Fallback exit if connections keep the server open.
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
