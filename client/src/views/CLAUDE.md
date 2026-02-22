# Views

All page-level components live here. Each view maps to a route or game stage.

## Component Conventions

- **Functional components** with hooks (except `KeyboardWrapper` — class component for input state).
- All views consume `useContext(ApplicationContext)` for state and actions.
- Each view directory has an `index.tsx` (component) and `styles.scss` (co-located styles).
- Components rendering game objects use `React.memo()` with custom equality checks.
- Action methods on context are `request*` prefixed: `requestDirectionChange`, `requestKeyPress`, `requestSendMessage`, etc.

## Layout Pattern

Every top-level view wraps content with shared layout components:

```tsx
<Wrapper>
  <Header>{/* optional header content */}</Header>
  <Container>{/* view content */}</Container>
</Wrapper>
```

## View Index

| View | Route / Stage | Description |
|------|--------------|-------------|
| [Login](Login/CLAUDE.md) | `/` | Entry point — nickname input with YouTube background |
| [Rooms](Rooms/CLAUDE.md) | `/room-select` | Room list with auto-refresh, room creation form |
| [TeamSelect](TeamSelect/CLAUDE.md) | `TEAM_SELECT` | Two-team picker, admin kick, chat |
| [ChampionSelect](ChampionSelect/CLAUDE.md) | `CHAMPION_SELECT` | Champion portrait grid with pick/ban state |
| [World](World/CLAUDE.md) | `FIELD` | Game viewport — SVG rendering, camera, input, HUD, skill VFX |
