# Layout Components

Thin wrapper components that provide consistent page structure across all views. No business logic — pure layout.

## Components

All are functional components with a single `children` prop typed as `any`.

### Wrapper

```tsx
<div className="wrapper">{children}</div>
```

Root container for every view. Styles: `100vw × 100vh`, dark gradient background, `z-index: 2`.

### Header

```tsx
<div className="header">{children}</div>
```

Top bar. Fixed 50px height. Content is view-specific (usually empty or contains back navigation).

### Container

```tsx
<div className="container">{children}</div>
```

Main content area below header. Height: `calc(100% - 50px)`. Holds all view-specific content.

### Sidebar

```tsx
<div className="sidebar">{children}</div>
```

Side panel. Not currently used by any view but available.

## Usage Pattern

Every top-level view follows this structure:

```tsx
import { Wrapper, Header, Container } from '../../layout'

const MyView = () => (
  <Wrapper>
    <Header>{/* optional */}</Header>
    <Container>
      {/* view content */}
    </Container>
  </Wrapper>
)
```

## Styles (`styles.scss`)

Defines the layout CSS:

- `.wrapper` — full viewport, dark gradient (`--bg-0` based), hidden overflow
- `.header` — 50px fixed height
- `.container` — fills remaining height
- `.world` — game viewport container: relative, max-width 1300px, centered, rounded corners, shadow, hidden overflow
- `.world svg` — 100% dimensions
- `.world` animation: `fadeInWorld` — opacity 0→1 over 0.7s with 0.12s delay

## Conventions

- Layout components are purely structural — no state, no context consumption, no side effects
- All styling via class names, no inline styles
- Barrel-exported from `index.tsx`: `Wrapper`, `Container`, `Sidebar`, `Header`
- Styles imported once in `index.tsx`, not in individual component files
