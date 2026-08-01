/**
 * Production Integration Layer Telemetry Collector — WP-5.4
 */

import { IntegrationFeatureFlags, IntegrationMetricsSnapshot } from './integration.types';
import { IntegrationPipeline } from './integration.pipeline';

export class IntegrationMetricsCollector {
  private totalExecutions = 0;
  private bypassedExecutions = 0;
  private integratedExecutions = 0;
  private performanceInterceptionCount = 0;
  private reliabilityInterceptionCount = 0;
  private observabilityInterceptionCount = 0;

  /**
   * Record a pipeline execution attempt
   */
  public recordExecution(bypassed: boolean, flags: IntegrationFeatureFlags): void {
    this.totalExecutions++;
    if (bypassed) {
      this.bypassedExecutions++;
    } else {
      this.integratedExecutions++;
      if (flags.performanceIntegrationEnabled) this.performanceInterceptionCount++;
      if (flags.reliabilityIntegrationEnabled) this.reliabilityInterceptionCount++;
      if (flags.observabilityIntegrationEnabled) this.observabilityInterceptionCount++;
    }
  }

  /**
   * Capture a snapshot of integration telemetry
   */
  public getSnapshot(): IntegrationMetricsSnapshot {
    return {
      totalExecutions: this.totalExecutions,
      bypassedExecutions: this.bypassedExecutions,
      integratedExecutions: this.integratedExecutions,
      performanceInterceptionCount: this.performanceInterceptionCount,
      reliabilityInterceptionCount: this.reliabilityInterceptionCount,
      observabilityInterceptionCount: this.observabilityInterceptionCount,
      flagsSnapshot: IntegrationPipeline.getActiveFeatureFlags(),
      timestamp: Date.now()
    };
  }

  /**
   * Reset integration telemetry counters
   */
  public reset(): void {
    this.totalExecutions = 0;
    this.bypassedExecutions = 0;
    this.integratedExecutions = 0;
    this.performanceInterceptionCount = 0;
    this.reliabilityInterceptionCount = 0;
    this.observabilityInterceptionCount = 0;
  }
}
