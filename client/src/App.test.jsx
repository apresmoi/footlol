import React, { act } from 'react';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    json: async () => [],
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('renders game title on login screen', async () => {
  let getByRole;
  await act(async () => {
    ({ getByRole } = render(<App />));
  });
  const titleElement = getByRole('heading', { name: /FOOTLOL/i });
  expect(titleElement).toBeInTheDocument();
});
