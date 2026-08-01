/**
 * Enterprise Performance Metrics Collector & Analytics Engine — WP-5.1
 */

import {
  PerformanceResult,
  BenchmarkStatistics,
  HandlerRanking,
  ExecutionHistogram,
  HistogramBucket,
  OptimizationRecommendation,
  LayerBreakdown
} from './benchmark.types';

export class BenchmarkMetricsCollector {
  /**
   * Calculate percentile value from a sorted array of numbers using linear interpolation
   */
  public static calculatePercentile(sorted: number[], percentile: number): number {
    if (sorted.length === 0) return 0;
    if (sorted.length === 1) return sorted[0];

    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  /**
   * Compute complete benchmark statistics from raw performance results
   */
  public static calculateStatistics(
    results: PerformanceResult[],
    totalDurationMs: number,
    initialMemoryBytes: number,
    finalMemoryBytes: number
  ): BenchmarkStatistics {
    const totalEvents = results.length;
    if (totalEvents === 0) {
      return {
        totalEvents: 0,
        successCount: 0,
        failureCount: 0,
        minLatencyMs: 0,
        maxLatencyMs: 0,
        avgLatencyMs: 0,
        medianLatencyMs: 0,
        p95LatencyMs: 0,
        p99LatencyMs: 0,
        totalDurationMs: 0,
        eventsPerSecond: 0,
        peakThroughput: 0,
        memoryDeltaMb: 0,
        retryOverheadCount: 0,
        layerBreakdown: {
          publishLatencyMs: 0,
          middlewareTimeMs: 0,
          subscriberTimeMs: 0,
          dispatcherTimeMs: 0,
          registryLookupTimeMs: 0,
          handlerDurationMs: 0
        }
      };
    }

    let successCount = 0;
    let failureCount = 0;
    let retryOverheadCount = 0;

    const latencies: number[] = [];
    const publishTimes: number[] = [];
    const middlewareTimes: number[] = [];
    const subscriberTimes: number[] = [];
    const dispatcherTimes: number[] = [];
    const registryTimes: number[] = [];
    const handlerTimes: number[] = [];

    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      if (res.success) {
        successCount++;
      } else {
        failureCount++;
      }
      retryOverheadCount += res.retryCount;

      latencies.push(res.totalLatencyMs);
      publishTimes.push(res.publishLatencyMs);
      middlewareTimes.push(res.middlewareTimeMs);
      subscriberTimes.push(res.subscriberTimeMs);
      dispatcherTimes.push(res.dispatcherTimeMs);
      registryTimes.push(res.registryLookupTimeMs);
      handlerTimes.push(res.handlerDurationMs);
    }

    latencies.sort((a, b) => a - b);

    const minLatencyMs = latencies[0];
    const maxLatencyMs = latencies[latencies.length - 1];
    const sumLatency = latencies.reduce((acc, val) => acc + val, 0);
    const avgLatencyMs = sumLatency / totalEvents;
    const medianLatencyMs = this.calculatePercentile(latencies, 50);
    const p95LatencyMs = this.calculatePercentile(latencies, 95);
    const p99LatencyMs = this.calculatePercentile(latencies, 99);

    const safeDurationSec = Math.max(totalDurationMs / 1000, 0.001);
    const eventsPerSecond = totalEvents / safeDurationSec;

    // Peak throughput estimation over 100ms windows
    const peakThroughput = this.calculatePeakThroughput(results, eventsPerSecond);

    const memoryDeltaMb = (finalMemoryBytes - initialMemoryBytes) / (1024 * 1024);

    const layerBreakdown: LayerBreakdown = {
      publishLatencyMs: publishTimes.reduce((a, b) => a + b, 0) / totalEvents,
      middlewareTimeMs: middlewareTimes.reduce((a, b) => a + b, 0) / totalEvents,
      subscriberTimeMs: subscriberTimes.reduce((a, b) => a + b, 0) / totalEvents,
      dispatcherTimeMs: dispatcherTimes.reduce((a, b) => a + b, 0) / totalEvents,
      registryLookupTimeMs: registryTimes.reduce((a, b) => a + b, 0) / totalEvents,
      handlerDurationMs: handlerTimes.reduce((a, b) => a + b, 0) / totalEvents
    };

    return {
      totalEvents,
      successCount,
      failureCount,
      minLatencyMs,
      maxLatencyMs,
      avgLatencyMs,
      medianLatencyMs,
      p95LatencyMs,
      p99LatencyMs,
      totalDurationMs,
      eventsPerSecond,
      peakThroughput,
      memoryDeltaMb,
      retryOverheadCount,
      layerBreakdown
    };
  }

  /**
   * Estimate peak throughput over rolling windows
   */
  private static calculatePeakThroughput(results: PerformanceResult[], defaultEps: number): number {
    if (results.length < 10) return defaultEps;

    const windowSizeMs = 100;
    const timestamps = results.map((r) => r.timestamp);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    if (maxTime - minTime < windowSizeMs) return defaultEps;

    let maxWindowCount = 0;
    for (let windowStart = minTime; windowStart <= maxTime; windowStart += 50) {
      const windowEnd = windowStart + windowSizeMs;
      let count = 0;
      for (let i = 0; i < timestamps.length; i++) {
        if (timestamps[i] >= windowStart && timestamps[i] < windowEnd) {
          count++;
        }
      }
      if (count > maxWindowCount) {
        maxWindowCount = count;
      }
    }

    const windowEps = (maxWindowCount / windowSizeMs) * 1000;
    return Math.max(windowEps, defaultEps);
  }

  /**
   * Rank BusinessHandlers by execution duration
   */
  public static calculateHandlerRankings(results: PerformanceResult[]): {
    slowest: HandlerRanking[];
    fastest: HandlerRanking[];
  } {
    const handlerMap = new Map<
      string,
      {
        handlerId: string;
        targetTopic: string;
        durations: number[];
      }
    >();

    for (const res of results) {
      const key = res.handlerId || `handler_${res.topic}`;
      const existing = handlerMap.get(key) || {
        handlerId: key,
        targetTopic: res.topic,
        durations: []
      };
      existing.durations.push(res.handlerDurationMs);
      handlerMap.set(key, existing);
    }

    const rankings: HandlerRanking[] = [];

    handlerMap.forEach((val) => {
      val.durations.sort((a, b) => a - b);
      const count = val.durations.length;
      const totalDurationMs = val.durations.reduce((a, b) => a + b, 0);
      const avgDurationMs = totalDurationMs / count;
      const minDurationMs = val.durations[0];
      const maxDurationMs = val.durations[count - 1];
      const p95DurationMs = this.calculatePercentile(val.durations, 95);

      rankings.push({
        handlerId: val.handlerId,
        targetTopic: val.targetTopic,
        count,
        totalDurationMs,
        avgDurationMs,
        minDurationMs,
        maxDurationMs,
        p95DurationMs
      });
    });

    const slowest = [...rankings].sort((a, b) => b.avgDurationMs - a.avgDurationMs);
    const fastest = [...rankings].sort((a, b) => a.avgDurationMs - b.avgDurationMs);

    return { slowest, fastest };
  }

  /**
   * Generate execution latency histogram
   */
  public static generateHistogram(results: PerformanceResult[]): ExecutionHistogram {
    const bucketDefs = [
      { range: '< 0.5 ms', minMs: 0, maxMs: 0.5 },
      { range: '0.5 - 1.0 ms', minMs: 0.5, maxMs: 1.0 },
      { range: '1.0 - 5.0 ms', minMs: 1.0, maxMs: 5.0 },
      { range: '5.0 - 10.0 ms', minMs: 5.0, maxMs: 10.0 },
      { range: '10.0 - 50.0 ms', minMs: 10.0, maxMs: 50.0 },
      { range: '> 50.0 ms', minMs: 50.0, maxMs: Infinity }
    ];

    const total = results.length;
    const buckets: HistogramBucket[] = bucketDefs.map((def) => {
      const count = results.filter(
        (r) => r.totalLatencyMs >= def.minMs && r.totalLatencyMs < def.maxMs
      ).length;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        range: def.range,
        minMs: def.minMs,
        maxMs: def.maxMs,
        count,
        percentage
      };
    });

    return { buckets };
  }

  /**
   * Calculate overall performance score (0 - 100) based on SLA latencies and success rate
   */
  public static calculatePerformanceScore(stats: BenchmarkStatistics): number {
    if (stats.totalEvents === 0) return 100;

    let score = 100;

    // Penalty for failure rate
    const failureRate = stats.failureCount / stats.totalEvents;
    score -= failureRate * 50;

    // Penalty for P95 latency (> 5ms starts deducting)
    if (stats.p95LatencyMs > 5) {
      score -= Math.min(30, (stats.p95LatencyMs - 5) * 2);
    }

    // Penalty for P99 latency (> 20ms starts deducting)
    if (stats.p99LatencyMs > 20) {
      score -= Math.min(20, (stats.p99LatencyMs - 20) * 1);
    }

    // Penalty for retries
    if (stats.retryOverheadCount > 0) {
      const retryRate = stats.retryOverheadCount / stats.totalEvents;
      score -= Math.min(15, retryRate * 30);
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Formulate actionable optimization recommendations based on empirical benchmark metrics
   */
  public static generateOptimizationRecommendations(
    stats: BenchmarkStatistics,
    handlerRankings: HandlerRanking[]
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // 1. Layer Bottleneck Recommendations
    const breakdown = stats.layerBreakdown;
    if (breakdown.handlerDurationMs > breakdown.dispatcherTimeMs * 2 && breakdown.handlerDurationMs > 2) {
      recommendations.push({
        id: 'REC-OPT-01',
        category: 'HANDLER',
        severity: 'MEDIUM',
        component: 'BusinessHandlers',
        observation: `BusinessHandler execution consumes ${breakdown.handlerDurationMs.toFixed(2)}ms (${((breakdown.handlerDurationMs / Math.max(stats.avgLatencyMs, 0.001)) * 100).toFixed(1)}% of end-to-end latency).`,
        recommendation: 'Optimize BusinessHandler execution loops and delegate payload parsing/validation to background workers or memoize domain validation computations.'
      });
    }

    if (breakdown.publishLatencyMs > 1.0) {
      recommendations.push({
        id: 'REC-OPT-02',
        category: 'LATENCY',
        severity: 'HIGH',
        component: 'EventBusCore',
        observation: `EventBus publish latency averages ${breakdown.publishLatencyMs.toFixed(2)}ms under load.`,
        recommendation: 'Pre-allocate EventBus envelopes and batch subscriber notifications using microtask scheduling to reduce publish overhead.'
      });
    }

    // 2. Slowest Handler Identification
    if (handlerRankings.length > 0) {
      const slowest = handlerRankings[0];
      if (slowest.avgDurationMs > 3.0) {
        recommendations.push({
          id: 'REC-OPT-03',
          category: 'HANDLER',
          severity: 'HIGH',
          component: slowest.handlerId,
          observation: `Slowest handler [${slowest.handlerId}] on topic [${slowest.targetTopic}] averages ${slowest.avgDurationMs.toFixed(2)}ms (P95: ${slowest.p95DurationMs.toFixed(2)}ms).`,
          recommendation: `Refactor [${slowest.handlerId}] to optimize JSON serialization and array operations.`
        });
      }
    }

    // 3. Throughput & Batching Recommendation
    if (stats.eventsPerSecond < 1000 && stats.totalEvents >= 1000) {
      recommendations.push({
        id: 'REC-OPT-04',
        category: 'THROUGHPUT',
        severity: 'MEDIUM',
        component: 'BusinessDispatcher',
        observation: `Throughput capped at ${stats.eventsPerSecond.toFixed(0)} events/sec under bulk scenarios.`,
        recommendation: 'Implement batched dispatch in BusinessDispatcher to group concurrent events into single tick executions.'
      });
    }

    // 4. Retry Overhead Recommendation
    if (stats.retryOverheadCount > 0) {
      recommendations.push({
        id: 'REC-OPT-05',
        category: 'RETRY',
        severity: 'HIGH',
        component: 'BusinessDispatcher',
        observation: `Detected ${stats.retryOverheadCount} retry attempt(s) during benchmark execution.`,
        recommendation: 'Audit transient error sources and increase initial exponential backoff delay to prevent retry stampedes.'
      });
    }

    // 5. Memory Allocation Recommendation
    if (stats.memoryDeltaMb > 50) {
      recommendations.push({
        id: 'REC-OPT-06',
        category: 'MEMORY',
        severity: 'MEDIUM',
        component: 'EventBus / BusinessFramework',
        observation: `Benchmark run consumed ${stats.memoryDeltaMb.toFixed(2)} MB heap growth.`,
        recommendation: 'Implement object pooling for BusEventEnvelope and BusinessExecutionContext instances to minimize garbage collection cycles.'
      });
    }

    // Default recommendation if system is performing exceptionally well
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'REC-OPT-00',
        category: 'LATENCY',
        severity: 'LOW',
        component: 'Business Framework Stack',
        observation: 'All latency, throughput, and memory metrics operate well within optimal SLAs.',
        recommendation: 'Maintain current production architecture and continue monitoring telemetry.'
      });
    }

    return recommendations;
  }
}
