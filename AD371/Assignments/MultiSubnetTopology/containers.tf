###############################################################################
# Containers
#
# 1. nginx load balancer  - DUAL-HOMED: attached to BOTH the public subnet and
#                          the private subnet. It is the ONLY container with
#                          published host ports (80 and 443).
#
# 2. Node.js backends (app #1) - attached ONLY to the private subnet.
# 3. Python backends (app #2)   - No `ports` blocks are defined for either, so
#                          nothing is ever exposed to the host, and the network
#                          itself is `internal = true` so no external routing
#                          exists at all. nginx Round-Robins across BOTH app
#                          pools, treating them as one upstream group.
###############################################################################

# ---------------------------------------------------------------------------
# Backend replicas, app #1 (Node.js) - private subnet ONLY
# ---------------------------------------------------------------------------
resource "docker_container" "backend_node" {
  count   = var.backend_count
  name    = local.node_backend_names[count.index]
  image   = docker_image.backend_node.image_id
  start   = true
  restart = "unless-stopped"

  # The SERVER_ID env var is what each replica reports back in its responses,
  # letting you verify which instance handled a given request.
  env = [
    "SERVER_ID=${local.node_backend_names[count.index]}",
    "PORT=${var.backend_port}",
  ]

  # NOTE: no `ports` block -> no host port mapping, ever.
  networks_advanced {
    name    = docker_network.private_subnet.name
    aliases = [local.node_backend_names[count.index]]
  }

  labels {
    label = "subnet"
    value = "private"
  }

  labels {
    label = "role"
    value = "web-backend"
  }

  labels {
    label = "runtime"
    value = "node"
  }

  labels {
    label = "project"
    value = var.project_name
  }
}

# ---------------------------------------------------------------------------
# Backend replicas, app #2 (Python) - private subnet ONLY
#
# Same contract as the Node.js app (SERVER_ID + /healthz) but implemented with
# the Python standard library. nginx treats both pools identically, so the
# upstream group is a heterogeneous Round-Robin pool.
# ---------------------------------------------------------------------------
resource "docker_container" "backend_python" {
  count   = var.python_backend_count
  name    = local.python_backend_names[count.index]
  image   = docker_image.backend_python.image_id
  start   = true
  restart = "unless-stopped"

  env = [
    "SERVER_ID=${local.python_backend_names[count.index]}",
    "PORT=${var.backend_port}",
  ]

  # NOTE: no `ports` block -> no host port mapping, ever.
  networks_advanced {
    name    = docker_network.private_subnet.name
    aliases = [local.python_backend_names[count.index]]
  }

  labels {
    label = "subnet"
    value = "private"
  }

  labels {
    label = "role"
    value = "web-backend"
  }

  labels {
    label = "runtime"
    value = "python"
  }

  labels {
    label = "project"
    value = var.project_name
  }
}

# ---------------------------------------------------------------------------
# nginx load balancer - dual-homed on public + private subnets
# ---------------------------------------------------------------------------
resource "docker_container" "load_balancer" {
  name    = "${var.project_name}-nginx-lb"
  image   = docker_image.nginx.image_id
  start   = true
  restart = "unless-stopped"

  # Public leg: this is the attachment that makes the published ports reachable
  # from the host. Port publishing only works on non-internal networks.
  networks_advanced {
    name    = docker_network.public_subnet.name
    aliases = ["lb"]
  }

  # Private leg: lets nginx reach the backend pool and Docker's embedded DNS
  # resolve backend-N names inside this network.
  networks_advanced {
    name    = docker_network.private_subnet.name
    aliases = ["lb-internal"]
  }

  # Expose HTTP and HTTPS to the host.
  ports {
    internal = 80
    external = var.http_port
    ip       = "0.0.0.0"
    protocol = "tcp"
  }

  ports {
    internal = 443
    external = var.https_port
    ip       = "0.0.0.0"
    protocol = "tcp"
  }

  # Base nginx.conf tuned for this demo: a SINGLE worker process, so the
  # upstream Round-Robin rotation is strict and easy to observe. (With the
  # default `worker_processes auto`, each worker keeps its own rotation
  # state, which makes short test runs look unevenly distributed.)
  upload {
    file    = "/etc/nginx/nginx.conf"
    content = file("${path.module}/nginx/nginx.conf")
  }

  # Reverse-proxy config rendered from the Round-Robin upstream template.
  upload {
    file = "/etc/nginx/conf.d/default.conf"
    content = templatefile("${path.module}/nginx/default.conf.tpl", {
      upstreams  = local.upstreams
      http_port  = var.http_port
      https_port = var.https_port
    })
  }

  # TLS material generated in tls.tf (self-signed, demo only).
  upload {
    file    = "/etc/nginx/certs/lb.crt"
    content = tls_self_signed_cert.lb_tls.cert_pem
  }

  upload {
    file    = "/etc/nginx/certs/lb.key"
    content = tls_private_key.lb_tls.private_key_pem
  }

  labels {
    label = "subnet"
    value = "public+private"
  }

  labels {
    label = "role"
    value = "reverse-proxy-load-balancer"
  }

  labels {
    label = "project"
    value = var.project_name
  }

  # nginx resolves upstream hostnames at startup, so all backend containers
  # must exist (and be attached to the private subnet) before nginx starts.
  depends_on = [docker_container.backend_node, docker_container.backend_python]
}
