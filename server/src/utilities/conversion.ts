import { mapSize, mapSizeMeters } from "../globals";

export const metersToPixels = (n: number) => n * mapSize._width / mapSizeMeters._width
