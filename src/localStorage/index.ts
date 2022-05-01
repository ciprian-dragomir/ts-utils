import { AnyObject, Maybe } from '../types';

export type LocalStorageError<T extends AnyObject, K extends keyof T> =
  | ({
      key: K;
      error: unknown;
    } & ({ op: 'set'; value: T[K] } | { op: 'get' }))
  | { op: 'clear' };

export type LocalStorageFactoryParams<T extends AnyObject> = {
  storage?: Pick<typeof window.localStorage, 'getItem' | 'setItem' | 'clear'>;
  onError?: <K extends keyof T = keyof T>(info: LocalStorageError<T, K>) => void;
};

const DefaultParams: Partial<LocalStorageFactoryParams<AnyObject>> = {
  storage: globalThis?.localStorage,
};

const localStorageFactory = <T extends AnyObject>(params?: LocalStorageFactoryParams<T>) => {
  const { storage, onError } = { ...DefaultParams, ...params };
  if (!storage) {
    throw Error('A valid "storage" must be specified.');
  }

  const setItem = <K extends keyof T>(key: K, value: T[K]) => {
    const item = { value };
    try {
      storage.setItem(key.toString(), JSON.stringify(item));
    } catch (error) {
      onError?.({ key, op: 'set', value, error });
    }
  };

  const getItemOrDefault = <K extends keyof T, P = T[K]>(key: K, defaultReturn: P): T[K] | P => {
    try {
      const item = storage.getItem(key.toString());
      if (item) {
        return JSON.parse(item).value || defaultReturn;
      }
    } catch (error) {
      onError?.({ key, op: 'get', error });
    }

    return defaultReturn;
  };

  const getItem = <K extends keyof T>(key: K): Maybe<T[K]> => getItemOrDefault(key, undefined);

  const clear = () => {
    try {
      storage.clear();
    } catch (error) {
      onError?.({ op: 'clear' });
    }
  };

  return { setItem, getItem, getItemOrDefault, clear };
};

export default localStorageFactory;
