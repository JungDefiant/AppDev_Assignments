# Manual Test Procedures - MultiSubnetTopology

Step-by-step procedures for demonstrating failover, subnet isolation, and
load balancer traffic handling against the deployed topology. All commands
were verified against a live deployment; each section shows the commands, the
expected result, and the evidence captured when this guide was written.

> **Before you start**
>
> 1. Deploy the topology if you haven't already (`terraform apply`).
> 2. In Git Bash on Windows, Docker's CLI is often not on `PATH`. Run this
>    once per terminal session:
>
>    ```bash
>    export PATH="$HOME/AppData/Local/Programs/DockerDesktop/resources/bin:$PATH"
>    ```
>
> 3. The load balancer listens on host ports **8080 (HTTP)** and **8443
>    (TLS)** on this machine (see `terraform.tfvars`).
>
> The automated equivalents of these procedures live in `tests/run-tests.sh`.

---

## Procedure 1 - Stop a backend and demonstrate automatic failover

**Goal:** prove that killing one backend instance causes zero service
disruption; remaining instances transparently absorb 100% of the traffic,
and the restarted instance rejoins the pool.

### Commands

```bash
# Baseline: all backends in rotation
for i in {1..4}; do curl -s http://localhost:8080/ ; echo; done

# Kill one instance
docker stop backend-1

# Requests DURING the outage
for i in {1..8}; do curl -s -w ' -> HTTP %{http_code}\n' http://localhost:8080/ ; done

# Bring it back
docker start backend-1

# Wait for the container's own HEALTHCHECK to pass
docker inspect --format '{{.State.Health.Status}}' backend-1   # -> "healthy"

# nginx retries the peer after fail_timeout=15s, so wait that out
sleep 16

# Requests AFTER recovery
for i in {1..8}; do curl -s -w ' -> HTTP %{http_code}\n' http://localhost:8080/ ; done
```

### Observed evidence

- During the outage: **8/8 requests returned `HTTP 200`** - zero dropped
  requests, zero 502 Bad Gateway - and `backend-1` served nothing. The
  remaining three instances (`backend-2`, `pybackend-1`, `pybackend-2`)
  absorbed 100% of traffic:

  ```
  HTTP 200 <- "serverId":"backend-2"
  HTTP 200 <- "serverId": "pybackend-1"
  HTTP 200 <- "serverId": "pybackend-2"
  HTTP 200 <- "serverId":"backend-2"
  ...                                   <- no backend-1, no failures
  ```

- After restart (+15s `fail_timeout`), `backend-1` re-entered the rotation:

  ```
  HTTP 200 <- "serverId":"backend-2"
  HTTP 200 <- "serverId":"backend-1"    <- back in the pool
  HTTP 200 <- "serverId": "pybackend-1"
  HTTP 200 <- "serverId":"backend-1"
  ...
  ```

### Why it works

- `proxy_next_upstream` (nginx default: `error timeout`) retries a failed
  upstream attempt on the next peer in the pool, so the client never sees
  the failure.
- `max_fails=3 fail_timeout=15s` on each upstream server temporarily removes
  a flapping peer from rotation, and restores it after the window elapses.
- `proxy_connect_timeout 2s` keeps the retry delay short (a dead backend IP
  silently drops packets, so the timeout is what bounds the failover).

> **Known limitation:** nginx resolves backend hostnames once at startup.
> Docker usually reassigns the same IP on restart (which is why this
> procedure passes), but if a backend returns on a *different* IP it will
> not truly rejoin the pool until nginx is reloaded. See "Known limitations"
> in the README.

---

## Procedure 2 - Direct connection attempt (subnet isolation proof)

**Goal:** negative test - prove the host cannot reach backend containers
directly, by published port OR by container IP, and that the load balancer
is the only path in.

### Commands

```bash
# Attempt 1: a backend's container port on the host
curl -v --connect-timeout 3 http://localhost:3000/

# Attempt 2: the backend container's private-subnet IP, discovered via docker
IP=$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' backend-1)
echo "$IP"
curl -v --connect-timeout 3 "http://$IP:3000/healthz"

# Control: the published load balancer port works
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/

# Show the backend has no published host ports at all
docker port backend-1          # prints nothing

# Show the network itself is air-gapped
docker network inspect multisubnet-private_subnet --format '{{.Internal}}'   # -> "true"
```

### Observed evidence

- `curl http://localhost:3000` -> **connection refused** (curl exit 28,
  `http_code=000`)
- `curl http://172.28.1.3:3000/healthz` (backend-1's actual container IP)
  -> **no route / unreachable** - even knowing the IP, the host cannot enter
  the private subnet
- `curl http://localhost:8080/healthz` -> **HTTP 200** (the only front door)
- `docker port backend-1` -> empty (0 published ports)
- `docker network inspect ... .Internal` -> `true`

### Why it works

- Backend containers define **no `ports` blocks** in Terraform, so nothing is
  ever published to the host.
- `private_subnet` is a Docker network with `internal = true`: Docker
  provides no external routing for it at all. The only attached container
  with a second network interface (dual-homed) is the nginx load balancer,
  making it the single gateway between the subnets.

---

## Procedure 3 - Log evidence of health checks and traffic redirection

**Goal:** prove via container logs that the load balancer received the client
traffic, redirected it to backends over the private subnet, and that health
checks are flowing.

### Commands

```bash
# Generate some fresh traffic first
for i in {1..5}; do
  curl -s -o /dev/null http://localhost:8080/
  curl -s -o /dev/null http://localhost:8080/healthz
  sleep 0.2
done
sleep 1

# 1. The load balancer's access log (client side of the proxy)
docker logs --tail 10 multisubnet-nginx-lb

# 2. A backend's log (upstream side of the proxy - Python logs every request)
docker logs --tail 10 pybackend-1

# 3. Proxied traffic only: entries whose source is the LB's private IP
docker logs --since 2m pybackend-1 2>&1 | grep -v '127.0.0.1' | grep GET

# 4. Docker-level health check status
docker inspect --format \
  '{{.State.Health.Status}} (checks recorded: {{len .State.Health.Log}})' \
  backend-1 backend-2 pybackend-1 pybackend-2
```

### Observed evidence

1. **LB access log** - nginx logged every proxied client request, arriving
   from the public subnet:

   ```
   172.28.0.1 - - [29/Oct/2026:23:55:04 +0000] "GET / HTTP/1.1" 200 152 "-" "curl/7.84.0"
   ```

2. **Traffic redirection** - the backend saw requests from the **LB's
   private-subnet IP** (`172.28.1.6`), never the client's address:

   ```
   [pybackend-1] 172.28.1.6 "GET /healthz HTTP/1.1" 200 -
   ```

   The client's IP (`172.28.0.1`, public subnet) never appears in backend
   logs - every request was redirected through the reverse proxy.

3. **Health checks** - two kinds of evidence:

   - Docker HEALTHCHECK probes (originating inside each container, source
     `127.0.0.1`):
     ```
     [pybackend-1] 127.0.0.1 "GET /healthz HTTP/1.1" 200 -
     ```
   - Docker's verdict for every backend:
     ```
     backend-1:    healthy (checks recorded: 5)
     backend-2:    healthy (checks recorded: 5)
     pybackend-1:  healthy (checks recorded: 5)
     pybackend-2:  healthy (checks recorded: 5)
     ```

### Nuances worth knowing

- nginx does **not** log `/healthz` in its own access log: the config sets
  `access_log off` for the probe path (standard practice to keep probe noise
  out of logs). The backend-side logs still prove the healthz traffic flowed
  through the proxy.
- The **Node.js** backends log only lifecycle events (startup, SIGTERM), not
  per-request lines - use the **Python** replicas when demonstrating
  per-request log evidence.

---

## Quick reference - topology facts for the write-up

| Item | Value |
|---|---|
| Public subnet | `multisubnet-public_subnet`, 172.28.0.0/24, bridge (non-internal) |
| Private subnet | `multisubnet-private_subnet`, 172.28.1.0/24, `internal=true` (air-gapped) |
| Load balancer | `multisubnet-nginx-lb` - dual-homed; publishes 0.0.0.0:8080 -> 80 and 0.0.0.0:8443 -> 443 |
| Backends | `backend-1`, `backend-2` (Node.js), `pybackend-1`, `pybackend-2` (Python) - private subnet only, port 3000 |
| Balancing | Round-Robin (nginx default), single worker -> strict rotation |
| Failover | `proxy_next_upstream error timeout` + `max_fails=3 fail_timeout=15s` + `proxy_connect_timeout 2s` |


