/**
 * Browser Lifecycle Observer Subscriber - WP-3 Stage 5
 * Passive observer maintaining in-memory window, tab, and navigation telemetry.
 */
import { EventBus } from '../index';
import { BusEventEnvelope } from '../types/event.types';
import { Subscription } from '../types/subscriber.types';

export interface LifecycleTabState {
  tabId: number;
  windowId: number;
  url: string;
  title?: string;
  status?: 'loading' | 'complete';
  openedAt: number;
  lastNavigatedAt?: number;
}

export interface LifecycleWindowState {
  windowId: number;
  isFocused: boolean;
  activeTabId: number | null;
  tabCount: number;
}

export interface LifecycleNavigationTimer {
  navigationId: string;
  tabId: number;
  url: string;
  startedAt: number;
}

export interface LifecycleCacheState {
  activeWindowId: number | null;
  activeTabId: number | null;
  windows: Record<number, LifecycleWindowState>;
  tabs: Record<number, LifecycleTabState>;
  pendingNavigations: Record<number, LifecycleNavigationTimer>;
  completedNavigationCount: number;
  averageNavigationDurationMs: number;
}

export class LifecycleSubscriber {
  private static subscriptions: Subscription[] = [];

  // In-memory lifecycle cache
  private static cache: LifecycleCacheState = {
    activeWindowId: null,
    activeTabId: null,
    windows: {},
    tabs: {},
    pendingNavigations: {},
    completedNavigationCount: 0,
    averageNavigationDurationMs: 0
  };

  /**
   * Register LifecycleSubscriber for window, tab, and navigation topics
   */
  public static init(): Subscription[] {
    this.clear();

    // 1. Window Events
    const subWindowCreated = EventBus.subscribe('browser.window.created', (evt) => this.handleWindowCreated(evt));
    const subWindowRemoved = EventBus.subscribe('browser.window.removed', (evt) => this.handleWindowRemoved(evt));
    const subWindowFocus = EventBus.subscribe('browser.window.focus', (evt) => this.handleWindowFocus(evt));

    // 2. Tab Events
    const subTabCreated = EventBus.subscribe('browser.tab.created', (evt) => this.handleTabCreated(evt));
    const subTabUpdated = EventBus.subscribe('browser.tab.updated', (evt) => this.handleTabUpdated(evt));
    const subTabRemoved = EventBus.subscribe('browser.tab.removed', (evt) => this.handleTabRemoved(evt));

    // 3. Navigation Events
    const subNavStarted = EventBus.subscribe('browser.navigation.started', (evt) => this.handleNavStarted(evt));
    const subNavCompleted = EventBus.subscribe('browser.navigation.completed', (evt) => this.handleNavCompleted(evt));

    this.subscriptions.push(
      subWindowCreated, subWindowRemoved, subWindowFocus,
      subTabCreated, subTabUpdated, subTabRemoved,
      subNavStarted, subNavCompleted
    );
    return this.subscriptions;
  }

  // --- HANDLERS ---

  private static handleWindowCreated(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const windowId = payload?.windowId || payload?.id;
    if (windowId) {
      this.cache.windows[windowId] = {
        windowId,
        isFocused: !!payload.focused,
        activeTabId: null,
        tabCount: 0
      };
      if (payload.focused) {
        this.cache.activeWindowId = windowId;
      }
    }
  }

  private static handleWindowRemoved(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const windowId = payload?.windowId || payload?.id;
    if (windowId) {
      delete this.cache.windows[windowId];
      if (this.cache.activeWindowId === windowId) {
        this.cache.activeWindowId = null;
      }
    }
  }

  private static handleWindowFocus(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const windowId = payload?.windowId || payload?.id;
    if (windowId) {
      this.cache.activeWindowId = windowId;
      Object.keys(this.cache.windows).forEach((wId) => {
        const id = Number(wId);
        if (this.cache.windows[id]) {
          this.cache.windows[id].isFocused = id === windowId;
        }
      });
      if (this.cache.windows[windowId]) {
        this.cache.activeTabId = this.cache.windows[windowId].activeTabId;
      }
    }
  }

  private static handleTabCreated(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const tabId = payload?.tabId || payload?.id;
    const windowId = payload?.windowId || 1;

    if (tabId) {
      this.cache.tabs[tabId] = {
        tabId,
        windowId,
        url: payload.url || 'about:blank',
        title: payload.title,
        status: payload.status || 'loading',
        openedAt: evt.timestamp || Date.now()
      };

      if (!this.cache.windows[windowId]) {
        this.cache.windows[windowId] = { windowId, isFocused: true, activeTabId: tabId, tabCount: 1 };
      } else {
        this.cache.windows[windowId].tabCount += 1;
        if (payload.active) {
          this.cache.windows[windowId].activeTabId = tabId;
        }
      }

      if (payload.active) {
        this.cache.activeTabId = tabId;
        this.cache.activeWindowId = windowId;
      }
    }
  }

  private static handleTabUpdated(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const tabId = payload?.tabId || payload?.id;

    if (tabId) {
      const existing = this.cache.tabs[tabId] || {
        tabId,
        windowId: payload.windowId || 1,
        url: 'about:blank',
        openedAt: evt.timestamp || Date.now()
      };

      this.cache.tabs[tabId] = {
        ...existing,
        url: payload.url || payload.changeInfo?.url || existing.url,
        title: payload.title || payload.changeInfo?.title || existing.title,
        status: payload.status || payload.changeInfo?.status || existing.status,
        lastNavigatedAt: evt.timestamp || Date.now()
      };
    }
  }

  private static handleTabRemoved(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const tabId = payload?.tabId || payload?.id;

    if (tabId) {
      const tab = this.cache.tabs[tabId];
      if (tab && this.cache.windows[tab.windowId]) {
        this.cache.windows[tab.windowId].tabCount = Math.max(0, this.cache.windows[tab.windowId].tabCount - 1);
      }
      delete this.cache.tabs[tabId];
      delete this.cache.pendingNavigations[tabId];

      if (this.cache.activeTabId === tabId) {
        this.cache.activeTabId = null;
      }
    }
  }

  private static handleNavStarted(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const tabId = payload?.tabId;

    if (tabId) {
      this.cache.pendingNavigations[tabId] = {
        navigationId: payload.navigationId || `nav_${Date.now()}`,
        tabId,
        url: payload.url || '',
        startedAt: evt.timestamp || Date.now()
      };
    }
  }

  private static handleNavCompleted(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const tabId = payload?.tabId;

    if (tabId && this.cache.pendingNavigations[tabId]) {
      const timer = this.cache.pendingNavigations[tabId];
      const duration = Math.max(0, (evt.timestamp || Date.now()) - timer.startedAt);

      this.cache.completedNavigationCount += 1;

      if (this.cache.completedNavigationCount === 1) {
        this.cache.averageNavigationDurationMs = duration;
      } else {
        // Exponential moving average
        this.cache.averageNavigationDurationMs = parseFloat(
          ((this.cache.averageNavigationDurationMs * 0.9) + (duration * 0.1)).toFixed(2)
        );
      }

      delete this.cache.pendingNavigations[tabId];
    }
  }

  // --- PUBLIC READ-ONLY API ---

  public static getLifecycleCache(): Readonly<LifecycleCacheState> {
    return {
      ...this.cache,
      windows: { ...this.cache.windows },
      tabs: { ...this.cache.tabs },
      pendingNavigations: { ...this.cache.pendingNavigations }
    };
  }

  public static getActiveTab(): LifecycleTabState | null {
    if (this.cache.activeTabId && this.cache.tabs[this.cache.activeTabId]) {
      return { ...this.cache.tabs[this.cache.activeTabId] };
    }
    return null;
  }

  public static getAverageNavigationDuration(): number {
    return this.cache.averageNavigationDurationMs;
  }

  /**
   * Reset in-memory cache and unsubscribe handlers
   */
  public static clear(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.cache = {
      activeWindowId: null,
      activeTabId: null,
      windows: {},
      tabs: {},
      pendingNavigations: {},
      completedNavigationCount: 0,
      averageNavigationDurationMs: 0
    };
  }
}
