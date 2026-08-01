/**
 * Enterprise Observability & Metrics Platform Service Facade — WP-5.3
 */

import { BenchmarkStatistics, PerformanceResult } from '../performance/benchmark.types';
import { SystemHealthSnapshot, ReliabilityScoreModel } from '../reliability/reliability.types';
import { ObservabilityMetricsCollector } from './metrics.collector';
import { HealthDashboard } from './health.dashboard';
import { TelemetryService } from './telemetry.service';
import { ObservabilityReportGenerator } from './metrics.report';
import { MetricsExportEngine } from './metrics.export';
import { DashboardModel, ObservabilityReportData, TrendDataPoint } from './observability.types';

export class ObservabilityService {
  private telemetryService = new TelemetryService();

  /**
   * Capture a unified observability snapshot aggregating telemetry across all framework layers
   */
  public captureSnapshot(
    benchmarkStats?: BenchmarkStatistics,
    healthSnapshot?: SystemHealthSnapshot,
    scoreModel?: ReliabilityScoreModel,
    perfResults: PerformanceResult[] = [],
    initialMemoryBytes = 0,
    finalMemoryBytes = 0
  ): ObservabilityReportData {
    const unifiedMetrics = ObservabilityMetricsCollector.collectUnifiedMetrics(
      benchmarkStats,
      healthSnapshot,
      scoreModel
    );

    const businessMetrics = ObservabilityMetricsCollector.collectBusinessDomainMetrics(perfResults);
    const systemMetrics = ObservabilityMetricsCollector.collectSystemMetrics(
      initialMemoryBytes,
      finalMemoryBytes
    );

    const dashboard = HealthDashboard.generateDashboardModel(
      unifiedMetrics,
      businessMetrics,
      systemMetrics
    );

    // Record time-series point to in-memory telemetry service
    const trendPoint: TrendDataPoint = {
      timestamp: Date.now(),
      throughput: unifiedMetrics.eventsPerSecond,
      avgLatencyMs: unifiedMetrics.avgHandlerDurationMs,
      p95LatencyMs: unifiedMetrics.p95LatencyMs,
      failureCount: unifiedMetrics.failureCount,
      retryCount: unifiedMetrics.retryCount,
      dlqCount: unifiedMetrics.dlqCount,
      healthScore: unifiedMetrics.healthScore
    };
    this.telemetryService.recordSnapshot(trendPoint);

    const trends = this.telemetryService.getTrendSnapshot();

    return ObservabilityReportGenerator.assembleReportData(
      unifiedMetrics,
      businessMetrics,
      systemMetrics,
      dashboard,
      trends
    );
  }

  /**
   * Generate structured Dashboard Model
   */
  public generateDashboard(
    benchmarkStats?: BenchmarkStatistics,
    healthSnapshot?: SystemHealthSnapshot,
    scoreModel?: ReliabilityScoreModel,
    perfResults: PerformanceResult[] = []
  ): DashboardModel {
    const unified = ObservabilityMetricsCollector.collectUnifiedMetrics(
      benchmarkStats,
      healthSnapshot,
      scoreModel
    );
    const business = ObservabilityMetricsCollector.collectBusinessDomainMetrics(perfResults);
    const system = ObservabilityMetricsCollector.collectSystemMetrics();

    return HealthDashboard.generateDashboardModel(unified, business, system);
  }

  /**
   * Format & Export Markdown report
   */
  public exportMarkdownReport(reportData?: ObservabilityReportData): string {
    const data = reportData || this.captureSnapshot();
    return MetricsExportEngine.exportMarkdown(data);
  }

  /**
   * Format & Export JSON report
   */
  public exportJsonReport(reportData?: ObservabilityReportData): string {
    const data = reportData || this.captureSnapshot();
    return MetricsExportEngine.exportJson(data);
  }

  /**
   * Output console summary table
   */
  public printConsoleSummary(reportData?: ObservabilityReportData): void {
    const data = reportData || this.captureSnapshot();
    MetricsExportEngine.exportConsoleSummary(data);
  }

  /**
   * Get in-memory TelemetryService instance
   */
  public getTelemetryService(): TelemetryService {
    return this.telemetryService;
  }
}
