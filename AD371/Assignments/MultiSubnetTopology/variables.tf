###############################################################################
# Project variables
###############################################################################

variable "project_name" {
  description = "Prefix used for resource names (networks, containers, image tag)."
  type        = string
  default     = "multisubnet"
}

variable "backend_count" {
  description = "Number of Node.js backend replicas attached to the private subnet. Round-Robin distributes requests across them."
  type        = number
  default     = 2

  validation {
    condition     = var.backend_count >= 2
    error_message = "At least two backend replicas are required to demonstrate load balancing."
  }
}

variable "python_backend_count" {
  description = "Number of Python backend replicas attached to the private subnet. Set to 0 to run the Node.js app only."
  type        = number
  default     = 2

  validation {
    condition     = var.python_backend_count >= 0
    error_message = "The Python backend replica count cannot be negative."
  }
}

variable "http_port" {
  description = "Host port that maps to the load balancer's HTTP (80) listener."
  type        = number
  default     = 80
}

variable "https_port" {
  description = "Host port that maps to the load balancer's TLS (443) listener."
  type        = number
  default     = 443
}

variable "backend_port" {
  description = "Container port the Node.js backends listen on (private subnet only, never published to the host)."
  type        = number
  default     = 3000
}

variable "nginx_image" {
  description = "nginx image used for the dual-homed load balancer."
  type        = string
  default     = "nginx:1.27-alpine"
}

variable "public_subnet_cidr" {
  description = "CIDR for the public subnet (reachable from the host/internet)."
  type        = string
  default     = "172.28.0.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR for the private subnet (internal-only, no external egress or ingress)."
  type        = string
  default     = "172.28.1.0/24"
}
