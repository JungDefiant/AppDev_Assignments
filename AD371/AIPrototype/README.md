# discourse-slack-notifier (AD371 AI Prototype)

A lightweight TypeScript companion application that receives **Discourse**
webhook events (e.g., new posts) and forwards them to **Slack** as
notifications. See [`docs/architecture.md`](docs/architecture.md) for the
accompanying Discourse architecture breakdown.

## Architecture

```
Discourse instance                this service                     Slack
┌────────────────┐   POST /webhooks/discourse   ┌──────────────┐   incoming    ┌───────┐
│  post_created  ├────────────────────────────►│ 1. verify    │──webhook──────►│ Slack │
│  webhook       │   X-Discourse-Event-Signature│ 2. filter    │   (fetch)     │ team  │
└────────────────┘                              │ 3. format    │                └───────┘
                                                └──────────────┘
```

- `src/server.ts` — zero-dependency HTTP server (`node:http`): `GET /healthz`,
  `POST /webhooks/discourse`
- `src/verify.ts` — optional HMAC-SHA256 signature verification
  (`X-Discourse-Event-Signature`, timing-safe compare)
- `src/notifier.ts` — formats a Discourse post payload as a readable Slack
  message (title, author, plain-text excerpt, deep link)
- `src/slack.ts` — delivers via a Slack **Incoming Webhook** using built-in
  `fetch` (with `MOCK_SLACK=1` for dry runs)
- `src/config.ts` — all settings from environment variables

No runtime dependencies; Node ≥ 22.6 runs the TypeScript directly.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your values
```

> `npm start` and `npm run send-test` automatically load `.env` via Node's
> built-in `--env-file-if-exists` support (Node ≥ 20.6) — no dotenv dependency
> needed. Variables set directly in your shell still take precedence over
> values in `.env`.

### 1. Create the Slack Incoming Webhook

1. <https://api.slack.com/apps> → **Create New App** → *From scratch*
2. **Incoming Webhooks** → activate → **Add New Webhook to Workspace** → pick a channel
3. Copy the webhook URL into `SLACK_WEBHOOK_URL` in `.env`

### 2. Create the Discourse webhook

As a Discourse admin:

1. **Admin → API → Webhooks → New Webhook**
2. Payload URL: `http://<your-host>:3000/webhooks/discourse`
3. Content type: `application/json`
4. Event types: check **Post event** (delivers `post_created`)
5. Optionally set a **secret** — put the same value in
   `DISCOURSE_WEBHOOK_SECRET` so the service verifies the
   `X-Discourse-Event-Signature` header

### 3. Run it

```bash
npm start              # start the webhook receiver
npm run send-test      # send one test message through the Slack webhook
```

For local development without Slack credentials:

```bash
MOCK_SLACK=1 npm start
```

## Local Discourse instance

A local Discourse runs on this machine (WSL2, Docker) at **http://localhost**.
See [`docs/local-discourse.md`](docs/local-discourse.md) for credentials,
lifecycle notes, and how to point its **Post event** webhook at this notifier
(payload URL `http://172.22.208.1:3000/webhooks/discourse`).

**Moving to production?** [`docs/vps-deploy.md`](docs/vps-deploy.md) has the
full VPS deployment steps for this exact configuration.

## Testing

```bash
npm test        # unit + end-to-end tests (node:test)
npm run typecheck
```

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP listen port |
| `DISCOURSE_URL` | – | Base URL of the forum, used to build post links |
| `DISCOURSE_WEBHOOK_SECRET` | – | Enables HMAC-SHA256 signature verification |
| `DISCOURSE_EVENTS` | `post_created` | Comma-separated `X-Discourse-Event` values to forward |
| `SLACK_WEBHOOK_URL` | – (required) | Slack incoming webhook URL |
| `SLACK_CHANNEL` | – | Optional channel override (workspace webhooks only) |
| `SLACK_USERNAME` | `Discourse Notifier` | Sender name shown in Slack |
| `MOCK_SLACK` | `0` | `1` = log messages instead of delivering |

## Simulating a webhook locally

```bash
MOCK_SLACK=1 npm start &

curl -X POST http://localhost:3000/webhooks/discourse \
  -H "Content-Type: application/json" \
  -H "X-Discourse-Event: post_created" \
  -H "X-Discourse-Event-Type: post" \
  -d '{"post":{"id":1,"username":"bade","topic_id":10,"topic_title":"Hello world","topic_slug":"hello-world","post_number":1,"excerpt":"<p>First post!</p>"}}'
```

The formatted Slack message is printed to the console.
