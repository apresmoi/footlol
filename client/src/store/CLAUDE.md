# Store (State Management)

All application state lives here. Uses **React Context API** — no Redux, Zustand, or other external state libraries.

## File Roles

| File | Purpose |
|------|---------|
| `index.ts` | Creates `ApplicationContext`, exports context and consumer |
| `provider.tsx` | `ApplicationContextProvider` — all state, socket lifecycle, action methods |
| `types.ts` | TypeScript interfaces for every data structure |
| `socket.ts` | `RoomSocket` class wrapping Socket.IO client |
| `sounds.ts` | Audio playback triggered by socket events |

## Context Shape (`types.ts`)

### Core State (`IApplicationContext`)

```typescript
{
  // Player identity
  name: string                          // persisted in localStorage.game
  champion: string                      // selected champion name

  // Room
  roomId: string
  rooms: Room[]                         // { id, name, players: number }
  stage: RoomStage                      // 'TEAM_SELECT' | 'CHAMPION_SELECT' | 'FIELD' | 'END'

  // Game entities
  self: Player                          // current player
  players: { [id: string]: Player }     // all players keyed by socket ID
  ball: Ball                            // { position, angle, states? }
  score: Score                          // { left, right, goals? }
  time: number                          // remaining seconds
  countdown: number                     // pre-game countdown
  victory: 'LEFT' | 'RIGHT' | null     // winner side

  // UI
  effects: Effect[]                     // active ability VFX
  debug: Effect[]                       // debug shapes
  messages: PlayerMessage[]             // chat history { name, message }
  champions: Champion[]                 // available champion pool

  // Actions (all methods)
  changeName(name: string): void
  changeChampion(champion: string): void
  connectSocket(roomId: string): void
  disconnectSocket(): void
  updateRooms(): void
  updateChampionPool(): void
  createRoom(name: string): void
  requestPlayerReady(ready: boolean): void
  requestDirectionChange(direction: Vector): void
  requestKeyPress(code: string): void
  requestSendMessage(payload: { message: string }): void
  requestChampionSelect(champion: string): void
  requestKickPlayer(id: string): void
  requestChangeSide(side: string): void
}
```

### Player Type

```typescript
{
  id: string
  name: string
  champion: string
  position: Vector              // { x, y }
  direction: Vector
  side: 'LEFT' | 'RIGHT'
  kicking: boolean
  ready: boolean
  cooldown: { Q: number, W: number }  // remaining seconds
  visible: boolean
  admin: boolean
  states?: { type: string, remainingMs: number }[]
}
```

### Effect Types

Rich union for ability VFX rendering:

- `CircleEffect` — `{ type: 'circle', radius }`
- `RectEffect` — `{ type: 'rect', width, height }`
- `RingEffect` — `{ type: 'ring', radius, thickness }`
- `PolygonEffect` — `{ type: 'polygon', points }`
- `VectorEffect` — `{ type: 'rect' }` (serialized from VectorCollideable)
- `CompoundEffect` — `{ type: 'compound', parts: Effect[] }`

All effects share: `id`, `instanceId?`, `position`, `angle`, `direction`, `image?`, `visible?`.

### Champion Type

```typescript
{
  name: string
  spells: {
    Q: { id, sprite, x, y, w, h, cooldown }
    W: { id, sprite, x, y, w, h, cooldown }
  }
}
```

## Provider (`provider.tsx`)

Single `ApplicationContextProvider` component wraps the entire app.

### State Management Pattern

- `useState` for all state fields
- `useCallback` for memoized action methods
- `useRef` for socket instance (`socketRef`)
- State updates via functional `setState` for immutability

### Key Behaviors

**Name persistence**: Reads from `localStorage.game` on mount, writes on every `changeName()` call. Sanitized: max 12 chars, trimmed.

**Socket lifecycle**:
1. `connectSocket(roomId)` — creates `RoomSocket`, binds subscribers, calls `socket.connect()`
2. `bindSocketSubscribers()` — attaches handlers for all inbound events (login, join, leave, update, messages, stage, kicks)
3. `disconnectSocket()` — calls `socket.disconnect()`, resets all game state to defaults

**API calls** (REST, not socket):
- `updateRooms()` — `GET /api/rooms`
- `createRoom(name)` — `POST /api/rooms` with `{ name }`
- `updateChampionPool()` — `GET /api/champions`

**Route-based cleanup**: `useEffect` on `location.pathname` disconnects socket when navigating to `/room-select`.

### Subscriber Bindings

Each socket event maps to a state update:

| Socket Event | State Update |
|-------------|--------------|
| `login_success` | Sets self, players, ball, score, stage, time, effects, roomId |
| `player_join` | Adds player to `players` dict |
| `player_leave` | Removes player from `players` dict |
| `update` | Updates players, ball, score, time, effects, countdown, victory |
| `message_sent` | Appends to `messages` array |
| `stage_change` | Updates `stage`, resets messages |
| `player_kicked` | Disconnects socket, navigates to `/room-select` |

## RoomSocket (`socket.ts`)

Wraps Socket.IO client. One instance per room connection.

### Connection

```typescript
const socket = io(roomId, { path: '/ws', autoConnect: false, query: { name } })
```

- Path `/ws` matches the server's Socket.IO path
- `autoConnect: false` — must call `connect()` explicitly
- Room ID is the Socket.IO namespace

### Binary Protocol

**All messages are binary-encoded.** Uses `objectToBinary()` / `binaryToObject()` from `../utils/conversion.ts`.

Inbound: `socket.on(event, (binary) => { const data = binaryToObject(binary); ... })`
Outbound: `socket._sendMessage(type, objectToBinary(payload))`

Exception: `ball_kicked` event uses raw JSON (not binary).

### Subscriber Pattern

```typescript
socket.subscribeUpdate((callback) => {
  subscribers.update = callback
})
```

Provider binds callbacks via `bindSocketSubscribers()`. Each inbound event triggers its subscriber callback after decoding and playing sounds.

### Outbound Methods

All `request*` methods encode payload to binary and emit:

```typescript
requestDirectionChange(direction: Vector)
requestKeyPress(code: string)
requestSendMessage(payload: { message: string })
requestPlayerReady(ready: boolean)
requestChampionSelect(champion: string)
requestKickPlayer(id: string)
requestChangeSide(side: string)
```

## Sounds (`sounds.ts`)

`playSound(sound: string)` — creates `new Audio()` and plays on socket events:

| Event | Sound File |
|-------|-----------|
| `player_leave` | `/sounds/leave.ogg` |
| `player_join` | `/sounds/join.ogg` |
| `message_sent` | `/sounds/chat.ogg` |
| `goal` | `/sounds/goal.ogg` |
| `stage_change` | `/sounds/stage.ogg` |
| `ball_kicked` | `/sounds/kick.ogg` |

Called inside `RoomSocket` event handlers before subscriber callbacks.

## Consuming Context

In functional components:
```tsx
const context = useContext(ApplicationContext)
context.requestKeyPress('KeyQ')
```

In class components (only KeyboardWrapper):
```tsx
<ApplicationContext.Consumer>
  {state => <Child {...state} />}
</ApplicationContext.Consumer>
```

Or use the exported wrapper pattern in KeyboardWrapper that provides context as props.
