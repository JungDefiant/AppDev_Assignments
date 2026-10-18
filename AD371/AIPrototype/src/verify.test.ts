import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifySignature } from "./verify.ts";

const secret = "s3cret-webhook-password";
const rawBody = JSON.stringify({ post: { id: 1, username: "bade" } });

function sign(body: string, key: string): string {
  return `sha256=${createHmac("sha256", key).update(body, "utf8").digest("hex")}`;
}

test("valid signature passes", () => {
  assert.equal(verifySignature(rawBody, sign(rawBody, secret), secret), true);
});

test("tampered body fails signature check", () => {
  const tampered = `${rawBody} `;
  assert.equal(verifySignature(tampered, sign(rawBody, secret), secret), false);
});

test("wrong secret fails signature check", () => {
  assert.equal(verifySignature(rawBody, sign(rawBody, "other"), secret), false);
});

test("missing signature header fails when a secret is configured", () => {
  assert.equal(verifySignature(rawBody, undefined, secret), false);
});

test("verification is skipped when no secret is configured", () => {
  assert.equal(verifySignature(rawBody, undefined, undefined), true);
});
