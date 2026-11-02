# syntax=docker/dockerfile:1
# Node.js backend replica - reachable ONLY inside the private subnet.

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Zero runtime dependencies: copy the sources directly (no npm install needed).
COPY package.json server.js ./

ENV PORT=3000
EXPOSE 3000

USER node

# Docker-level health check (visible via `docker ps` and `docker inspect`).
# Uses the built-in fetch() available in Node 18+.
HEALTHCHECK --interval=5s --timeout=3s --start-period=3s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||'3000')+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
