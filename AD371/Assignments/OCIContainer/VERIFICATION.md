# Verification Guide — OCI Container Assignment

Step-by-step instructions for verifying every checklist item for the stack in this
directory: a zero-dependency Node.js app (`ad371/oci-web:1.0.0`, non-root,
`/healthz` + `/metadata` endpoints) orchestrated by Docker Compose as 3
replicas behind an nginx gateway published on host port **8080**.

> All commands are run from the project directory
> (`AD371/Assignments/OCIContainer`) in a terminal with Docker Desktop running.
> Prerequisite: make sure `.env` exists (`cp .env.example .env`) before running
> Compose.

---

## ✅ Checklist 1 — Container Image & Build Verification

### 1.1 Image builds cleanly without warnings or errors

Run a clean build so nothing is served from cache and no previous run masks
problems:

```bash
docker compose build --no-cache --pull web
```

**Pass criteria:**
- The build completes with exit code 0 and ends with a `naming to
  docker.io/ad371/oci-web:1.0.0` (and `done`) line for both stages
  (`builder` and `runtime`).
- No `ERROR` or `failed to solve` lines from BuildKit.
- No layer-build warnings (e.g., "Undefined variable", `npm WARN`,
  `npm notice`, deprecated-package warnings, or package-manager cache hints).

Optional — build the Dockerfile directly to confirm it also works outside
Compose:

```bash
docker build --no-cache --pull -t ad371/oci-web:1.0.0 .
```

### 1.2 `docker images` proves the final image is lean and properly tagged

```bash
docker images ad371/oci-web
```

**Pass criteria:**
- The image is listed with repository `ad371/oci-web` and tag `1.0.0`
  (properly tagged — not `<none>:<none>` / dangling).
- Size is small relative to the full builder base: expect roughly
  **85–130 MB** uncompressed (Alpine-based `node:24-alpine` plus the app).
  The multi-stage build guarantees no npm cache, toolchain, or build artifacts
  are present.

Confirm no dangling builder remnants are tagged as the final image:

```bash
docker images --filter dangling=true
```

Optionally prove the multi-stage build kept it lean by inspecting the image's
layers for anything unexpected:

```bash
docker history ad371/oci-web:1.0.0
```

**Pass criteria:** the top layers are only the 3 `COPY --from=builder`
layers, `WORKDIR`, `USER`, `EXPOSE`, and `HEALTHCHECK` — no `npm ci`,
`RUN apk`, or cache layers from the builder stage.

### 1.3 Container process runs as a non-root user

Start the stack and inspect the process inside a running container:

```bash
docker compose up --build -d
docker compose ps                          # note the 3 healthy web containers
docker compose top web                     # USER column + command per replica
```

**Pass criteria:** the `USER` column shows `node` (not `root`) for the
`node server.js` process in every replica.

Verify both the container's configured user and the *actual runtime process*
for a single container (replace `oci-container-web-1` with a real name from
`docker compose ps`):

```bash
docker inspect oci-container-web-1 --format '{{.Config.User}}'
# Expected: node

docker top oci-container-web-1
# Expected: UID/GID column shows 1000 (the built-in unprivileged `node` user)

docker exec oci-container-web-1 id
# Expected: uid=1000(node) gid=1000(node)

docker exec oci-container-web-1 sh -c 'ps -o pid,user,args'
# Expected: only the node process — no root shells
```

**Evidence to screenshot:** `docker compose top web` output plus one
`docker exec <container> id` output showing `uid=1000(node)`.

---

## ✅ Checklist 2 — Functional & Endpoint Testing

The nginx gateway publishes the whole stack on
`http://localhost:${GATEWAY_PORT}` (default **8080**). All endpoints below are
exercised through the gateway.

### 2.1 Main page returns HTTP 200 OK

```bash
curl -s -o /dev/null -w "HTTP %{http_code} in %{time_total}s\n" http://localhost:8080/
# Expected: HTTP 200 in ~0.0xs

curl -i http://localhost:8080/ | head -n 8
# Expected: HTTP/1.1 200 OK, Content-Type: text/html; charset=utf-8, Cache-Control: no-store
```

Or open **http://localhost:8080/** in a browser — the 📦 *OCI Container Demo*
landing page renders with the greeting
*"Hello from a hardened, non-root Alpine container"*.

### 2.2 `/healthz` returns a healthy status payload

```bash
curl -s -w "\nHTTP %{http_code}\n" http://localhost:8080/healthz
```

**Expected (HTTP 200):**

```json
{
  "status": "ok",
  "uptimeSeconds": 123
}
```

Confirm the health checks wired into the stack agree:

```bash
docker compose ps          # STATUS column shows (healthy) for web + gateway
```

### 2.3 Application displays its dynamic container hostname / ID

The landing page renders *"Served by container `<id>` (host `<hostname>`)"*,
and `/metadata` exposes it as JSON. Hit it several times — the nginx gateway
round-robins across replicas, so the `hostname`/`containerId` rotate between
the 3 replicas:

```bash
for i in 1 2 3 4 5 6; do curl -s http://localhost:8080/metadata | grep hostname; done
```

Cross-check one of the reported hostnames against the *actual* running
containers to prove the value is dynamic, not hard-coded:

```bash
docker compose ps -q web | xargs docker inspect --format '{{.Name}}'
```

**Pass criteria:**
- At least two different `hostname` values appear across repeated requests
  (3 distinct values expected with default DNS round-robin).
- Each reported hostname matches one of the real container names/IDs from
  `docker compose ps`, and the browser page shows the same values in the
  "Served by container ... (host ...)" line.

---

## ✅ Checklist 3 — Orchestration & Resilience Testing

### 3.1 Scaling to at least 3 replicas — all healthy

The default stack already runs 3 replicas. Verify it, then scale **up to 5**
and verify again (this also exercises the gateway re-resolving new replicas):

```bash
# Default 3 replicas
docker compose up --build -d
docker compose ps          # three oci-container-web-N entries, all (healthy)
```

**Pass criteria:** three `oci-container-web-N` services listed, every one with
`STATUS: Up ... (healthy)`, plus the `gateway` also `(healthy)`.

Scale out:

```bash
docker compose up -d --scale web=5
docker compose ps
```

**Pass criteria:**
- 5 web containers, all `(healthy)`.
- The gateway picks them up automatically: repeated requests now resolve to
  up to 5 different hostnames:

  ```bash
  for i in $(seq 1 10); do curl -s http://localhost:8080/metadata | grep hostname; done
  ```

Scale back down afterwards:

```bash
docker compose up -d --scale web=3
```

### 3.2 Self-healing / auto-restart after a kill

Pick one web container and kill it hard (simulates a crash):

```bash
docker compose ps                     # pick one replica, e.g. oci-container-web-2
docker kill oci-container-web-2
```

Watch Docker's restart policy (`on-failure`, 5 s delay, 3 max attempts)
restart it — no manual action needed:

```bash
docker compose ps                    # re-run every few seconds
```

**Pass criteria:**
- Within ~5–10 seconds the killed container reappears with `STATUS:
  Up ... (healthy)`.
- No manual `docker start` / `docker compose up` was needed.
- Service stayed available the whole time (nginx kept routing to the
  surviving replicas):

  ```bash
  curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8080/
  # Expected: HTTP 200 (immediately after the kill)
  ```

Extra evidence that the policy is actually configured:

```bash
docker inspect oci-container-web-1 --format '{{.HostConfig.RestartPolicy.Name}}'   # on-failure
docker inspect --format '{{.State.Status}} (restarts: {{.RestartCount}})' oci-container-web-2
```

> Optional add-on: verify the orchestrator's resource enforcement with
> `docker stats --no-stream` — live CPU/mem per replica against the
> 0.50 CPU / 128M limits.

---

## ✅ Checklist 4 — Browser Console & Health Check Status

Open **http://localhost:8080/** in Chrome/Edge/Firefox with DevTools open
(`F12` or `Ctrl+Shift+I`).

### 4.1 Network tab — proper status codes, headers, response times

1. With the **Network** tab open, hard-reload the page (`Ctrl+F5`).
2. Click each request and confirm the **Headers** and **Timing** sub-tabs:

| Request                    | Status          | Headers to confirm                                    | Response time             |
|----------------------------|-----------------|-------------------------------------------------------|--------------------------|
| `/` (document)             | **200 OK**      | `Content-Type: text/html; charset=utf-8`, `Cache-Control: no-store` | well under 100 ms locally |
| `/healthz`                 | **200 OK**      | `Content-Type: application/json; charset=utf-8`, `Cache-Control: no-store` | single-digit ms |
| `/metadata`                | **200 OK**      | same as `/healthz`                                     | single-digit ms          |
| missing path, e.g. `/nope` | **404** (JSON)  | —                                                     | —                        |

3. Click the `/healthz` and `/metadata` links on the page so they appear in
   the Network tab as real entries with status + timing waterfall.
4. Repeat `/metadata` a few times — replica changes must not produce 5xx
   responses, `CORS error`, or latency spikes.

**Pass criteria:** no request shows `4xx` (other than an intentional 404),
`5xx`, `(failed)`, or `net::ERR_*`; response times are single/double-digit ms.

### 4.2 Console free of uncaught frontend errors

With the **Console** tab open:

1. Hard-reload the landing page.
2. Click both links on the page (`GET /healthz`, `GET /metadata`).
3. Navigate back and reload once more.

**Pass criteria:**
- Console shows **no red errors** — no `Uncaught SyntaxError`,
  `Uncaught TypeError`, `Uncaught ReferenceError`, mixed-content, or
  `net::ERR_*` failures.
- Only benign informational lines (if any), e.g. DevTools' self-XSS
  "Don't paste code..." warning — a browser message, not an app error.

  > The page is server-rendered static HTML with **zero JavaScript**, so any
  > red error here would indicate a routing/serving problem, not a frontend
  > bug.

---

## Cleanup

```bash
docker compose down                # stop and remove the stack + networks
# docker compose down --rmi all    # optionally also remove the built image
```

