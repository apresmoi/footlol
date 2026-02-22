# World View

**Stage:** `FIELD`

The game viewport — the most complex view. All game objects render as **SVG** (not Canvas API).

## Component Tree

```
World
├── Camera (ResizeObserver for responsive SVG)
│   └── CameraPosition (follows self player or ball, clamped to field bounds)
│       └── Draw (renders all game objects as SVG)
├── Score (top-center: LEFT_SCORE : TIME : RIGHT_SCORE)
└── KeyboardWrapper (class component for input)
    ├── GameChat (bottom-left, foreignObject in SVG)
    ├── ActionBar (bottom-center HUD: champion portrait, HP bar, skill slots)
    ├── Scoreboard (TAB key overlay: per-player goals)
    ├── Victory (overlay when player's team wins)
    └── Defeat (overlay when player's team loses)
```

## Camera System (`Camera/`)

- `Camera.tsx` uses `ResizeObserver` to track container dimensions
- Passes `width` and `height` to children via `React.cloneElement()`
- `CameraPosition` computes viewport offset with `useMemo()`:
  - Follows self player (25% from left if LEFT team, 75% if RIGHT)
  - Falls back to ball center if no self
  - Clamped to field bounds (`mapSize`)

## Game Rendering (`Objects/`)

### Render Order in Draw.tsx (back to front)

1. `<defs>` — SVG patterns for champion images
2. `FieldComponent` — pitch background, markings, center circle, branding
3. `GoalComponent` (LEFT) — frame, posts, gradient aura
4. `GoalComponent` (RIGHT)
5. Debug effects (if enabled)
6. Game effects (abilities/skills)
7. `BallComponent`
8. Opponent players
9. Self player (topmost)

### Champion Image Patterns

`Draw.tsx` generates SVG `<pattern>` elements for each unique champion. Pattern ID: `championPatternId(champion)`. Images from LoL CDN: `ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/{name}.png`

### Memoization Strategy

Game objects re-render at 40 Hz. To prevent unnecessary renders:
- `PlayerComponent` uses `React.memo()` with custom `isPlayerEqual()` comparing: id, name, champion, visibility, side, position (x,y), direction (x,y), state signature, kicking flag, isSelf, teammate
- `BallComponent`, `FieldComponent`, `GoalComponent` use `React.memo()` with default equality
- `Draw.tsx` uses `useMemo()` for champion names and opponent list

### Player Visual States

Each state renders distinct SVG VFX overlays:
- **Frozen**: Ice aura, rotating polygons, animated circles
- **Stunned**: Yellow dashed outline, rotating stars
- **Feared**: Purple aura, rotating teardrops
- **Slowed**: Cyan halo, wave animations

### Player Colors

- Yellow = self
- Blue = LEFT team
- Red = RIGHT team

## Skill VFX (`Objects/Skills/`)

One file per champion. Each exports named components for that champion's abilities.

`Effect.tsx` is the router — maps `effect.id` to the correct skill component via switch/if-else.

When adding a new champion's VFX:
1. Create `Skills/ChampionName.tsx` with SVG components for each ability
2. Register each ability in `Effect.tsx`'s routing logic
3. Effect props: `{ effect, self, players }` — effect contains position, angle, type, dimensions

## UI Components (`UI/`)

### ActionBar

Bottom-center HUD. Shows champion portrait (120x120), HP bar, and skill slots (Q, W, KICK). Skill icons loaded from LoL sprite sheets (480x192 atlas) using `viewBox` to crop individual spells. Cooldown timers displayed as numbers. Active keys highlighted with yellow border.

Props: `{ width, height, actionKeysPressed }` (injected by KeyboardWrapper).

### Score

Top-center. Format: `LEFT_SCORE : MM:SS : RIGHT_SCORE`. Blue for LEFT, red for RIGHT, gold for time.

### Scoreboard

Visible only when TAB pressed. Calculates goals per player from `context.score.goals`. Sorts by goals descending. Shows both connected and disconnected (offline) players who scored.

### Victory / Defeat

Full-screen overlays. Victory shows when `context.victory === self.side`. Defeat when `context.victory !== self.side`. Images from `/public/logo/victory.png` and `/public/logo/defeat.png`.

## KeyboardWrapper (`Wrappers/`)

**Class component** (only class component in the project). Handles keyboard input for game controls.

Allowed keys:
- Direction: `ArrowLeft`, `ArrowDown`, `ArrowUp`, `ArrowRight`
- Action: `Space`, `KeyQ`, `KeyW`
- Special: `Tab` (toggles scoreboard)

Calculates direction vector from pressed arrow keys and calls `requestDirectionChange()`. Action keys call `requestKeyPress()`.

Passes to children via `cloneElement()`:
- `actionKeysPressed`, `directionKeysPressed`, `tabPressed` — state
- `disableKeyboardInput()`, `enableKeyboardInput()` — methods (used by Chat to prevent typing from triggering game controls)

## Chat (`World/Chat.tsx`)

Fully functional in-game chat rendered as SVG `<foreignObject>`. Calls `disableKeyboardInput()` on focus and `enableKeyboardInput()` on blur to prevent game input conflicts.
