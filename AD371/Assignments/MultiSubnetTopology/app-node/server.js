/**
 * Node.js web backend replica for the AD371 multi-subnet Terraform topology.
 *
 * - Lives ONLY on the private subnet (never published to the host).
 * - Reports its unique SERVER_ID in every response so round-robin
 *   distribution across replicas can be verified from the load balancer.
 * - Exposes a simple /healthz endpoint for health checks.
 *
 * Zero runtime dependencies (built-in http module only).
 */
'use strict';

const http = require('http');
const os = require('os');

const SERVER_ID = process.env.SERVER_ID || 'unknown-server';
const PORT = parseInt(process.env.PORT || '3000', 10);

const requestHandler = (req, res) => {
  const path = req.url.split('?')[0];

  // --- Health check endpoint -------------------------------------------
  if (path === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        serverId: SERVER_ID,
        uptimeSeconds: Number(process.uptime().toFixed(2)),
      })
    );
    return;
  }

  // --- Default response: identify which instance handled the request ---
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      message: 'Hello from the private subnet!',
      serverId: SERVER_ID,
      containerHostname: os.hostname(),
      handledAt: new Date().toISOString(),
    })
  );
};

const server = http.createServer(requestHandler);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[${SERVER_ID}] listening on 0.0.0.0:${PORT}`);
});

// --- Graceful shutdown --------------------------------------------------
const shutdown = (signal) => {
  console.log(`[${SERVER_ID}] received ${signal}, shutting down gracefully`);
  server.close(() => process.exit(0));
  // Force-exit fallback if connections refuse to drain.
  setTimeout(() => process.exit(0), 5000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
