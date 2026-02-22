# Client Utilities

Small, shared utility functions for the client.

## Functions

### `conversion.ts`

```typescript
objectToBinary(object: any): ArrayBuffer
```
Converts JS object to binary via `JSON.stringify()` → `TextEncoder.encode()`. Used for all Socket.IO outbound messages.

```typescript
binaryToObject(ab: ArrayBuffer | Uint8Array): any
```
Reverse: `TextDecoder.decode()` → `JSON.parse()`. Accepts both ArrayBuffer and Uint8Array. Used for all Socket.IO inbound messages.

These mirror the server's `utilities/conversion.ts` exactly. Both sides must use the same encoding — never send raw JSON over Socket.IO.

### `geojson.ts`

```typescript
boundsToSquareFeature(bounds: [[number, number], [number, number]][]): FeatureCollection
```
Converts an array of bounding box coordinate pairs into a GeoJSON FeatureCollection with a single Polygon feature. Finds global min/max across all bounds, adds 0.5 padding. Used for map-related features.

## Testing

`conversion.test.ts` — Vitest tests for the binary conversion round-trip:
- Plain object round-trip
- Unicode/emoji support
- Uint8Array input acceptance

Run with `npm test` from client root.

## Conventions

- Pure functions, no side effects
- Each file exports related functions
- Mirror server utilities where applicable (conversion.ts is identical)
