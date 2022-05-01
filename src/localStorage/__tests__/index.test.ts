import localStorageFactory from '../index';

describe('localStorageFactory', () => {
  const mockStorage = () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    clear: jest.fn(),
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

    ls.setItem('foo', 'test');

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
});
