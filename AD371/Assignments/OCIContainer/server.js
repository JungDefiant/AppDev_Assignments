'use strict';

/**
 * Lightweight zero-dependency web server.
 *
 * Endpoints:
 *   GET /          - HTML landing page
 *   GET /healthz   - Health check (used by Docker HEALTHCHECK / Compose / K8s probes)
 *   GET /metadata  - Runtime metadata (hostname, container ID, uptime, ...)
 */

const http = require('node:http');
const os = require('node:os');
const fs = require('node:fs');

const PORT = Number.parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '0.0.0.0';
const APP_NAME = process.env.APP_NAME || 'OCI Container Demo';
const GREETING = process.env.GREETING || 'Hello from a hardened, non-root Alpine container';

const startedAt = Date.now();

/** Best-effort container ID (falls back to the hostname, which in Docker is
 *  the first 12 chars of the container ID anyway). */
function getContainerId() {
  try {
    const cgroup = fs.readFileSync('/proc/self/cgroup', 'utf8');
    const ids = cgroup.match(/[0-9a-f]{64}/g);
    if (ids && ids.length > 0) return ids[ids.length - 1].slice(0, 12);
  } catch {
    /* Not Linux or cgroup v2 without an ID - fall through */
  }
  return os.hostname();
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function landingPage(req) {
  const meta = {
    hostname: os.hostname(),
    containerId: getContainerId(),
    uptimeSeconds: Math.round(process.uptime()),
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${APP_NAME}</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
           max-width: 46rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.6; }
    h1 { margin-bottom: .25rem; }
    p.tagline { color: #666; margin-top: 0; }
    code { background: rgba(127,127,127,.15); padding: .1rem .35rem; border-radius: .25rem; }
    table { border-collapse: collapse; margin: 1rem 0; }
    td, th { border: 1px solid #888; padding: .35rem .75rem; text-align: left; }
  </style>
</head>
<body>
  <h1>&#128230; ${APP_NAME}</h1>
  <p class="tagline">${GREETING}</p>
  <p>Served by container <code>${meta.containerId}</code> (host <code>${meta.hostname}</code>),
     up for <strong>${meta.uptimeSeconds}s</strong>.</p>
  <table>
    <tr><th>Endpoint</th><th>Description</th></tr>
    <tr><td><a href="/healthz"><code>GET /healthz</code></a></td><td>Liveness / health check</td></tr>
    <tr><td><a href="/metadata"><code>GET /metadata</code></a></td><td>Server runtime metadata</td></tr>
  </table>
  <p>Request handled by: ${req.socket.remoteAddress} &rarr; ${meta.hostname}
     (${req.method} ${req.url})</p>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];

  if ((req.method === 'GET' || req.method === 'HEAD') && url === '/') {
    const body = landingPage(req);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Cache-Control': 'no-store',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
    return;
  }

  if ((req.method === 'GET' || req.method === 'HEAD') && url === '/healthz') {
    sendJson(res, 200, { status: 'ok', uptimeSeconds: Math.round(process.uptime()) });
    return;
  }

  if ((req.method === 'GET' || req.method === 'HEAD') && url === '/metadata') {
    sendJson(res, 200, {
      app: APP_NAME,
      hostname: os.hostname(),
      containerId: getContainerId(),
      uptime: {
        processSeconds: Math.round(process.uptime()),
        systemSeconds: Math.round(os.uptime()),
        startedAt: new Date(startedAt).toISOString(),
      },
      runtime: {
        node: process.version,
        platform: `${os.platform()}/${os.arch()}`,
        cpus: os.cpus().length,
        loadavg: os.loadavg().map((n) => Number(n.toFixed(2))),
      },
      memory: {
        rssBytes: process.memoryUsage().rss,
        heapUsedBytes: process.memoryUsage().heapUsed,
        systemFreeBytes: os.freemem(),
        systemTotalBytes: os.totalmem(),
      },
    });
    return;
  }

  sendJson(res, 404, { error: 'not found', path: url });
});

server.listen(PORT, HOST, () => {
  console.log(`[${APP_NAME}] listening on http://${HOST}:${PORT} (pid ${process.pid})`);
});

/* Graceful shutdown so orchestrators can drain connections on stop/redeploy */
function shutdown(signal) {
  console.log(`[${APP_NAME}] received ${signal}, draining connections...`);
  server.close(() => {
    console.log(`[${APP_NAME}] closed cleanly`);
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
