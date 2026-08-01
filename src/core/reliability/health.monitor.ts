/**
 * Runtime Health Monitor & Reliability Score Engine — WP-5.2
 */

import { HealthStatus, ReliabilityScoreModel, SystemHealthSnapshot } from './reliability.types';

export class HealthMonitor {
  private totalSuccess = 0;
  private totalFailure = 0;
  private retryCount = 0;
  private timeoutCount = 0;
  private dlqCount = 0;
  private recoveryCount = 0;

  public recordSuccess(): void {
    this.totalSuccess++;
  }

  public recordFailure(): void {
    this.totalFailure++;
  }

  public recordRetry(): void {
    this.retryCount++;
  }

  public recordTimeout(): void {
    this.timeoutCount++;
  }

  public recordDlq(): void {
    this.dlqCount++;
  }

  public recordRecovery(): void {
    this.recoveryCount++;
  }

  /**
   * Calculate detailed Reliability Score Model breakdown (0 - 100)
   */
  public getScoreModel(): ReliabilityScoreModel {
    const totalExecutions = this.totalSuccess + this.totalFailure;
    if (totalExecutions === 0) {
      return {
        availabilityScore: 100,
        successScore: 100,
        timeoutScore: 100,
        dlqScore: 100,
        overallScore: 100
      };
    }

    const successRate = (this.totalSuccess / totalExecutions) * 100;
    const availabilityScore = Math.max(0, Math.min(100, successRate));
    const successScore = Math.max(0, Math.min(100, successRate));

    const timeoutRate = (this.timeoutCount / totalExecutions) * 100;
    const timeoutScore = Math.max(0, Math.round(100 - timeoutRate * 5));

    const dlqRate = (this.dlqCount / totalExecutions) * 100;
    const dlqScore = Math.max(0, Math.round(100 - dlqRate * 10));

    // Weighted Overall Score (40% Availability, 30% Success Rate, 15% Timeout, 15% DLQ)
    const overallScore = Math.round(
      availabilityScore * 0.4 + successScore * 0.3 + timeoutScore * 0.15 + dlqScore * 0.15
    );

    return {
      availabilityScore: Math.round(availabilityScore),
      successScore: Math.round(successScore),
      timeoutScore,
      dlqScore,
      overallScore: Math.max(0, Math.min(100, overallScore))
    };
  }

  /**
   * Determine Health Status level based on overall score and critical flags
   */
  public evaluateStatus(overallScore: number): HealthStatus {
    if (this.totalSuccess === 0 && this.totalFailure > 5) {
      return 'Unavailable';
    }
    if (overallScore >= 90) return 'Healthy';
    if (overallScore >= 75) return 'Warning';
    if (overallScore >= 50) return 'Critical';
    return 'Unavailable';
  }

  /**
   * Capture a System Health Snapshot
   */
  public getHealthSnapshot(): SystemHealthSnapshot {
    const totalExecutions = this.totalSuccess + this.totalFailure;
    const successRate = totalExecutions > 0 ? (this.totalSuccess / totalExecutions) * 100 : 100;
    const failureRate = totalExecutions > 0 ? (this.totalFailure / totalExecutions) * 100 : 0;
    const availabilityPercentage = successRate;

    const scoreModel = this.getScoreModel();
    const status = this.evaluateStatus(scoreModel.overallScore);

    return {
      status,
      successRate: parseFloat(successRate.toFixed(2)),
      failureRate: parseFloat(failureRate.toFixed(2)),
      availabilityPercentage: parseFloat(availabilityPercentage.toFixed(2)),
      totalSuccess: this.totalSuccess,
      totalFailure: this.totalFailure,
      retryCount: this.retryCount,
      timeoutCount: this.timeoutCount,
      dlqCount: this.dlqCount,
      recoveryCount: this.recoveryCount,
      timestamp: Date.now()
    };
  }

  /**
   * Reset health monitor counters
   */
  public reset(): void {
    this.totalSuccess = 0;
    this.totalFailure = 0;
    this.retryCount = 0;
    this.timeoutCount = 0;
    this.dlqCount = 0;
    this.recoveryCount = 0;
  }
}
