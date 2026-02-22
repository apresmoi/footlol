# Login View

**Route:** `/`

Entry point for the app. Text input for player nickname (max 12 chars). Embeds YouTube background video (ID: `dGM7MqzeA7s`). Navigates to `/room-select` on submit.

## Context Usage

- `context.name` — current player name
- `context.changeName()` — updates player name

## Layout

Uses the standard layout pattern:

```tsx
<Wrapper>
  <Header />
  <Container>
    {/* name input + submit */}
  </Container>
</Wrapper>
```
