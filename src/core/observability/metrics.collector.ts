/**
 * Enterprise Metrics Aggregator & Telemetry Collector — WP-5.3
 */

import { EventBusCore } from '../event-bus/event-bus.core';
import { BusinessRegistry } from '../business-framework/business.registry';
import { BenchmarkStatistics, PerformanceResult } from '../performance/benchmark.types';
import { BenchmarkMetricsCollector } from '../performance/benchmark.metrics';
import { SystemHealthSnapshot, ReliabilityScoreModel } from '../reliability/reliability.types';
import {
  UnifiedMetrics,
  BusinessDomainMetrics,
  SystemMetrics,
  HandlerSummary
} from './observability.types';

export class ObservabilityMetricsCollector {
  private static getHeapUsedBytes(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Aggregate unified operational metrics from Performance, Reliability, and EventBus frameworks
   */
  public static collectUnifiedMetrics(
    benchmarkStats?: BenchmarkStatistics,
    healthSnapshot?: SystemHealthSnapshot,
    scoreModel?: ReliabilityScoreModel
  ): UnifiedMetrics {
    const stats = benchmarkStats || {
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

    const health = healthSnapshot || {
      status: 'Healthy',
      successRate: 100,
      failureRate: 0,
      availabilityPercentage: 100,
      totalSuccess: 0,
      totalFailure: 0,
      retryCount: 0,
      timeoutCount: 0,
      dlqCount: 0,
      recoveryCount: 0,
      timestamp: Date.now()
    };

    const score = scoreModel || {
      availabilityScore: 100,
      successScore: 100,
      timeoutScore: 100,
      dlqScore: 100,
      overallScore: 100
    };

    const perfScore = BenchmarkMetricsCollector.calculatePerformanceScore(stats);

    return {
      eventCount: stats.totalEvents,
      eventRate: stats.eventsPerSecond,
      eventsPerSecond: stats.eventsPerSecond,
      businessHandlerCount: BusinessRegistry.getHandlerCount(),
      avgHandlerDurationMs: stats.layerBreakdown.handlerDurationMs,
      p95LatencyMs: stats.p95LatencyMs,
      p99LatencyMs: stats.p99LatencyMs,
      avgPublishLatencyMs: stats.layerBreakdown.publishLatencyMs,
      dispatcherLatencyMs: stats.layerBreakdown.dispatcherTimeMs,
      registryLookupTimeMs: stats.layerBreakdown.registryLookupTimeMs,
      successCount: health.totalSuccess || stats.successCount,
      failureCount: health.totalFailure || stats.failureCount,
      retryCount: health.retryCount || stats.retryOverheadCount,
      timeoutCount: health.timeoutCount,
      dlqCount: health.dlqCount,
      recoveryCount: health.recoveryCount,
      availabilityPercentage: health.availabilityPercentage,
      healthScore: score.overallScore,
      reliabilityScore: score.overallScore,
      performanceScore: perfScore
    };
  }

  /**
   * Aggregate Business Domain Metrics across Workspace, Storage, and Lifecycle event traffic
   */
  public static collectBusinessDomainMetrics(results: PerformanceResult[] = []): BusinessDomainMetrics {
    let wsCount = 0;
    let stCount = 0;
    let lcCount = 0;
    let wsTotalTime = 0;
    let stTotalTime = 0;
    let lcTotalTime = 0;

    for (const res of results) {
      if (res.topic.startsWith('workspace.')) {
        wsCount++;
        wsTotalTime += res.handlerDurationMs;
      } else if (res.topic.startsWith('storage.')) {
        stCount++;
        stTotalTime += res.handlerDurationMs;
      } else if (res.topic.startsWith('browser.')) {
        lcCount++;
        lcTotalTime += res.handlerDurationMs;
      }
    }

    const totalDomainEvents = Math.max(1, wsCount + stCount + lcCount);

    const { slowest, fastest } = BenchmarkMetricsCollector.calculateHandlerRankings(results);

    const topSlowestHandlers: HandlerSummary[] = slowest.slice(0, 5).map((h) => ({
      handlerId: h.handlerId,
      targetTopic: h.targetTopic,
      avgDurationMs: h.avgDurationMs,
      executionCount: h.count
    }));

    const topFastestHandlers: HandlerSummary[] = fastest.slice(0, 5).map((h) => ({
      handlerId: h.handlerId,
      targetTopic: h.targetTopic,
      avgDurationMs: h.avgDurationMs,
      executionCount: h.count
    }));

    return {
      workspaceEventCount: wsCount,
      storageEventCount: stCount,
      lifecycleEventCount: lcCount,
      avgWorkspaceDurationMs: wsCount > 0 ? wsTotalTime / wsCount : 0,
      avgStorageDurationMs: stCount > 0 ? stTotalTime / stCount : 0,
      avgLifecycleDurationMs: lcCount > 0 ? lcTotalTime / lcCount : 0,
      domainDistributionRatio: {
        workspace: parseFloat((wsCount / totalDomainEvents).toFixed(3)),
        storage: parseFloat((stCount / totalDomainEvents).toFixed(3)),
        lifecycle: parseFloat((lcCount / totalDomainEvents).toFixed(3))
      },
      topSlowestHandlers,
      topFastestHandlers
    };
  }

  /**
   * Collect System-level metrics (Heap, Queue, Subscribers, Registered Handlers)
   */
  public static collectSystemMetrics(initialMemoryBytes = 0, finalMemoryBytes = 0): SystemMetrics {
    const busCore = EventBusCore.getInstance();
    const currentMemory = this.getHeapUsedBytes();

    return {
      heapUsageBytes: currentMemory,
      memoryDeltaBytes: Math.max(0, finalMemoryBytes - initialMemoryBytes),
      queueSize: 0,
      dlqSize: busCore.getDLQ().getSize(),
      activeSubscribers: busCore.getSubscriptionCount(),
      registeredHandlers: BusinessRegistry.getHandlerCount()
    };
  }
}
