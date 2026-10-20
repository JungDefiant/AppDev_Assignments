import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies the X-Discourse-Event-Signature header of a Discourse webhook.
 *
 * Discourse signs the raw request body with HMAC-SHA256 using the secret
 * configured on the webhook, and sends it as `sha256=<hexdigest>`.
 *
 * If no secret is configured, verification is disabled and this returns true.
 */
export function verifySignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secret: string | undefined,
): boolean {
  if (!secret) {
    return true;
  }
  if (!signatureHeader) {
    return false;
  }

  const expected = `sha256=${createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")}`;

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signatureHeader, "utf8");
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
