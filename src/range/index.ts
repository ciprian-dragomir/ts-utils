import { Maybe } from '../types';

export type Range = {
  map: <T>(fn: (e: number, index: number) => T) => T[];
  some: (fn: (e: number, index: number) => boolean) => boolean;
  forEach: (fn: (e: number, index: number) => void) => void;
  random: (generator?: () => number) => number;
  find: (fn: (e: number, index: number) => boolean) => Maybe<number>;
};

/**
 * Introduce a range struct which allows "mapping" over the integer value in its (right open) interval.
 * The purpose of this utility is twofold:
 * 1. Avoid the necessity to use "[...Array(n).keys()]" (which implies allocation and two iterations)
 * every time we wish to map over indices starting at 0;
 * 2. Avoid having to allocate an array just to be able to use higher order functions (e.g. map)
 * over integers in a given range (i.e. to make up for the lack of lazy evaluations).
 *
 * Note: A range is exclusive: range(0, 0) will yield 0 iterations.
 *
 * Usage:
 *  range(0, 3).map(i => `Item ${i})`) // ['Item 0', 'Item 1', 'Item 2']
 *  range(4, 2).map(`Item ${i})`) // ['Item 4', 'Item 3')
 *
 * Other methods can be added as necessary (e.g. fold)
 * @param start
 * @param end
 */
export default (start: number, end: number): Range => ({
  map: <T>(fn: (e: number, index: number) => T): T[] => {
    const res: T[] = [];
    if (end < start) {
      for (let i = start, j = 0; i > end; --i, ++j) {
        res.push(fn(i, j));
      }
    } else {
      for (let i = start, j = 0; i < end; ++i, ++j) {
        res.push(fn(i, j));
      }
    }

    return res;
  },
  some: (fn: (e: number, index: number) => boolean): boolean => {
    if (end < start) {
      for (let i = start, j = 0; i > end; --i, ++j) {
        if (fn(i, j)) {
          return true;
        }
      }
    } else {
      for (let i = start, j = 0; i < end; ++i, ++j) {
        if (fn(i, j)) {
          return true;
        }
      }
    }

    return false;
  },
  forEach: (fn: (e: number, index: number) => void): void => {
    if (end < start) {
      for (let i = start, j = 0; i > end; --i, ++j) {
        fn(i, j);
      }
    } else {
      for (let i = start, j = 0; i < end; ++i, ++j) {
        fn(i, j);
      }
    }
  },
  /**
   * The range is exceptionally inclusive for this function to avoid the inclusion of undefined
   * as a return value for cases such as range(1, 1).random().
   */
  random: (generator = Math.random): number =>
    start === end
      ? start
      : (end < start ? end : start) + Math.floor(generator() * Math.abs(end - start) + 1),
  find: (fn: (e: number, index: number) => boolean): Maybe<number> => {
    if (end < start) {
      for (let i = start, j = 0; i > end; --i, ++j) {
        if (fn(i, j)) {
          return i;
        }
      }
    } else {
      for (let i = start, j = 0; i < end; ++i, ++j) {
        if (fn(i, j)) {
          return i;
        }
      }
    }

    return undefined;
  },
});
