"""
Python web backend replica for the AD371 multi-subnet Terraform topology.

- Lives ONLY on the private subnet (never published to the host).
- Reports its unique SERVER_ID in every response so round-robin
  distribution across replicas can be verified from the load balancer.
- Exposes a simple /healthz endpoint for health checks.

Zero runtime dependencies (Python standard library only).
"""

import datetime
import json
import os
import signal
import socket
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SERVER_ID = os.environ.get("SERVER_ID", "unknown-server")
PORT = int(os.environ.get("PORT", "3000"))
STARTED_AT = time.time()


class RequestHandler(BaseHTTPRequestHandler):
    """Answers every GET with a JSON payload identifying this instance."""

    def _send_json(self, code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):  # noqa: N802 - stdlib naming convention
        path = self.path.split("?")[0]

        # --- Health check endpoint -----------------------------------------
        if path == "/healthz":
            self._send_json(
                200,
                {
                    "status": "ok",
                    "serverId": SERVER_ID,
                    "uptimeSeconds": round(time.time() - STARTED_AT, 2),
                },
            )
            return

        # --- Default response: identify which instance handled the request --
        self._send_json(
            200,
            {
                "message": "Hello from the private subnet (Python)!",
                "serverId": SERVER_ID,
                "runtime": "python",
                "containerHostname": socket.gethostname(),
                "handledAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            },
        )

    def do_HEAD(self):  # noqa: N802 - stdlib naming convention
        """Answer HEAD like GET, but omit the body (used by curl -I, uptime
        monitors and load balancer health checkers)."""
        path = self.path.split("?")[0]

        if path == "/healthz":
            payload = {
                "status": "ok",
                "serverId": SERVER_ID,
                "uptimeSeconds": round(time.time() - STARTED_AT, 2),
            }
        else:
            payload = {
                "message": "Hello from the private subnet (Python)!",
                "serverId": SERVER_ID,
                "runtime": "python",
                "containerHostname": socket.gethostname(),
                "handledAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            }

        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()  # no body written for HEAD

    def log_message(self, fmt, *args):  # quiet, tagged access log
        print(
            "[{}] {} {}".format(SERVER_ID, self.address_string(), fmt % args),
            file=sys.stderr,
            flush=True,
        )


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), RequestHandler)

    # --- Graceful shutdown -----------------------------------------------
    def handle_signal(signum, _frame):
        print(f"[{SERVER_ID}] received signal {signum}, shutting down gracefully",
              file=sys.stderr, flush=True)
        # shutdown() must be called from another thread than serve_forever()
        threading.Thread(target=server.shutdown, daemon=True).start()

    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    print(f"[{SERVER_ID}] listening on 0.0.0.0:{PORT}", file=sys.stderr, flush=True)
    server.serve_forever()
    server.server_close()
    print(f"[{SERVER_ID}] shut down cleanly", file=sys.stderr, flush=True)


if __name__ == "__main__":
    main()
