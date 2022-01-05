export type Maybe<T> = T | undefined;
export type AnyObject = Record<string, unknown>;
export const flatMap = <T, P>(a: Maybe<T>, b: (c: T) => Maybe<P>): Maybe<P> =>
  a === undefined ? undefined : b(a);

export type Optional<T extends AnyObject, Q extends keyof T> = Omit<T, Q> &
  {
    [key in Q]+?: T[key];
  };