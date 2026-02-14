import { objectToBinary, binaryToObject } from './conversion';

describe('conversion utilities', () => {
  it('round-trips plain objects', () => {
    const payload = {
      id: 'room-1',
      players: 10,
      flags: { ready: true, admin: false },
    };

    expect(binaryToObject(objectToBinary(payload))).toEqual(payload);
  });

  it('round-trips unicode text safely', () => {
    const payload = {
      message: 'Goal! ⚽🔥',
      player: 'Renée',
    };

    expect(binaryToObject(objectToBinary(payload))).toEqual(payload);
  });

  it('accepts Uint8Array input on decode', () => {
    const payload = { code: 'KeyQ', ok: true };
    const bytes = new Uint8Array(objectToBinary(payload));

    expect(binaryToObject(bytes)).toEqual(payload);
  });
});
