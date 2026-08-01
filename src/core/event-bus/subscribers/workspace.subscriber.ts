/**
 * Workspace State Observer Subscriber - WP-3 Stage 3
 * Passive state observer maintaining an in-memory workspace cache.
 */
import { EventBus } from '../index';
import { BusEventEnvelope } from '../types/event.types';
import { Subscription } from '../types/subscriber.types';
import { Workspace } from '../../../config/interfaces';

export interface WorkspaceCacheState {
  currentWorkspace: Workspace | null;
  workspaceId: string | null;
  activeUrlPattern: string | null;
  isContentScriptConnected: boolean;
  lastUpdatedTimestamp: number | null;
  workspaceVersion: string | null;
}

export class WorkspaceSubscriber {
  private static subscriptions: Subscription[] = [];

  // In-memory workspace cache state
  private static cache: WorkspaceCacheState = {
    currentWorkspace: null,
    workspaceId: null,
    activeUrlPattern: null,
    isContentScriptConnected: false,
    lastUpdatedTimestamp: null,
    workspaceVersion: null
  };

  /**
   * Register WorkspaceSubscriber for workspace.changed and content.connected
   */
  public static init(): Subscription[] {
    this.clear();

    // 1. Workspace Changed Handler
    const subWorkspaceChanged = EventBus.subscribe('workspace.changed', (evt: BusEventEnvelope) => {
      this.handleWorkspaceChanged(evt);
    });

    // 2. Content Connected Handler
    const subContentConnected = EventBus.subscribe('content.connected', (evt: BusEventEnvelope) => {
      this.handleContentConnected(evt);
    });

    this.subscriptions.push(subWorkspaceChanged, subContentConnected);
    return this.subscriptions;
  }

  /**
   * Handle workspace.changed event payload
   */
  private static handleWorkspaceChanged(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    if (payload && typeof payload === 'object') {
      const workspace: Workspace | null = payload.workspace || (payload.id ? (payload as Workspace) : null);
      const workspaceId = payload.workspaceId || (workspace ? workspace.id : null);
      const activeUrlPattern = payload.activeUrlPattern || payload.pattern || null;
      const version = workspace ? workspace.version : payload.version || null;

      this.cache = {
        ...this.cache,
        currentWorkspace: workspace,
        workspaceId,
        activeUrlPattern,
        workspaceVersion: version,
        lastUpdatedTimestamp: evt.timestamp || Date.now()
      };
    } else {
      this.cache.lastUpdatedTimestamp = evt.timestamp || Date.now();
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[WorkspaceSubscriber][WorkspaceChanged Cache Updated]', this.cache);
    }
  }

  /**
   * Handle content.connected event payload
   */
  private static handleContentConnected(evt: BusEventEnvelope): void {
    const payload = evt.payload as any;
    const pattern = payload?.pattern || payload?.url || this.cache.activeUrlPattern;

    this.cache = {
      ...this.cache,
      isContentScriptConnected: true,
      activeUrlPattern: pattern || null,
      lastUpdatedTimestamp: evt.timestamp || Date.now()
    };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[WorkspaceSubscriber][ContentConnected Cache Updated]', this.cache);
    }
  }

  // --- PUBLIC READ-ONLY API ---

  public static getCurrentWorkspace(): Workspace | null {
    return this.cache.currentWorkspace;
  }

  public static getWorkspaceCache(): Readonly<WorkspaceCacheState> {
    return { ...this.cache };
  }

  public static isContentConnected(): boolean {
    return this.cache.isContentScriptConnected;
  }

  /**
   * Reset in-memory cache and unsubscribe handlers
   */
  public static clear(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.cache = {
      currentWorkspace: null,
      workspaceId: null,
      activeUrlPattern: null,
      isContentScriptConnected: false,
      lastUpdatedTimestamp: null,
      workspaceVersion: null
    };
  }
}
