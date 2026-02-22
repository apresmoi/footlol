# Footlol — Agent Working Guide

## Project Overview

Footlol is a real-time multiplayer football arena game played in the browser. Players join rooms, pick teams, select League of Legends-inspired champions with unique abilities, and compete in physics-based soccer matches.

- **Frontend**: React 19 + Vite + TypeScript + SCSS (`/client`)
- **Backend**: Node.js + Express + Socket.IO + Matter.js + TypeScript (`/server`)
- **Infra**: Docker Compose, Caddy (edge/TLS), Nginx (static serving)
- **Site**: https://footlol.com

## Architecture

```
Browser ←→ Caddy (TLS, gzip) ←→ Nginx (static) + Express/Socket.IO (game server)
```

- Client is a React SPA served by Nginx in production
- Game server runs a 40 Hz physics loop (25ms ticks) with Matter.js
- Client ↔ Server communicate via Socket.IO with binary-encoded JSON
- Each room is a Socket.IO namespace (`/roomId`)
- One default room `/ao` always exists; dynamic rooms get 20-char random IDs

### Data Flow

1. Player enters name → REST `POST /api/rooms` or selects room via `GET /api/rooms`
2. Socket connects to namespace → `login_success` returns full room state
3. Stages progress: `TEAM_SELECT` → `CHAMPION_SELECT` → `FIELD` → `END`
4. During `FIELD`: server runs physics at 40 Hz, broadcasts `update` events with serialized state
5. Client renders SVG-based game view from serialized positions

## Key Paths

| Path | Purpose |
|------|---------|
| `/client` | React + Vite web client |
| `/server` | Express + Socket.IO game server |
| `/ops/Caddyfile` | Edge routing and TLS |
| `/docker-compose.dev.yml` | Local development stack |
| `/docker-compose.ec2.yml` | Production EC2 stack |

## Local Development

Full stack via Docker:
```bash
docker compose -f docker-compose.dev.yml up -d --build
# Client: http://localhost:5000 | Server: http://localhost:5001
```

Without Docker:
```bash
# Terminal 1
cd client && npm ci && npm run dev
# Terminal 2
cd server && npm ci && npm run start-dev
```

## Validation Before Shipping

```bash
cd client && npm test       # Vitest
cd server && npm run build  # TypeScript typecheck
cd client && npm run build  # Vite production build
```

## Commit Style

Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. Keep subjects short and clear. See `/CONTRIBUTING.md` for full PR checklist.

## Git and Safety Rules

- Never commit secrets, credentials, keys, or certificates
- Keep local operator notes in gitignored files
- `*.pem`, `*.key`, `.env.local` must stay out of version control
