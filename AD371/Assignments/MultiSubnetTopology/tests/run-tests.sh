#!/usr/bin/env bash
# =============================================================================
# AD371 MultiSubnetTopology - Automated Acceptance Tests
#
# Covers the four required test scenarios:
#   1. Load Distribution Verification (Round-Robin)
#   2. High Availability & Failover (stop/restart a backend)
#   3. Network Boundary & Isolation (negative test)
#   4. Health Check & HTTP Status / Connection Reuse
#
# Usage (from the project root, in Git Bash):
#   bash tests/run-tests.sh
#
# Optional overrides:
#   HTTP_PORT=8080 HTTPS_PORT=8443 VICTIM=backend-1 bash tests/run-tests.sh
# =============================================================================

set -u

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
HTTP_PORT="${HTTP_PORT:-8080}"
HTTPS_PORT="${HTTPS_PORT:-8443}"
BASE="http://localhost:${HTTP_PORT}"
VICTIM="${VICTIM:-backend-1}"   # the backend instance killed in the failover test

PASS=0
FAIL=0

# ---------------------------------------------------------------------------
# Locate the docker CLI (not always on PATH in Git Bash on Windows)
# ---------------------------------------------------------------------------
DOCKER=""
for candidate in "${DOCKER_BIN:-}" docker \
  "/c/Program Files/Docker/Docker/resources/bin/docker.exe" \
  "$HOME/AppData/Local/Programs/DockerDesktop/resources/bin/docker.exe"; do
  if [ -n "$candidate" ] && command -v "$candidate" >/dev/null 2>&1; then
    DOCKER="$candidate"
    break
  fi
done
if [ -z "$DOCKER" ]; then
  echo "FATAL: docker CLI not found. Set DOCKER_BIN=/path/to/docker and retry." >&2
  exit 2
fi

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
green()  { printf '\033[32m%s\033[0m\n' "$*"; }
red()    { printf '\033[31m%s\033[0m\n' "$*"; }
yellow() { printf '\033[33m%s\033[0m\n' "$*"; }
ok()     { green "  [PASS] $*"; PASS=$((PASS + 1)); }
bad()    { red   "  [FAIL] $*"; FAIL=$((FAIL + 1)); }

server_id() {
  curl -s --max-time 5 "$BASE/" | sed -n 's/.*"serverId":[[:space:]]*"\([^"]*\)".*/\1/p'
}

http_code() {
  curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$1"
}

# Make sure the failover test victim is always restarted, even on Ctrl-C.
RESTORE_NEEDED=0
restore_victim() {
  if [ "$RESTORE_NEEDED" = "1" ]; then
    "$DOCKER" start "$VICTIM" >/dev/null 2>&1 || true
  fi
}
trap restore_victim EXIT INT TERM

banner() {
  echo
  yellow "==================================================================="
  yellow " $*"
  yellow "==================================================================="
}

# =============================================================================
banner "TEST 1: Load Distribution Verification (Round-Robin)"
# =============================================================================
N=12
ids=()
consecutive_repeats=0
prev=""

for i in $(seq 1 "$N"); do
  sid="$(server_id)"
  if [ -z "$sid" ]; then
    bad "request $i returned no serverId (backend/LB not reachable?)"
    exit 1
  fi
  ids+=("$sid")
  if [ "$sid" = "$prev" ]; then
    consecutive_repeats=$((consecutive_repeats + 1))
  fi
  prev="$sid"
done

echo "  Response sequence:"
printf '    %s\n' "${ids[@]}"

declare -A count
for sid in "${ids[@]}"; do count["$sid"]=$(( ${count["$sid"]:-0} + 1 )); done

min=999; max=0
echo "  Distribution over $N requests:"
for sid in "${!count[@]}"; do
  echo "    $sid -> ${count["$sid"]}"
  [ "${count["$sid"]}" -lt "$min" ] && min=${count["$sid"]}
  [ "${count["$sid"]}" -gt "$max" ] && max=${count["$sid"]}
done

[ "$consecutive_repeats" -eq 0 ] \
  && ok "Strict round-robin: no instance served two consecutive requests" \
  || bad "Round-robin violated: $consecutive_repeats consecutive repeats"

instances=${#count[@]}
[ "$instances" -ge 2 ] \
  && ok "Requests distributed across $instances backend instances (>= 2)" \
  || bad "Only $instances instance served all requests"

[ "$((max - min))" -le 1 ] \
  && ok "Even distribution: every instance served ${min}..${max} requests" \
  || bad "Uneven distribution: spread is ${min}..${max} (expected +-1)"

# =============================================================================
banner "TEST 2: High Availability & Failover (stop / restart $VICTIM)"
# =============================================================================
echo "  Baseline: $VICTIM is running and in rotation."

echo "  Stopping $VICTIM ..."
"$DOCKER" stop "$VICTIM" >/dev/null
RESTORE_NEEDED=1

DURING_N=10
during_ids=()
during_errors=0
for i in $(seq 1 "$DURING_N"); do
  code="$(http_code "$BASE/")"
  if [ "$code" != "200" ]; then
    during_errors=$((during_errors + 1))
    continue
  fi
  sid="$(server_id)"
  [ -n "$sid" ] && during_ids+=("$sid")
done

echo "  Requests while $VICTIM is down:"
printf '    %s\n' "${during_ids[@]:-<none>}"

[ "$during_errors" -eq 0 ] \
  && ok "Zero failed requests during failure ($DURING_N/$DURING_N returned 200, no 502 Bad Gateway)" \
  || bad "$during_errors of $DURING_N requests failed while backend was down"

if printf '%s\n' "${during_ids[@]}" | grep -q "^$VICTIM$"; then
  bad "Stopped instance $VICTIM still served requests - failover not working"
else
  ok "0% of requests went to the stopped instance; 100% routed to healthy peers"
fi

echo "  Restarting $VICTIM ..."
"$DOCKER" start "$VICTIM" >/dev/null
RESTORE_NEEDED=0

echo "  Waiting for $VICTIM health check to pass ..."
health="starting"
for i in $(seq 1 30); do
  health="$("$DOCKER" inspect --format '{{.State.Health.Status}}' "$VICTIM" 2>/dev/null)"
  [ "$health" = "healthy" ] && break
  sleep 1
done
if [ "$health" = "healthy" ]; then
  echo "  $VICTIM is healthy again after ${i}s"
else
  bad "$VICTIM did not become healthy within 30s (status: $health)"
fi

# nginx retries the peer after fail_timeout (15s); give it a grace period.
echo "  Waiting for nginx fail_timeout (15s) to elapse so the peer is retried ..."
sleep 16

AFTER_N=12
after_ids=()
after_errors=0
for i in $(seq 1 "$AFTER_N"); do
  code="$(http_code "$BASE/")"
  if [ "$code" != "200" ]; then
    after_errors=$((after_errors + 1))
    continue
  fi
  sid="$(server_id)"
  [ -n "$sid" ] && after_ids+=("$sid")
done

echo "  Requests after restart:"
printf '    %s\n' "${after_ids[@]:-<none>}"

[ "$after_errors" -eq 0 ] \
  && ok "Zero dropped requests after restart" \
  || bad "$after_errors requests failed after restart"

if printf '%s\n' "${after_ids[@]}" | grep -q "^$VICTIM$"; then
  ok "$VICTIM automatically re-entered the active balancing pool"
else
  bad "$VICTIM did NOT re-enter the rotation after restart"
fi

# =============================================================================
banner "TEST 3: Network Boundary & Isolation (Negative Test)"
# =============================================================================
# 3a. No published host ports on any backend container.
no_published_ports=1
for c in backend-1 backend-2 pybackend-1 pybackend-2; do
  if "$DOCKER" inspect "$c" >/dev/null 2>&1; then
    published="$("$DOCKER" port "$c" 2>/dev/null)"
    if [ -n "$published" ]; then
      bad "$c has published host ports: $published"
      no_published_ports=0
    fi
  fi
done
[ "$no_published_ports" = "1" ] \
  && ok "Backend containers have zero published host ports (docker port -> empty)"

# 3b. Direct connection to a backend port on localhost is rejected.
code="$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 3 --max-time 5 http://localhost:3000/)"
[ "$code" = "000" ] \
  && ok "curl http://localhost:3000 -> connection refused (no direct host exposure)" \
  || bad "Direct connection to localhost:3000 unexpectedly reachable (HTTP $code)"

# 3c. Direct connection to a backend's container IP from the host fails too.
backend_ip="$("$DOCKER" inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' backend-1)"
if [ -n "$backend_ip" ]; then
  code="$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 3 --max-time 5 "http://${backend_ip}:3000/healthz")"
  [ "$code" = "000" ] \
    && ok "curl http://$backend_ip:3000 (container IP) -> unreachable from the host" \
    || bad "Container IP $backend_ip unexpectedly reachable from host (HTTP $code)"
else
  bad "Could not determine container IP for backend-1"
fi

# 3d. The private subnet really is an internal (air-gapped) network.
internal="$("$DOCKER" network inspect multisubnet-private_subnet --format '{{.Internal}}')"
[ "$internal" = "true" ] \
  && ok "private_subnet is internal=true (no external routing possible)" \
  || bad "private_subnet internal flag is: $internal"

# 3e. Positive control: the load balancer (public gateway) IS reachable.
code="$(http_code "$BASE/")"
[ "$code" = "200" ] \
  && ok "Positive control: backends reachable through the reverse-proxy LB (HTTP 200)" \
  || bad "Load balancer not reachable via $BASE (HTTP $code) - topology broken?"

# =============================================================================
banner "TEST 4: Health Check & HTTP Status / Connection Reuse"
# =============================================================================
# 4a. /healthz returns HTTP 200 with status=ok JSON.
code="$(http_code "$BASE/healthz")"
[ "$code" = "200" ] \
  && ok "GET /healthz -> HTTP 200 OK" \
  || bad "GET /healthz returned HTTP $code"

body="$(curl -s --max-time 5 "$BASE/healthz")"
echo "$body" | grep -Eq '"status": ?"ok"' \
  && ok "/healthz body contains status=ok: $body" \
  || bad "/healthz body unexpected: $body"

# 4b. Response headers show the reverse proxy and JSON content type.
headers="$(curl -sI --max-time 5 "$BASE/healthz")"
echo "  Response headers:"
echo "$headers" | sed 's/^/    /'
echo "$headers" | grep -qi '^server: nginx' \
  && ok "Server header confirms reverse proxy (Server: nginx)" \
  || bad "Server header missing/different"
echo "$headers" | grep -qi '^content-type: application/json' \
  && ok "Content-Type is application/json" \
  || bad "Content-Type is not application/json"

# 4c. HTTPS listener returns 200 as well.
code="$(curl -sk -o /dev/null -w '%{http_code}' --max-time 5 "https://localhost:${HTTPS_PORT}/healthz")"
[ "$code" = "200" ] \
  && ok "GET https://localhost:${HTTPS_PORT}/healthz -> HTTP 200 OK (TLS)" \
  || bad "HTTPS /healthz returned HTTP $code"

# 4d. Connection reuse (HTTP keep-alive between client and nginx).
reuse="$(curl -sv -o /dev/null -o /dev/null --max-time 5 "$BASE/" "$BASE/" 2>&1 | grep -c 'Re-using existing connection')"
[ "$reuse" -ge 1 ] \
  && ok "HTTP keep-alive connection reuse confirmed (connection not re-established)" \
  || bad "Connection was not reused between consecutive requests"

# 4e. No 5xx gateway errors from any sampled endpoint.
gateway_errors=0
for path in "/" "/healthz"; do
  code="$(http_code "$BASE$path")"
  [ "${code:0:1}" = "5" ] && gateway_errors=$((gateway_errors + 1))
done
[ "$gateway_errors" -eq 0 ] \
  && ok "Zero 5xx gateway/routing errors on sampled endpoints" \
  || bad "$gateway_errors endpoints returned 5xx"

# =============================================================================
banner "SUMMARY"
# =============================================================================
echo "  Passed: $PASS   Failed: $FAIL"
echo
if [ "$FAIL" -eq 0 ]; then
  green "  ALL AUTOMATED TESTS PASSED"
else
  red "  $FAIL TEST(S) FAILED - see output above"
fi
echo
yellow "  Manual browser checks (Test 4, DevTools):"
echo "    1. Open http://localhost:${HTTP_PORT}/ in Chrome/Edge, press F12."
echo "    2. Network tab: refresh (Ctrl+R) several times -> every request should"
echo "       be 200 OK, and connection reuse is visible (same Connection ID /"
echo "       no new TCP handshake per request)."
echo "    3. Console tab: must be completely clean (no client-side JS errors,"
echo "       no 502/504 gateway errors logged)."
echo "    4. Repeat with https://localhost:${HTTPS_PORT}/ (accept the self-signed"
echo "       cert warning to view the TLS-terminated listener)."
echo

exit "$([ "$FAIL" -eq 0 ] && echo 0 || echo 1)"




