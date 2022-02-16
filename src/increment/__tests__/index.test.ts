import { increment } from '../index';

describe('increment', () => {
  it('starts at 0 by default', () => {
    const { peek } = increment();
    expect(peek()).toBe(0);
  });

  it('respects startAt parameter', () => {
    const { peek } = increment(234);
    expect(peek()).toBe(234);
  });

  it('respects increment parameter', () => {
    const { next } = increment(0.5, 0.3);
    expect(next()).toBe(0.5);
    expect(next()).toBe(0.8);
    expect(next()).toBe(1.1);
  });

  it('peek does not change state', () => {
    const { peek } = increment(-4);
    expect(peek()).toBe(-4);
    expect(peek()).toBe(-4);
  });

  it('increments when next is called', () => {
    const { next } = increment();
    expect(next()).toBe(0);
    expect(next()).toBe(1);
    expect(next()).toBe(2);
  });

  it('reset works with startAt parameter', () => {
    const { next, reset, peek } = increment(-5, -2);
    expect(next()).toBe(-5);
    expect(next()).toBe(-7);

    reset();
    expect(peek()).toBe(-5);
    expect(next()).toBe(-5);
    expect(next()).toBe(-7);
  });
});
