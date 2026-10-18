# Local Discourse Instance (WSL2)

A local Discourse was installed on this machine following the manual path of
[docs/INSTALL-cloud.md](https://github.com/discourse/discourse/blob/main/docs/INSTALL-cloud.md)
(the interactive installer is wizard-driven; the same underlying
`discourse_docker` steps were executed non-interactively).

## Where it lives

| Item | Value |
| --- | --- |
| Host | WSL2 Ubuntu 22.04 (systemd enabled), Docker Engine 29.x inside the distro |
| Config | `/var/discourse` (clone of `discourse/discourse_docker`) |
| Container config | `/var/discourse/containers/app.yml` (from `samples/standalone.yml`) |
| Container name | `app` (standalone: nginx + Unicorn + Sidekiq + PostgreSQL + Redis) |
| Data | `/var/discourse/shared/standalone` (mounted at `/shared` in the container) |
| URL | http://localhost (WSL2 forwards ports 80/443 to Windows) |
| Admin | email `admin@example.com`, username `user1`, password `AD371LocalAdmin!` — **change this before any real use** |
| Email | SMTP skipped (`DISCOURSE_SKIP_EMAIL_SETUP=1`) — local/testing only |

Local-only tweaks made to `app.yml`: `DISCOURSE_HOSTNAME: "localhost"`,
`DISCOURSE_SKIP_EMAIL_SETUP: "1"`, `UNICORN_WORKERS: 2`,
`db_shared_buffers: "512MB"` (tuned for the 7.7 GB WSL VM).

## Lifecycle (important WSL caveats)

- **WSL auto-shutdown**: the WSL VM shuts down ~8 s after the last WSL session
  closes, which stops the forum. Keep a WSL terminal open, or run a keepalive
  in the background from Windows:
  ```powershell
  Start-Process wsl -ArgumentList "-d","Ubuntu","-u","root","--","tail","-f","/dev/null" -WindowStyle Hidden
  ```
- The container runs with `--restart=always`, so as soon as WSL boots (any
  `wsl` command or terminal), Docker restarts the forum automatically.
- Standard operations (from `/var/discourse`, as root in WSL):
  ```bash
  ./launcher logs app      # view logs
  ./launcher restart app   # restart
  ./launcher rebuild app   # rebuild after editing app.yml / upgrading
  ./launcher enter app      # shell inside the container
  ```
- Rails production log: `/var/discourse/shared/standalone/log/rails/production.log`

## Connecting the notifier (Discourse → Slack) — **DONE, verified working**

The webhook is registered in the local Discourse and was verified end-to-end on
2026-10-17: a post created in the forum was delivered to Slack
(notifier log: `delivered post_created to Slack`; Discourse delivery record:
HTTP 200 in 287 ms).

Registered webhook:

- Payload URL: `http://172.22.208.1:3000/webhooks/discourse`
- Event types: `post_created`
- Secret: `AD371-local-test-secret` (HMAC-SHA256 signature, verified by the notifier)
- `SiteSetting.allowed_internal_hosts` was set to `172.22.208.1` so Discourse's
  SSRF guard permits the private-range webhook target
- A user-scoped admin API key (`notifier-test`) exists for creating test posts
  via the REST API

Gotchas discovered during setup (relevant if re-registering via Rails):

1. Event types in `web_hook_event_types` are full event names
   (`post_created`, `post_edited`, ...) — **not** groups like `post`.
   Associating a hook with a non-existent name silently never fires.
2. `WebHook.secret` must be ≥ 12 characters.
3. The webhook association must be attached **before** `save!`
   (`validates :web_hook_event_types, presence: true`).
4. Fresh installs without the setup wizard have
   `allow_uncategorized_topics` disabled — create test posts in the
   *General* category (id 4) or pass an explicit `category`.

## Install history (for reference)

1. Docker + git installed in WSL Ubuntu (`apt install docker.io`, `systemctl enable --now docker`)
2. `git clone https://github.com/discourse/discourse_docker.git /var/discourse`
3. `cp samples/standalone.yml containers/app.yml`, edited as above
4. `./launcher bootstrap app` (failed once at `assets:precompile:pretty_text`
   due to WSL shutdown/resource contention; passed on retry after tuning
   `UNICORN_WORKERS`/`db_shared_buffers`)
5. `./launcher start app`
6. Admin created via `rake admin:create` (piped answers)
