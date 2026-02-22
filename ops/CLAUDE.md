# Ops & Infrastructure Standards

## Stack

- **Edge proxy**: Caddy 2 (auto TLS, gzip/zstd, www→non-www redirect)
- **Static serving**: Nginx 1.27 (production client)
- **Containers**: Docker with multi-stage builds, Node 22 Alpine base
- **Orchestration**: Docker Compose (dev and production configs)

## Service Architecture

```
Internet → Caddy (:80/:443)
            ├── /api/* /ws/* → game-server:3000 (Express + Socket.IO)
            └── /* → game-client:80 (Nginx serving Vite build)
```

## Environments

### Development (`docker-compose.dev.yml`)
- Client: `localhost:5000` → container:3000 (Vite dev server with HMR)
- Server: `localhost:5001` → container:3000 (tsx watch mode)
- Volume mounts for hot reload (node_modules excluded)
- No Caddy — direct port access

### Production (`docker-compose.ec2.yml`)
- All traffic through Caddy on ports 80/443
- game-server and game-client only `expose` internal ports (not published)
- `DOMAIN` env var controls Caddy's domain (default: localhost)
- Named volumes for Caddy TLS certificates (`caddy_data`, `caddy_config`)

Deploy:
```bash
DOMAIN=footlol.com docker compose -f docker-compose.ec2.yml up -d --build
```

## Caddyfile (`ops/Caddyfile`)

- Handles automatic HTTPS via Let's Encrypt
- www → non-www permanent redirect
- Routes `/api*` and `/ws*` to game-server, everything else to game-client
- Compression: gzip + zstd

## Nginx (`client/nginx.conf`)

- SPA fallback: `try_files $uri $uri/ /index.html`
- Static assets (js, css, fonts, images, audio): 1 year cache, `immutable`
- HTML, JSON, XML, TXT: `no-cache` for immediate updates
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`

## Dockerfiles

| File | Purpose | Base | Output |
|------|---------|------|--------|
| `client/Dockerfile` | Dev client | node:22-alpine | Vite dev server |
| `client/Dockerfile.prod` | Prod client (multi-stage) | node:22-alpine → nginx:1.27-alpine | Static files via Nginx |
| `server/Dockerfile` | Prod server | node:22-alpine | Compiled TS via node |
| `server/Dockerfile.dev` | Dev server | node:22-alpine | tsx watch mode |

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `DOMAIN` | docker-compose.ec2.yml / Caddy | Production domain for TLS |
| `NODE_ENV` | server container | `development` or `production` |
| `PORT` | server container | Express listen port (3000) |
| `VITE_API_PROXY_TARGET` | client container (dev) | API proxy target for Vite |
| `VITE_GA_MEASUREMENT_ID` | client build | Google Analytics 4 ID |
| `VITE_SITE_URL` | client build | Canonical site URL |

## No CI/CD

There is no automated CI/CD pipeline. Deployments are manual via SSH + Docker Compose on EC2.
