export * from './types';
export * from './splitArray';
export * from './range';

export const equals =
  <T>(a: T, isEqual: (x: T, y: T) => boolean = Object.is) =>
  (b: T) =>
    isEqual(a, b);
