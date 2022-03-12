import { replaceAll, replaceItem, replaceItemAt, split } from '../index';

describe('split', () => {
  it('should return two empty arrays', () => {
    expect(split([], e => e)).toEqual([[], []]);
  });

  it('should return all elements in the first array', () => {
    expect(split([1, 2, 3], e => e < 5)).toEqual([[1, 2, 3], []]);
  });

  it('should return all elements in the second array', () => {
    expect(split([1, 2, 3], e => e > 3)).toEqual([[], [1, 2, 3]]);
  });

  it('should split the array correctly when none match', () => {
    expect(split([1, 2, 3], e => e > 3)).toEqual([[], [1, 2, 3]]);
  });

  it('should split the array correctly when some match', () => {
    expect(split([7, 1, 2, 3, 4, 5, 6, 3, 9, 6], e => e % 2 === 0)).toEqual([
      [2, 4, 6, 6],
      [7, 1, 3, 5, 3, 9],
    ]);
  });

  it('should split the array correctly for strings', () => {
    expect(split(['apple', 'b', 'banana', 'lemon', 'orange'], e => e.length === 5)).toEqual([
      ['apple', 'lemon'],
      ['b', 'banana', 'orange'],
    ]);
  });
});

describe('replaceItemAt', () => {
  it('returns the same array if index is less than 0', () => {
    const arr = [1, 2, 3];
    expect(replaceItemAt(arr, -1, 10)).toBe(arr);
  });

  it('returns the same array if index is greater or equal than array length', () => {
    const arr = [1, 2, 3];
    expect(replaceItemAt(arr, arr.length, 10)).toBe(arr);
    expect(replaceItemAt(arr, arr.length + 1, 10)).toBe(arr);
  });

  it('returns a new array with item replaced at index', () => {
    const arr = [1, 2, 3];
    const nextArr = replaceItemAt(arr, 0, 5);
    expect(arr).not.toBe(nextArr);
    expect(nextArr).toEqual([5, 2, 3]);
    expect(replaceItemAt<any>([1, 'someString', { a: 3 }], 2, true)).toEqual([
      1,
      'someString',
      true,
    ]);

    expect(replaceItemAt<string | number>([1, 'food', 4], 1, 'bar')).toEqual([1, 'bar', 4]);
  });
});

describe('replaceItem', () => {
  it('returns the array if the item to replace is not found', () => {
    const arr = [1, 2, 3];
    expect(replaceItemAt(arr, 5, 6)).toBe(arr);
    expect(replaceItemAt<any>(arr, 'foo', true)).toBe(arr);
  });

  it('returns the array with first found item replaced', () => {
    const arr = [1, 2, 3];
    const nextArr = replaceItem(arr, 2, 6);
    expect(arr).not.toBe(nextArr);
    expect(nextArr).toEqual([1, 6, 3]);
    expect(replaceItem([true, true, true], true, false)).toEqual([false, true, true]);
    expect(replaceItem<any>(['123', 6, NaN, null, undefined], undefined, 'foo')).toEqual([
      '123',
      6,
      NaN,
      null,
      'foo',
    ]);

    expect(
      replaceItem<any>(['123', 6, NaN, null, undefined], 6, true, (a, b) => !a && b % 2 === 0),
    ).toEqual(['123', 6, true, null, undefined]);
  });
});

describe('replaceAll', () => {
  it('returns the same array if no elements have been replaced', () => {
    const arr = [1, 2, 3];
    const nextArray = replaceAll(arr, e => e > 3, -1);
    expect(nextArray).toBe(arr);
  });

  it('returns a new array with replaced items', () => {
    const arr = [1, 2, 3];
    const nextArray = replaceAll(arr, (e, index) => e < 3 && index > 0, -1);
    expect(nextArray).not.toBe(arr);
    expect(nextArray).toEqual([1, -1, 3]);
    expect(replaceAll(arr, () => true, -1)).toEqual([-1, -1, -1]);
    expect(replaceAll(['foo', 'bar'], e => e.startsWith('f'), 'abc')).toEqual(['abc', 'bar']);
  });
});
