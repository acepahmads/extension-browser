/**
 * Observability Operational Report Generator — WP-5.3
 */

import {
  ObservabilityReportData,
  OperationalSummary,
  UnifiedMetrics,
  BusinessDomainMetrics,
  SystemMetrics,
  DashboardModel,
  TrendAnalyticsSnapshot
} from './observability.types';

export class ObservabilityReportGenerator {
  /**
   * Formulate Operational Summary & Key Takeaways
   */
  public static generateOperationalSummary(
    unified: UnifiedMetrics,
    dashboard: DashboardModel
  ): OperationalSummary {
    let keyTakeaway = 'System is operating within optimal operational, latency, and throughput SLAs.';
    if (dashboard.status === 'Warning') {
      keyTakeaway = 'System performance or failure rates show minor variance. Monitor telemetry trends.';
    } else if (dashboard.status === 'Critical' || dashboard.status === 'Unavailable') {
      keyTakeaway = 'Critical latency, failure rate, or DLQ push threshold breached. Immediate operational review required.';
    }

    return {
      status: dashboard.status,
      overallHealthScore: unified.healthScore,
      performanceScore: unified.performanceScore,
      reliabilityScore: unified.reliabilityScore,
      activeIncidents: unified.failureCount + unified.dlqCount,
      keyTakeaway
    };
  }

  /**
   * Formulate actionable engineering recommendations based on unified telemetry
   */
  public static generateEngineeringRecommendations(
    unified: UnifiedMetrics,
    business: BusinessDomainMetrics,
    system: SystemMetrics
  ): string[] {
    const recommendations: string[] = [];

    if (unified.p95LatencyMs > 5.0) {
      recommendations.push(
        `High P95 latency detected (${unified.p95LatencyMs.toFixed(2)}ms). Pre-allocate EventBus envelopes and memoize domain handler validations.`
      );
    }

    if (business.topSlowestHandlers.length > 0 && business.topSlowestHandlers[0].avgDurationMs > 2.0) {
      const slowest = business.topSlowestHandlers[0];
      recommendations.push(
        `Optimize slowest handler [${slowest.handlerId}] on topic [${slowest.targetTopic}] (Avg: ${slowest.avgDurationMs.toFixed(2)}ms).`
      );
    }

    if (system.dlqSize > 0) {
      recommendations.push(
        `Dead Letter Queue contains ${system.dlqSize} unhandled envelopes. Deploy a dedicated DLQ replay/recovery consumer.`
      );
    }

    if (unified.retryCount > 0) {
      recommendations.push(
        `Detected ${unified.retryCount} retry attempts. Audit transient error dependencies to eliminate backoff delays.`
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Maintain current production architecture and passive observability monitoring.');
    }

    return recommendations;
  }

  /**
   * Assemble complete Observability Report Data payload
   */
  public static assembleReportData(
    unified: UnifiedMetrics,
    business: BusinessDomainMetrics,
    system: SystemMetrics,
    dashboard: DashboardModel,
    trends: TrendAnalyticsSnapshot
  ): ObservabilityReportData {
    const operationalSummary = this.generateOperationalSummary(unified, dashboard);
    const engineeringRecommendations = this.generateEngineeringRecommendations(
      unified,
      business,
      system
    );

    return {
      operationalSummary,
      unifiedMetrics: unified,
      businessMetrics: business,
      systemMetrics: system,
      dashboard,
      trends,
      engineeringRecommendations,
      timestamp: Date.now()
    };
  }
}
