/**
 * Shadow Metrics Engine - WP-4 Stage 5
 */
import { ShadowComparisonReport, MismatchCategory } from './shadow.comparator';

export interface DomainMetrics {
  totalEvents: number;
  matched: number;
  mismatch: number;
  categories: Record<MismatchCategory, number>;
}

export interface ShadowMetricsSummary {
  totalEvents: number;
  matched: number;
  mismatch: number;
  errorCount: number;
  retryCount: number;
  dlqCount: number;
  averageLegacyDurationMs: number;
  averageBusinessDurationMs: number;
  comparisonDurationMs: number;
  successRate: number;
  domains: {
    workspace: DomainMetrics;
    storage: DomainMetrics;
    lifecycle: DomainMetrics;
  };
}

export class ShadowMetrics {
  private static totalEvents = 0;
  private static matched = 0;
  private static mismatch = 0;
  private static errorCount = 0;
  private static totalLegacyDurationMs = 0;
  private static totalBusinessDurationMs = 0;
  private static totalComparisonDurationMs = 0;

  private static domainMap: Record<string, DomainMetrics> = {
    workspace: { totalEvents: 0, matched: 0, mismatch: 0, categories: this.initCategories() },
    storage: { totalEvents: 0, matched: 0, mismatch: 0, categories: this.initCategories() },
    lifecycle: { totalEvents: 0, matched: 0, mismatch: 0, categories: this.initCategories() }
  };

  private static initCategories(): Record<MismatchCategory, number> {
    return {
      IDENTICAL: 0,
      PAYLOAD_MISMATCH: 0,
      VALIDATION_MISMATCH: 0,
      ERROR_MISMATCH: 0,
      TIMING_ONLY: 0,
      UNSUPPORTED: 0,
      UNKNOWN: 0
    };
  }

  /**
   * Record a comparison report
   */
  public static record(report: ShadowComparisonReport): void {
    this.totalEvents++;
    this.totalLegacyDurationMs += report.legacyDurationMs;
    this.totalBusinessDurationMs += report.businessDurationMs;
    this.totalComparisonDurationMs += report.comparisonDurationMs;

    if (report.category === 'IDENTICAL') {
      this.matched++;
    } else {
      this.mismatch++;
    }

    if (report.category === 'ERROR_MISMATCH' || report.category === 'UNKNOWN') {
      this.errorCount++;
    }

    let domain = 'lifecycle';
    if (report.topic.startsWith('workspace.')) {
      domain = 'workspace';
    } else if (report.topic.startsWith('storage.')) {
      domain = 'storage';
    }

    const dMetrics = this.domainMap[domain] || this.domainMap.lifecycle;
    dMetrics.totalEvents++;
    dMetrics.categories[report.category]++;
    if (report.category === 'IDENTICAL') {
      dMetrics.matched++;
    } else {
      dMetrics.mismatch++;
    }
  }

  /**
   * Get metrics summary snapshot
   */
  public static getSummary(): ShadowMetricsSummary {
    const avgLegacy = this.totalEvents > 0 ? this.totalLegacyDurationMs / this.totalEvents : 0;
    const avgBusiness = this.totalEvents > 0 ? this.totalBusinessDurationMs / this.totalEvents : 0;
    const successRate = this.totalEvents > 0 ? (this.matched / this.totalEvents) * 100 : 100;

    return {
      totalEvents: this.totalEvents,
      matched: this.matched,
      mismatch: this.mismatch,
      errorCount: this.errorCount,
      retryCount: 0,
      dlqCount: 0,
      averageLegacyDurationMs: Math.round(avgLegacy * 100) / 100,
      averageBusinessDurationMs: Math.round(avgBusiness * 100) / 100,
      comparisonDurationMs: this.totalComparisonDurationMs,
      successRate: Math.round(successRate * 100) / 100,
      domains: {
        workspace: { ...this.domainMap.workspace },
        storage: { ...this.domainMap.storage },
        lifecycle: { ...this.domainMap.lifecycle }
      }
    };
  }

  /**
   * Clear all recorded metrics
   */
  public static clear(): void {
    this.totalEvents = 0;
    this.matched = 0;
    this.mismatch = 0;
    this.errorCount = 0;
    this.totalLegacyDurationMs = 0;
    this.totalBusinessDurationMs = 0;
    this.totalComparisonDurationMs = 0;
    this.domainMap = {
      workspace: { totalEvents: 0, matched: 0, mismatch: 0, categories: this.initCategories() },
      storage: { totalEvents: 0, matched: 0, mismatch: 0, categories: this.initCategories() },
      lifecycle: { totalEvents: 0, matched: 0, mismatch: 0, categories: this.initCategories() }
    };
  }
}
