/**
 * Activity Event Domain Models for SPPG Companion
 */

export type ActivitySource =
  | 'Browser'
  | 'Background'
  | 'Content Script'
  | 'Popup'
  | 'Workspace Resolver'
  | 'Workspace Registry'
  | 'Storage'
  | 'Diagnostics'
  | 'Logger'
  | 'System';

export type ActivitySeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DEBUG';
export type ActivityEventStatus = ActivitySeverity;

export interface ActivityEvent {
  id: string;
  sequence: number;
  sessionId: string;
  correlationId: string;
  timestamp: number;
  source: ActivitySource;
  severity: ActivitySeverity;
  status: ActivityEventStatus;
  eventType: string;
  workspaceId: string | null;
  workspaceName: string | null;
  tabId: number | null;
  windowId: number | null;
  url: string;
  title: string;
  description: string;
  duration: number | null;
  metadata: Record<string, unknown>;
}

export type ActivityFilterCategory =
  | 'all'
  | 'today'
  | 'workspace'
  | 'tab'
  | 'navigation'
  | 'window'
  | 'storage'
  | 'system';

export interface ActivityFilterOptions {
  searchQuery?: string;
  category?: ActivityFilterCategory;
  workspaceId?: string;
  tabId?: number;
  status?: ActivityEventStatus;
  severity?: ActivitySeverity;
  source?: ActivitySource;
  limit?: number;
}
