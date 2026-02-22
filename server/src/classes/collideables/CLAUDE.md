# Collideables

Physics object hierarchy wrapping Matter.js bodies. Every physical entity in the game (players, ball, walls, goals, ability effects) extends one of these base classes.

## Class Hierarchy

```
Collideable (abstract base — position, mount/unmount, state tracking)
├── CircleCollideable (mass, radius)
│   └── VectorCollideable (projectile that serializes as directional rect from owner)
├── RectCollideable (mass, width, height, angle)
├── PolygonCollideable (mass, points[][])
│   ├── Ring (radius, thickness — donut shape from 100-point arcs)
│   ├── Cone (radius, aperture — fan shape, auto-rotates toward velocity)
│   └── TurnWall (side — curved half-field boundary)
└── CompoundCollideable (combines multiple bodies)
    └── Player (physical body + sensor body)
```

## Base: Collideable (`physics.ts`)

All physics objects inherit from this. Manages Matter.js body lifecycle.

### Key Properties

| Property | Type | Purpose |
|----------|------|---------|
| `_id` | `string` | Unique ID (auto-generated) |
| `_body` | `ICollideableBody` | Matter.js body |
| `_direction` | `Vector` | Facing direction |
| `_acceleration` | `number` | Movement acceleration |
| `_mounted` | `boolean` | Whether added to physics world |
| `_alreadyCollided` | `Collideable[]` | Tracks collisions to prevent multi-hit |
| `_slowUntil` / `_slowMultiplier` | `Date` / `number` | Slow state |

### Lifecycle Methods

- `materialize(world)` — adds `_body` to Matter.js world, sets `_mounted = true`
- `dematerialize()` — removes from world, sets `_mounted = false`
- These are the **only** way to add/remove physics objects. Never call `Matter.World.add()` directly.

### Collision Utilities

- `hasAlreadyCollided(other)` — returns true if already in `_alreadyCollided` list. Used by stun abilities to prevent hitting the same target twice.
- `triggerEvent(target)` — adds target to `_alreadyCollided`
- `handleCollision` — plugin callback set on `_body.plugin.handleCollision`. Called by Field's collision handler.

### State Methods

- `setSlow(durationMs, multiplier)` — reduces velocity by multiplier for duration
- `setStun(durationMs)` — sets velocity to zero for duration
- `setVelocity(velocity, angularVelocity?)` — wraps `Matter.Body.setVelocity()`
- `setPosition(position)` — wraps `Matter.Body.setPosition()`
- `applyForce(force)` — wraps `Matter.Body.applyForce()`

### Body Plugin Convention

Every Matter.js body gets a `plugin` object:
```typescript
body.plugin = {
  owner: Collideable,      // the Collideable that owns this body
  drawer: Collideable,     // the Collideable to use for rendering
  id?: string,             // ability ID (e.g. "BandageToss")
  duration?: number,       // lifetime in ms
  effectDuration?: number, // state effect duration to apply on hit
  velocity?: number,       // initial projectile speed
  angularVelocity?: number,// initial spin
  cooldown?: number,       // unused
  handleCollision?: (target?) => void  // collision callback
}
```

This plugin is how Field's collision handler identifies what collided and what to do about it.

### Serialization

Base `serialize()` returns `{ type: 'none', position: {x,y}, angle, direction }`.

Subclasses override `type` and add shape-specific fields.

---

## CircleCollideable (`physics.ts`)

Constructor: `(mass, position, radius, options?)`

Uses `Matter.Bodies.circle()`. Serializes as `{ type: 'circle', position, angle, radius, direction }`.

---

## RectCollideable (`physics.ts`)

Constructor: `(mass, position, width, height, angle?, options?)`

Uses `Matter.Bodies.rectangle()`. Serializes as `{ type: 'rect', position, angle, width, height, direction }`.

---

## PolygonCollideable (`physics.ts`)

Constructor: `(mass, position, points: Vector[][], options?)`

Uses `Matter.Bodies.fromVertices()`. Points are arrays of vertex arrays. Serializes as `{ type: 'polygon', position, angle, points, direction }`.

---

## CompoundCollideable (`physics.ts`)

Constructor: `(position)` — empty shell.

Static factory: `CompoundCollideable.fromCollideables(position, collideables[], options?)` — combines multiple bodies via `Matter.Body.create({ parts })`.

Used by Player to combine a physical body and a sensor body into one compound entity.

---

## Player (`player.ts`)

The most complex collideable. Compound of two bodies:
- `_physicalBody`: CircleCollideable (radius 25, collision-enabled)
- `_sensorBody`: CircleCollideable (radius 40, `isSensor: true`, detects ball proximity for kick)

### Constructor

```typescript
new Player(id, name, championName, position, side: TeamSide, admin: boolean)
```

Physics derived from champion stats:
- `mass = champion.hp / 10`
- `_acceleration = champion.movespeed / 5000`
- `_force = champion.attackdamage / 400`

### State System

`_stateUntil` tracks time-limited effects: `{ frozen, stunned, feared, slowed }` — each a `Date` or `null`.

- `applyState(state, durationMs)` — sets expiry timestamp
- `applyStateFromAbility(abilityId, durationMs)` — maps ability IDs to state types (e.g., "CurseoftheSadMummy" → stunned)
- `getStates()` — returns array of `{ type, remainingMs }` for active states

### Movement

`update(dt)` applies directional force each tick:
- Checks frozen/stunned/feared states — if active, skip movement
- Otherwise applies `_acceleration` force in `_direction`

### Kicking

- `allowPlayerToKick(canKick)` — set by Field when ball is in sensor range
- `kick(ball)` — applies `_force` from `_sensorBody` position toward ball. Returns `true` if kicked.
- `_kicking` flag set on kick, cleared next tick

### Serialization

```typescript
{ id, name, champion, position, side, kicking, ready, cooldown: { Q, W }, visible, admin, direction, states[] }
```

---

## Ball (`ball.ts`)

Constructor: `(position: Vector)` — CircleCollideable with radius 12, mass 2.5.

### Kicker Tracking

`_kickers: { player: Player, seconds: number }[]` — records who touched the ball and when. Used to credit goal scorers.

- `addKicker(seconds, player)` — push to front of array
- `getLastKicker()` — returns most recent kicker

### State System

Same pattern as Player: `_stateUntil` with `{ frozen, stunned, slowed }`.

`applyStateFromAbility(abilityId, durationMs)` maps abilities to ball states:
- Frozen: FlashFrost, EnchantedCrystalArrow
- Stunned: VeigarEventHorizon, BandageToss, CurseoftheSadMummy, ThreshQ, JackInTheBox

### Serialization

```typescript
{ position, angle, states[] }
```

---

## Goal (`goal.ts`)

Compound object: physical frame + 2 goal post circles + sensor polygon.

Constructor: `(position, side: TeamSide, options?)`

- `_bodyGoalStickLeft` / `_bodyGoalStickRight`: CircleCollideable (radius 10, static)
- `_sensor`: PolygonCollideable (`isSensor: true`, static)
- `checkSensor(body)` — returns true if the given body is the goal sensor (used by Field to detect goals)
- Custom `materialize()`/`dematerialize()` to manage all sub-bodies

---

## Wall (`wall.ts`)

Static rectangle boundary. Constructor: `(position, width, height, options?)`.

Position is offset to center: `(x + w/2, y + h/2)`. Always `isStatic: true` with `WallCategory` collision filter.

---

## Ring (`ring.ts`)

Donut shape built from 100-point inner and outer arcs. Used by Veigar W (Event Horizon).

Constructor: `(mass, position, radius, thickness, options?)`

Serializes as `{ type: 'ring', position, angle, radius, thickness }`.

---

## Cone (`cone.ts`)

Fan/wedge shape built from 10-point arc. Used for directional AoE abilities.

Constructor: `(mass, position, radius, aperture, options?)`

Special behavior: `setVelocity()` auto-rotates the body to face the velocity direction (8-octant snapping).

Serializes with `_sourcePosition` (caster origin) rather than current position.

---

## TurnWall (`turnwall.ts`)

Curved half-field barrier that drops on kickoff. One per side (LEFT/RIGHT).

Constructor: `(side: TeamSide)` — always static, WallCategory.

Built from 100-point inner/outer arcs centered on the field midpoint. Dematerialized when ball starts moving.

---

## VectorCollideable (`vector.ts`)

Projectile that serializes as a **directional rectangle from its owner** rather than its actual circle body. This lets the client render hook/toss abilities as lines from the caster.

Constructor: `(mass, position, radius, options?)`

Serializes as:
```typescript
{ type: 'rect', position: owner.position, angle: vectorToTarget.angle(), width: distance, height: radius }
```

Used by Amumu Q (Bandage Toss) and similar hook abilities.

---

## Collision Categories (`categories.ts`)

Matter.js bitmasks for `collisionFilter.category` and `collisionFilter.mask`:

```
WallCategory              = 1
BallCategory              = 2
GoalCategory              = 4
PlayerLeftSideCategory    = 8
PlayerRightSideCategory   = 16
AbilityProjectileCategory = 32
AbilityStunCategory       = 64
AbilityEffectCategory     = 128
```

### Standard Masks

- **Player**: collides with walls, ball, goal, opposite-side players, ability categories
- **Ball**: collides with walls, goal, both player sides, projectiles, stuns
- **Ability projectile**: collides with opposite-side players and ball
- **Ability stun**: collides with opposite-side players and ball
- **Ability effect**: typically `isSensor: true`, collision detected but no physics response

When creating a new ability, set `category` to the appropriate ability type and `mask` to include only valid targets.
