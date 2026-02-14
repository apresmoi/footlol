const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function objectToBinary(object) {
    return encoder.encode(JSON.stringify(object)).buffer;
}

export function binaryToObject(ab) {
    const bytes = ab instanceof Uint8Array ? ab : new Uint8Array(ab);
    return JSON.parse(decoder.decode(bytes));
}
