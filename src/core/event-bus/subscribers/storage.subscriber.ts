/**
 * Storage State Observer Subscriber - WP-3 Stage 4
 * Passive state observer maintaining an in-memory storage change cache.
 */
import { EventBus } from '../index';
import { BusEventEnvelope } from '../types/event.types';
import { Subscription } from '../types/subscriber.types';

export interface StorageCacheState {
  changedKeys: string[];
  lastChangeTimestamp: number | null;
  lastStorageArea: string | null;
  changedKeyCount: number;
  previousSnapshot: Record<string, unknown> | null;
  currentSnapshot: Record<string, unknown> | null;
}

export class StorageSubscriber {
  private static subscriptions: Subscription[] = [];

  // In-memory storage change cache
  private static cache: StorageCacheState = {
    changedKeys: [],
    lastChangeTimestamp: null,
    lastStorageArea: null,
    changedKeyCount: 0,
    previousSnapshot: null,
    currentSnapshot: null
  };

  /**
   * Register StorageSubscriber for storage.changed topic
   */
  public static init(): Subscription[] {
    this.clear();

    const subStorage = EventBus.subscribe('storage.changed', (evt: BusEventEnvelope) => {
      this.handleStorageChanged(evt);
    });

    this.subscriptions.push(subStorage);
    return this.subscriptions;
  }

  /**
   * Handle storage.changed event payload
   */
  private static handleStorageChanged(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    let keys: string[] = [];
    let area = 'local';
    let prev: Record<string, unknown> | null = this.cache.currentSnapshot;
    let curr: Record<string, unknown> | null = null;

    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.keys)) {
        keys = payload.keys;
      } else if (payload.changes && typeof payload.changes === 'object') {
        keys = Object.keys(payload.changes);
      } else if (payload.key) {
        keys = [payload.key];
      }

      area = payload.areaName || payload.area || 'local';
      curr = payload.snapshot || payload.current || payload.changes || null;
      if (payload.previous || payload.oldValue) {
        prev = payload.previous || payload.oldValue;
      }
    }

    this.cache = {
      changedKeys: [...keys],
      lastChangeTimestamp: evt.timestamp || Date.now(),
      lastStorageArea: area,
      changedKeyCount: keys.length,
      previousSnapshot: prev,
      currentSnapshot: curr
    };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[StorageSubscriber][StorageChanged Cache Updated]', this.cache);
    }
  }

  // --- PUBLIC READ-ONLY API ---

  public static getStorageCache(): Readonly<StorageCacheState> {
    return { ...this.cache };
  }

  public static getLastChangedKeys(): string[] {
    return [...this.cache.changedKeys];
  }

  public static getLastUpdate(): number | null {
    return this.cache.lastChangeTimestamp;
  }

  /**
   * Reset in-memory cache and unsubscribe handlers
   */
  public static clear(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.cache = {
      changedKeys: [],
      lastChangeTimestamp: null,
      lastStorageArea: null,
      changedKeyCount: 0,
      previousSnapshot: null,
      currentSnapshot: null
    };
  }
}
