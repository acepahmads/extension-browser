/**
 * Enterprise Reliability & Fault Tolerance Service Facade — WP-5.2
 */

import { RetryPolicyEngine } from './retry.policy';
import { TimeoutGuard } from './timeout.guard';
import { FailureDetector } from './failure.detector';
import { HealthMonitor } from './health.monitor';
import { RecoveryMetricsCollector } from './recovery.metrics';
import {
  RetryConfig,
  TimeoutLevel,
  ReliabilityReportData,
  ReliabilityRecommendation,
  FailureRecord,
  SystemHealthSnapshot
} from './reliability.types';

export interface ResilientOptions {
  retryConfig?: Partial<RetryConfig>;
  timeoutMs?: number;
  timeoutLevel?: TimeoutLevel;
  isRecoverable?: (err: any) => boolean;
  sourceLabel?: string;
}

export interface ResilientExecutionResult<T = unknown> {
  success: boolean;
  data: T | null;
  error: any;
  attempts: number;
  totalDurationMs: number;
  timedOut: boolean;
  recovered: boolean;
}

export class ReliabilityService {
  private retryEngine = new RetryPolicyEngine();
  private timeoutGuard = new TimeoutGuard();
  private failureDetector = new FailureDetector();
  private healthMonitor = new HealthMonitor();
  private recoveryMetrics = new RecoveryMetricsCollector();

  /**
   * Execute an asynchronous task with full reliability protection (Timeout + Retry + Telemetry)
   */
  public async executeResiliently<T>(
    fn: (attempt: number) => Promise<T>,
    options?: ResilientOptions
  ): Promise<ResilientExecutionResult<T>> {
    const startTime = performance.now();
    const source = options?.sourceLabel || 'resilient_execution';
    const timeoutLevel = options?.timeoutLevel || 'EXECUTION';

    const retryResult = await this.retryEngine.execute<T>(
      async (attempt) => {
        const timeoutRes = await this.timeoutGuard.executeWithTimeout<T>(
          () => fn(attempt),
          options?.timeoutMs,
          timeoutLevel
        );

        if (timeoutRes.timedOut) {
          this.healthMonitor.recordTimeout();
          this.failureDetector.recordFailure('TIMEOUT', source, timeoutRes.error || 'Timeout exceeded');
          throw new Error(timeoutRes.error || 'Task execution timed out');
        }

        return timeoutRes.result as T;
      },
      options?.isRecoverable,
      options?.retryConfig
    );

    const totalDurationMs = Math.max(0, performance.now() - startTime);
    const recovered = retryResult.success && retryResult.attempts > 1;

    if (retryResult.success) {
      this.healthMonitor.recordSuccess();
      if (recovered) {
        this.healthMonitor.recordRecovery();
        this.recoveryMetrics.recordRecoveryAttempt(true, totalDurationMs, 'RETRY');
      }
    } else {
      this.healthMonitor.recordFailure();
      this.failureDetector.recordFailure(
        'HANDLER_FAILURE',
        source,
        retryResult.error?.message || 'Execution failed after retries',
        retryResult.error
      );
      if (retryResult.attempts > 1) {
        this.recoveryMetrics.recordRecoveryAttempt(false, totalDurationMs, 'RETRY');
      }
    }

    return {
      success: retryResult.success,
      data: retryResult.data,
      error: retryResult.error,
      attempts: retryResult.attempts,
      totalDurationMs,
      timedOut: false,
      recovered
    };
  }

  /**
   * Generate actionable optimization & operational recommendations
   */
  public generateRecommendations(
    snapshot: SystemHealthSnapshot,
    recentFailures: FailureRecord[]
  ): ReliabilityRecommendation[] {
    const recommendations: ReliabilityRecommendation[] = [];

    if (snapshot.failureRate > 5) {
      recommendations.push({
        id: 'REC-REL-01',
        category: 'HEALTH',
        severity: 'HIGH',
        component: 'Business Framework Stack',
        observation: `High failure rate detected (${snapshot.failureRate.toFixed(1)}%).`,
        actionableStep: 'Audit handler exception sources and verify domain schema validation patterns.'
      });
    }

    if (snapshot.timeoutCount > 0) {
      recommendations.push({
        id: 'REC-REL-02',
        category: 'TIMEOUT',
        severity: 'MEDIUM',
        component: 'TimeoutGuard',
        observation: `Detected ${snapshot.timeoutCount} timeout breach(es).`,
        actionableStep: 'Increase timeout limits or optimize long-running handler executions.'
      });
    }

    if (snapshot.dlqCount > 0) {
      recommendations.push({
        id: 'REC-REL-03',
        category: 'FAILURE',
        severity: 'HIGH',
        component: 'DeadLetterQueue',
        observation: `Detected ${snapshot.dlqCount} events routed to Dead Letter Queue.`,
        actionableStep: 'Inspect DLQ entries and implement dedicated consumer recovery handlers.'
      });
    }

    if (recentFailures.some((f) => f.severity === 'CRITICAL')) {
      recommendations.push({
        id: 'REC-REL-04',
        category: 'RECOVERY',
        severity: 'HIGH',
        component: 'FailureDetector',
        observation: 'Critical failure frequency threshold breached.',
        actionableStep: 'Trigger automated circuit breaker or fall back to legacy execution mode.'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        id: 'REC-REL-00',
        category: 'HEALTH',
        severity: 'LOW',
        component: 'Reliability Framework',
        observation: 'System operating at optimal reliability standards.',
        actionableStep: 'Maintain current retry policies and continue passive health monitoring.'
      });
    }

    return recommendations;
  }

  /**
   * Compile full Reliability Report Data
   */
  public generateReportData(): ReliabilityReportData {
    const healthSnapshot = this.healthMonitor.getHealthSnapshot();
    const retryStats = this.retryEngine.getStatistics();
    const timeoutStats = this.timeoutGuard.getStatistics();
    const recentFailures = this.failureDetector.getRecentFailures(10);
    const recoveryStats = this.recoveryMetrics.getStatistics();
    const scoreModel = this.healthMonitor.getScoreModel();
    const recommendations = this.generateRecommendations(healthSnapshot, recentFailures);

    return {
      healthSnapshot,
      retryStats,
      timeoutStats,
      recentFailures,
      recoveryStats,
      scoreModel,
      recommendations,
      timestamp: Date.now()
    };
  }

  /**
   * Format GitHub-Flavored Markdown Reliability Report
   */
  public generateMarkdownReport(reportData?: ReliabilityReportData): string {
    const data = reportData || this.generateReportData();
    const { healthSnapshot: h, retryStats: r, timeoutStats: t, recentFailures: f, recoveryStats: rec, scoreModel: s, recommendations } = data;
    const dateStr = new Date(data.timestamp).toISOString();

    let md = `# Reliability & Fault Tolerance Report\n\n`;
    md += `**Timestamp**: \`${dateStr}\`  \n`;
    md += `**System Health Status**: **${h.status.toUpperCase()}**  \n`;
    md += `**Overall Reliability Score**: **${s.overallScore} / 100**  \n\n`;

    md += `---\n\n`;
    md += `## 1. Runtime Health Summary\n\n`;
    md += `| Health Metric | Value | Description |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **System Availability** | \`${h.availabilityPercentage}%\` | Percentage of successful event dispatches |\n`;
    md += `| **Success Rate** | \`${h.successRate}%\` | Successful executions vs total |\n`;
    md += `| **Failure Rate** | \`${h.failureRate}%\` | Execution failure rate |\n`;
    md += `| **Total Successes** | \`${h.totalSuccess}\` | Total successful events |\n`;
    md += `| **Total Failures** | \`${h.totalFailure}\` | Total unhandled failures |\n`;
    md += `| **Recovery Count** | \`${h.recoveryCount}\` | Recovered execution count |\n\n`;

    md += `## 2. Reliability Score Model\n\n`;
    md += `| Score Dimension | Weight | Score (0-100) |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Availability Score** | 40% | \`${s.availabilityScore}\` |\n`;
    md += `| **Success Score** | 30% | \`${s.successScore}\` |\n`;
    md += `| **Timeout Score** | 15% | \`${s.timeoutScore}\` |\n`;
    md += `| **DLQ Protection Score** | 15% | \`${s.dlqScore}\` |\n`;
    md += `| **Composite Overall Score** | **100%** | **\`${s.overallScore}\`** |\n\n`;

    md += `## 3. Retry Policy Statistics\n\n`;
    md += `- **Total Executions**: \`${r.totalExecutions}\`\n`;
    md += `- **Retry Attempts**: \`${r.retryAttempts}\`\n`;
    md += `- **Retry Success Rate**: \`${r.retryAttempts > 0 ? ((r.retrySuccesses / r.retryAttempts) * 100).toFixed(1) : 100}%\` (${r.retrySuccesses} / ${r.retryAttempts})\n`;
    md += `- **Average Retry Delay**: \`${r.avgRetryDelayMs.toFixed(2)} ms\`\n`;
    md += `- **Recoverable vs Fatal**: \`${r.recoverableErrors}\` recoverable / \`${r.fatalErrors}\` fatal\n\n`;

    md += `## 4. Timeout Protection Summary\n\n`;
    md += `- **Guarded Executions**: \`${t.totalGuardedExecutions}\`\n`;
    md += `- **Total Timeout Breaches**: \`${t.timeoutCount}\`\n`;
    md += `- **Timeouts by Level**: Handler (\`${t.timeoutsByLevel.HANDLER}\`), Dispatcher (\`${t.timeoutsByLevel.DISPATCHER}\`), Execution (\`${t.timeoutsByLevel.EXECUTION}\`)\n`;
    md += `- **Max Execution Duration**: \`${t.maxExecutionTimeMs.toFixed(2)} ms\`\n\n`;

    md += `## 5. Recovery Metrics (MTTR)\n\n`;
    md += `- **Mean Time to Recovery (MTTR)**: \`${rec.meanTimeToRecoveryMs.toFixed(2)} ms\`\n`;
    md += `- **Recovery Attempts / Successes**: \`${rec.recoveryAttempts}\` attempts / \`${rec.recoverySuccesses}\` successes\n`;
    md += `- **Timeout Recoveries**: \`${rec.timeoutRecoveries}\`\n`;
    md += `- **DLQ Recoveries**: \`${rec.dlqRecoveries}\`\n\n`;

    md += `## 6. Recent Failure Records\n\n`;
    if (f.length === 0) {
      md += `*No recent failure anomalies recorded.*\n\n`;
    } else {
      md += `| Severity | Category | Source | Message |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      for (const rec of f) {
        md += `| \`${rec.severity}\` | \`${rec.category}\` | \`${rec.source}\` | ${rec.message} |\n`;
      }
      md += `\n`;
    }

    md += `## 7. Actionable Operational Recommendations\n\n`;
    for (const rec of recommendations) {
      const icon = rec.severity === 'HIGH' ? '🔴' : rec.severity === 'MEDIUM' ? '🟡' : '🟢';
      md += `### ${icon} [${rec.severity}] ${rec.id}: ${rec.component}\n`;
      md += `- **Observation**: ${rec.observation}  \n`;
      md += `- **Actionable Step**: ${rec.actionableStep}  \n\n`;
    }

    return md;
  }

  /**
   * Format JSON Reliability Report
   */
  public generateJsonReport(reportData?: ReliabilityReportData): string {
    return JSON.stringify(reportData || this.generateReportData(), null, 2);
  }

  /**
   * Print Console Reliability Summary Table
   */
  public printConsoleSummary(reportData?: ReliabilityReportData): void {
    const data = reportData || this.generateReportData();
    const { healthSnapshot: h, scoreModel: s } = data;
    // eslint-disable-next-line no-console
    console.log(`
================================================================================
🛡️ RELIABILITY & FAULT TOLERANCE REPORT
================================================================================
  Health Status   : ${h.status.toUpperCase()}
  Overall Score   : ${s.overallScore} / 100
  Availability    : ${h.availabilityPercentage}%
  Success Rate    : ${h.successRate}%
  Failure Rate    : ${h.failureRate}%
--------------------------------------------------------------------------------
  Executions      : Total (${h.totalSuccess + h.totalFailure}), Success (${h.totalSuccess}), Failure (${h.totalFailure})
  Retries         : ${h.retryCount}
  Timeouts        : ${h.timeoutCount}
  DLQ Pushes      : ${h.dlqCount}
  Recoveries      : ${h.recoveryCount}
================================================================================
`);
  }

  // Component Getters
  public getRetryPolicyEngine(): RetryPolicyEngine {
    return this.retryEngine;
  }

  public getTimeoutGuard(): TimeoutGuard {
    return this.timeoutGuard;
  }

  public getFailureDetector(): FailureDetector {
    return this.failureDetector;
  }

  public getHealthMonitor(): HealthMonitor {
    return this.healthMonitor;
  }

  public getRecoveryMetricsCollector(): RecoveryMetricsCollector {
    return this.recoveryMetrics;
  }

  /**
   * Reset all reliability counters and metrics
   */
  public resetAll(): void {
    this.retryEngine.resetStatistics();
    this.timeoutGuard.resetStatistics();
    this.failureDetector.clear();
    this.healthMonitor.reset();
    this.recoveryMetrics.reset();
  }
}
