/**
 * Observability Multi-Format Export Engine — WP-5.3
 */

import { ObservabilityReportData, DashboardModel } from './observability.types';

export class MetricsExportEngine {
  /**
   * Format comprehensive GitHub-Flavored Markdown Observability Report
   */
  public static exportMarkdown(data: ObservabilityReportData): string {
    const {
      operationalSummary: op,
      unifiedMetrics: u,
      businessMetrics: b,
      systemMetrics: s,
      dashboard: d,
      trends: t,
      engineeringRecommendations: recs,
      timestamp
    } = data;

    const dateStr = new Date(timestamp).toISOString();

    let md = `# Enterprise Observability Platform Report\n\n`;
    md += `**Timestamp**: \`${dateStr}\`  \n`;
    md += `**System Operational Status**: **${op.status.toUpperCase()}**  \n`;
    md += `**Overall Health Score**: **${op.overallHealthScore} / 100** | **Performance**: **${op.performanceScore}** | **Reliability**: **${op.reliabilityScore}**  \n\n`;

    md += `---\n\n`;
    md += `## 1. Operational Summary\n\n`;
    md += `- **Operational Status**: \`${op.status}\`\n`;
    md += `- **Active Incidents**: \`${op.activeIncidents}\` (Failures: ${u.failureCount}, DLQ: ${u.dlqCount})\n`;
    md += `- **Key Takeaway**: ${op.keyTakeaway}\n\n`;

    md += `## 2. Unified Telemetry Metrics\n\n`;
    md += `| Telemetry Indicator | Value | Description |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Total Event Count** | \`${u.eventCount.toLocaleString()}\` | Total processed events |\n`;
    md += `| **Throughput Rate** | \`${u.eventsPerSecond.toFixed(2)} ops/sec\` | Events processed per second |\n`;
    md += `| **Average Latency** | \`${u.avgHandlerDurationMs.toFixed(3)} ms\` | Mean business handler duration |\n`;
    md += `| **P95 SLA Latency** | \`${u.p95LatencyMs.toFixed(3)} ms\` | 95th percentile execution SLA |\n`;
    md += `| **P99 SLA Latency** | \`${u.p99LatencyMs.toFixed(3)} ms\` | 99th percentile execution SLA |\n`;
    md += `| **Publish Latency** | \`${u.avgPublishLatencyMs.toFixed(3)} ms\` | EventBus publish phase latency |\n`;
    md += `| **Dispatcher Latency** | \`${u.dispatcherLatencyMs.toFixed(3)} ms\` | Dispatcher routing phase latency |\n`;
    md += `| **Registry Lookup Latency** | \`${u.registryLookupTimeMs.toFixed(3)} ms\` | BusinessRegistry lookup latency |\n`;
    md += `| **System Availability** | \`${u.availabilityPercentage.toFixed(2)}%\` | Execution availability ratio |\n\n`;

    md += `## 3. Business Domain Traffic & Handler Rankings\n\n`;
    md += `### Domain Event Distribution\n\n`;
    md += `- **Workspace Events**: \`${b.workspaceEventCount}\` (${(b.domainDistributionRatio.workspace * 100).toFixed(1)}%)\n`;
    md += `- **Storage Events**: \`${b.storageEventCount}\` (${(b.domainDistributionRatio.storage * 100).toFixed(1)}%)\n`;
    md += `- **Lifecycle Events**: \`${b.lifecycleEventCount}\` (${(b.domainDistributionRatio.lifecycle * 100).toFixed(1)}%)\n\n`;

    md += `### Top Slowest Handlers\n\n`;
    if (b.topSlowestHandlers.length === 0) {
      md += `*No slow handler data collected.*\n\n`;
    } else {
      md += `| Handler ID | Target Topic | Executions | Avg Duration |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      for (const h of b.topSlowestHandlers) {
        md += `| \`${h.handlerId}\` | \`${h.targetTopic}\` | \`${h.executionCount}\` | \`${h.avgDurationMs.toFixed(3)} ms\` |\n`;
      }
      md += `\n`;
    }

    md += `## 4. System Resources & Queue Depths\n\n`;
    md += `- **Heap Memory Usage**: \`${(s.heapUsageBytes / (1024 * 1024)).toFixed(2)} MB\`\n`;
    md += `- **Memory Delta**: \`${(s.memoryDeltaBytes / (1024 * 1024)).toFixed(3)} MB\`\n`;
    md += `- **Dead Letter Queue (DLQ) Size**: \`${s.dlqSize}\` envelopes\n`;
    md += `- **Active EventBus Subscribers**: \`${s.activeSubscribers}\`\n`;
    md += `- **Registered Business Handlers**: \`${s.registeredHandlers}\`\n\n`;

    md += `## 5. Time-Series Trend Direction Analytics\n\n`;
    md += `| Metric Trend | Direction | Evaluation |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Throughput Trend** | \`${t.throughputTrend}\` | Event processing velocity |\n`;
    md += `| **Latency Trend** | \`${t.latencyTrend}\` | Handler execution latency |\n`;
    md += `| **Failure Rate Trend** | \`${t.failureTrend}\` | Exception & DLQ rate |\n`;
    md += `| **Reliability Trend** | \`${t.reliabilityTrend}\` | Availability & MTTR |\n`;
    md += `| **Overall Health Trend** | \`${t.healthTrend}\` | Composite system health |\n\n`;

    md += `## 6. Health Dashboard Widgets\n\n`;
    md += `| Widget ID | Title | Type | Current Value |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    for (const w of d.widgets) {
      md += `| \`${w.id}\` | ${w.title} | \`${w.type}\` | \`${w.value}\` |\n`;
    }
    md += `\n`;

    md += `## 7. Actionable Engineering Recommendations\n\n`;
    for (let i = 0; i < recs.length; i++) {
      md += `${i + 1}. ${recs[i]}\n`;
    }
    md += `\n`;

    return md;
  }

  /**
   * Export JSON telemetry payload
   */
  public static exportJson(data: ObservabilityReportData): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Export Dashboard Model object
   */
  public static exportDashboardModel(data: ObservabilityReportData): DashboardModel {
    return data.dashboard;
  }

  /**
   * Print Console Observability Summary
   */
  public static exportConsoleSummary(data: ObservabilityReportData): void {
    const { operationalSummary: op, unifiedMetrics: u, systemMetrics: s } = data;
    // eslint-disable-next-line no-console
    console.log(`
================================================================================
👁️ ENTERPRISE OBSERVABILITY PLATFORM SUMMARY
================================================================================
  Operational Status : ${op.status.toUpperCase()}
  Health Score       : ${op.overallHealthScore} / 100
  Performance Score  : ${op.performanceScore} / 100
  Reliability Score  : ${op.reliabilityScore} / 100
--------------------------------------------------------------------------------
  Events Processed   : ${u.eventCount.toLocaleString()} (${u.eventsPerSecond.toFixed(2)} ops/sec)
  P95 / P99 Latency  : ${u.p95LatencyMs.toFixed(3)} ms / ${u.p99LatencyMs.toFixed(3)} ms
  Availability       : ${u.availabilityPercentage.toFixed(2)}%
  Heap Memory Usage  : ${(s.heapUsageBytes / (1024 * 1024)).toFixed(2)} MB
  DLQ Envelopes      : ${s.dlqSize}
================================================================================
`);
  }
}
