###############################################################################
# Provider requirements
#
# docker (kreuzwerker) - manages Docker networks, images and containers.
# tls (hashicorp)      - generates the self-signed certificate that lets the
#                        nginx load balancer serve a real TLS listener on 443.
###############################################################################

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.1"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

# Uses the local Docker context (DOCKER_HOST env var or local daemon).
# No provider configuration block is required for Docker Desktop / local engine.
provider "docker" {}

provider "tls" {}
