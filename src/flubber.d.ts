/// <reference types="vite/client" />

declare module 'flubber' {
  export interface InterpolateOptions {
    maxSegmentLength?: number;
    string?: boolean;
  }
  export function interpolate(
    fromShape: string,
    toShape: string,
    options?: InterpolateOptions
  ): (t: number) => string;
  export function interpolateAll(
    fromShapes: string[],
    toShapes: string[],
    options?: InterpolateOptions
  ): Array<(t: number) => string>;
}
