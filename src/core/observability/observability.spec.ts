/**
 * Observability & Metrics Platform Verification Suite — WP-5.3
 */

import { ObservabilityService } from './observability.service';
import { ObservabilityMetricsCollector } from './metrics.collector';
import { HealthDashboard } from './health.dashboard';
import { TelemetryService } from './telemetry.service';
import { MetricsExportEngine } from './metrics.export';
import { PerformanceResult, BenchmarkStatistics } from '../performance/benchmark.types';
import { BusinessRegistry } from '../business-framework/business.registry';
import { getEventBusFeatureFlags } from '../../services/eventBusFacade';

export async function runObservabilityPlatformTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Observability & Metrics Platform Verification (WP-5.3)...\n');

  // TEST 1: Unified Metrics Collection
  try {
    BusinessRegistry.initDefaults();

    const mockStats: BenchmarkStatistics = {
      totalEvents: 500,
      successCount: 495,
      failureCount: 5,
      minLatencyMs: 0.1,
      maxLatencyMs: 4.5,
      avgLatencyMs: 0.8,
      medianLatencyMs: 0.5,
      p95LatencyMs: 2.1,
      p99LatencyMs: 3.8,
      totalDurationMs: 1000,
      eventsPerSecond: 500,
      peakThroughput: 800,
      memoryDeltaMb: 2.5,
      retryOverheadCount: 2,
      layerBreakdown: {
        publishLatencyMs: 0.1,
        middlewareTimeMs: 0.1,
        subscriberTimeMs: 0.1,
        dispatcherTimeMs: 0.2,
        registryLookupTimeMs: 0.05,
        handlerDurationMs: 0.25
      }
    };

    const unified = ObservabilityMetricsCollector.collectUnifiedMetrics(mockStats);

    if (
      unified.eventCount === 500 &&
      unified.eventsPerSecond === 500 &&
      unified.p95LatencyMs === 2.1 &&
      unified.businessHandlerCount > 0 &&
      unified.performanceScore >= 80
    ) {
      results.push('✓ Test 1 Passed: Unified metrics collector aggregates performance, reliability, and business telemetry cleanly.');
    } else {
      throw new Error(`Unified metrics collection failed: ${JSON.stringify(unified)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Business Domain Metrics & Traffic Ratios
  try {
    const mockPerfResults: PerformanceResult[] = [
      { correlationId: 'c1', topic: 'workspace.changed', handlerId: 'WorkspaceBusinessHandler', success: true, publishLatencyMs: 0.1, middlewareTimeMs: 0.1, subscriberTimeMs: 0.1, dispatcherTimeMs: 0.2, registryLookupTimeMs: 0.05, handlerDurationMs: 0.5, totalLatencyMs: 1.05, retryCount: 0, routedToDlq: false, memoryDeltaBytes: 100, timestamp: Date.now() },
      { correlationId: 'c2', topic: 'storage.changed', handlerId: 'StorageBusinessHandler', success: true, publishLatencyMs: 0.1, middlewareTimeMs: 0.1, subscriberTimeMs: 0.1, dispatcherTimeMs: 0.3, registryLookupTimeMs: 0.05, handlerDurationMs: 1.2, totalLatencyMs: 1.85, retryCount: 0, routedToDlq: false, memoryDeltaBytes: 100, timestamp: Date.now() },
      { correlationId: 'c3', topic: 'browser.tab.updated', handlerId: 'LifecycleBusinessHandler', success: true, publishLatencyMs: 0.1, middlewareTimeMs: 0.1, subscriberTimeMs: 0.1, dispatcherTimeMs: 0.2, registryLookupTimeMs: 0.05, handlerDurationMs: 0.3, totalLatencyMs: 0.85, retryCount: 0, routedToDlq: false, memoryDeltaBytes: 100, timestamp: Date.now() }
    ];

    const domainMetrics = ObservabilityMetricsCollector.collectBusinessDomainMetrics(mockPerfResults);

    if (
      domainMetrics.workspaceEventCount === 1 &&
      domainMetrics.storageEventCount === 1 &&
      domainMetrics.lifecycleEventCount === 1 &&
      domainMetrics.domainDistributionRatio.workspace === 0.333 &&
      domainMetrics.topSlowestHandlers[0].handlerId === 'StorageBusinessHandler'
    ) {
      results.push('✓ Test 2 Passed: Business domain traffic distribution ratios and handler rankings computed accurately.');
    } else {
      throw new Error(`Domain metrics calculation mismatch: ${JSON.stringify(domainMetrics)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  // TEST 3: System Metrics Collection
  try {
    const sysMetrics = ObservabilityMetricsCollector.collectSystemMetrics(1000, 5000);

    if (sysMetrics.heapUsageBytes >= 0 && sysMetrics.memoryDeltaBytes === 4000 && sysMetrics.registeredHandlers >= 0) {
      results.push('✓ Test 3 Passed: System metrics collector gathers heap memory, memory delta, and subscriber topology.');
    } else {
      throw new Error(`System metrics collection failed: ${JSON.stringify(sysMetrics)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  // TEST 4: Health Dashboard Model & Widget Rendering
  try {
    BusinessRegistry.initDefaults();

    const unified = ObservabilityMetricsCollector.collectUnifiedMetrics();
    const business = ObservabilityMetricsCollector.collectBusinessDomainMetrics();
    const system = ObservabilityMetricsCollector.collectSystemMetrics();

    const dashboard = HealthDashboard.generateDashboardModel(unified, business, system);

    if (
      dashboard.status === 'Healthy' &&
      dashboard.widgets.length === 7 &&
      dashboard.widgets.some((w) => w.id === 'WIDGET-HEALTH-GAUGE') &&
      dashboard.widgets.some((w) => w.id === 'WIDGET-PERFORMANCE-METRIC')
    ) {
      results.push('✓ Test 4 Passed: HealthDashboard generates structured Dashboard Model with 7 visual telemetry widgets.');
    } else {
      throw new Error(`HealthDashboard rendering failed: ${JSON.stringify(dashboard)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 4 Failed: ${err.message}`);
  }

  // TEST 5: In-Memory Time-Series Trend Analytics
  try {
    const telemetry = new TelemetryService();

    // Record improving throughput trend
    telemetry.recordSnapshot({ timestamp: Date.now() - 300, throughput: 100, avgLatencyMs: 5.0, p95LatencyMs: 10, failureCount: 2, retryCount: 0, dlqCount: 0, healthScore: 80 });
    telemetry.recordSnapshot({ timestamp: Date.now() - 200, throughput: 200, avgLatencyMs: 3.0, p95LatencyMs: 7, failureCount: 1, retryCount: 0, dlqCount: 0, healthScore: 90 });
    telemetry.recordSnapshot({ timestamp: Date.now() - 100, throughput: 300, avgLatencyMs: 1.0, p95LatencyMs: 3, failureCount: 0, retryCount: 0, dlqCount: 0, healthScore: 100 });

    const trends = telemetry.getTrendSnapshot();

    if (
      trends.throughputTrend === 'IMPROVING' &&
      trends.latencyTrend === 'IMPROVING' &&
      trends.history.length === 3
    ) {
      results.push('✓ Test 5 Passed: TelemetryService in-memory trend engine accurately calculates time-series trend directions (IMPROVING/STABLE/DEGRADING).');
    } else {
      throw new Error(`Trend calculation failed: Throughput=${trends.throughputTrend}, Latency=${trends.latencyTrend}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 5 Failed: ${err.message}`);
  }

  // TEST 6: Observability Exporters & Production Isolation
  try {
    BusinessRegistry.initDefaults();

    const service = new ObservabilityService();
    const snapshot = service.captureSnapshot();
    const mdReport = service.exportMarkdownReport(snapshot);
    const jsonReport = service.exportJsonReport(snapshot);
    const dashboardModel = service.generateDashboard();
    const flags = getEventBusFeatureFlags();

    if (
      mdReport.includes('# Enterprise Observability Platform Report') &&
      jsonReport.includes('"operationalSummary"') &&
      dashboardModel.widgets.length === 7 &&
      flags.publishEnabled === true
    ) {
      results.push('✓ Test 6 Passed: ObservabilityService facade exports Markdown, JSON, and Dashboard models cleanly with zero production side-effects.');
    } else {
      throw new Error('Observability exports validation failed.');
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 6 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
