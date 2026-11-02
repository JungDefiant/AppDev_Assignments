# syntax=docker/dockerfile:1
# Python backend replica - reachable ONLY inside the private subnet.

FROM python:3.12-alpine

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Zero runtime dependencies: stdlib-only app, no pip install needed.
COPY server.py healthcheck.py ./

ENV PORT=3000
EXPOSE 3000

USER nobody

# Docker-level health check (visible via `docker ps` and `docker inspect`).
HEALTHCHECK --interval=5s --timeout=3s --start-period=3s --retries=3 \
  CMD ["python", "healthcheck.py"]

CMD ["python", "server.py"]
