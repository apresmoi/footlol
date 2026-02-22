# Client Standards

## Tech Stack

React 19, Vite 7, TypeScript, SCSS, Socket.IO Client, React Router 7.

## File Naming

- **Directories**: PascalCase for views/components (`Login/`, `TeamSelect/`, `World/`)
- **Components**: `index.tsx` as barrel entry, or PascalCase (`ActionBar.tsx`, `KeyboardWrapper.tsx`)
- **Utilities**: camelCase (`conversion.ts`, `geojson.ts`)
- **Styles**: `styles.scss` co-located with each view
- **Tests**: `.test.{ts,tsx}` suffix co-located with source

## Component Patterns

- Functional components with hooks. No class components except `KeyboardWrapper` (complex input state).
- State management via React Context (`ApplicationContext` in `src/store/`). No Redux or external state libraries.
- Context consumed with `useContext(ApplicationContext)` in functional components.
- Props typed with TypeScript interfaces.

## Styling

- SCSS with CSS custom properties defined in `src/styles.scss` under `:root`
- Class names: kebab-case (`.team-select`, `.chat-input`, `.player-remove`)
- Theme: dark-only, LoL-inspired gold/bronze palette
- Fonts: `Beaufort for LOL` (display), `Spiegel` (body/UI) — loaded from `/public/fonts/lol/`
- Key variables: `--bg-0..2`, `--surface-0..2`, `--text-main`, `--accent`, `--font-display`, `--font-body`

## State Store (`src/store/`)

- `index.ts` — creates `ApplicationContext` with defaults
- `provider.tsx` — `ApplicationContextProvider` manages all state + socket lifecycle
- `types.ts` — `IApplicationContext` interface
- `socket.ts` — `RoomSocket` class wrapping Socket.IO
- `sounds.ts` — audio playback on socket events

Player name persisted in `localStorage.game`.

## Socket.IO

- Connects to namespace matching room ID, path `/ws`
- Binary encoding via `objectToBinary()` / `binaryToObject()` (TextEncoder)
- Inbound events: `login_success`, `update`, `player_join`, `player_leave`, `stage_change`, `goal`, `ball_kicked`, `message_sent`, `player_kicked`
- Outbound events: `request_direction_change`, `request_key_press`, `request_send_message`, `request_player_ready`, `request_champion_select`, `request_kick_player`, `request_change_side`

## Game Rendering

- SVG-based rendering (not Canvas API)
- `World/` view contains the game viewport
- `Camera` component uses `ResizeObserver` for responsive SVG scaling
- Game objects (players, ball, effects) rendered as SVG elements from serialized server state

## View Hierarchy

```
App (BrowserRouter + ApplicationContextProvider)
├── / → Login
├── /room-select → Rooms
├── /room-create → CreateRoom
└── /game → Game
    ├── TEAM_SELECT → TeamSelect
    ├── CHAMPION_SELECT → ChampionSelect
    └── FIELD → World
        ├── Camera → Draw (Field, Goals, Effects, Ball, Players)
        ├── Score, GameChat, ActionBar, Scoreboard
        └── Victory / Defeat overlays
```

## SEO & Analytics

- `src/seo.js` — dynamic meta tags per route via `applySeo(pathname)`
- `src/analytics.js` — GA4 via `VITE_GA_MEASUREMENT_ID`
- Static meta in `index.html`, dynamically updated on navigation

## Environment Variables

- `VITE_API_PROXY_TARGET` — API server URL (default: `http://localhost:8081`)
- `VITE_GA_MEASUREMENT_ID` — Google Analytics 4 ID
- `VITE_SITE_URL` — canonical site URL (default: `https://footlol.com`)

## Testing

Vitest + React Testing Library, jsdom environment. Run with `npm test` or `npm run test:watch`.

## Build

`npm run build` produces a Vite production bundle in `dist/`. In production, served by Nginx with aggressive caching for hashed assets and no-cache for HTML.
