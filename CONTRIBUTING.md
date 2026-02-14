# Contributing to Footlol

Thanks for contributing.

## Ground Rules

- Keep changes focused and small.
- Prefer bug fixes and incremental improvements over large rewrites.
- Do not commit secrets, credentials, keys, or certificates.
- Open an issue first for major changes.

## Development Setup

### Option A: Docker (recommended)

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

- Client: <http://localhost:5000>
- Server: <http://localhost:5001>

### Option B: Run services directly

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

## Before Opening a PR

Run checks:

```bash
cd client && npm test
cd server && npm run build
```

If your change affects runtime behavior, include a short manual verification note in the PR description.

## Commit Style

Use Conventional Commits:

- `feat: ...` for new behavior
- `fix: ...` for bug fixes
- `docs: ...` for documentation-only changes
- `refactor: ...` for code cleanup without behavior changes
- `test: ...` for test changes
- `chore: ...` for maintenance/tooling

Keep commit subjects short and clear.

## Pull Request Checklist

- Change is scoped and understandable.
- Related docs are updated (`README.md`, this file, or code comments if needed).
- No secrets added.
- Tests/build pass for affected parts.

## Security

If you discover a vulnerability or exposed secret, do not open a public issue with details.
Contact the maintainer directly and rotate any compromised credentials immediately.
