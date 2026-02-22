# Server Standards

## Tech Stack

Node.js 22, Express 5, Socket.IO 4, Matter.js (physics), TypeScript 5.

## File Organization

```
src/
├── index.ts              # Express setup, REST routes, Socket.IO namespaces
├── types.ts              # Shared interfaces and type aliases
├── globals.ts            # Game constants (tick rate, dimensions, physics values)
├── classes/
│   ├── room.ts           # Room — Socket.IO namespace + stage management
│   ├── field.ts          # Field — physics engine, game loop, collision handling
│   ├── score.ts          # Score tracking with goal history
│   ├── math.ts           # Vector and Size utilities
│   └── collideables/
│       ├── physics.ts    # Base classes: Collideable, Circle, Rect, Polygon, Compound
│       ├── player.ts     # Player (CompoundCollideable with physical + sensor body)
│       ├── ball.ts       # Ball (CircleCollideable)
│       ├── goal.ts       # Goal (sensor + post circles)
│       ├── wall.ts       # Wall boundaries
│       ├── ring.ts       # Ring object
│       ├── cone.ts       # Cone object
│       ├── turnwall.ts   # Start wall that drops on kickoff
│       ├── vector.ts     # VectorCollideable — projectile base for abilities
│       └── categories.ts # Matter.js collision bitmask categories
├── league/
│   ├── classes.ts        # Champion base class, ChampionSpell, ChampionName type
│   ├── champions.ts      # Champion factory registry
│   ├── source.ts         # LoL champion stats + spell data (JSON)
│   └── champions/        # One file per champion (Amumu.ts, Garen.ts, etc.)
└── utilities/            # conversion, arrays, numbers, objects, dates
```

## Naming Conventions

- **Classes**: PascalCase (`Player`, `Ball`, `Champion`)
- **Private fields**: underscore prefix (`_id`, `_direction`, `_mounted`)
- **Public methods**: camelCase (`serialize`, `applyStateFromAbility`)
- **Socket events**: snake_case (`login_success`, `player_join`, `request_key_press`)
- **Interfaces**: PascalCase, `I` prefix for collision-related (`ICollideableBody`)
- **Type aliases**: PascalCase (`RoomStage`, `TeamSide`, `ChampionName`)
- **Files**: camelCase for utilities, PascalCase for champion files

## Game Loop

- **Tick rate**: 40 Hz (25ms via `setInterval`)
- **Physics**: Matter.js with zero gravity, collision categories as bitmasks
- **Loop order**: update effects → `Engine.update()` → player movement → ball updates → broadcast if changed
- **Field dimensions**: 2200x1000 total, 1900x830 playable inner zone

## Key Constants (`globals.ts`)

- `timeConstant: 25` (ms per tick)
- Ball: radius 12, mass 2.5
- Player: radius 25, action radius 40
- Game: 600s match + 5s countdown
- Max players: 10 per room, 5 per side

## Class Hierarchy

```
Collideable (base physics object with Matter.js body)
├── CircleCollideable → Ball, ability projectiles
├── RectCollideable → Wall, some abilities
├── PolygonCollideable → Goal sensors
└── CompoundCollideable → Player (physical body + sensor body)

Field (physics engine, game state, collision handling)
└── Room (Socket.IO namespace, stage transitions, event handling)
```

## Champion System

- 12 champions: Veigar, Ashe, Amumu, LeeSin, Thresh, Shaco, Garen, Anivia, Yasuo, Malphite, Ahri, Lucian
- Each champion has Q and W abilities with cooldowns
- Champion factory in `league/champions.ts` maps name → constructor
- Stats sourced from LoL data in `league/source.ts`
- Player physics derived from champion stats: mass = hp/10, accel = movespeed/5000, force = attackdamage/400

### Adding a New Champion

1. Create `league/champions/ChampionName.ts`
2. Export a factory `(side: TeamSide, owner: Player) => Champion`
3. Define Q and W abilities as async methods returning a `Collideable` (or null for self-buffs)
4. Add stats and spell metadata to `league/source.ts`
5. Register in `league/champions.ts` factory map
6. Add to `ChampionName` union type in `league/classes.ts`

### Ability Patterns

- **Projectile**: create `VectorCollideable`, set velocity, handle collision via `handleCollision` callback
- **Zone/AoE**: create `CircleCollideable` with `isSensor: true`, apply states on overlap
- **Self-buff**: modify player state directly (speed, acceleration), return `null`
- **Hook/Pull**: create projectile that on-hit moves the caster toward the target position

## Player States

States are time-limited effects applied by abilities: `frozen`, `stunned`, `feared`, `slowed`. Tracked in `_stateUntil` map with expiry timestamps. Ball supports: `frozen`, `stunned`, `slowed`.

## Serialization

Every game object implements `serialize()` returning a plain object. Room serializes the full state tree each tick. Binary encoding via `TextEncoder`/`TextDecoder` for Socket.IO transport.

## REST API

- `GET /api/rooms` — list active rooms with player counts
- `POST /api/rooms` — create new room (body: `{ name }`, min 5 chars)
- `GET /api/champions` — all champion definitions with abilities and stats

## Room Stages

`TEAM_SELECT` → `CHAMPION_SELECT` → `FIELD` → `END` (then resets to `TEAM_SELECT`)

All players must ready up to advance. Stage transitions broadcast `stage_change` events.

## Build & Run

```bash
npm run build      # tsc compile to /build
npm run start      # run compiled output
npm run start-dev  # tsx watch mode (hot reload)
```
