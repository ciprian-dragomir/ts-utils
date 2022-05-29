import localStorageFactory from '../index';
import { AnyObject } from '../../types';

describe('localStorageFactory', () => {
  const mockStorage = (overrides?: AnyObject) => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    clear: jest.fn(),
    ...overrides,
  });

  type T = {
    foo: string;
    bar: number;
    nix: {
      b: boolean;
      u: undefined;
      n: null;
    };
  };

  it('calls storage.setItem on setItem', () => {
    const storage = mockStorage();

    const ls = localStorageFactory<T>({ storage });
    expect(storage.setItem).not.toHaveBeenCalled();

    expect(ls.setItem('foo', 'test')).toBe(true);

    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenLastCalledWith('foo', '{"value":"test"}');

    ls.setItem('bar', 123);
    expect(storage.setItem).toHaveBeenCalledTimes(2);
    expect(storage.setItem).toHaveBeenLastCalledWith('bar', '{"value":123}');

    ls.setItem('nix', { b: false, n: null, u: undefined });
    expect(storage.setItem).toHaveBeenCalledTimes(3);
    expect(storage.setItem).toHaveBeenLastCalledWith('nix', '{"value":{"b":false,"n":null}}');
  });

  it('calls storage.getItem on getItem', () => {
    const storage = mockStorage();

    const ls = localStorageFactory<T>({ storage });
    expect(storage.getItem).not.toHaveBeenCalled();

    ls.getItem('foo');
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenLastCalledWith('foo');
  });

  it('calls storage.getItem on getItemOrDefault', () => {
    const storage = mockStorage();

    const ls = localStorageFactory<T>({ storage });
    expect(storage.getItem).not.toHaveBeenCalled();

    const value = ls.getItemOrDefault('foo', 123);
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenLastCalledWith('foo');
    expect(value).toBe(123);
  });

  it('calls storage.clear on clear', () => {
    const storage = mockStorage();

    const ls = localStorageFactory<T>({ storage });
    expect(storage.clear).not.toHaveBeenCalled();
    ls.clear();
    expect(storage.clear).toHaveBeenCalledTimes(1);
  });

  it('calls onError and returns false if setting an item fails', () => {
    const error = new Error('Test error');
    const storage = mockStorage({
      setItem: () => {
        throw error;
      },
    });
    const onError = jest.fn();

    const ls = localStorageFactory<T>({ storage, onError });
    expect(ls.setItem('foo', 'test')).toBe(false);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith({
      key: 'foo',
      op: 'set',
      value: 'test',
      error,
    });
  });

  it('calls onSpecificError and returns false if setting an item fails', () => {
    const error = new Error('Test error');
    const storage = mockStorage({
      setItem: () => {
        throw error;
      },
    });
    const onError = jest.fn();

    const ls = localStorageFactory<T>({ storage, onError });
    const onSpecificError = jest.fn();
    expect(ls.setItem('foo', 'test', onSpecificError)).toBe(false);
    expect(onError).not.toHaveBeenCalled();
    expect(onSpecificError).toHaveBeenCalledTimes(1);
    expect(onSpecificError).toHaveBeenLastCalledWith({
      key: 'foo',
      op: 'set',
      value: 'test',
      error,
    });
  });

  it('calls onError if getItem fails', () => {
    const error = new Error('Test error');
    const storage = mockStorage({
      getItem: jest.fn(() => {
        throw error;
      }),
    });

    const onError = jest.fn();
    const ls = localStorageFactory<T>({ storage, onError });
    expect(storage.getItem).not.toHaveBeenCalled();

    expect(ls.getItem('foo')).toBeUndefined();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenLastCalledWith('foo');
    expect(onError).toHaveBeenLastCalledWith({
      key: 'foo',
      op: 'get',
      error,
    });
  });

  it('calls migrate if provided and record is not found', () => {
    const storage = mockStorage({
      getItem: () => undefined,
    });
    const onComplete = jest.fn();
    const migrate = jest.fn(() => ({ value: 123, onComplete }));
    const ls = localStorageFactory<T>({
      storage,
      migrations: { bar: migrate },
    });

    expect(migrate).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(ls.getItem('bar')).toBe(123);
    expect(migrate).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenLastCalledWith('bar', JSON.stringify({ value: 123 }));
  });

  it('does not call migrate if value exists', () => {
    const storage = mockStorage({
      getItem: (key: string) =>
        key === 'foo' ? JSON.stringify({ value: 'test foo value' }) : undefined,
    });
    const onComplete = jest.fn();
    const migrate = jest.fn(() => ({ value: 'migrate foo value', onComplete }));
    const ls = localStorageFactory<T>({
      storage,
      migrations: { foo: migrate },
    });

    expect(ls.getItem('foo')).toBe('test foo value');
    expect(migrate).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
