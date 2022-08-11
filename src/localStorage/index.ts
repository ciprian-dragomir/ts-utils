import { AnyObject, Maybe } from '../types';

export type LocalStorageError<T extends AnyObject, K extends keyof T> = { error: unknown } & (
  | ({
      key: K;
    } & ({ op: 'set'; value: T[K] } | { op: 'get' | 'remove' }))
  | { op: 'clear' }
);

export type LocalStorageFactoryParams<T extends AnyObject> = {
  storage?: Pick<typeof window.localStorage, 'getItem' | 'setItem' | 'clear' | 'removeItem'>;
  onError?: <K extends keyof T = keyof T>(info: LocalStorageError<T, K>) => void;
  migrations?: Partial<{ [K in keyof T]: () => Maybe<{ value: T[K]; onComplete?: () => void }> }>;
};

const getDefaultParams = <T extends AnyObject>(): Partial<LocalStorageFactoryParams<T>> => ({
  storage: globalThis?.localStorage,
});

export type FindItemResult<K, V> = {
  key: K;
  hasRecord: boolean;
  hasValue: boolean;
  value?: V;
  error?: unknown;
};

export type LocalStorage<T extends AnyObject> = {
  setItem: <K extends keyof T>(
    key: K,
    value: T[K],
    onErrorSpecific?: LocalStorageFactoryParams<T>['onError'],
  ) => boolean;
  getItemOrDefault: <K extends keyof T, P = T[K]>(
    key: K,
    defaultReturn: P,
    onErrorSpecific?: LocalStorageFactoryParams<T>['onError'],
  ) => T[K] | P;
  getItem: <K extends keyof T>(
    key: K,
    onErrorSpecific?: LocalStorageFactoryParams<T>['onError'],
  ) => Maybe<T[K]>;
  removeItem: <K extends keyof T>(
    key: K,
    onErrorSpecific?: LocalStorageFactoryParams<T>['onError'],
  ) => void;
  findItem: <K extends keyof T, P = T[K]>(key: K) => FindItemResult<K, P>;
  clear: () => boolean;
};

export const localStorageFactory = <T extends AnyObject>(
  params?: LocalStorageFactoryParams<T>,
): LocalStorage<T> => {
  const { storage, onError, migrations } = { ...getDefaultParams<T>(), ...params };
  if (!storage) {
    throw Error('A valid "storage" must be specified.');
  }

  const setItem: LocalStorage<T>['setItem'] = (key, value, onErrorSpecific) => {
    const item = { value };
    try {
      storage.setItem(key.toString(), JSON.stringify(item));
      return true;
    } catch (error) {
      (onErrorSpecific || onError)?.({ key, op: 'set', value, error });
    }

    return false;
  };

  const getItemOrDefault: LocalStorage<T>['getItemOrDefault'] = (
    key,
    defaultReturn,
    onErrorSpecific,
  ) => {
    try {
      const k = key.toString();
      const item = storage.getItem(k);
      if (item) {
        return JSON.parse(item).value;
      } else {
        const migration = migrations?.[k]?.();
        if (migration) {
          const { value, onComplete } = migration;
          if (setItem(k, value)) {
            onComplete?.();
          }
          return value;
        }
      }
    } catch (error) {
      (onErrorSpecific || onError)?.({ key, op: 'get', error });
    }

    return defaultReturn;
  };

  const getItem: LocalStorage<T>['getItem'] = (key, onErrorSpecific) =>
    getItemOrDefault(key, undefined, onErrorSpecific);

  const clear = () => {
    try {
      storage.clear();
      return true;
    } catch (error) {
      onError?.({ op: 'clear', error });
    }

    return false;
  };

  const removeItem: LocalStorage<T>['removeItem'] = (key, onErrorSpecific) => {
    try {
      storage.removeItem(key.toString());
    } catch (error) {
      (onErrorSpecific || onError)?.({
        key,
        op: 'remove',
        error,
      });
    }
  };

  const findItem: LocalStorage<T>['findItem'] = key => {
    const result = { key, hasRecord: false, hasValue: false };
    try {
      const k = key.toString();
      const item = storage.getItem(k);
      if (item) {
        const container = JSON.parse(item);
        if (container && typeof container === 'object' && container.hasOwnProperty('value')) {
          return {
            key,
            hasRecord: true,
            hasValue: true,
            value: container.value,
          };
        } else {
          return { ...result, hasValue: false };
        }
      }
    } catch (error) {
      return { ...result, error };
    }

    return result;
  };

  return { setItem, getItem, getItemOrDefault, clear, removeItem, findItem };
};
