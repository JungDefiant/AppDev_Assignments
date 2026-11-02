###############################################################################
# Outputs - use these to verify the topology after `terraform apply`
###############################################################################

output "load_balancer_http_url" {
  description = "Public entry point through the load balancer (HTTP)."
  value       = "http://localhost:${var.http_port}"
}

output "load_balancer_https_url" {
  description = "Public entry point through the load balancer (TLS, self-signed -> use curl -k)."
  value       = "https://localhost:${var.https_port}"
}

output "backend_server_ids" {
  description = "Server IDs of ALL backend replicas (Node.js + Python) - watch these rotate in responses to verify Round-Robin."
  value       = local.backend_names
}

output "node_backend_server_ids" {
  description = "Server IDs of the Node.js replicas."
  value       = local.node_backend_names
}

output "python_backend_server_ids" {
  description = "Server IDs of the Python replicas."
  value       = local.python_backend_names
}

output "public_subnet" {
  description = "Public subnet network name and CIDR."
  value = {
    name = docker_network.public_subnet.name
    cidr = var.public_subnet_cidr
  }
}

output "private_subnet" {
  description = "Private (internal) subnet network name and CIDR."
  value = {
    name = docker_network.private_subnet.name
    cidr = var.private_subnet_cidr
  }
}

output "round_robin_verification_command" {
  description = "Run this after apply to see requests alternate across backend instances."
  value       = "for i in {1..8}; do curl -s http://localhost:${var.http_port}/ | grep -o '\"serverId\":\"[^\"]*\"'; done"
}
