###############################################################################
# Network subnets
#
# Docker user-defined networks act as the isolated subnets:
#
#   public_subnet  - internal = false -> containers can reach the internet and
#                    (importantly) containers on this network may have ports
#                    published to the host.
#
#   private_subnet - internal = true  -> an air-gapped bridge. Docker provides
#                    NO external routing: containers attached to it cannot
#                    reach the outside world, and no port on any container can
#                    ever be published to the host from this network. The only
#                    way in is via a container dual-homed on both subnets
#                    (the nginx load balancer).
###############################################################################

resource "docker_network" "public_subnet" {
  name     = "${var.project_name}-public_subnet"
  internal = false

  ipam_config {
    subnet  = var.public_subnet_cidr
    gateway = cidrhost(var.public_subnet_cidr, 1)
  }

  labels {
    label = "subnet"
    value = "public"
  }

  labels {
    label = "project"
    value = var.project_name
  }
}

resource "docker_network" "private_subnet" {
  name     = "${var.project_name}-private_subnet"
  internal = true

  ipam_config {
    subnet  = var.private_subnet_cidr
    gateway = cidrhost(var.private_subnet_cidr, 1)
  }

  labels {
    label = "subnet"
    value = "private"
  }

  labels {
    label = "project"
    value = var.project_name
  }
}
