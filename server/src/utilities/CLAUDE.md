# Server Utilities

Small, pure utility functions shared across the server codebase.

## Functions

### `conversion.ts`

```typescript
objectToBinary(object: any): ArrayBuffer
```
Converts a JS object to binary via `JSON.stringify()` → `TextEncoder.encode()`. Used for all Socket.IO message encoding.

```typescript
binaryToObject(ab: ArrayBuffer | Uint8Array): any
```
Reverse: `TextDecoder.decode()` → `JSON.parse()`. Accepts both ArrayBuffer and Uint8Array.

These are the **only** serialization functions used for socket transport. All events use binary encoding — never send raw JSON over Socket.IO.

### `arrays.ts`

```typescript
reverseArray<T>(arr: Array<T>): Array<T>
```
Returns a new reversed array without mutating the original. Uses `reduce()`.

### `numbers.ts`

```typescript
round(n: number): number
```
Rounds to 3 decimal places. Formula: `Math.round(n * 3) / 3`.

Note: this rounds to thirds (0, 0.333, 0.667, 1.0), not to 3 decimal places in the traditional sense. The constant is `3`, not `1000`.

### `objects.ts`

```typescript
deepCopy<T>(object: T): T
```
Deep clones via `JSON.parse(JSON.stringify())`. Only works for serializable objects — no functions, Dates, or circular references.

### `dates.ts`

```typescript
elapsedSeconds(from: Date, to: Date = null): number
```
Returns seconds elapsed between two dates. If `to` is null, uses `new Date()` (current time). Used by Score and Field for timing.

## Conventions

- All functions are pure (no side effects, no mutations)
- Each file exports a single function
- Generic types used where applicable (`<T>`)
- No external dependencies — plain JS/TS only
