import '@testing-library/jest-dom/vitest';
import { TextEncoder, TextDecoder } from 'util';

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}
