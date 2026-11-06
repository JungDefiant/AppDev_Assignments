# syntax=docker/dockerfile:1

# Pin the major version so builds are reproducible; alpine keeps it lightweight.
ARG NODE_VERSION=24

###############################################################################
# Stage 1: builder
#  - Full toolchain available; installs/audits dependencies and copies source.
#  - Nothing installed here (package caches, npm, headers) reaches the
#    final image.
###############################################################################
FROM node:${NODE_VERSION}-alpine AS builder

# Prevent npm from writing to $HOME and running audits we don't need.
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false

WORKDIR /app

# Copy manifests first so this layer is cached when source changes.
COPY package.json package-lock.json ./

# Install production dependencies only, then purge the npm cache from this
# stage. `mkdir -p` keeps the runtime COPY deterministic for projects with
# zero dependencies (npm ci then produces no node_modules directory at all).
RUN npm ci --omit=dev \
    && npm cache clean --force \
    && mkdir -p node_modules

# Application source.
COPY server.js ./

###############################################################################
# Stage 2: runtime (final image)
#  - Only the built artifacts + runtime user land here -> minimal surface.
###############################################################################
FROM node:${NODE_VERSION}-alpine AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080

WORKDIR /app

# Copy artifacts as the unprivileged `node` user (uid 1000, built into the
# official image - no need to create a user or keep apk cache around).
COPY --from=builder --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=node:node /app/server.js ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Never run as root.
USER node

EXPOSE 8080

# Docker-native health check. busybox wget ships with alpine, so no extra
# packages (curl, etc.) need to be installed in the final image.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/healthz" || exit 1

# tini (PID 1) is already the entrypoint of the official node image, so
# signals reach Node correctly for graceful shutdown.
CMD ["node", "server.js"]
