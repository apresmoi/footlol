export function objectToBinary(object) {
    return new Uint8Array(JSON.stringify(object).split('').map(c => c.charCodeAt(0))).buffer;
}

export function binaryToObject(ab) {
    return JSON.parse(new Uint8Array(ab).reduce((p, c) => p + String.fromCharCode(c), ''));
}