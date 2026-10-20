import http, {
  type IncomingHttpHeaders,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import type { AppConfig } from "./config.ts";
import { notifyDiscourseEvent } from "./notifier.ts";
import { verifySignature } from "./verify.ts";
import type { DiscourseWebhookPayload } from "./types.ts";

const MAX_BODY_BYTES = 1_000_000;

interface HttpOutcome {
  status: number;
  body: unknown;
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function headerValue(headers: IncomingHttpHeaders, name: string): string | undefined {
  const value = headers[name];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Core webhook processing: verify signature, filter events, parse payload,
 * and forward to Slack. Separated from the HTTP plumbing for testability.
 */
export async function handleWebhook(
  config: AppConfig,
  rawBody: string,
  headers: IncomingHttpHeaders,
): Promise<HttpOutcome> {
  const signature = headerValue(headers, "x-discourse-event-signature");
  if (!verifySignature(rawBody, signature, config.discourseWebhookSecret)) {
    return { status: 401, body: { error: "invalid webhook signature" } };
  }

  const event = headerValue(headers, "x-discourse-event") ?? "";
  if (!config.discourseEvents.includes(event)) {
    return { status: 202, body: { status: "ignored", event } };
  }

  let payload: DiscourseWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as DiscourseWebhookPayload;
  } catch {
    return { status: 400, body: { error: "invalid JSON payload" } };
  }

  const result = await notifyDiscourseEvent(config, event, payload);
  if (!result.ok) {
    console.error(`[${new Date().toISOString()}] failed to notify Slack for ${event}: ${result.error}`);
    return { status: 502, body: { error: result.error ?? "failed to notify Slack" } };
  }
  console.log(`[${new Date().toISOString()}] delivered ${event} to Slack`);
  return { status: 200, body: { status: "delivered", event } };
}

/** Creates the HTTP server: GET /healthz and POST /webhooks/discourse. */
export function createServer(config: AppConfig): http.Server {
  return http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = req.url ?? "";

    if (req.method === "GET" && url === "/healthz") {
      send(res, 200, { status: "ok" });
      return;
    }

    if (req.method === "POST" && url === "/webhooks/discourse") {
      const chunks: Buffer[] = [];
      let size = 0;

      req.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > MAX_BODY_BYTES) {
          req.destroy();
          return;
        }
        chunks.push(chunk);
      });

      req.on("end", () => {
        void (async () => {
          try {
            const rawBody = Buffer.concat(chunks).toString("utf8");
            const outcome = await handleWebhook(config, rawBody, req.headers);
            send(res, outcome.status, outcome.body);
          } catch (err) {
            send(res, 500, { error: err instanceof Error ? err.message : String(err) });
          }
        })();
      });

      req.on("error", () => {
        // Client aborted mid-request; nothing to respond to.
      });
      return;
    }

    send(res, 404, { error: "not found" });
  });
}
