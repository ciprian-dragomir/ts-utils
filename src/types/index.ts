export type Maybe<T> = T | undefined;
export type AnyObject = Record<string, unknown>;

/**
 * Monadic bind for the Maybe monad.
 * @param a
 * @param b
 */
export const flatMap = <T, P>(a: Maybe<T>, b: (c: T) => Maybe<P>): Maybe<P> =>
  a === undefined ? undefined : b(a);

/**
 * Convert a nullable value to a Maybe monad (null is translated to undefined).
 * @param a
 */
export const maybe = <T>(a: T | null): Maybe<T> => (a === null ? undefined : a);

/**
 * Convert a possibly defined JS number to an actual numeric value (or Infinity).
 * Return undefined if value is null, undefined or NaN.
 * Adds the convenience of using the ?? for values which could be NaN:
 * E.g.
 * NaN ?? 0 ---> NaN
 * maybeNumber(NaN) ?? 0 ---> 0
 *
 * But also collapses 3 separate exceptional values which can be associated with
 * an optional number into one (undefined).
 * A realistic use case is getting the value from a form field:
 * maybeNumber(parseInt('')) ?? 0 ---> 0
 * maybeNumber(parseFloat('sdg0')) ---> undefined
 * @param a
 */
export const maybeNumber = <T extends number>(a: T | null | undefined) =>
  a === 0 ? a : !a ? undefined : a;

export type Optional<T extends AnyObject, Q extends keyof T> = Omit<T, Q> & {
  [key in Q]+?: T[key];
};

export const equals =
  <T>(a: T, isEqual: (x: T, y: T) => boolean = Object.is) =>
  (b: T) =>
    isEqual(a, b);

export const not =
  <T extends unknown[]>(predicate: (...args: T) => boolean) =>
  (...args: T) =>
    !predicate(...args);

export const compose =
  <T extends (...args: any[]) => any, P>(a: (arg: ReturnType<T>) => P, b: T) =>
  (...args: Parameters<T>): P =>
    a(b(...args));
