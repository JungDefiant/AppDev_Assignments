# Production VPS Deployment Guide

Deploying the **exact `/var/discourse` configuration** from the local WSL2 setup
to a production VPS, following the same INSTALL-cloud.md path.

> Local setup being migrated: standalone template (nginx + Unicorn + Sidekiq +
> PostgreSQL + Redis in one container), `UNICORN_WORKERS: 2`,
> `db_shared_buffers: 512MB`, docker_manager plugin, SMTP skipped,
> `DISCOURSE_HOSTNAME: localhost`, admin `admin@example.com`,
> `post_created` webhook to the AIPrototype notifier.

## 0. What changes local → production

| Local (WSL2) value | Production value | Why |
| --- | --- | --- |
| `DISCOURSE_HOSTNAME: localhost` | `forum.example.com` (your domain) | Real URLs, cookies, Let's Encrypt |
| `DISCOURSE_SKIP_EMAIL_SETUP: "1"` | *(removed)* — real SMTP config | Signup, notifications, digests |
| No SSL templates | `web.ssl.template.yml` + `web.letsencrypt.ssl.template.yml` | HTTPS via Let's Encrypt |
| `UNICORN_WORKERS: 2` / `db_shared_buffers: 512MB` | *(removed — let bootstrap auto-tune)* or set to VPS specs | Local values were tuned for the 7.7GB WSL VM |
| `DISCOURSE_DEVELOPER_EMAILS: admin@example.com` | Your real email | Bootstrap admin grants |
| Webhook target `http://172.22.208.1:3000/...` (internal, SSRF-bypassed) | Public HTTPS notifier URL | No `allowed_internal_hosts` bypass needed |
| Test secret `AD371-local-test-secret` | New high-entropy secret | Never promote local secrets |

Everything else — templates, volumes, hooks (docker_manager plugin), container
name `app` — stays identical, which is the point of this guide.

## 1. Provision the VPS

- **Any Docker-capable provider**: DigitalOcean, Hetzner, Linode, Vultr, AWS EC2...
- **Specs** (INSTALL-cloud.md requirements): minimum 1 GB RAM **with swap**,
  2 GB+ recommended; 2+ cores; 20 GB+ disk; **Ubuntu 22.04/24.04 LTS**
- **DNS**: create an A record `forum.example.com → <VPS public IP>` and wait for
  propagation (verify with `dig +short forum.example.com`) — required *before*
  bootstrap because Let's Encrypt issuance needs it

## 2. Prepare the server (as root over SSH)

```bash
ssh root@<VPS_IP>
apt update && apt upgrade -y

# Swap (required under 2GB RAM; recommended at 2GB)
fallocate -l 2G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile swap swap defaults 0 0' >> /etc/fstab

# Firewall: SSH + HTTP + HTTPS only
apt install -y ufw
ufw allow ssh && ufw allow 80 && ufw allow 443 && ufw enable

# Docker + git (same as the WSL setup)
apt install -y docker.io git
systemctl enable --now docker
docker --version   # expect >= 20.10
```

## 3. Get the Discourse configuration

```bash
git clone https://github.com/discourse/discourse_docker.git /var/discourse
cd /var/discourse
cp samples/standalone.yml containers/app.yml   # same base as local
```

## 4. Edit `containers/app.yml` — the exact production edits

Using the same file as the local instance, make **only** these changes:

```yaml
templates:
  - "templates/postgres.template.yml"
  - "templates/redis.template.yml"
  - "templates/web.template.yml"
  - "templates/web.ratelimited.template.yml"
  - "templates/web.ssl.template.yml"                 # ADD
  - "templates/web.letsencrypt.ssl.template.yml"     # ADD

env:
  ## CHANGED: real domain (A record must already resolve to this server)
  DISCOURSE_HOSTNAME: "forum.example.com"

  ## CHANGED: your real admin email(s), comma-separated
  DISCOURSE_DEVELOPER_EMAILS: "you@yourdomain.com"

  ## REMOVED: delete the DISCOURSE_SKIP_EMAIL_SETUP line

  ## CHANGED: real SMTP (e.g. Postmark, Mailgun, SES, Resend...)
  DISCOURSE_SMTP_ADDRESS: smtp.yourprovider.com
  DISCOURSE_SMTP_PORT: 587
  DISCOURSE_SMTP_USER_NAME: your-smtp-user
  DISCOURSE_SMTP_PASSWORD: "your-smtp-password"
  DISCOURSE_SMTP_FORCE_TLS: true        # for port 465; omit for 587 STARTTLS

  ## REMOVED: delete UNICORN_WORKERS and db_shared_buffers
  ## (bootstrap auto-tunes both from the VPS's RAM/CPU — the guide's
  ## "Auto-scaling" note; or set explicitly for your specs)
```

Leave untouched: `expose 80/443`, the `/shared` volumes, the `hooks` block
(docker_manager plugin), `run` custom commands, `params`.

Then secure the file: `chmod o-rwx containers/app.yml`

## 5. Bootstrap and start (10–30 min)

```bash
cd /var/discourse
./launcher bootstrap app     # builds the image, runs migrations, gets the TLS cert
./launcher start app
```

Bootstrap aborts early with clear messages if the domain doesn't resolve or
mail isn't configured — fix `app.yml` and re-run. Verify:

```bash
curl -I https://forum.example.com     # expect 200 + valid Let's Encrypt cert
```

## 6. First-run: admin account

Browse to `https://forum.example.com` → the setup wizard runs on first visit.
Create the admin account there (email + password, no confirmation round-trip
needed for the wizard account). If you prefer the non-interactive path used
locally:

```bash
cd /var/discourse && ./launcher enter app
rake admin:create    # prompts for email + password
exit
```

Then complete the wizard (or skip it once an admin exists).


## 7. Wire the notifier for production

**Recommended: host the notifier at a public HTTPS URL.** Unlike the local
setup, no SSRF workaround is needed — the payload URL is public.

Options (either works):

- **Netlify Function** — the stateless verify → format → Slack-fetch logic fits
  serverless perfectly; endpoint becomes
  `https://<site>.netlify.app/.netlify/functions/webhooks-discourse`
- **Same VPS as a systemd service** — install Node ≥ 22.6 (NodeSource), run
  `npm start`, point the webhook at `http://127.0.0.1:3000/webhooks/discourse`.
  Caveat: loopback is also in Discourse's blocked ranges, so this needs the
  same `allowed_internal_hosts` bypass as local (`127.0.0.1` this time) —
  acceptable on a single-tenant box you control, but the public-URL options
  avoid it entirely.

**Register the webhook in the Admin UI this time** (no Rails needed — the
payload URL is public):

1. Admin → API → Webhooks → New Webhook
2. Payload URL: your notifier's HTTPS endpoint
3. Content type: `application/json`
4. Event types: check **Post event** (delivers `post_created`)
5. Secret: a **new** high-entropy value (e.g. `openssl rand -hex 32`) —
   never reuse `AD371-local-test-secret`
6. Put the same secret in the notifier's `DISCOURSE_WEBHOOK_SECRET` env

The notifier's `.env` production changes: `DISCOURSE_URL=https://forum.example.com`,
`SLACK_WEBHOOK_URL` unchanged (same Slack workspace), `MOCK_SLACK=0`.

## 8. Optional: migrate the local instance's content

The local forum only has two test topics, so a fresh start is usually fine.
If you do want to carry content/settings over, use Discourse's supported path:

**A. Backup/restore (recommended)**

1. Local: Admin → Backups → create backup, download the `.tar.gz`
2. Production: Admin → Backups → upload, then **Restore**
3. After restore, re-check: the webhook, API keys, and
   `allowed_internal_hosts` may not transfer — re-create per §7
4. All users' emails are placeholder/local in the current data — only worth
   migrating if you've since created real content

**B. Lift-and-shift the volume (exact clone, riskier)**

Copies the database bit-for-bit; requires the **same Discourse/Postgres
version** (pin `params: version:` in `app.yml` to match local, and use the
same `discourse/base` image tag, or results are undefined):

```bash
# local (WSL)
cd /var/discourse && ./launcher stop app
tar czf /tmp/standalone.tgz -C /var/discourse/shared standalone
scp /tmp/standalone.tgz root@<VPS_IP>:/var/discourse/shared/

# VPS
cd /var/discourse
./launcher bootstrap app    # builds the image first
tar xzf /tmp/standalone.tgz -C /var/discourse/shared/
./launcher start app
```

## 9. Day-2 operations (from INSTALL-cloud.md / launcher)

```bash
cd /var/discourse
./launcher logs app        # container logs
./launcher enter app       # shell inside the container
./launcher rebuild app     # after editing app.yml or upgrading Discourse
                           # (~10 min; the multi-container web+data split exists
                           #  to avoid downtime here, if you outgrow standalone)
```

- **Web-based upgrades**: the docker_manager plugin (already in the `hooks`
  block) gives an upgrade UI at `https://forum.example.com/admin/upgrade`
- **Rails production log** (same path as local):
  `/var/discourse/shared/standalone/log/rails/production.log`
- **Email troubleshooting** if digests/notifications don't send:
  Admin → Email has a "send test email" button; then the
  [email troubleshooting guide](https://meta.discourse.org/t/troubleshooting-email-on-a-new-discourse-install/16326)
- **Backups**: Admin → Backups → schedule + (recommended) an S3-compatible
  remote target
- **Post-mortem note**: memory pressure killed our first local bootstrap at
  the asset-precompile step; on a 2 GB VPS the swap file from §2 is what
  prevents that

## Quick troubleshooting (from the local install)

| Symptom | First check |
| --- | --- |
| Bootstrap aborts "Domain is not configured" | `DISCOURSE_HOSTNAME` still a placeholder / DNS not propagated |
| Bootstrap aborts "Mail is not configured" | `DISCOURSE_SKIP_EMAIL_SETUP` carried over or SMTP incomplete |
| Let's Encrypt fails | A record must resolve to this VPS **before** bootstrap; port 80 reachable (ufw) |
| 502 after start | unicorn still booting (~60 s) or workers OOM'd — check swap + `./launcher logs app` |
| Webhook never fires | Event type must be `post_created`, not `post` (see local-discourse.md gotchas) |
