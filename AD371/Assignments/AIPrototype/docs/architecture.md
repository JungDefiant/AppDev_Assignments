# Discourse Architecture Breakdown

Analysis of two repositories:

- `discourse/discourse` — the application itself (Ruby on Rails + Ember.js)
- `discourse/discourse_docker` — the official Docker packaging and deployment tooling

---

## 1. Primary Architectural Style: **Modular Monolith**

Discourse is a **modular monolith**, not a microservices system:

- **One deployable application** contains all domain logic (users, topics, posts,
  notifications, search, moderation, chat, badges, etc.) in a single Rails codebase
  (`app/`, `lib/`, `config/`, `db/`), backed by a single primary database.
- **Modularity within the monolith:**
  - Classic Rails MVC layering (models / controllers / views) under `app/`.
  - A formal **plugin system** (`plugins/` directory) with hook-based extension
    points — plugins are Ruby/Rails code loaded into the same process, which is a
    textbook modular-monolith seam (e.g., the `docker_manager` plugin provides
    web-based upgrades).
  - An **Ember.js SPA frontend** served and versioned by the same application,
    talking to a JSON REST API.
- **Background work is in-process**, not a separate service tier: **Sidekiq**
  workers (Ruby, started alongside the web server via `UNICORN_SIDEKIQS`) consume
  Redis-backed queues for digests, emails, post processing, and search indexing.
- **Async integration with the outside world is event-driven at the edges**:
  outbound **webhooks** (`post_created`, `topic_created`, ...), the
  **MessageBus** pub/sub channel (long-polling/WebSocket push to browsers), and
  optional pollers to remote services.

Deployment (`discourse_docker`) confirms this: the recommended setup bundles
*everything* into **one container** (standalone template), or splits it into
**two containers** — web tier vs. data tier — which is a deployment split of
the *same logical monolith*, not a service decomposition.

### Summary of the style

| Style | Verdict |
| --- | --- |
| Microservices | ✗ — no independently deployable domain services |
| Serverless | ✗ — self-hosted long-running processes |
| Layered/tiered (MVC) | ✓ — *within* the monolith (Rails MVC + API + SPA) |
| Event-driven | ✓ — *at the edges* (webhooks, MessageBus, Redis queues) |
| **Modular monolith** | **✓ — primary style** |

---

## 2. Core Component Map

Sourced from `discourse_docker` templates
(`templates/web.template.yml`, `templates/postgres.template.yml`,
`templates/redis.template.yml`) and samples (`samples/standalone.yml`,
`samples/web_only.yml`, `samples/data.yml`).

| Component | Technology | Role |
| --- | --- | --- |
| Reverse proxy / TLS terminator | **nginx** (`/etc/service/nginx`, ports 80/443) | Serves precompiled static assets, proxies application requests to the Rails server, rate limiting (`web.ratelimited.template.yml`), optional Let's Encrypt SSL (`web.letsencrypt.ssl.template.yml`), optional CDN in front |
| Compute engine (web) | **Unicorn** Rails app server (`config/unicorn_launcher`, `UNICORN_WORKERS`, default 3) | Runs the Ruby on Rails application: REST/JSON API, server-rendered pages, admin UI; boots with optional `db:migrate` and `assets:precompile` |
| Compute engine (background) | **Sidekiq** workers (`UNICORN_SIDEKIQS`) | Asynchronous jobs: email digests and notifications, post cooking, badge processing, search indexing, scheduled/cron-style work |
| Database | **PostgreSQL** (data tier; `DISCOURSE_DB_*` env) | System of record for all domain data; also provides full-text search (tsvector/pg_trigram) and advisory locks |
| Cache / queue / pub-sub | **Redis** (`DISCOURSE_REDIS_HOST`) | Application cache, Sidekiq job queues, rate-limit counters, and backing store for MessageBus (browser push transport) |
| Frontend | **Ember.js SPA** + MessageBus client | Rich client served from the same app; receives live updates over MessageBus long-polling/WebSocket |
| Outbound email | **External SMTP** (`DISCOURSE_SMTP_*` env; no MTA in the image) | Account validation, notifications, digests |
| Process supervision | **runit** (`/etc/service/*`), cron/anacron | Supervises nginx/unicorn daemons and scheduled tasks inside the container |
| Upgrades | **docker_manager** plugin + `./launcher rebuild` | Web-based or CLI rebuilds; stateless container, data in `/shared` volume |


### Deployment topology (`discourse_docker`)

```
                    ┌─────────────────────────────────────────────┐
   browser ───────► │  standalone container (samples/standalone)  │
                    │                                             │
                    │  nginx ──► Unicorn (Rails) ──┐              │
                    │          │        ▲         │              │
                    │          │        └─ Sidekiq workers        │
                    │          ▼                │ │              │
                    │     static assets    Redis │ │ (cache/queue │
                    │                                /MessageBus) │
                    │                     Postgres │ │ (data +     │
                    │                              │ │  search)   │
                    │  /shared volume ── all persistent state      │
                    └─────────────────────────────────────────────┘
                    outgoing: SMTP (external)

  two-container option:
    web_only container (nginx + Unicorn + Sidekiq)
        ──links──► data container (PostgreSQL + Redis)
```

- `./launcher` bootstraps a container by composing declarative YAML templates
  (`postgres`, `redis`, `web`, rate-limiting, SSL) into an image and running it
  with the `/shared` host volume for state (the image itself is stateless).
- The multi-container setup exists for scaling/HA: blue-green web rebuilds,
  beefier data-tier hardware, redundancy — but each container still runs
  monolithic Discourse.

---

## 3. Where the Companion App Fits (AD371/AIPrototype)

The Discourse → Slack notifier is a **sidecar integration service** that
plugs into the monolith's event-driven edge without modifying it:

```
Discourse (modular monolith)                Companion service (TypeScript)
┌──────────────────────────┐                ┌──────────────────────────┐
│ Rails/Unicorn             │  webhook:      │ node http server         │
│  post_created event ─────┼───────────────►│  /webhooks/discourse     │
│                          │  HMAC-SHA256    │   ├─ verify signature    │
│ Redis/Sidekiq (internal) │  signature     │   ├─ build message       │
│ Postgres (internal)      │                │   └─ POST to Slack        │
└──────────────────────────┘                │        incoming webhook  │
                                            └──────────────────────────┘
```

Rationale: Discourse already emits webhooks for domain events, so a small
stateless translator (webhook in → formatted Slack message out) is the
lowest-coupling way to extend the platform — consistent with how the modular
monolith is meant to be integrated with.
