import { Range, range } from '../index';

it('maps range values correctly', () => {
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

it('executes "some" function correctly', () => {
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

it('executes "forEach" fn correctly', () => {
  const fn = jest.fn();
  range(0, 5).forEach(fn);
  expect(fn).toHaveBeenCalledTimes(5);
  for (let i = 0; i < 5; ++i) {
    expect(fn.mock.calls[i][0]).toBe(i);
  }
});

it('executes "find" fn correctly', () => {
  expect(range(2, 5).find(i => i > 4)).toBeUndefined();
  expect(range(5, 2).find(i => i < 2)).toBeUndefined();
  expect(range(5, 2).find(i => i % 2 === 0)).toBe(4);
  expect(range(2, 2).find(() => true)).toBe(undefined);
  expect(range(2, 3).find(() => true)).toBe(2);
  expect(range(2, 10).find((_, index) => index === 4)).toBe(6);
  expect(range(2, 10).find((_, index) => index === 20)).toBeUndefined();
});
