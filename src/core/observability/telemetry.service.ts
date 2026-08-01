/**
 * In-Memory Time-Series Trend Analytics Engine — WP-5.3
 */

import {
  TrendAnalyticsSnapshot,
  TrendDataPoint,
  TrendDirection
} from './observability.types';

export class TelemetryService {
  private history: TrendDataPoint[] = [];
  private readonly maxCapacity = 100;

  /**
   * Record an in-memory telemetry data point snapshot (No persistent storage)
   */
  public recordSnapshot(point: TrendDataPoint): void {
    if (this.history.length >= this.maxCapacity) {
      this.history.shift(); // Evict oldest in-memory entry
    }
    this.history.push(point);
  }

  /**
   * Helper to calculate trend direction based on sliding window delta
   */
  public static calculateDirection(
    values: number[],
    higherIsBetter = true
  ): TrendDirection {
    if (values.length < 2) return 'STABLE';

    const half = Math.floor(values.length / 2);
    const olderWindow = values.slice(0, half);
    const newerWindow = values.slice(half);

    const avgOlder = olderWindow.reduce((a, b) => a + b, 0) / olderWindow.length;
    const avgNewer = newerWindow.reduce((a, b) => a + b, 0) / newerWindow.length;

    const deltaPercentage = avgOlder !== 0 ? ((avgNewer - avgOlder) / Math.abs(avgOlder)) * 100 : 0;

    if (Math.abs(deltaPercentage) < 3) {
      return 'STABLE'; // Within 3% variance
    }

    if (higherIsBetter) {
      return deltaPercentage > 0 ? 'IMPROVING' : 'DEGRADING';
    } else {
      return deltaPercentage < 0 ? 'IMPROVING' : 'DEGRADING';
    }
  }

  /**
   * Compute comprehensive trend analytics snapshot
   */
  public getTrendSnapshot(): TrendAnalyticsSnapshot {
    if (this.history.length === 0) {
      return {
        throughputTrend: 'STABLE',
        latencyTrend: 'STABLE',
        failureTrend: 'STABLE',
        reliabilityTrend: 'STABLE',
        healthTrend: 'STABLE',
        history: []
      };
    }

    const throughputs = this.history.map((p) => p.throughput);
    const latencies = this.history.map((p) => p.avgLatencyMs);
    const failures = this.history.map((p) => p.failureCount);
    const healthScores = this.history.map((p) => p.healthScore);

    const throughputTrend = TelemetryService.calculateDirection(throughputs, true);
    const latencyTrend = TelemetryService.calculateDirection(latencies, false); // Lower latency is better
    const failureTrend = TelemetryService.calculateDirection(failures, false); // Lower failures is better
    const reliabilityTrend = TelemetryService.calculateDirection(healthScores, true);
    const healthTrend = TelemetryService.calculateDirection(healthScores, true);

    return {
      throughputTrend,
      latencyTrend,
      failureTrend,
      reliabilityTrend,
      healthTrend,
      history: [...this.history]
    };
  }

  /**
   * Clear in-memory trend history
   */
  public clearHistory(): void {
    this.history = [];
  }
}
