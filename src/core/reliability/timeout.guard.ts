/**
 * Timeout Protection & Guard Engine — WP-5.2
 */

import { TimeoutConfig, TimeoutLevel, TimeoutResult, TimeoutStatistics } from './reliability.types';

export class TimeoutGuard {
  public static readonly DEFAULT_TIMEOUTS: Record<TimeoutLevel, number> = {
    HANDLER: 500,
    DISPATCHER: 2000,
    EXECUTION: 5000
  };

  private stats: TimeoutStatistics = {
    totalGuardedExecutions: 0,
    timeoutCount: 0,
    timeoutsByLevel: {
      HANDLER: 0,
      DISPATCHER: 0,
      EXECUTION: 0
    },
    maxExecutionTimeMs: 0,
    timeoutRecoveryCount: 0
  };

  /**
   * Execute an asynchronous task with timeout protection
   */
  public async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs?: number,
    level: TimeoutLevel = 'EXECUTION'
  ): Promise<TimeoutResult<T>> {
    const effectiveTimeoutMs = timeoutMs ?? TimeoutGuard.DEFAULT_TIMEOUTS[level];
    this.stats.totalGuardedExecutions++;

    const startTime = performance.now();
    let timerId: any = null;

    const timeoutPromise = new Promise<TimeoutResult<T>>((resolve) => {
      timerId = setTimeout(() => {
        const durationMs = Math.max(0, performance.now() - startTime);
        resolve({
          timedOut: true,
          result: null,
          durationMs,
          level,
          error: `Execution timed out after ${effectiveTimeoutMs}ms at level [${level}]`
        });
      }, effectiveTimeoutMs);
    });

    const executionPromise = (async (): Promise<TimeoutResult<T>> => {
      try {
        const res = await fn();
        const durationMs = Math.max(0, performance.now() - startTime);
        return {
          timedOut: false,
          result: res,
          durationMs,
          level
        };
      } catch (err: any) {
        throw err;
      }
    })();

    const finalResult = await Promise.race([executionPromise, timeoutPromise]);
    if (timerId) {
      clearTimeout(timerId);
    }

    if (finalResult.durationMs > this.stats.maxExecutionTimeMs) {
      this.stats.maxExecutionTimeMs = finalResult.durationMs;
    }

    if (finalResult.timedOut) {
      this.stats.timeoutCount++;
      this.stats.timeoutsByLevel[level] = (this.stats.timeoutsByLevel[level] || 0) + 1;
    }

    return finalResult;
  }

  /**
   * Record a successful recovery after a timeout event
   */
  public recordTimeoutRecovery(): void {
    this.stats.timeoutRecoveryCount++;
  }

  /**
   * Get accumulated timeout statistics
   */
  public getStatistics(): TimeoutStatistics {
    return {
      ...this.stats,
      timeoutsByLevel: { ...this.stats.timeoutsByLevel }
    };
  }

  /**
   * Reset timeout statistics
   */
  public resetStatistics(): void {
    this.stats = {
      totalGuardedExecutions: 0,
      timeoutCount: 0,
      timeoutsByLevel: {
        HANDLER: 0,
        DISPATCHER: 0,
        EXECUTION: 0
      },
      maxExecutionTimeMs: 0,
      timeoutRecoveryCount: 0
    };
  }
}
