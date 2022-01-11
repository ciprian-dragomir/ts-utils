type SplitResult<T> = [T[], T[]];

/**
 * A missing array method which allows us to split an instance based on a predicate.
 * The first array returned contains the elements for which the predicate holds whereas the second
 * array (index 1) consists of remaining elements.
 * This permits a more efficient way of separating elements than using two Array.prototype.filter
 * calls with complementary predicates.
 * @param arr
 * @param predicate
 */
export const splitArray = <T>(
  arr: T[],
  predicate: (e: T, index: number) => boolean,
): SplitResult<T> => {
  return arr.reduce<SplitResult<T>>(
    (acc, e, index) => {
      const [a1, a2] = acc;
      if (predicate(e, index)) {
        a1.push(e);
      } else {
        a2.push(e);
      }

      return acc;
    },
    [[], []],
  );
};
