
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export interface StorageKeys {
  TOKEN: 'token';
  USER_DATA: 'user_data';
  THEME: 'theme';
}

export const STORAGE_KEYS: StorageKeys = {
  TOKEN: 'token',
  USER_DATA: 'user_data',
  THEME: 'theme',
};

export const setStorage = (key: string, value: unknown): void => {
  storage.set(key, JSON.stringify(value));
};

export const getStorage = <T>(key: string): T | null => {
  const value = storage.getString(key);
  if (!value) return null;
  return JSON.parse(value) as T;
};

export const removeStorage = (key: string): void => {
  storage.remove(key);
};

export const clearStorage = (): void => {
  storage.clearAll();
};
