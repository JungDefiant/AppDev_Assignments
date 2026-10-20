import test from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { createServer } from "./server.ts";
import type { AppConfig } from "./config.ts";

function makeConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    port: 0,
    discourseUrl: "https://forum.example.com",
    discourseEvents: ["post_created"],
    slackUsername: "Test",
    mockSlack: true,
    ...overrides,
  };
}

async function startServer(config: AppConfig): Promise<{ server: ReturnType<typeof createServer>; port: number }> {
  const server = createServer(config);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address() as AddressInfo;
  return { server, port: address.port };
}

test("GET /healthz returns ok", async () => {
  const { server, port } = await startServer(makeConfig());
  const response = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  server.close();
});

test("POST /webhooks/discourse with a post event is delivered", async () => {
  const { server, port } = await startServer(makeConfig());
  const response = await fetch(`http://127.0.0.1:${port}/webhooks/discourse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Discourse-Event": "post_created",
      "X-Discourse-Event-Type": "post",
    },
    body: JSON.stringify({
      post: {
        id: 1,
        username: "bade",
        topic_id: 10,
        topic_title: "Hello world",
        topic_slug: "hello-world",
        post_number: 1,
        excerpt: "<p>First post!</p>",
      },
    }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "delivered", event: "post_created" });
  server.close();
});

test("POST /webhooks/discourse ignores events not in the allowlist", async () => {
  const { server, port } = await startServer(makeConfig());
  const response = await fetch(`http://127.0.0.1:${port}/webhooks/discourse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Discourse-Event": "user_created",
      "X-Discourse-Event-Type": "user",
    },
    body: JSON.stringify({ user: { id: 1 } }),
  });
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { status: "ignored", event: "user_created" });
  server.close();
});

test("POST /webhooks/discourse rejects an invalid signature", async () => {
  const { server, port } = await startServer(
    makeConfig({ discourseWebhookSecret: "s3cret" }),
  );
  const response = await fetch(`http://127.0.0.1:${port}/webhooks/discourse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Discourse-Event": "post_created",
      "X-Discourse-Event-Type": "post",
      "X-Discourse-Event-Signature": "sha256=deadbeef",
    },
    body: JSON.stringify({ post: { id: 1 } }),
  });
  assert.equal(response.status, 401);
  server.close();
});

test("unknown routes return 404", async () => {
  const { server, port } = await startServer(makeConfig());
  const response = await fetch(`http://127.0.0.1:${port}/nope`);
  assert.equal(response.status, 404);
  server.close();
});
