# Production VPS Deployment — DigitalOcean Droplet

Target server (verified 2026-10-19):

| Item | Value |
| --- | --- |
| Droplet | `marketplace-s-1vcpu-1gb-sfo2` (DigitalOcean, SFO2) |
| IP | `138.68.3.138` |
| OS | Ubuntu 22.04.5 LTS |
| Spec | 1 vCPU / 1 GB RAM / 25 GB disk (**no swap — must add**) |
| Docker | 29.7.2 (preinstalled) |
| SSH | `ssh ad371-discourse` (alias configured in `~/.ssh/config`, key `~/.ssh/id_rsa_digitalocean_ad371`) |

> ⚠️ 1 GB is the absolute *minimum* (guide: 1 GB **with swap**; 2 GB+ recommended).
> Strongly consider resizing to 2 GB at least for the bootstrap —
> `assets:precompile` is memory-hungry and we already saw it fail locally
> under memory contention. It *can* work on 1 GB + swap, just slowly.

## Smoke deployment status (2026-10-20) — forum runs, one step left

The droplet was deployed in **smoke-test mode** (user chose "skip mail,
bootstrap immediately"):

- ✅ Swap 2 GB added; droplet resized to 2 GB (hostname now `marketplace-s-1vcpu-2gb-sfo2`)
- ✅ `app.yml` backed up (`containers/app.yml.bak.*`), then edited:
  `DISCOURSE_HOSTNAME: "localhost"`, `DISCOURSE_SKIP_EMAIL_SETUP: "1"`,
  SSL/Let's Encrypt templates commented out, `SMTP_FORCE_TLS` commented
- ✅ Bootstrap succeeded; container `app` running (`UNICORN_WORKERS=3` auto-tuned),
  HTTP 200 locally on the droplet
- ✅ Admin: `user1` / `admin@example.com` / `AD371ProdAdmin!` (via `rake admin:create`)
- ✅ **Notifier deployed (2026-10-20)**: Node 24 via NodeSource at
  `/opt/discourse-slack-notifier` (source of truth: `AD371/Assignments/AIPrototype/`
  — the project was moved there), running as systemd service
  `discourse-notifier` (enabled at boot, `Restart=always`), live Slack delivery,
  HMAC signature verification, `.env` chmod 600
- ✅ **Webhook registered & verified end-to-end on the droplet**: webhook ID 1
  → `http://172.17.0.1:3000/webhooks/discourse`, `post_created`,
  `allowed_internal_hosts = 172.17.0.1`, ufw rule for the docker subnet.
  Test post delivered to Slack (notifier journal: `delivered post_created to
  Slack`; Discourse delivery record: HTTP 200 / 397 ms)
- ❌ **External port 80/443 blocked** — ufw on the droplet allows them and
  Docker's chains precede ufw, but the DO **Cloud Firewall** (control panel,
  hypervisor level, from the Docker 1-click image) only passes SSH.
  Fix: DigitalOcean panel → Networking → Firewalls → firewall attached to
  this droplet → add inbound rules **TCP 80** and **TCP 443** (All IPv4/IPv6).
  The on-droplet ufw is already correct.

To go to production later: set the real `DISCOURSE_HOSTNAME`, uncomment the
SSL/Let's Encrypt templates, configure real SMTP, remove
`DISCOURSE_SKIP_EMAIL_SETUP`, then `cd /var/discourse && ./launcher rebuild app`
(backups exist; the rebuild is destructive-free for `/shared` data).

## Step 0 — SSH access (already fixed)

The earlier `Permission denied (publickey)` happened because SSH only tries
default key *names* (`id_rsa`, `id_ed25519`, …). The droplet key lives at
`~/.ssh/id_rsa_digitalocean_ad371`. Fixed permanently via `~/.ssh/config`:

```
Host ad371-discourse 138.68.3.138
    HostName 138.68.3.138
    User root
    IdentityFile ~/.ssh/id_rsa_digitalocean_ad371
    IdentitiesOnly yes
```

## Step 1 — DNS (before Let's Encrypt works)

Point an A record at `138.68.3.138`, e.g. `forum.yourdomain.com → 138.68.3.138`.
Verify with `dig +short forum.yourdomain.com` **before bootstrapping** —
the Let's Encrypt step in the build fails if DNS doesn't resolve.

## Step 2 — Add swap (mandatory on 1 GB)

From the INSTALL-cloud.md troubleshooting section:

```bash
ssh ad371-discourse
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
```

## Step 3 — Get the configuration

Docker is already installed, so skip the interactive installer entirely:

```bash
apt-get update -qq
git clone https://github.com/discourse/discourse_docker.git /var/discourse
cd /var/discourse
cp samples/standalone.yml containers/app.yml
```

## Step 4 — Production edits to `containers/app.yml`

Same file we used locally, but with production values:

```yaml
templates:
  - "templates/postgres.template.yml"
  - "templates/redis.template.yml"
  - "templates/web.template.yml"
  - "templates/web.ratelimited.template.yml"
  - "templates/web.ssl.template.yml"                 # ← uncomment for HTTPS
  - "templates/web.letsencrypt.ssl.template.yml"     # ← uncomment (free TLS)

env:
  DISCOURSE_HOSTNAME: forum.yourdomain.com           # real domain, not localhost
  DISCOURSE_DEVELOPER_EMAILS: you@yourdomain.com     # becomes admin on signup
  # DELETE the DISCOURSE_SKIP_EMAIL_SETUP line — production needs mail
  DISCOURSE_SMTP_ADDRESS: smtp.yourprovider.com      # real SMTP (required)
  DISCOURSE_SMTP_PORT: 587
  DISCOURSE_SMTP_USER_NAME: you@yourdomain.com
  DISCOURSE_SMTP_PASSWORD: "real-password"

params:
  db_shared_buffers: "256MB"    # pinned: 25% of 1 GB RAM (don't let auto-tune see swap)
  # UNICORN_WORKERS: 2          # optional pin; auto-tune picks 2 on 1 vCPU anyway
```

Keep: `expose 80/443`, the `/shared` volumes, and the `docker_manager` plugin
hook (it gives the web upgrade UI at `/admin/upgrade`).

## Step 5 — Bootstrap and start (~20–60 min on 1 vCPU)

```bash
cd /var/discourse
./launcher bootstrap app     # run inside tmux/screen — never let SSH drop mid-build
./launcher start app
curl -I https://forum.yourdomain.com
```

If it fails: `./launcher logs app` and
`/var/discourse/shared/standalone/log/rails/production.log`
(same troubleshooting as the local install).


## Step 6 — Admin account

With working SMTP the normal flow works: register using an email listed in
`DISCOURSE_DEVELOPER_EMAILS`, click the activation email link, and that
account becomes admin automatically. Or the non-interactive way:

```bash
./launcher enter app
rake admin:create
```

## Step 7 — Notifier on the same VPS

The companion app runs as a systemd service next to the container:

```bash
# Node 22 (Ubuntu 22.04's stock Node is too old for native TS)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Ship the app (from AD371/AIPrototype on your workstation)
mkdir -p /opt/discourse-slack-notifier
scp -r src package.json tsconfig.json \
    ad371-discourse:/opt/discourse-slack-notifier/
ssh ad371-discourse "cd /opt/discourse-slack-notifier && npm install --omit=dev"
```

`/opt/discourse-slack-notifier/.env`:

```
PORT=3000
DISCOURSE_URL=https://forum.yourdomain.com
DISCOURSE_WEBHOOK_SECRET=<same secret as the Discourse webhook, >=12 chars>
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
MOCK_SLACK=0
```

`/etc/systemd/system/discourse-notifier.service`:

```ini
[Unit]
Description=Discourse to Slack notifier
After=network-online.target

[Service]
WorkingDirectory=/opt/discourse-slack-notifier
ExecStart=/usr/bin/node --env-file-if-exists=.env src/index.ts
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload && systemctl enable --now discourse-notifier
curl http://127.0.0.1:3000/healthz
```

## Step 8 — Register the webhook (production)

> ⚠️ The notifier runs on the **host**, but webhook delivery is performed by
> Discourse **inside the container** — `127.0.0.1` there is the container's
> own loopback and will never reach it. Use the Docker bridge gateway
> (`172.17.0.1`, exported as `DOCKER_HOST_IP` in the container) instead, and
> open that single port in ufw for the docker subnet.

Registered via `scripts/setup_notifier_webhook.rb` (shipped to
`/var/discourse/shared/standalone/`, run with `bin/rails runner /shared/...`):
it sets `SiteSetting.allowed_internal_hosts = "172.17.0.1"`, creates the
`WebHook` (payload URL `http://172.17.0.1:3000/webhooks/discourse`, secret,
`post_created`), and a test API key. Required firewall rule:

```bash
ufw allow from 172.17.0.0/16 to any port 3000 proto tcp comment discourse-notifier
```

Create a test post and confirm it lands in Slack.

> Public-notifier alternative: deploy the notifier anywhere with a public
> HTTPS URL (Netlify function, Fly.io) and no `allowed_internal_hosts`
> bypass or ufw rule is needed at all.

## Step 9 — Firewall & maintenance

- Use a **DigitalOcean Cloud Firewall** (not ufw — Docker publishes ports
  past ufw): inbound allow TCP 22, 80, 443 only.
- Upgrades: Admin → Upgrade in the browser (docker_manager plugin), or
  `cd /var/discourse && ./launcher rebuild app`.
- Logs: `./launcher logs app`; Rails:
  `/var/discourse/shared/standalone/log/rails/production.log`.
- Backups: `./launcher backup app` (also schedulable via Admin → Backups).

## Migration from the local instance (optional)

The local forum's data can move over: on `http://localhost` take
Admin → Backups → Download, then upload on production and Restore.
Or start fresh — recommended for a real launch.
