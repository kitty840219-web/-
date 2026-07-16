/**
 * Safe localStorage wrapper that gracefully falls back to memory storage
 * if localStorage is blocked (e.g. in strict iframe environments).
 */

const memoryStorage: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`localStorage.getItem failed for "${key}". Falling back to memory storage.`, e);
      return memoryStorage[key] || null;
    }
  },

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`localStorage.setItem failed for "${key}". Falling back to memory storage.`, e);
      memoryStorage[key] = value;
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`localStorage.removeItem failed for "${key}".`, e);
      delete memoryStorage[key];
    }
  }
};
