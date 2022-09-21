import { maybeNumber } from '../index';

describe('maybeNumber', () => {
  it('works as expected', () => {
    expect(maybeNumber(null)).toBe(undefined);
    expect(maybeNumber(undefined)).toBe(undefined);
    expect(maybeNumber(0)).toBe(0);
    expect(maybeNumber(12)).toBe(12);
    expect(maybeNumber(NaN)).toBe(undefined);
    expect(maybeNumber(Number.NaN)).toBe(undefined);
    expect(maybeNumber(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
    expect(maybeNumber(Number.NEGATIVE_INFINITY)).toBe(Number.NEGATIVE_INFINITY);
    expect(maybeNumber(NaN) ?? 87).toBe(87);
  });
});
