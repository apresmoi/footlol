# TeamSelect View

**Stage:** `TEAM_SELECT`

Two-team layout. Players see LEFT and RIGHT teams. Click team header to switch sides. Admin can kick players.

## Context Usage

- `context.players` — all players in room
- `context.self` — current player
- `context.requestPlayerReady()` — toggle ready state
- `context.requestKickPlayer()` — admin-only kick
- `context.requestChangeSide()` — switch teams

## Chat

`Chat.tsx` — 140 char limit, Enter to send, auto-scroll to latest message.
