/**
 * Enterprise Performance Benchmarking Service & Execution Engine — WP-5.1
 */

import { EventBusCore } from '../event-bus/event-bus.core';
import { BusinessRegistry } from '../business-framework/business.registry';
import { BusinessDispatcher } from '../business-framework/business.dispatcher';
import { BusinessExecutionContext } from '../business-framework/business.context';
import { WorkspaceBusinessHandler } from '../business-framework/handlers/workspace.business-handler';
import { StorageBusinessHandler } from '../business-framework/handlers/storage.business-handler';
import { LifecycleBusinessHandler } from '../business-framework/handlers/lifecycle.business-handler';
import {
  BenchmarkScenario,
  ScenarioIdentifier,
  PerformanceResult,
  BenchmarkReportData,
  PerformanceSnapshot
} from './benchmark.types';
import { BenchmarkMetricsCollector } from './benchmark.metrics';
import { BenchmarkReporter } from './benchmark.report';

export class BenchmarkService {
  /**
   * Pre-defined Standard Load Test Scenarios (A, B, C, D)
   */
  public static readonly STANDARD_SCENARIOS: Record<ScenarioIdentifier, BenchmarkScenario> = {
    'Scenario A': {
      id: 'Scenario A',
      name: 'Scenario A (100 Events)',
      totalEvents: 100,
      batchSize: 10,
      topics: ['workspace.changed', 'storage.changed', 'browser.tab.updated'],
      description: 'Baseline low-concurrency operational traffic benchmark'
    },
    'Scenario B': {
      id: 'Scenario B',
      name: 'Scenario B (1,000 Events)',
      totalEvents: 1000,
      batchSize: 50,
      topics: ['workspace.updated', 'storage.updated', 'browser.navigation.completed'],
      description: 'Standard enterprise workload benchmark'
    },
    'Scenario C': {
      id: 'Scenario C',
      name: 'Scenario C (10,000 Events)',
      totalEvents: 10000,
      batchSize: 200,
      topics: ['workspace.created', 'storage.created', 'browser.window.created'],
      description: 'High-density peak load stress benchmark'
    },
    'Scenario D': {
      id: 'Scenario D',
      name: 'Scenario D (100,000 Events)',
      totalEvents: 100000,
      batchSize: 1000,
      topics: ['workspace.changed', 'storage.changed', 'browser.tab.updated', 'storage.removed'],
      description: 'Maximum throughput sustained saturation benchmark'
    }
  };

  /**
   * Safe cross-environment heap memory usage getter
   */
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
   * Capture a system performance snapshot
   */
  public static captureSnapshot(): PerformanceSnapshot {
    return {
      timestamp: Date.now(),
      heapUsedBytes: this.getHeapUsedBytes(),
      queueDepth: EventBusCore.getInstance().getDLQ().getSize(),
      activeSubscriptions: EventBusCore.getInstance().getSubscriptionCount()
    };
  }

  /**
   * Execute a single event passive timing measurement through the layer pipeline
   */
  public static async measureSingleEvent<T = any>(
    topic: string,
    payload: T
  ): Promise<PerformanceResult> {
    const t0 = performance.now();
    const correlationId = `bench_tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const startMemory = this.getHeapUsedBytes();

    // 1. Measure EventBus Publish & Validation / Middleware phase
    const busCore = EventBusCore.getInstance();
    const t1_start = performance.now();
    const validationResult = busCore.getValidator().validate({
      id: correlationId,
      version: '1.0',
      sequence: 1,
      sessionId: 'bench_session',
      correlationId,
      timestamp: Date.now(),
      topic,
      source: 'System' as any,
      severity: 'INFO' as any,
      payload
    });
    const t1_end = performance.now();
    const publishLatencyMs = Math.max(0, t1_end - t0);
    const middlewareTimeMs = Math.max(0, t1_end - t1_start);

    // 2. Measure Subscriber Context construction overhead
    const t2_start = performance.now();
    const context: BusinessExecutionContext<T> = {
      correlationId,
      topic,
      timestamp: Date.now(),
      payload,
      attempt: 1
    };
    const t2_end = performance.now();
    const subscriberTimeMs = Math.max(0, t2_end - t2_start);

    // 3. Measure Registry Lookup latency
    const t3_start = performance.now();
    const handlers = BusinessRegistry.getHandlers(topic);
    const t3_end = performance.now();
    const registryLookupTimeMs = Math.max(0, t3_end - t3_start);

    // 4. Measure BusinessDispatcher & Handler Execution
    const t4_start = performance.now();
    const dispatchResults = await BusinessDispatcher.dispatch(context);
    const t4_end = performance.now();

    const totalLatencyMs = Math.max(0, t4_end - t0);
    const dispatcherTimeMs = Math.max(0, t4_end - t4_start);

    // Calculate handler specific duration and status
    let handlerDurationMs = 0;
    let success = false;
    let retryCount = 0;
    let routedToDlq = false;
    let handlerId = 'unknown_handler';

    if (dispatchResults.length > 0) {
      const res = dispatchResults[0];
      success = res.success;
      handlerDurationMs = res.executionTimeMs || 0;
      if (handlers.length > 0) {
        handlerId = handlers[0].handlerId;
      }
    } else if (handlers.length === 0) {
      // Topic matched no handler
      success = true;
      handlerDurationMs = 0;
    }

    const endMemory = this.getHeapUsedBytes();
    const memoryDeltaBytes = Math.max(0, endMemory - startMemory);

    return {
      correlationId,
      topic,
      handlerId,
      success,
      publishLatencyMs,
      middlewareTimeMs,
      subscriberTimeMs,
      dispatcherTimeMs,
      registryLookupTimeMs,
      handlerDurationMs,
      totalLatencyMs,
      retryCount,
      routedToDlq,
      memoryDeltaBytes,
      timestamp: Date.now()
    };
  }

  /**
   * Helper to generate synthetic payload for target domain topic
   */
  private static generateSyntheticPayload(topic: string, index: number): any {
    if (topic.startsWith('workspace.')) {
      return {
        workspace: {
          id: `ws_bench_${index}`,
          name: `Workspace Benchmark ${index}`,
          description: 'Synthetic load payload',
          application: 'SPPG',
          environment: 'production',
          baseUrl: 'https://example.com',
          matchPatterns: [{ id: `p_${index}`, pattern: '*', enabled: true, priority: 1 }],
          enabled: true,
          icon: 'box',
          color: '#3b82f6',
          tags: ['bench', 'test'],
          version: '1.0',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      };
    }

    if (topic.startsWith('storage.')) {
      return {
        keys: [`key_${index % 10}`, `config_${index % 5}`],
        areaName: 'local'
      };
    }

    if (topic.startsWith('browser.')) {
      return {
        tabId: 100 + (index % 50),
        windowId: 1 + (index % 5),
        url: `https://example.com/page/${index}`,
        startTime: Date.now() - 500,
        endTime: Date.now()
      };
    }

    return { id: `event_${index}`, data: 'synthetic_payload' };
  }

  /**
   * Execute a specified benchmark scenario
   */
  public static async runScenario(
    scenarioInput: ScenarioIdentifier | BenchmarkScenario
  ): Promise<BenchmarkReportData> {
    const scenario: BenchmarkScenario =
      typeof scenarioInput === 'string'
        ? this.STANDARD_SCENARIOS[scenarioInput] || this.STANDARD_SCENARIOS['Scenario A']
        : scenarioInput;

    // Ensure production handlers are initialized in registry
    BusinessRegistry.initDefaults();

    const initialMemory = this.getHeapUsedBytes();
    const benchmarkStart = performance.now();

    const results: PerformanceResult[] = [];
    const totalEvents = scenario.totalEvents;
    const batchSize = scenario.batchSize;
    const topics = scenario.topics;

    for (let i = 0; i < totalEvents; i += batchSize) {
      const currentBatch = Math.min(batchSize, totalEvents - i);
      const batchPromises: Promise<PerformanceResult>[] = [];

      for (let j = 0; j < currentBatch; j++) {
        const eventIndex = i + j;
        const topic = topics[eventIndex % topics.length];
        const payload = this.generateSyntheticPayload(topic, eventIndex);

        batchPromises.push(this.measureSingleEvent(topic, payload));
      }

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const benchmarkEnd = performance.now();
    const totalDurationMs = Math.max(0.001, benchmarkEnd - benchmarkStart);
    const finalMemory = this.getHeapUsedBytes();

    // Compute metrics
    const stats = BenchmarkMetricsCollector.calculateStatistics(
      results,
      totalDurationMs,
      initialMemory,
      finalMemory
    );

    const { slowest, fastest } = BenchmarkMetricsCollector.calculateHandlerRankings(results);
    const histogram = BenchmarkMetricsCollector.generateHistogram(results);
    const performanceScore = BenchmarkMetricsCollector.calculatePerformanceScore(stats);
    const recommendations = BenchmarkMetricsCollector.generateOptimizationRecommendations(
      stats,
      slowest
    );

    const reportData: BenchmarkReportData = {
      scenario,
      statistics: stats,
      slowestHandlers: slowest,
      fastestHandlers: fastest,
      histogram,
      performanceScore,
      recommendations,
      timestamp: Date.now()
    };

    return reportData;
  }

  /**
   * Execute all standard load test scenarios (A, B, C, D)
   */
  public static async runAllScenarios(): Promise<Map<ScenarioIdentifier, BenchmarkReportData>> {
    const reportMap = new Map<ScenarioIdentifier, BenchmarkReportData>();
    const keys: ScenarioIdentifier[] = ['Scenario A', 'Scenario B', 'Scenario C', 'Scenario D'];

    for (const key of keys) {
      const report = await this.runScenario(key);
      reportMap.set(key, report);
    }

    return reportMap;
  }
}
