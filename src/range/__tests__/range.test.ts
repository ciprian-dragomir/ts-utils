import range, { Range } from '../index';

it('should map range values correctly', () => {
  (
    [
      [range(-4, 2), [-4, -3, -2, -1, 0, 1]],
      [range(6, 3), [6, 5, 4]],
      [range(0, 0), []],
      [range(-3, -5), [-3, -4]],
    ] as [Range, number[]][]
  ).forEach(([r, result]) => {
    expect(r.map(i => i)).toEqual(result);
  });
});

it('should execute some function correctly', () => {
  expect(range(-4, -2).some(i => i < 0)).toBe(true);
  expect(range(-4, -2).some(i => i >= -2)).toBe(false);
  expect(range(0, 0).some(() => false)).toBe(false);
  expect(range(0, 0).some(() => true)).toBe(false);
  expect(range(6, 6).some(() => true)).toBe(false);
  expect(range(-6, -6).some(() => true)).toBe(false);
  expect(range(-5, 10).some(i => i === 0)).toBe(true);
  expect(range(9, -9).some(i => i < 10 && i > -9)).toBe(true);
  expect(range(1, -2).some(i => i === -2)).toBe(false);
});

it('should execute forEach fn correctly', () => {
  const fn = jest.fn();
  range(0, 5).forEach(fn);
  expect(fn).toHaveBeenCalledTimes(5);
  for (let i = 0; i < 5; ++i) {
    expect(fn.mock.calls[i][0]).toBe(i);
  }
});
