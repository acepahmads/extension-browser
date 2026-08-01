/**
 * Runtime Failure Detector & Anomaly Classifier — WP-5.2
 */

import { FailureCategory, FailureRecord, FailureSeverity } from './reliability.types';

export class FailureDetector {
  private failures: FailureRecord[] = [];
  private readonly maxCapacity = 200;

  /**
   * Determine failure severity based on category and recent occurrence frequency
   */
  public calculateSeverity(category: FailureCategory, recentCountInWindow: number): FailureSeverity {
    if (category === 'DLQ_PUSH' || category === 'DISPATCHER_FAILURE') {
      return recentCountInWindow > 3 ? 'CRITICAL' : 'HIGH';
    }

    if (category === 'TIMEOUT' || category === 'RETRY_FAILURE') {
      return recentCountInWindow > 5 ? 'HIGH' : 'MEDIUM';
    }

    // HANDLER_FAILURE or VALIDATION_FAILURE
    if (recentCountInWindow > 10) return 'HIGH';
    if (recentCountInWindow > 3) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Record a runtime failure event
   */
  public recordFailure(
    category: FailureCategory,
    source: string,
    message: string,
    details?: unknown
  ): FailureRecord {
    const now = Date.now();
    const windowMs = 60000; // 1-minute rolling window
    const recentCount = this.failures.filter(
      (f) => f.category === category && f.timestamp >= now - windowMs
    ).length;

    const severity = this.calculateSeverity(category, recentCount);

    const record: FailureRecord = {
      id: `fail_${now}_${Math.random().toString(36).substring(2, 6)}`,
      category,
      severity,
      source,
      message,
      timestamp: now,
      details
    };

    if (this.failures.length >= this.maxCapacity) {
      this.failures.shift(); // Evict oldest
    }
    this.failures.push(record);

    return record;
  }

  /**
   * Get recent failure records
   */
  public getRecentFailures(limit = 20): FailureRecord[] {
    return [...this.failures].reverse().slice(0, limit);
  }

  /**
   * Calculate failure frequency within a time window (default 60 seconds)
   */
  public getFailureFrequency(category?: FailureCategory, windowMs = 60000): number {
    const now = Date.now();
    return this.failures.filter(
      (f) => (!category || f.category === category) && f.timestamp >= now - windowMs
    ).length;
  }

  /**
   * Clear recorded failures
   */
  public clear(): void {
    this.failures = [];
  }
}
