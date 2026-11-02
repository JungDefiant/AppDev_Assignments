###############################################################################
# Local override values.
#
# This machine runs another service (WSL-relayed Discourse) that squats the
# loopback bindings for 127.0.0.1:80 / ::1:80 and 443, which shadows Docker's
# 0.0.0.0 port publications on localhost. These host ports keep the load
# balancer reachable at http://localhost:8080 and https://localhost:8443.
###############################################################################

http_port  = 8080
https_port = 8443
