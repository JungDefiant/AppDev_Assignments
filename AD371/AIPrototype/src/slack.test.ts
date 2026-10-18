import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, type AppConfig } from "./config.ts";
import { sendSlackMessage } from "./slack.ts";

function makeConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    port: 3000,
    discourseUrl: "https://forum.example.com",
    discourseEvents: ["post_created"],
    slackUsername: "Test",
    mockSlack: true,
    ...overrides,
  };
}

test("mock mode succeeds without a webhook URL", async () => {
  const result = await sendSlackMessage(makeConfig(), "hello");
  assert.equal(result.ok, true);
});

test("missing webhook URL is reported as an error", async () => {
  const result = await sendSlackMessage(makeConfig({ mockSlack: false }), "hello");
  assert.equal(result.ok, false);
  assert.ok(result.error?.includes("SLACK_WEBHOOK_URL"));
});

test("loadConfig requires SLACK_WEBHOOK_URL unless mocking", () => {
  assert.throws(() => loadConfig({}));
  const mock = loadConfig({ MOCK_SLACK: "1" });
  assert.equal(mock.mockSlack, true);
  assert.deepEqual(mock.discourseEvents, ["post_created"]);
});

test("loadConfig parses a custom event list", () => {
  const config = loadConfig({
    MOCK_SLACK: "1",
    DISCOURSE_EVENTS: "post_created, topic_created , ",
  });
  assert.deepEqual(config.discourseEvents, ["post_created", "topic_created"]);
});
