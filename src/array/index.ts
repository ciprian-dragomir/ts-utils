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
export const split = <T>(arr: T[], predicate: (e: T, index: number) => boolean): SplitResult<T> => {
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

export const replaceItemAt = <T>(arr: T[], index: number, item: T): T[] => {
  if (index > -1 && index < arr.length) {
    const nextArr = arr.slice();
    nextArr.splice(index, 1, item);
    return nextArr;
  }

  return arr;
};

export const replaceAll = <T>(
  arr: T[],
  predicate: (e: T, index: number) => boolean,
  replacementItem: T,
): T[] => {
  const nextArr = new Array(arr.length);
  let atLeastOneItemReplaced = false;
  for (let i = 0; i < arr.length; ++i) {
    if (predicate(arr[i], i)) {
      nextArr[i] = replacementItem;
      atLeastOneItemReplaced = true;
    } else {
      nextArr[i] = arr[i];
    }
  }

  return atLeastOneItemReplaced ? nextArr : arr;
};

export const replaceFirst = <T>(arr: T[], predicate: (e: T) => boolean, replacementItem: T): T[] =>
  replaceItemAt(arr, arr.findIndex(predicate), replacementItem);

export const replaceItem = <T>(
  arr: T[],
  itemToReplace: T,
  replacementItem: T,
  eq: (item1: T, item2: T) => boolean = Object.is,
): T[] => replaceFirst(arr, item => eq(item, itemToReplace), replacementItem);

export const arrayEquals = <T>(
  arr1: T[],
  arr2: T[],
  eq: (e1: T, e2: T) => boolean = Object.is,
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; ++i) {
    if (!eq(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
};
