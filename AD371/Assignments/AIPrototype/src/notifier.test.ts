import test from "node:test";
import assert from "node:assert/strict";
import { stripHtml, buildSlackMessageFromPost, postLink } from "./notifier.ts";

test("stripHtml removes tags and decodes entities", () => {
  const html = "<p>Hello <b>world</b> &amp; welcome</p><p>Line two</p>";
  const text = stripHtml(html);
  assert.ok(!text.includes("<"), "no tags remain");
  assert.ok(text.includes("Hello world & welcome"));
  assert.ok(text.includes("Line two"));
});

test("buildSlackMessageFromPost includes title, author, excerpt and link", () => {
  const message = buildSlackMessageFromPost(
    {
      id: 42,
      username: "bade",
      topic_id: 10,
      topic_title: "Release planning",
      topic_slug: "release-planning",
      post_number: 2,
      excerpt: "<p>Here is the <b>plan</b>.</p>",
    },
    "https://forum.example.com",
  );

  assert.ok(message.includes("Release planning"));
  assert.ok(message.includes("bade"));
  assert.ok(message.includes("Here is the plan."));
  assert.ok(message.includes("https://forum.example.com/t/release-planning/10/2"));
});

test("buildSlackMessageFromPost truncates very long excerpts", () => {
  const message = buildSlackMessageFromPost(
    {
      username: "bade",
      topic_id: 1,
      topic_title: "Long post",
      excerpt: `<p>${"x".repeat(1000)}</p>`,
    },
    "",
  );
  const excerptLine = message.split("\n")[2] ?? "";
  assert.ok(excerptLine.length <= 302, `excerpt truncated, got ${excerptLine.length}`);
});

test("postLink prefers payload URL and falls back to constructed topic URL", () => {
  assert.equal(postLink({ url: "https://forum.example.com/p/1" }, "https://other"), "https://forum.example.com/p/1");
  assert.equal(
    postLink({ topic_id: 5, topic_slug: "hello", post_number: 3 }, "https://forum.example.com"),
    "https://forum.example.com/t/hello/5/3",
  );
  assert.equal(postLink({}, ""), "");
});
