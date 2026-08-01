/**
 * Performance Benchmark Report Formatter & Export Engine — WP-5.1
 */

import { BenchmarkReportData } from './benchmark.types';

export class BenchmarkReporter {
  /**
   * Generate a comprehensive GitHub-flavored Markdown performance benchmark report
   */
  public static generateMarkdownReport(data: BenchmarkReportData): string {
    const { scenario, statistics: stats, slowestHandlers, fastestHandlers, histogram, performanceScore, recommendations, timestamp } = data;
    const dateStr = new Date(timestamp).toISOString();

    let md = `# Performance Benchmark Report — ${scenario.name} (${scenario.id})\n\n`;
    md += `**Timestamp**: \`${dateStr}\`  \n`;
    md += `**Total Events**: \`${stats.totalEvents.toLocaleString()}\` | **Batch Size**: \`${scenario.batchSize}\`  \n`;
    md += `**Performance Score**: **${performanceScore} / 100**  \n\n`;

    md += `---\n\n`;
    md += `## 1. Latency Metrics Breakdown\n\n`;
    md += `| Metric | Duration (ms) | Description |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Minimum Latency** | \`${stats.minLatencyMs.toFixed(3)} ms\` | Fastest single event processing |\n`;
    md += `| **Maximum Latency** | \`${stats.maxLatencyMs.toFixed(3)} ms\` | Peak single event processing latency |\n`;
    md += `| **Average Latency** | \`${stats.avgLatencyMs.toFixed(3)} ms\` | Arithmetic mean across all events |\n`;
    md += `| **Median (P50)** | \`${stats.medianLatencyMs.toFixed(3)} ms\` | 50th percentile latency |\n`;
    md += `| **P95 Latency** | \`${stats.p95LatencyMs.toFixed(3)} ms\` | 95th percentile SLA latency |\n`;
    md += `| **P99 Latency** | \`${stats.p99LatencyMs.toFixed(3)} ms\` | 99th percentile SLA latency |\n\n`;

    md += `## 2. Layer-by-Layer Execution Breakdown\n\n`;
    md += `Execution Flow: \`Publish() -> Subscriber -> Dispatcher -> Registry -> Handler -> Completion\`\n\n`;
    md += `| Layer / Phase | Avg Time (ms) | % of Total |\n`;
    md += `| :--- | :--- | :--- |\n`;
    
    const layer = stats.layerBreakdown;
    const totalAvg = Math.max(stats.avgLatencyMs, 0.0001);

    md += `| **EventBus Publish** | \`${layer.publishLatencyMs.toFixed(3)} ms\` | \`${((layer.publishLatencyMs / totalAvg) * 100).toFixed(1)}%\` |\n`;
    md += `| **Middleware Execution** | \`${layer.middlewareTimeMs.toFixed(3)} ms\` | \`${((layer.middlewareTimeMs / totalAvg) * 100).toFixed(1)}%\` |\n`;
    md += `| **BusinessSubscriber Context** | \`${layer.subscriberTimeMs.toFixed(3)} ms\` | \`${((layer.subscriberTimeMs / totalAvg) * 100).toFixed(1)}%\` |\n`;
    md += `| **BusinessDispatcher Processing** | \`${layer.dispatcherTimeMs.toFixed(3)} ms\` | \`${((layer.dispatcherTimeMs / totalAvg) * 100).toFixed(1)}%\` |\n`;
    md += `| **BusinessRegistry Lookup** | \`${layer.registryLookupTimeMs.toFixed(3)} ms\` | \`${((layer.registryLookupTimeMs / totalAvg) * 100).toFixed(1)}%\` |\n`;
    md += `| **BusinessHandler Execution** | \`${layer.handlerDurationMs.toFixed(3)} ms\` | \`${((layer.handlerDurationMs / totalAvg) * 100).toFixed(1)}%\` |\n\n`;

    md += `## 3. Throughput & Memory Metrics\n\n`;
    md += `- **Total Benchmark Duration**: \`${stats.totalDurationMs.toFixed(2)} ms\`\n`;
    md += `- **Events Processed Per Second**: \`${stats.eventsPerSecond.toFixed(2)} ops/sec\`\n`;
    md += `- **Peak Throughput**: \`${stats.peakThroughput.toFixed(2)} ops/sec\`\n`;
    md += `- **Memory Delta**: \`${stats.memoryDeltaMb.toFixed(3)} MB\`\n`;
    md += `- **Retry Overhead Count**: \`${stats.retryOverheadCount}\` retries\n`;
    md += `- **Success Rate**: \`${((stats.successCount / stats.totalEvents) * 100).toFixed(2)}%\` (${stats.successCount} / ${stats.totalEvents})\n\n`;

    md += `## 4. Latency Distribution Histogram\n\n`;
    md += `| Latency Range | Count | Percentage | Visual |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    for (const b of histogram.buckets) {
      const barLength = Math.round(b.percentage / 5);
      const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
      md += `| \`${b.range}\` | \`${b.count}\` | \`${b.percentage.toFixed(1)}%\` | \`${bar}\` |\n`;
    }
    md += `\n`;

    md += `## 5. BusinessHandler Ranking\n\n`;
    md += `### Slowest Handlers\n\n`;
    md += `| Handler ID | Target Topic | Executions | Avg Latency | P95 Latency |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    for (const h of slowestHandlers.slice(0, 5)) {
      md += `| \`${h.handlerId}\` | \`${h.targetTopic}\` | \`${h.count}\` | \`${h.avgDurationMs.toFixed(3)} ms\` | \`${h.p95DurationMs.toFixed(3)} ms\` |\n`;
    }
    md += `\n`;

    md += `### Fastest Handlers\n\n`;
    md += `| Handler ID | Target Topic | Executions | Avg Latency | P95 Latency |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    for (const h of fastestHandlers.slice(0, 5)) {
      md += `| \`${h.handlerId}\` | \`${h.targetTopic}\` | \`${h.count}\` | \`${h.avgDurationMs.toFixed(3)} ms\` | \`${h.p95DurationMs.toFixed(3)} ms\` |\n`;
    }
    md += `\n`;

    md += `## 6. Automated Optimization Recommendations\n\n`;
    for (const rec of recommendations) {
      const icon = rec.severity === 'HIGH' ? '🔴' : rec.severity === 'MEDIUM' ? '🟡' : '🟢';
      md += `### ${icon} [${rec.severity}] ${rec.id}: ${rec.component}\n`;
      md += `- **Category**: \`${rec.category}\`  \n`;
      md += `- **Observation**: ${rec.observation}  \n`;
      md += `- **Recommendation**: ${rec.recommendation}  \n\n`;
    }

    return md;
  }

  /**
   * Export benchmark report as formatted JSON
   */
  public static generateJsonReport(data: BenchmarkReportData): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Print concise summary table to console
   */
  public static printConsoleSummary(data: BenchmarkReportData): void {
    const { scenario, statistics: stats, performanceScore } = data;
    // eslint-disable-next-line no-console
    console.log(`
================================================================================
📊 PERFORMANCE BENCHMARK REPORT: ${scenario.name} (${scenario.id})
================================================================================
  Events Processed : ${stats.totalEvents.toLocaleString()}
  Benchmark Score  : ${performanceScore} / 100
  Total Time       : ${stats.totalDurationMs.toFixed(2)} ms
  Throughput       : ${stats.eventsPerSecond.toFixed(2)} ops/sec (Peak: ${stats.peakThroughput.toFixed(2)})
--------------------------------------------------------------------------------
  Average Latency  : ${stats.avgLatencyMs.toFixed(3)} ms
  Median (P50)     : ${stats.medianLatencyMs.toFixed(3)} ms
  P95 Latency      : ${stats.p95LatencyMs.toFixed(3)} ms
  P99 Latency      : ${stats.p99LatencyMs.toFixed(3)} ms
  Min / Max        : ${stats.minLatencyMs.toFixed(3)} ms / ${stats.maxLatencyMs.toFixed(3)} ms
--------------------------------------------------------------------------------
  Layer Breakdown  :
    - EventBus Publish    : ${stats.layerBreakdown.publishLatencyMs.toFixed(3)} ms
    - Middleware Exec     : ${stats.layerBreakdown.middlewareTimeMs.toFixed(3)} ms
    - Subscriber Context  : ${stats.layerBreakdown.subscriberTimeMs.toFixed(3)} ms
    - Dispatcher Engine   : ${stats.layerBreakdown.dispatcherTimeMs.toFixed(3)} ms
    - Registry Lookup     : ${stats.layerBreakdown.registryLookupTimeMs.toFixed(3)} ms
    - BusinessHandler Exec: ${stats.layerBreakdown.handlerDurationMs.toFixed(3)} ms
================================================================================
`);
  }
}
