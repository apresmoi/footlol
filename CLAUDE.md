# Repository Working Guide (Local Agent Notes)

This file is for local agent/operator workflow notes. It is intentionally git-ignored.

## Project Overview

- App: Footlol (real-time multiplayer football arena game)
- Frontend: React + Vite (`/client`)
- Backend: Node.js + Express + Socket.IO + TypeScript (`/server`)
- Infra: Docker Compose for local and EC2

## Key Paths

- `/client` - web client
- `/server` - game server and API
- `/ops/Caddyfile` - edge routing/TLS config
- `/docker-compose.dev.yml` - local stack
- `/docker-compose.ec2.yml` - production/EC2 stack
- `/ec2-cli-deploy.local.md` - local EC2 deploy runbook

## Local Development

Start full local stack:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Stop local stack:

```bash
docker compose -f docker-compose.dev.yml down
```

Non-Docker client dev:

```bash
cd client
npm ci
npm run dev
```

Non-Docker server dev:

```bash
cd server
npm ci
npm run start-dev
```

## Validation Before Shipping

- Client tests:

```bash
cd client
npm test
```

- Server build/typecheck:

```bash
cd server
npm run build
```

## EC2 Deploy

- Use `/ec2-cli-deploy.local.md` for the exact remote deployment steps.
- If using compose directly on host:

```bash
DOMAIN=footlol.com docker compose -f docker-compose.ec2.yml up -d --build
```

## Git and Safety Rules

- Keep secrets and credentials out of git.
- Do not commit certificates/keys (`*.pem`, `*.key`).
- Keep local operator notes in ignored files (like this one).
- Follow `/CONTRIBUTING.md` for coding and PR expectations.
