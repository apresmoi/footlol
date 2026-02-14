# Footlol

Real-time multiplayer football arena game with champion-inspired abilities.

## About

Footlol is a browser game where players join rooms, pick teams/champions, and play live matches over Socket.IO.

- Live app (primary URL): <https://footlol.com>
- Repository: <https://github.com/apresmoi/footlol>
- Maintainer: Juan Cruz Fortunatti (<https://ledeluge.me>)

## Features

- Fast multiplayer room flow (create/join matches)
- Team and champion selection before game start
- Real-time gameplay with server-authoritative simulation
- SEO baseline (metadata, robots, sitemap, structured data)
- Google Analytics 4 page tracking

## Tech Stack

- Frontend: React + Vite + React Router + Sass
- Backend: Node.js + Express + Socket.IO + TypeScript
- Infra:
  - Local: Docker Compose (`docker-compose.dev.yml`)
  - Production: Docker Compose + Caddy edge (`docker-compose.ec2.yml`)

## Repository Structure

```text
.
├── client/                 # React app
├── server/                 # Express + Socket.IO game server
├── ops/                    # Edge/reverse-proxy configuration (Caddy)
├── docker-compose.dev.yml  # Local development stack
├── docker-compose.ec2.yml  # Production/EC2 stack
├── CONTRIBUTING.md
└── README.md
```

## Prerequisites

- Docker + Docker Compose plugin
- Node.js 22+ (only needed if running outside Docker)

## Quick Start (Local)

Start:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Open:

- Client: <http://localhost:5000>
- Server API: <http://localhost:5001>

Stop:

```bash
docker compose -f docker-compose.dev.yml down
```

## Production (EC2 / Single VM)

The production stack is defined in `docker-compose.ec2.yml`:

- `game-client` (static build served by nginx container)
- `game-server` (Node process)
- `edge` (Caddy terminates TLS and routes `/api` and `/ws` to server)

Deploy command:

```bash
DOMAIN=footlol.com docker compose -f docker-compose.ec2.yml up -d --build
```

## Environment Variables

### Client

Defined in `client/.env.example`:

- `VITE_SITE_URL` (canonical site URL)
- `VITE_GA_MEASUREMENT_ID` (GA4 measurement ID)

### Server

- `NODE_ENV`
- `PORT` (defaults to `3000`)

### Edge (Caddy)

- `DOMAIN` (defaults to `localhost`)

## API Endpoints

- `GET /api/rooms` - list active rooms
- `POST /api/rooms` - create room (name length >= 6)
- `GET /api/champions` - list champion metadata
- Socket.IO path: `/ws`

## Development Commands (Without Docker)

Client:

```bash
cd client
npm ci
npm run dev
```

Server:

```bash
cd server
npm ci
npm run start-dev
```

## Testing

Frontend tests:

```bash
cd client
npm test
```

Backend typecheck/build:

```bash
cd server
npm run build
```

## Open Source

- License: MIT (`LICENSE`)
- Contributions: see `CONTRIBUTING.md`

## Credits

Built and maintained by Juan Cruz Fortunatti.
