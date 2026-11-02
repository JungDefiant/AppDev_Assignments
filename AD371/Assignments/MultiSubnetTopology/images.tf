###############################################################################
# Container images
#
# backend_node   - built from ./app-node (Node.js app that reports its
#                  SERVER_ID and exposes /healthz).
# backend_python - built from ./app-python (stdlib-only Python server with the
#                  same SERVER_ID / /healthz contract).
# nginx          - pulled from Docker Hub for the reverse-proxy load balancer.
###############################################################################

resource "docker_image" "backend_node" {
  name         = "${var.project_name}-backend-node:1.0.0"
  keep_locally = true # keep the built image around for fast re-applies

  build {
    context    = "${path.module}/app-node"
    dockerfile = "Dockerfile"
  }
}

resource "docker_image" "backend_python" {
  name         = "${var.project_name}-backend-python:1.0.1"
  keep_locally = true

  build {
    context    = "${path.module}/app-python"
    dockerfile = "Dockerfile"
  }
}

resource "docker_image" "nginx" {
  name         = var.nginx_image
  keep_locally = false
}
