import { Logger } from '../services/logger';

const MODULE = 'StorageService';

export class StorageService {
  /**
   * Read data from Chrome Storage local
   */
  public static async get<T>(key: string): Promise<T | null> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          const lastError = chrome.runtime?.lastError;
          if (lastError) {
            Logger.error(MODULE, `Error reading key [${key}] from storage`, lastError.message);
            resolve(null);
          } else {
            resolve((result[key] as T) ?? null);
          }
        });
      });
    }

    // LocalStorage fallback for dev preview
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(`sppg_companion_${key}`);
      if (!item) return null;
      try {
        return JSON.parse(item) as T;
      } catch {
        return null;
      }
    }

    return null;
  }

  /**
   * Write data to Chrome Storage local
   */
  public static async set<T>(key: string, value: T): Promise<boolean> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          const lastError = chrome.runtime?.lastError;
          if (lastError) {
            Logger.error(MODULE, `Error writing key [${key}] to storage`, lastError.message);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`sppg_companion_${key}`, JSON.stringify(value));
      return true;
    }

    return false;
  }

  /**
   * Remove item from Chrome Storage local
   */
  public static async remove(key: string): Promise<boolean> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], () => resolve(true));
      });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(`sppg_companion_${key}`);
      return true;
    }

    return false;
  }
}
