import { AnyObject, Maybe } from '../types';

export type LocalStorageError<T extends AnyObject, K extends keyof T> =
  { error: unknown } &
  (({
      key: K;
    } & ({ op: 'set'; value: T[K] } | { op: 'get' }))
  | { op: 'clear' });

export type LocalStorageFactoryParams<T extends AnyObject> = {
  storage?: Pick<typeof window.localStorage, 'getItem' | 'setItem' | 'clear'>;
  onError?: <K extends keyof T = keyof T>(info: LocalStorageError<T, K>) => void;
  migrations?: Partial<{ [K in keyof T]: () => Maybe<{ value: T[K]; onComplete?: () => void }> }>;
};

const getDefaultParams = <T extends AnyObject>(): Partial<LocalStorageFactoryParams<T>> => ({
  storage: globalThis?.localStorage,
});

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
  clear: () => boolean;
};

export const localStorageFactory = <T extends AnyObject>(params?: LocalStorageFactoryParams<T>) => {
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
        return JSON.parse(item).value || defaultReturn;
      } else {
        const migration = migrations?.[k]?.();
        if (migration) {
          const { value, onComplete } = migration;
          if (setItem(k, migration.value)) {
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

  return { setItem, getItem, getItemOrDefault, clear };
};
