###############################################################################
# Derived values
###############################################################################

locals {
  # Node.js replicas: backend-1, backend-2, ... (stable DNS names on the
  # private subnet).
  node_backend_names = [for i in range(1, var.backend_count + 1) : "backend-${i}"]

  # Python replicas: pybackend-1, pybackend-2, ...
  python_backend_names = [for i in range(1, var.python_backend_count + 1) : "pybackend-${i}"]

  # Combined pool: every backend that nginx will Round-Robin across.
  backend_names = concat(local.node_backend_names, local.python_backend_names)

  # nginx upstream pool entries, e.g. "backend-1:3000", "pybackend-1:3000"
  upstreams = [for name in local.backend_names : "${name}:${var.backend_port}"]
}
