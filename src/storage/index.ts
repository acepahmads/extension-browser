/**
 * SPPG Storage Adapter Module
 * Supports Chrome Extension Storage (chrome.storage.local) with localStorage fallback
 */

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class ChromeStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve((result[key] as T) ?? null);
        });
      });
    }

    // LocalStorage fallback for dev preview
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(`sppg_${key}`);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    }

    return null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => resolve());
      });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`sppg_${key}`, JSON.stringify(value));
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], () => resolve());
      });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(`sppg_${key}`);
    }
  }

  async clear(): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.clear(() => resolve());
      });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('sppg_'))
        .forEach((k) => localStorage.removeItem(k));
    }
  }
}
