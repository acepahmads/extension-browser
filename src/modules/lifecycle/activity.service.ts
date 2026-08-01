import { ActivityEvent, ActivityFilterOptions } from './activity.types';
import { MAX_EVENT_BUFFER_SIZE } from './activity.constants';
import { Logger } from '../../services/logger';
import { MessageBus } from '../../services/messageBus';
import { MessageType } from '../../types/messages';

const MODULE = 'ActivityService';

export class ActivityService {
  private static eventsBuffer: ActivityEvent[] = [];
  private static sequenceCounter = 0;
  private static currentSessionId: string = ActivityService.generateSessionId();
  private static tabCorrelationMap: Map<number, string> = new Map();
  private static pendingOperationTimes: Map<string, number> = new Map();

  /**
   * Generate Session ID in format SESSION-YYYYMMDD-XXX
   */
  public static generateSessionId(): string {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    return `SESSION-${today}-${rand}`;
  }

  /**
   * Reset session (call on browser startup)
   */
  public static resetSession(): string {
    this.currentSessionId = this.generateSessionId();
    this.sequenceCounter = 0;
    this.tabCorrelationMap.clear();
    this.pendingOperationTimes.clear();
    Logger.info(MODULE, `Started new session: ${this.currentSessionId}`);
    return this.currentSessionId;
  }

  public static getSessionId(): string {
    return this.currentSessionId;
  }

  /**
   * Retrieve or generate Correlation ID for a tab/operation
   */
  public static getCorrelationIdForTab(tabId?: number | null): string {
    if (!tabId) return `CID-${Math.floor(100000 + Math.random() * 900000)}`;
    if (!this.tabCorrelationMap.has(tabId)) {
      this.tabCorrelationMap.set(tabId, `CID-${Math.floor(100000 + Math.random() * 900000)}`);
    }
    return this.tabCorrelationMap.get(tabId)!;
  }

  /**
   * Force creation of a fresh Correlation ID for a new user activity (e.g. Navigation Started)
   */
  public static createCorrelationIdForTab(tabId?: number | null): string {
    const cid = `CID-${Math.floor(100000 + Math.random() * 900000)}`;
    if (tabId) {
      this.tabCorrelationMap.set(tabId, cid);
    }
    return cid;
  }

  /**
   * Timer helpers for Duration calculation
   */
  public static startOperationTimer(key: string): void {
    this.pendingOperationTimes.set(key, Date.now());
  }

  public static endOperationDuration(key: string): number | null {
    const start = this.pendingOperationTimes.get(key);
    if (!start) return null;
    this.pendingOperationTimes.delete(key);
    return Date.now() - start;
  }

  /**
   * [DEPRECATED - WP-4 Stage 7.1] Legacy Activity Event Creator
   * Replaced by Enterprise EventBus and Business Execution Framework.
   * Preserved for backward type compatibility only. Zero side-effects.
   */
  public static createEvent(
    eventData: Partial<ActivityEvent> & Pick<ActivityEvent, 'eventType' | 'title' | 'description'>
  ): ActivityEvent {
    const now = Date.now();
    return {
      id: eventData.id || `evt_deprecated_${now}`,
      sequence: 0,
      sessionId: this.currentSessionId,
      correlationId: eventData.correlationId || 'CID-DEPRECATED',
      timestamp: now,
      source: eventData.source || 'Background',
      severity: eventData.severity || 'INFO',
      status: 'INFO',
      eventType: eventData.eventType,
      workspaceId: eventData.workspaceId ?? null,
      workspaceName: eventData.workspaceName ?? null,
      tabId: eventData.tabId ?? null,
      windowId: eventData.windowId ?? null,
      url: eventData.url || '',
      title: eventData.title,
      description: eventData.description,
      duration: null,
      metadata: {}
    };
  }

  /**
   * Get all recorded events in memory
   */
  public static getAllEvents(): ActivityEvent[] {
    return [...this.eventsBuffer];
  }

  /**
   * Get N recent events (defaults to 10 for Popup UI)
   */
  public static getRecentEvents(limit = 10): ActivityEvent[] {
    return this.eventsBuffer.slice(0, limit);
  }

  /**
   * Clear all recorded events
   */
  public static clearEvents(): void {
    this.eventsBuffer = [];
    Logger.info(MODULE, 'Cleared all recorded activity events');
  }

  /**
   * Filter & Search Events
   */
  public static filterEvents(options: ActivityFilterOptions): ActivityEvent[] {
    let result = [...this.eventsBuffer];

    // 1. Search Query (Title, URL, EventType, Description, WorkspaceName)
    if (options.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.url.toLowerCase().includes(q) ||
          e.eventType.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.workspaceName && e.workspaceName.toLowerCase().includes(q)) ||
          (e.source && e.source.toLowerCase().includes(q)) ||
          (e.sessionId && e.sessionId.toLowerCase().includes(q)) ||
          (e.correlationId && e.correlationId.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (options.category && options.category !== 'all') {
      const startOfToday = new Date().setHours(0, 0, 0, 0);

      switch (options.category) {
        case 'today':
          result = result.filter((e) => e.timestamp >= startOfToday);
          break;
        case 'workspace':
          result = result.filter((e) => e.workspaceId !== null);
          break;
        case 'tab':
          result = result.filter((e) => e.eventType.includes('Tab'));
          break;
        case 'navigation':
          result = result.filter((e) => e.eventType.includes('Navigation') || e.eventType.includes('Page'));
          break;
        case 'window':
          result = result.filter((e) => e.eventType.includes('Window'));
          break;
        case 'storage':
          result = result.filter((e) => e.eventType.includes('Storage') || e.eventType.includes('Settings'));
          break;
        case 'system':
          result = result.filter((e) => e.eventType.includes('Extension') || e.eventType.includes('Browser') || e.eventType.includes('Background'));
          break;
      }
    }

    // 3. Workspace Specific Filter
    if (options.workspaceId) {
      result = result.filter((e) => e.workspaceId === options.workspaceId);
    }

    // 4. Tab Specific Filter
    if (options.tabId) {
      result = result.filter((e) => e.tabId === options.tabId);
    }

    // 5. Source / Severity Filter
    if (options.source) {
      result = result.filter((e) => e.source === options.source);
    }

    if (options.severity) {
      result = result.filter((e) => e.severity === options.severity);
    }

    // 6. Limit
    if (options.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }

    return result;
  }
}
