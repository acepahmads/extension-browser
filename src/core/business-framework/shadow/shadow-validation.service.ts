/**
 * Shadow Validation & Observability Service - WP-4 Stage 5.5
 */
import { ShadowMetrics, ShadowMetricsSummary, DomainMetrics } from './shadow.metrics';

export type HealthScoreLevel = 'PERFECT' | 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';

export type MigrationReadinessLevel =
  | 'NOT READY'
  | 'VALIDATING'
  | 'READY FOR CUTOVER'
  | 'READY FOR LEGACY REMOVAL';

export interface ShadowDomainStatistics {
  domain: string;
  totalEvents: number;
  matched: number;
  mismatch: number;
  matchRatePercent: number;
  averageLegacyDurationMs: number;
  averageBusinessDurationMs: number;
  executionDifferenceMs: number;
}

export interface ShadowHealthScore {
  scorePercent: number;
  level: HealthScoreLevel;
}

export interface ShadowSummary {
  generatedAt: number;
  totalEvents: number;
  matchedEvents: number;
  mismatchEvents: number;
  overallMatchRatePercent: number;
  averageLegacyDurationMs: number;
  averageBusinessDurationMs: number;
  healthScore: ShadowHealthScore;
  migrationReadiness: MigrationReadinessLevel;
  domains: {
    workspace: ShadowDomainStatistics;
    storage: ShadowDomainStatistics;
    lifecycle: ShadowDomainStatistics;
  };
}

export interface ShadowValidationReport {
  summary: ShadowSummary;
  formattedMarkdown: string;
  formattedJson: string;
}

export class ShadowValidationService {
  /**
   * Evaluate Health Score Level from match percentage
   */
  public static evaluateHealthScore(matchRatePercent: number): ShadowHealthScore {
    let level: HealthScoreLevel = 'CRITICAL';
    if (matchRatePercent >= 100) {
      level = 'PERFECT';
    } else if (matchRatePercent >= 99) {
      level = 'EXCELLENT';
    } else if (matchRatePercent >= 95) {
      level = 'GOOD';
    } else if (matchRatePercent >= 90) {
      level = 'WARNING';
    }

    return {
      scorePercent: Math.round(matchRatePercent * 100) / 100,
      level
    };
  }

  /**
   * Evaluate Migration Readiness Level
   */
  public static evaluateMigrationReadiness(
    summary: ShadowMetricsSummary
  ): MigrationReadinessLevel {
    if (summary.totalEvents === 0) {
      return 'VALIDATING';
    }

    if (summary.successRate < 90 || summary.errorCount > 0 || summary.dlqCount > 0) {
      return 'NOT READY';
    }

    if (summary.successRate >= 100 && summary.errorCount === 0 && summary.dlqCount === 0) {
      return 'READY FOR LEGACY REMOVAL';
    }

    if (summary.successRate >= 99) {
      return 'READY FOR CUTOVER';
    }

    return 'VALIDATING';
  }

  /**
   * Generate comprehensive Shadow Validation Report
   */
  public static generateValidationReport(): ShadowValidationReport {
    const raw = ShadowMetrics.getSummary();
    const healthScore = this.evaluateHealthScore(raw.successRate);
    const migrationReadiness = this.evaluateMigrationReadiness(raw);

    const calcDomainStats = (name: string, dm: DomainMetrics): ShadowDomainStatistics => {
      const matchRate = dm.totalEvents > 0 ? (dm.matched / dm.totalEvents) * 100 : 100;
      return {
        domain: name,
        totalEvents: dm.totalEvents,
        matched: dm.matched,
        mismatch: dm.mismatch,
        matchRatePercent: Math.round(matchRate * 100) / 100,
        averageLegacyDurationMs: raw.averageLegacyDurationMs,
        averageBusinessDurationMs: raw.averageBusinessDurationMs,
        executionDifferenceMs: Math.round((raw.averageBusinessDurationMs - raw.averageLegacyDurationMs) * 100) / 100
      };
    };

    const summary: ShadowSummary = {
      generatedAt: Date.now(),
      totalEvents: raw.totalEvents,
      matchedEvents: raw.matched,
      mismatchEvents: raw.mismatch,
      overallMatchRatePercent: raw.successRate,
      averageLegacyDurationMs: raw.averageLegacyDurationMs,
      averageBusinessDurationMs: raw.averageBusinessDurationMs,
      healthScore,
      migrationReadiness,
      domains: {
        workspace: calcDomainStats('Workspace', raw.domains.workspace),
        storage: calcDomainStats('Storage', raw.domains.storage),
        lifecycle: calcDomainStats('Lifecycle', raw.domains.lifecycle)
      }
    };

    const markdown = this.renderMarkdownReport(summary);
    const json = JSON.stringify(summary, null, 2);

    return {
      summary,
      formattedMarkdown: markdown,
      formattedJson: json
    };
  }

  /**
   * Render Markdown format report
   */
  private static renderMarkdownReport(summary: ShadowSummary): string {
    return `# Shadow Validation Campaign Report

> Generated At: ${new Date(summary.generatedAt).toISOString()}  
> Overall Health Score: **${summary.healthScore.level}** (${summary.healthScore.scorePercent}%)  
> Migration Readiness: **${summary.migrationReadiness}**  

---

## Overall Telemetry Summary

- **Total Events Processed**: ${summary.totalEvents}
- **Matched Parity Events**: ${summary.matchedEvents}
- **Mismatch Events**: ${summary.mismatchEvents}
- **Match Rate**: ${summary.overallMatchRatePercent}%
- **Average Legacy Duration**: ${summary.averageLegacyDurationMs}ms
- **Average Business Duration**: ${summary.averageBusinessDurationMs}ms

---

## Domain Breakdown

### 1. Workspace Domain
- Events: ${summary.domains.workspace.totalEvents} | Matched: ${summary.domains.workspace.matched} | Mismatch: ${summary.domains.workspace.mismatch} | Match Rate: ${summary.domains.workspace.matchRatePercent}%

### 2. Storage Domain
- Events: ${summary.domains.storage.totalEvents} | Matched: ${summary.domains.storage.matched} | Mismatch: ${summary.domains.storage.mismatch} | Match Rate: ${summary.domains.storage.matchRatePercent}%

### 3. Lifecycle Domain
- Events: ${summary.domains.lifecycle.totalEvents} | Matched: ${summary.domains.lifecycle.matched} | Mismatch: ${summary.domains.lifecycle.mismatch} | Match Rate: ${summary.domains.lifecycle.matchRatePercent}%
`;
  }
}
