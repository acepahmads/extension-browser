/**
 * System Recovery Metrics & Telemetry Collector — WP-5.2
 */

import { RecoveryStatistics } from './reliability.types';

export class RecoveryMetricsCollector {
  private recoveryAttempts = 0;
  private recoverySuccesses = 0;
  private recoveryFailures = 0;
  private totalRecoveryTimeMs = 0;
  private totalRetryDelayMs = 0;
  private retryCount = 0;
  private timeoutRecoveries = 0;
  private dlqRecoveries = 0;

  /**
   * Record a recovery event attempt and duration
   */
  public recordRecoveryAttempt(
    success: boolean,
    recoveryTimeMs: number,
    type?: 'TIMEOUT' | 'DLQ' | 'RETRY'
  ): void {
    this.recoveryAttempts++;
    if (success) {
      this.recoverySuccesses++;
      this.totalRecoveryTimeMs += Math.max(0, recoveryTimeMs);
      if (type === 'TIMEOUT') this.timeoutRecoveries++;
      if (type === 'DLQ') this.dlqRecoveries++;
    } else {
      this.recoveryFailures++;
    }
  }

  /**
   * Record a retry delay allocation
   */
  public recordRetryDelay(delayMs: number): void {
    this.retryCount++;
    this.totalRetryDelayMs += Math.max(0, delayMs);
  }

  /**
   * Compute recovery statistics including MTTR (Mean Time To Recovery)
   */
  public getStatistics(): RecoveryStatistics {
    const meanTimeToRecoveryMs =
      this.recoverySuccesses > 0
        ? parseFloat((this.totalRecoveryTimeMs / this.recoverySuccesses).toFixed(2))
        : 0;

    const avgRetryDelayMs =
      this.retryCount > 0 ? parseFloat((this.totalRetryDelayMs / this.retryCount).toFixed(2)) : 0;

    return {
      meanTimeToRecoveryMs,
      recoveryAttempts: this.recoveryAttempts,
      recoverySuccesses: this.recoverySuccesses,
      recoveryFailures: this.recoveryFailures,
      avgRetryDelayMs,
      timeoutRecoveries: this.timeoutRecoveries,
      dlqRecoveries: this.dlqRecoveries
    };
  }

  /**
   * Reset recovery metrics
   */
  public reset(): void {
    this.recoveryAttempts = 0;
    this.recoverySuccesses = 0;
    this.recoveryFailures = 0;
    this.totalRecoveryTimeMs = 0;
    this.totalRetryDelayMs = 0;
    this.retryCount = 0;
    this.timeoutRecoveries = 0;
    this.dlqRecoveries = 0;
  }
}
