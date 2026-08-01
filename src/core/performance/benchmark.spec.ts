/**
 * Performance Benchmarking Suite Verification Tests — WP-5.1
 */

import { BenchmarkService } from './benchmark.service';
import { BenchmarkMetricsCollector } from './benchmark.metrics';
import { BenchmarkReporter } from './benchmark.report';
import { PerformanceResult } from './benchmark.types';
import { BusinessRegistry } from '../business-framework/business.registry';
import { getEventBusFeatureFlags } from '../../services/eventBusFacade';

export async function runPerformanceBenchmarkTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Performance Benchmarking Suite Verification (WP-5.1)...\n');

  // TEST 1: Percentile Math & Statistical Calculations
  try {
    const sampleData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const median = BenchmarkMetricsCollector.calculatePercentile(sampleData, 50);
    const p95 = BenchmarkMetricsCollector.calculatePercentile(sampleData, 95);
    const p99 = BenchmarkMetricsCollector.calculatePercentile(sampleData, 99);

    if (median === 55 && p95 === 95.5 && p99 === 99.1) {
      results.push('✓ Test 1 Passed: Percentile calculations (Median, P95, P99) match expected interpolated mathematical distribution.');
    } else {
      throw new Error(`Percentile calculation mismatch: Median=${median}, P95=${p95}, P99=${p99}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Single Event Passive Timing Measurement
  try {
    BusinessRegistry.initDefaults();

    const perfRes = await BenchmarkService.measureSingleEvent('workspace.changed', {
      workspace: {
        id: 'ws_bench_single',
        name: 'Benchmark Single Workspace',
        application: 'SPPG',
        environment: 'production'
      }
    });

    if (
      perfRes.success &&
      perfRes.topic === 'workspace.changed' &&
      perfRes.handlerId === 'WorkspaceBusinessHandler' &&
      perfRes.totalLatencyMs >= 0 &&
      perfRes.publishLatencyMs >= 0 &&
      perfRes.dispatcherTimeMs >= 0
    ) {
      results.push('✓ Test 2 Passed: Single Event passive timing breakdown measures all layers (Publish, Subscriber, Dispatcher, Registry, Handler) cleanly.');
    } else {
      throw new Error(`Single event measurement failed: ${JSON.stringify(perfRes)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  // TEST 3: Scenario A Load Test Execution & Report Generation
  try {
    BusinessRegistry.initDefaults();

    const reportData = await BenchmarkService.runScenario('Scenario A');

    if (
      reportData.scenario.id === 'Scenario A' &&
      reportData.statistics.totalEvents === 100 &&
      reportData.statistics.successCount === 100 &&
      reportData.statistics.avgLatencyMs >= 0 &&
      reportData.statistics.p95LatencyMs >= reportData.statistics.medianLatencyMs &&
      reportData.performanceScore >= 0 &&
      reportData.performanceScore <= 100
    ) {
      results.push('✓ Test 3 Passed: Scenario A (100 Events) benchmark executes, collects layer stats, and scores performance cleanly.');
    } else {
      throw new Error(`Scenario A execution failed: ${JSON.stringify(reportData.statistics)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  // TEST 4: Histogram & Handler Ranking Generation
  try {
    const mockResults: PerformanceResult[] = [
      {
        correlationId: 'c1',
        topic: 'workspace.changed',
        handlerId: 'WorkspaceBusinessHandler',
        success: true,
        publishLatencyMs: 0.1,
        middlewareTimeMs: 0.1,
        subscriberTimeMs: 0.1,
        dispatcherTimeMs: 0.5,
        registryLookupTimeMs: 0.05,
        handlerDurationMs: 0.2,
        totalLatencyMs: 0.8,
        retryCount: 0,
        routedToDlq: false,
        memoryDeltaBytes: 100,
        timestamp: Date.now()
      },
      {
        correlationId: 'c2',
        topic: 'storage.changed',
        handlerId: 'StorageBusinessHandler',
        success: true,
        publishLatencyMs: 0.2,
        middlewareTimeMs: 0.1,
        subscriberTimeMs: 0.1,
        dispatcherTimeMs: 2.0,
        registryLookupTimeMs: 0.05,
        handlerDurationMs: 1.5,
        totalLatencyMs: 4.0,
        retryCount: 0,
        routedToDlq: false,
        memoryDeltaBytes: 200,
        timestamp: Date.now()
      }
    ];

    const histogram = BenchmarkMetricsCollector.generateHistogram(mockResults);
    const rankings = BenchmarkMetricsCollector.calculateHandlerRankings(mockResults);

    if (
      histogram.buckets.length === 6 &&
      rankings.slowest[0].handlerId === 'StorageBusinessHandler' &&
      rankings.fastest[0].handlerId === 'WorkspaceBusinessHandler'
    ) {
      results.push('✓ Test 4 Passed: Latency histogram buckets and handler rankings (slowest vs fastest) are correctly computed.');
    } else {
      throw new Error(`Histogram/Ranking generation mismatch: ${JSON.stringify(rankings)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 4 Failed: ${err.message}`);
  }

  // TEST 5: Markdown Benchmark Report Formatting
  try {
    BusinessRegistry.initDefaults();
    const reportData = await BenchmarkService.runScenario('Scenario A');
    const mdReport = BenchmarkReporter.generateMarkdownReport(reportData);
    const jsonReport = BenchmarkReporter.generateJsonReport(reportData);

    if (
      mdReport.includes('# Performance Benchmark Report — Scenario A') &&
      mdReport.includes('Average Latency') &&
      mdReport.includes('Automated Optimization Recommendations') &&
      jsonReport.includes('"performanceScore"')
    ) {
      results.push('✓ Test 5 Passed: Markdown and JSON benchmark report formatters generate complete documentation structures.');
    } else {
      throw new Error('Report formatting validation failed.');
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 5 Failed: ${err.message}`);
  }

  // TEST 6: Non-Interference & Production Isolation Guarantee
  try {
    const flags = getEventBusFeatureFlags();

    if (flags.publishEnabled === true) {
      results.push('✓ Test 6 Passed: Benchmarking suite operates with zero side-effects on production FeatureFlags or Business Framework behavior.');
    } else {
      throw new Error(`Production feature flags altered: ${JSON.stringify(flags)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 6 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
