const roundingDecimals: number = 3;

export const round = (n: number): number => Math.round(n * roundingDecimals) / roundingDecimals
