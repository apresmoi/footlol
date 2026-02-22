# Server Classes

This directory contains the core game engine. `Field` owns the physics loop and collision logic. `Room` extends `Field` with Socket.IO networking and stage management.

## Class Hierarchy

```
Field (physics engine, game loop, collision handling)
└── Room (Socket.IO namespace, stage FSM, event broadcasting)
```

`Score` and `Vector`/`Size` (in `math.ts`) are standalone utilities used by `Field`.

## Field (`field.ts`)

The physics simulation and game state manager. Room extends this — never instantiate Field directly.

### Key Properties

| Property | Type | Purpose |
|----------|------|---------|
| `_players` | `{ [socketId: string]: Player }` | All players by socket ID |
| `_ball` | `Ball` | The match ball |
| `_engine` / `_world` | Matter.js | Physics engine (zero gravity) |
| `_score` | `Score` | Goal tracking |
| `_stage` | `RoomStage` | Current game stage |
| `_effectCollideables` | `Collideable[]` | Active ability effects |
| `_walls` | `RectCollideable[]` | 11 static boundary walls |
| `_startWalls` | `{ LEFT, RIGHT: TurnWall }` | Curved half-field walls that drop on kickoff |
| `_sensors` | `{ LEFT_GOAL, RIGHT_GOAL: Goal }` | Goal detection sensors |

### Game Loop

The loop runs at **40 Hz** (25ms ticks) via `setInterval` in `_startGame()`.

Each tick calls `update()` which runs in this order:
1. `_updateEffects()` — materialize new effects, expire old ones
2. `Engine.update(this._engine)` — Matter.js physics step
3. Update all connected players (apply movement forces)
4. Update ball (apply slow/stun states)
5. Unmount start walls if ball is moving
6. Return `true` if anything changed → triggers `_emit()` in Room

### Game Lifecycle

```
_startGame()
  → reset score, clear states
  → materialize players, start walls, sensors
  → schedule _mountBall() after 5s countdown
  → attach Matter.js collision listeners
  → start 25ms interval loop
  → after 605s (600s match + 5s countdown): _endGame()

_endGame()
  → clear intervals/timeouts
  → determine winner via _score.getWinner()
  → unmount ball, walls, reset players
  → dematerialize all effects
  → set _gameEnded = true
  → Room schedules stage transition after 10s
```

### Collision Handling

`_handleCollisionsStart` processes Matter.js collision pairs in **priority order**:

1. **AbilityProjectileCategory** — projectiles add kicker to ball, call `handleCollision` callback
2. **AbilityEffectCategory** — AoE zones call `handleCollision` callback
3. **AbilityStunCategory** — stuns target, zeros velocity, applies state. Uses `hasAlreadyCollided()` to prevent multi-hit
4. **Goal sensors** — detects ball in goal, increments score, triggers reset
5. **Player-Ball physical** — adds player as kicker
6. **Player-Ball sensor** — enables/disables kick ability (proximity)

### Reset Logic

`_reset(type: ResetType)` has two modes:
- `'GOAL'` — soft reset after 2.9s delay: remount ball, reset positions, clear cooldowns
- `'RESET'` — hard reset: clear everything, dematerialize all, reset score

### Effect Lifecycle

Effects are ability-spawned collideables tracked in `_effectCollideables[]`:
1. Champion ability creates a Collideable, passes to `dispatcher` callback
2. Dispatcher adds it to `_effectCollideables`
3. `_updateEffects()` materializes it, sets velocity from owner's facing direction
4. Each tick: update position, check duration expiry
5. Expired effects are dematerialized and removed from array

### Player Management

- `addPlayer()` — assigns to team (max 5 per side, 10 total), calculates starting position
- `removePlayer()` — dematerializes, removes from dict, recalculates all positions
- `playerChangeSide()` — enforces 5-player limit per side
- `playerKeyPress()` — handles `Space` (kick), `KeyQ`, `KeyW` (abilities)
- `_recalculatePlayerPositions()` — called after any roster change

### Serialization

`serialize()` returns:
```typescript
{ players, ball, score, time, countdown, victory, effects }
```

Called every tick by Room's `_emit()`. Full state — no deltas.

### Known Gotchas

- `_contdownTimeout` has a typo ("contdown") — preserved for compatibility
- Start walls drop when ball reaches non-zero speed, not on a timer
- Goal detection uses a `_goal` flag to prevent double-counting in one tick
- `_emit()` is a no-op on Field — Room overrides it to broadcast via Socket.IO

---

## Room (`room.ts`)

Extends Field with Socket.IO namespace integration and a stage state machine.

### Stage FSM

```
TEAM_SELECT → CHAMPION_SELECT → FIELD → END → TEAM_SELECT
```

Transitions happen in `_tryStageChange()` when all players are ready:
- **TEAM_SELECT → CHAMPION_SELECT**: calls `_resetPlayers()` to create fresh Player instances
- **CHAMPION_SELECT → FIELD**: calls `_startGame()`, sends tutorial messages
- **FIELD → END → TEAM_SELECT**: triggered 10s after `_endGame()`, resets ready flags

### Socket Events

**Inbound (from client):**

| Event | Handler | Notes |
|-------|---------|-------|
| `request_direction_change` | `playerDirectionChanged()` | Movement vector |
| `request_key_press` | `playerKeyPress()` | Space/Q/W, emits `ball_kicked` if kick succeeds |
| `request_send_message` | `playerSendMessage()` | 140 char limit, trimmed |
| `request_player_ready` | `playerReady()` | Triggers stage change check |
| `request_champion_select` | `tryChangeChampion()` | Prevents duplicate picks |
| `request_kick_player` | `tryKickPlayer()` | Admin-only |
| `request_change_side` | `tryChangeSide()` | Team switch |
| `disconnect` | cleanup | Removes player, reassigns admin, broadcasts |

**Outbound (to clients):**

| Event | When | Encoding |
|-------|------|----------|
| `login_success` | On connect | Binary (self + room state) |
| `player_join` | Player connects | Binary |
| `player_leave` | Player disconnects | Binary |
| `update` | Every tick if changed | Binary |
| `stage_change` | Stage transition | Binary |
| `message_sent` | Chat message | Binary |
| `player_kicked` | Admin kicks (to target only) | Binary |
| `goal` | Goal scored | Binary (side + player name) |
| `ball_kicked` | Kick success (to kicker only) | JSON |

All binary encoding uses `objectToBinary()` from utilities.

### Overridden Methods

- `_emit()` — broadcasts `update` with binary-serialized state
- `_endGame()` — calls parent, schedules `_tryStageChange()` after 10s
- `_reset('RESET')` — calls parent, changes stage to TEAM_SELECT
- `addPlayer()` — only allows in TEAM_SELECT, max 10
- `_connectedPlayers()` — filters by active socket connections, cleans up disconnected

### Player Rules

- Admin = first player to join. Reassigned on admin disconnect.
- Champion selection prevents duplicates across the room.
- `playerReady()` requires champion selected in CHAMPION_SELECT stage.
- Side switch only allowed in TEAM_SELECT.

---

## Score (`score.ts`)

Simple goal tracking.

```typescript
interface ConvertedGoal {
  side: TeamSide
  playerId: string
  playerName: string
  seconds: number
}
```

- `addGoal(side, player, seconds)` — increments score, pushes goal record
- `lastGoalSide()` — returns side of most recent goal (determines who controls kickoff)
- `getWinner()` — returns side with higher score (defaults to `'LEFT'` if tied)
- `serialize()` → `{ left, right, goals[] }`

---

## Math (`math.ts`)

### Vector

Immutable 2D vector. **All operations return new instances.**

Key methods:
- `module()` — magnitude
- `normalize()` — unit vector (returns self if zero)
- `rotate(angle)` — rotate by radians
- `angle()` — angle from origin (no args) or between two vectors (with arg)
- `add(v)`, `substract(v)` — arithmetic (note: typo "substract" is intentional, preserved for compat)
- `multiply(n)` — scalar multiply
- `invert()` — negate
- `serialize()` → `{ x, y }`
- `Vector.fromMatter(v)` — static factory from Matter.js vector

### Size

Axis-aligned bounding box from two corners.

- Properties: `min`, `max`, `center`, `width`, `height`
- `Size.fromMatter(bounds)` — static factory
- `multiply(n)` — scale all coordinates
