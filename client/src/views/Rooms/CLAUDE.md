# Rooms View

**Route:** `/room-select`, `/room-create`

Room list with auto-refresh every 2 seconds. Table shows room name and player count (out of 10). Clicking a room calls `context.connectSocket(roomId)`.

## Exported Components

- `Rooms` (default) — room list table
- `CreateRoom` — form with room name input (min 6 chars), calls `context.createRoom(name)`

## Context Usage

- `context.connectSocket(roomId)` — joins room
- `context.createRoom(name)` — creates new room
