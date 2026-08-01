/**
 * Automatic Retry Policy Engine — WP-5.2
 */

import { RetryConfig, RetryStatistics, RetryStrategy } from './reliability.types';

export class RetryPolicyEngine {
  private static readonly DEFAULT_CONFIG: RetryConfig = {
    strategy: 'EXPONENTIAL_BACKOFF',
    maxRetries: 3,
    baseDelayMs: 100,
    maxDelayMs: 2000,
    backoffFactor: 2
  };

  private stats: RetryStatistics = {
    totalExecutions: 0,
    successCount: 0,
    failureCount: 0,
    retryAttempts: 0,
    retrySuccesses: 0,
    retryFailures: 0,
    totalRetryDelayMs: 0,
    avgRetryDelayMs: 0,
    recoverableErrors: 0,
    fatalErrors: 0
  };

  /**
   * Calculate backoff delay for a specific attempt number
   */
  public static calculateDelay(attempt: number, config: RetryConfig): number {
    if (attempt <= 1 || config.strategy === 'NONE') {
      return 0;
    }

    if (config.strategy === 'FIXED') {
      return Math.min(config.baseDelayMs, config.maxDelayMs);
    }

    // EXPONENTIAL_BACKOFF
    const exponential = config.baseDelayMs * Math.pow(config.backoffFactor, attempt - 2);
    return Math.min(config.maxDelayMs, exponential);
  }

  /**
   * Execute an asynchronous action with automatic retry policy & backoff
   */
  public async execute<T>(
    fn: (attempt: number) => Promise<T>,
    isRecoverable?: (err: any) => boolean,
    configOverride?: Partial<RetryConfig>
  ): Promise<{
    success: boolean;
    data: T | null;
    error: any;
    attempts: number;
    totalDelayMs: number;
  }> {
    const config: RetryConfig = { ...RetryPolicyEngine.DEFAULT_CONFIG, ...configOverride };
    this.stats.totalExecutions++;

    let attempt = 0;
    let success = false;
    let data: T | null = null;
    let lastError: any = null;
    let totalDelayMs = 0;

    const maxAttempts = config.strategy === 'NONE' ? 1 : config.maxRetries + 1;

    while (attempt < maxAttempts && !success) {
      attempt++;

      if (attempt > 1) {
        const delay = RetryPolicyEngine.calculateDelay(attempt, config);
        totalDelayMs += delay;
        this.stats.retryAttempts++;
        this.stats.totalRetryDelayMs += delay;

        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      try {
        data = await fn(attempt);
        success = true;
      } catch (err: any) {
        lastError = err;
        const recoverable = isRecoverable ? isRecoverable(err) : true;

        if (recoverable) {
          this.stats.recoverableErrors++;
        } else {
          this.stats.fatalErrors++;
          break; // Stop immediately on non-recoverable / fatal errors
        }
      }
    }

    if (success) {
      this.stats.successCount++;
      if (attempt > 1) {
        this.stats.retrySuccesses++;
      }
    } else {
      this.stats.failureCount++;
      if (attempt > 1) {
        this.stats.retryFailures++;
      }
    }

    if (this.stats.retryAttempts > 0) {
      this.stats.avgRetryDelayMs = this.stats.totalRetryDelayMs / this.stats.retryAttempts;
    }

    return {
      success,
      data,
      error: lastError,
      attempts: attempt,
      totalDelayMs
    };
  }

  /**
   * Get accumulated retry statistics
   */
  public getStatistics(): RetryStatistics {
    return { ...this.stats };
  }

  /**
   * Reset retry statistics
   */
  public resetStatistics(): void {
    this.stats = {
      totalExecutions: 0,
      successCount: 0,
      failureCount: 0,
      retryAttempts: 0,
      retrySuccesses: 0,
      retryFailures: 0,
      totalRetryDelayMs: 0,
      avgRetryDelayMs: 0,
      recoverableErrors: 0,
      fatalErrors: 0
    };
  }
}
