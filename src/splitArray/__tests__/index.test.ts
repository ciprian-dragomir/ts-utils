import { splitArray } from '../index';

describe('splitArray', () => {
  it('should return two empty arrays', () => {
    expect(splitArray([], e => e)).toEqual([[], []]);
  });

  it('should return all elements in the first array', () => {
    expect(splitArray([1, 2, 3], e => e < 5)).toEqual([[1, 2, 3], []]);
  });

  it('should return all elements in the second array', () => {
    expect(splitArray([1, 2, 3], e => e > 3)).toEqual([[], [1, 2, 3]]);
  });

  it('should split the array correctly when none match', () => {
    expect(splitArray([1, 2, 3], e => e > 3)).toEqual([[], [1, 2, 3]]);
  });

  it('should split the array correctly when some match', () => {
    expect(splitArray([7, 1, 2, 3, 4, 5, 6, 3, 9, 6], e => e % 2 === 0)).toEqual([
      [2, 4, 6, 6],
      [7, 1, 3, 5, 3, 9],
    ]);
  });

  it('should split the array correctly for strings', () => {
    expect(splitArray(['apple', 'b', 'banana', 'lemon', 'orange'], e => e.length === 5)).toEqual([
      ['apple', 'lemon'],
      ['b', 'banana', 'orange'],
    ]);
  });
});
