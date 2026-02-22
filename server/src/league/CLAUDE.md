# League / Champion System

This directory defines all champions, their stats, abilities, and the factory registry.

## File Roles

| File | Purpose |
|------|---------|
| `classes.ts` | `Champion` base class, `ChampionSpell` interface, `ChampionName` union type |
| `champions.ts` | Factory registry mapping names to constructors |
| `source.ts` | Raw LoL stat data + spell metadata (sprite coords, cooldowns) |
| `champions/*.ts` | One file per champion — ability implementations |

## Champion Base Class (`classes.ts`)

```typescript
class Champion {
  _owner: Player
  name: ChampionName
  movespeed: number
  hp: number
  armor: number
  attackspeed: number
  attackdamage: number
  spells: { Q: ChampionSpell, W: ChampionSpell, E: ChampionSpell, R: ChampionSpell }
}
```

Only **Q and W** are implemented. E and R are templated but unused.

### ChampionSpell Interface

```typescript
{
  id: string         // ability ID, e.g. "BandageToss"
  sprite: string     // sprite sheet filename
  x: number          // sprite x offset
  y: number          // sprite y offset
  w: number          // sprite width
  h: number          // sprite height
  cooldown: number   // seconds
}
```

The `id` field is critical — it's used by `Ball.applyStateFromAbility()` and `Player.applyStateFromAbility()` to determine what state effect to apply. Adding a new ability requires adding its ID to those switch statements if it applies states.

### ChampionName Type

```typescript
type ChampionName = 'Veigar' | 'Ashe' | 'Amumu' | 'LeeSin' | 'Thresh' | 'Shaco' |
                    'Yasuo' | 'Garen' | 'Anivia' | 'Malphite' | 'Ahri' | 'Lucian'
```

### Cooldown System

- `_tsQ` / `_tsW`: `Date` timestamps of last ability use
- `_canUseAbility(ability)` — checks if cooldown elapsed, sets timestamp if ready
- `getCooldowns()` → `{ Q: number, W: number }` — remaining seconds
- `clearCooldown()` — resets both timestamps (called on goal reset)
- `setCooldown(ability)` — manually set cooldown timestamp

### Ability Method

```typescript
async getAbility(ability: 'Q' | 'W', dispatcher: (collideable: Collideable) => void): Promise<Collideable | null>
```

- Returns a `Collideable` to be added to `_effectCollideables`
- Returns `null` for self-buff abilities (like Garen Q) or multi-spawn abilities (like Ashe Q where dispatcher handles them)
- The `dispatcher` callback adds collideables to the game world — used when an ability spawns multiple objects
- Stored as `_abilityQ` / `_abilityW` on the champion instance

## Registry (`champions.ts`)

Simple factory map:

```typescript
export const champions: ChampionList = {
  'Ashe': (side, owner) => new Ashe(side, owner),
  'Veigar': (side, owner) => new Veigar(side, owner),
  // ...
}
```

Each factory takes `(side: TeamSide, owner: Player)` and returns a `Champion` instance.

## Source Data (`source.ts`)

Large JSON with LoL champion stats and spell metadata. Structure per champion:

```typescript
{
  stats: { hp, mp, movespeed, armor, spellblock, attackrange, hpregen, crit, attackdamage, attackspeedperlevel, ... },
  spells: [
    { id: "VeigarBalefulStrike", sprite: "spell0.png", x: 0, y: 0, w: 48, h: 48, cooldown: 7 },
    { id: "VeigarDarkMatter", ... },
    { id: "VeigarEventHorizon", ... },
    { id: "VeigarPrimordialBurst", ... }
  ]
}
```

Stats feed into Player physics: `mass = hp/10`, `acceleration = movespeed/5000`, `force = attackdamage/400`.

Spell array indices: 0=Q, 1=W, 2=E, 3=R. Only 0 and 1 are used.

## Ability Patterns

Every champion file in `champions/` follows one of these patterns:

### 1. Projectile (e.g., Veigar Q, Amumu Q)

Creates a `CircleCollideable` or `VectorCollideable` with initial velocity:

```typescript
const projectile = new CircleCollideable(mass, new Vector(0, 0), radius, {
  isSensor: true,              // or false for physical collision
  collisionFilter: {
    category: AbilityProjectileCategory,
    mask: oppositePlayerCategory | BallCategory
  }
})
projectile._body.plugin = {
  owner: this._owner,
  drawer: projectile,
  id: spell.id,
  duration: 1000,              // lifetime in ms
  effectDuration: 500,         // stun/slow duration on hit
  velocity: 7,                 // initial speed (set by Field._updateEffects)
  handleCollision: (target) => { /* apply effects, expire */ }
}
```

Velocity is applied by `Field._updateEffects()` using the owner's facing direction.

### 2. Zone/AoE (e.g., Veigar W, Amumu W, Ashe W)

Creates a static sensor at a position:

```typescript
const zone = new CircleCollideable(999999999, ownerPosition, radius, {
  isStatic: true,
  isSensor: true,
  collisionFilter: {
    category: AbilityStunCategory,
    mask: oppositePlayerCategory | BallCategory
  }
})
zone._body.plugin = {
  owner: this._owner,
  drawer: zone,
  id: spell.id,
  duration: 3000,
  effectDuration: 1500,
  velocity: 0                  // stationary
}
```

Use `AbilityStunCategory` for zones that stun. Use `AbilityEffectCategory` for zones that only trigger callbacks.

### 3. Self-Buff (e.g., Garen Q)

Modifies owner stats directly, returns `null`:

```typescript
async getAbility(ability, dispatcher) {
  if (ability === 'Q') {
    if (!this._canUseAbility('Q')) return null
    this._owner._acceleration *= 2
    setTimeout(() => { this._owner._acceleration /= 2 }, 1500)
    return null  // no collideable spawned
  }
}
```

### 4. Hook/Pull (e.g., Amumu Q, Thresh Q)

Projectile that on-hit stores a target reference and smoothly moves the caster toward the target:

```typescript
handleCollision: (target) => {
  projectile._target = target
  projectile.setVelocity(new Vector(0, 0))  // stop moving
  // extend duration for pull phase
}

// Custom update() on the collideable:
update(dt) {
  if (this._target) {
    // move owner toward target position
    const step = targetPos.substract(ownerPos).normalize().multiply(speed)
    this._owner.setPosition(ownerPos.add(step))
  }
}
```

### 5. Multi-Projectile (e.g., Ashe Q)

Uses `dispatcher` to spawn multiple objects, returns `null`:

```typescript
async getAbility(ability, dispatcher) {
  if (ability === 'Q') {
    if (!this._canUseAbility('Q')) return null
    const angles = [-0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24]
    for (const offset of angles) {
      const projectile = new AsheQ(...)
      projectile._body.plugin.velocity = 7.4
      projectile._body.plugin.angularVelocity = offset  // spread angle
      dispatcher(projectile)
    }
    return null  // dispatcher already handled all spawns
  }
}
```

### 6. Following Zone (e.g., Garen W, Thresh W)

Zone with a custom `update()` that tracks owner position:

```typescript
update(dt) {
  this.setPosition(this._body.plugin.owner._body.position)
}
```

## Adding a New Champion

1. **Create `champions/ChampionName.ts`**:
   - Import Champion base from `../classes`
   - Import collideable classes, categories, globals
   - Extend Champion, implement constructor calling `super(side, owner, 'ChampionName')`
   - Override `getAbility(ability, dispatcher)` with Q and W implementations
   - Export a factory: `(side: TeamSide, owner: Player) => Champion`

2. **Add stats to `source.ts`**:
   - Add a key under the champion name with `stats` and `spells` arrays
   - Spell entries need: `id`, `sprite`, `x`, `y`, `w`, `h`, `cooldown`

3. **Register in `champions.ts`**:
   - Import the factory
   - Add to the `champions` map

4. **Add to `ChampionName` union** in `classes.ts`

5. **If the ability applies states** to players or ball:
   - Add the spell `id` to `Player.applyStateFromAbility()` switch in `collideables/player.ts`
   - Add the spell `id` to `Ball.applyStateFromAbility()` switch in `collideables/ball.ts`

6. **Add client VFX** in `client/src/views/World/Objects/Skills/ChampionName.tsx`:
   - Create SVG components for each ability visual
   - Register in `Effect.tsx` switch statement

## Collision Category Guide for Abilities

| Ability Type | Category | Typical Mask |
|-------------|----------|--------------|
| Physical projectile (pushes targets) | `AbilityProjectileCategory` | Opposite players + Ball |
| Stun zone (freezes/stuns targets) | `AbilityStunCategory` | Opposite players + Ball |
| Effect zone (callbacks only, no physics) | `AbilityEffectCategory` | Opposite players + Ball |
| Ally-targeting (e.g., Thresh W) | `AbilityEffectCategory` | Same-side players |

Always set `isSensor: true` for zones and non-physical projectiles. Only use physical collision (`isSensor: false`) for projectiles that should push targets on impact.
