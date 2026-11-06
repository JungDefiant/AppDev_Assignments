# AD371 - OCI Container Assignment

Containerization and orchestration of a lightweight web application:
a **zero-dependency Node.js** server packaged as a minimal, hardened image
and orchestrated with **Docker Compose** (Option A) in a 3-replica setup
behind an nginx gateway.

```
        host :8080
            |
       [ gateway ]  nginx:1.27-alpine  (reverse proxy, DNS round-robin)
            |
   +--------+--------+
   |        |        |            Docker network "frontend" (bridge)
[web 1]  [web 2]  [web 3]         node:24-alpine, non-root, /healthz
```

## Files

| File                 | Purpose                                                        |
|----------------------|----------------------------------------------------------------|
| `server.js`          | App: `/` landing page, `/healthz` health check, `/metadata` runtime info |
| `package.json`       | Manifest (no runtime dependencies) + lockfile for `npm ci`     |
| `Dockerfile`         | Multi-stage build (builder -> runtime), Alpine, non-root       |
| `.dockerignore`      | Keeps build context (and final image) lean                     |
| `docker-compose.yml`| Option A: 3 replicas, resource limits, healthchecks, restarts |
| `.env` / `.env.example` | Environment config for compose substitution and containers |
| `nginx/nginx.conf`   | Reverse-proxy config so replicas share one published port      |

## Endpoints

| Endpoint    | Behavior                                                        |
|-------------|-----------------------------------------------------------------|
| `GET /`     | HTML landing page                                                |
| `GET /healthz` | `200 {"status":"ok",...}` - used by HEALTHCHECK/probes        |
| `GET /metadata` | JSON: hostname, container ID, uptime, Node version, memory |

## Quick start

```bash
# 1. Build and run the full stack (3 web replicas + nginx gateway)
docker compose up --build -d

# 2. Watch replicas come healthy
docker compose ps

# 3. Exercise the app - hit /metadata a few times and watch `containerId`
#    rotate between the three replicas:
curl -s http://localhost:8080/healthz
curl -s http://localhost:8080/metadata

# 4. Tear down
docker compose down
```

## Dockerfile - production hardening checklist

- **Multi-stage build** - `npm ci` runs in the `builder` stage; only
  `server.js`, manifests, and `node_modules/` are copied to `runtime`.
  No compiler, npm cache, or package-manager state in the final image.
- **Lightweight base** - `node:24-alpine` (~50 MB compressed runtime).
- **Non-root** - runs as the built-in unprivileged `node` user (UID 1000).
- **Minimal layers / no caches** - manifest copy is cached independently of
  source; `npm cache clean --force` runs in the builder stage only.
- **HEALTHCHECK** - Docker-level check against `/healthz` using busybox
  `wget` (already in Alpine - no extra packages installed).
- **Pinned bases** - major-version pinned (`node:24-alpine`) for
  reproducible builds; upgrade deliberately.
- **Signal handling** - Node runs as PID 1 (tini is the official image's
  entrypoint) and the app drains connections on `SIGTERM`.

Verify:

```bash
docker build -t ad371/oci-web:1.0.0 .
docker run --rm -d -p 8080:8080 --name oci-web ad371/oci-web:1.0.0
curl http://localhost:8080/healthz
docker inspect --format '{{.State.Health.Status}}' oci-web   # -> healthy
docker exec oci-web id                                       # uid=1000(node)
docker exec oci-web ps                                       # shows node + sh only
docker images ad371/oci-web                                  # final size
docker stop oci-web
```

## Orchestration (Option A - Docker Compose)

- **`deploy.replicas: 3`** - Compose v2 creates `oci-container-web-1..3`.
- **Resource limits** - each replica is capped at `0.50` CPU / `128M` memory
  (OOM-killed above the memory limit) with reservations of `0.10` CPU / `64M`.
- **Health checks** - service-level `healthcheck` hits `/healthz` every 15s;
  `depends_on.condition: service_healthy` gates the gateway startup.
- **Restart policies** - `deploy.restart_policy` (`on-failure`, 5s delay, 3
  max attempts) on web; Compose v2 translates this into the container restart
  policy (verify with `docker inspect <ctr> --format
  '{{.HostConfig.RestartPolicy.Name}}'`). The gateway uses the top-level
  `restart: unless-stopped`.
- **`.env`** - loaded by Compose for `${GATEWAY_PORT}` substitution and
  injected into web containers via `env_file`.
- **Gateway** - the replicas publish no host ports (avoids collisions);
  nginx is the single published entry point and load-balances via Docker's
  embedded DNS round-robin.

Useful commands:

```bash
docker compose config            # validate + render the final config
docker compose ps                 # replica + health status
docker compose top web            # processes inside replicas
docker stats --no-stream         # live CPU/mem vs. limits
docker compose scale web=5        # scale out on demand
```

## Assumptions / limitations

- Zero npm dependencies by design (smallest supply-chain surface, offline
  builds). The Dockerfile's `npm ci --omit=dev` stage still demonstrates the
  correct pattern for projects that do have dependencies.
- DNS round-robin (not L7 aware) is sufficient here; for session affinity or
  zero-downtime rolling updates, use Swarm/Kubernetes.
- Windows/macOS hosts allocate memory to Docker Desktop - the `128M` limits
  are per container, not host totals.
