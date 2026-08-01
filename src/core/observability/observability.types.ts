/**
 * Enterprise Observability & Metrics Platform Data Contracts — WP-5.3
 */

export interface UnifiedMetrics {
  eventCount: number;
  eventRate: number;
  eventsPerSecond: number;
  businessHandlerCount: number;
  avgHandlerDurationMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  avgPublishLatencyMs: number;
  dispatcherLatencyMs: number;
  registryLookupTimeMs: number;
  successCount: number;
  failureCount: number;
  retryCount: number;
  timeoutCount: number;
  dlqCount: number;
  recoveryCount: number;
  availabilityPercentage: number;
  healthScore: number;
  reliabilityScore: number;
  performanceScore: number;
}

export interface HandlerSummary {
  handlerId: string;
  targetTopic: string;
  avgDurationMs: number;
  executionCount: number;
}

export interface BusinessDomainMetrics {
  workspaceEventCount: number;
  storageEventCount: number;
  lifecycleEventCount: number;
  avgWorkspaceDurationMs: number;
  avgStorageDurationMs: number;
  avgLifecycleDurationMs: number;
  domainDistributionRatio: {
    workspace: number;
    storage: number;
    lifecycle: number;
  };
  topSlowestHandlers: HandlerSummary[];
  topFastestHandlers: HandlerSummary[];
}

export interface SystemMetrics {
  heapUsageBytes: number;
  memoryDeltaBytes: number;
  queueSize: number;
  dlqSize: number;
  activeSubscribers: number;
  registeredHandlers: number;
}

export type WidgetType = 'METRIC' | 'GAUGE' | 'TABLE' | 'CHART';

export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  value: string | number;
  description?: string;
  metadata?: Record<string, unknown>;
}

export type HealthStatusLevel = 'Healthy' | 'Warning' | 'Critical' | 'Unavailable';

export interface DashboardModel {
  status: HealthStatusLevel;
  healthScore: number;
  performanceScore: number;
  reliabilityScore: number;
  availabilityPercentage: number;
  widgets: DashboardWidget[];
  timestamp: number;
}

export type TrendDirection = 'IMPROVING' | 'STABLE' | 'DEGRADING';

export interface TrendDataPoint {
  timestamp: number;
  throughput: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  failureCount: number;
  retryCount: number;
  dlqCount: number;
  healthScore: number;
}

export interface TrendAnalyticsSnapshot {
  throughputTrend: TrendDirection;
  latencyTrend: TrendDirection;
  failureTrend: TrendDirection;
  reliabilityTrend: TrendDirection;
  healthTrend: TrendDirection;
  history: TrendDataPoint[];
}

export interface OperationalSummary {
  status: HealthStatusLevel;
  overallHealthScore: number;
  performanceScore: number;
  reliabilityScore: number;
  activeIncidents: number;
  keyTakeaway: string;
}

export interface ObservabilityReportData {
  operationalSummary: OperationalSummary;
  unifiedMetrics: UnifiedMetrics;
  businessMetrics: BusinessDomainMetrics;
  systemMetrics: SystemMetrics;
  dashboard: DashboardModel;
  trends: TrendAnalyticsSnapshot;
  engineeringRecommendations: string[];
  timestamp: number;
}
