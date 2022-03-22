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
export const maybe = <T>(a: T | null): Maybe<T> => a || undefined;

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

