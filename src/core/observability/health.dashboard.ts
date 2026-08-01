/**
 * Structured Health Dashboard Model Engine — WP-5.3
 */

import {
  DashboardModel,
  DashboardWidget,
  HealthStatusLevel,
  UnifiedMetrics,
  BusinessDomainMetrics,
  SystemMetrics
} from './observability.types';

export class HealthDashboard {
  /**
   * Determine overall health status level from unified health score
   */
  public static evaluateHealthStatus(healthScore: number, failureCount: number): HealthStatusLevel {
    if (failureCount > 50 || healthScore < 50) return 'Unavailable';
    if (healthScore >= 90) return 'Healthy';
    if (healthScore >= 75) return 'Warning';
    return 'Critical';
  }

  /**
   * Render a complete structured Dashboard Model with interactive widgets
   */
  public static generateDashboardModel(
    unified: UnifiedMetrics,
    business: BusinessDomainMetrics,
    system: SystemMetrics
  ): DashboardModel {
    const status = this.evaluateHealthStatus(unified.healthScore, unified.failureCount);

    const widgets: DashboardWidget[] = [
      {
        id: 'WIDGET-HEALTH-GAUGE',
        title: 'System Health Gauge',
        type: 'GAUGE',
        value: `${unified.healthScore} / 100`,
        description: `Operational status: ${status.toUpperCase()}`,
        metadata: { status, score: unified.healthScore }
      },
      {
        id: 'WIDGET-PERFORMANCE-METRIC',
        title: 'Performance Score & SLA Latency',
        type: 'METRIC',
        value: `${unified.performanceScore} / 100`,
        description: `P95: ${unified.p95LatencyMs.toFixed(2)}ms | P99: ${unified.p99LatencyMs.toFixed(2)}ms`,
        metadata: { p95: unified.p95LatencyMs, p99: unified.p99LatencyMs }
      },
      {
        id: 'WIDGET-RELIABILITY-METRIC',
        title: 'Reliability & Availability',
        type: 'METRIC',
        value: `${unified.availabilityPercentage.toFixed(1)}%`,
        description: `Reliability Score: ${unified.reliabilityScore}/100 | Recoveries: ${unified.recoveryCount}`,
        metadata: { availability: unified.availabilityPercentage, recoveries: unified.recoveryCount }
      },
      {
        id: 'WIDGET-THROUGHPUT-METRIC',
        title: 'Throughput Telemetry',
        type: 'METRIC',
        value: `${unified.eventsPerSecond.toFixed(1)} ops/sec`,
        description: `Total Processed Events: ${unified.eventCount.toLocaleString()}`,
        metadata: { ops: unified.eventsPerSecond, totalEvents: unified.eventCount }
      },
      {
        id: 'WIDGET-DOMAIN-DISTRIBUTION',
        title: 'Business Domain Traffic Ratio',
        type: 'CHART',
        value: `WS: ${(business.domainDistributionRatio.workspace * 100).toFixed(1)}% | ST: ${(business.domainDistributionRatio.storage * 100).toFixed(1)}% | LC: ${(business.domainDistributionRatio.lifecycle * 100).toFixed(1)}%`,
        description: 'Workspace vs Storage vs Lifecycle traffic breakdown',
        metadata: { ratios: business.domainDistributionRatio }
      },
      {
        id: 'WIDGET-SLOWEST-HANDLERS-TABLE',
        title: 'Slowest BusinessHandlers Ranking',
        type: 'TABLE',
        value: `${business.topSlowestHandlers.length} Handlers Tracked`,
        description: 'Top latency consuming domain handlers',
        metadata: { handlers: business.topSlowestHandlers }
      },
      {
        id: 'WIDGET-SYSTEM-RESOURCES-TABLE',
        title: 'System Resources & Queues',
        type: 'TABLE',
        value: `${(system.heapUsageBytes / (1024 * 1024)).toFixed(1)} MB Heap`,
        description: `DLQ Size: ${system.dlqSize} | Active Subs: ${system.activeSubscribers} | Handlers: ${system.registeredHandlers}`,
        metadata: {
          heapMb: (system.heapUsageBytes / (1024 * 1024)).toFixed(2),
          dlqSize: system.dlqSize,
          activeSubscribers: system.activeSubscribers,
          registeredHandlers: system.registeredHandlers
        }
      }
    ];

    return {
      status,
      healthScore: unified.healthScore,
      performanceScore: unified.performanceScore,
      reliabilityScore: unified.reliabilityScore,
      availabilityPercentage: unified.availabilityPercentage,
      widgets,
      timestamp: Date.now()
    };
  }
}
