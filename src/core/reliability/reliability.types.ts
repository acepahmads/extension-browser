/**
 * Enterprise Reliability & Fault Tolerance Data Contracts — WP-5.2
 */

export type RetryStrategy = 'NONE' | 'FIXED' | 'EXPONENTIAL_BACKOFF';

export interface RetryConfig {
  strategy: RetryStrategy;
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

export interface RetryStatistics {
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  retryAttempts: number;
  retrySuccesses: number;
  retryFailures: number;
  totalRetryDelayMs: number;
  avgRetryDelayMs: number;
  recoverableErrors: number;
  fatalErrors: number;
}

export type TimeoutLevel = 'HANDLER' | 'DISPATCHER' | 'EXECUTION';

export interface TimeoutConfig {
  level: TimeoutLevel;
  timeoutMs: number;
}

export interface TimeoutResult<T = unknown> {
  timedOut: boolean;
  result?: T | null;
  durationMs: number;
  level: TimeoutLevel;
  error?: string;
}

export interface TimeoutStatistics {
  totalGuardedExecutions: number;
  timeoutCount: number;
  timeoutsByLevel: Record<TimeoutLevel, number>;
  maxExecutionTimeMs: number;
  timeoutRecoveryCount: number;
}

export type FailureCategory =
  | 'HANDLER_FAILURE'
  | 'DISPATCHER_FAILURE'
  | 'TIMEOUT'
  | 'DLQ_PUSH'
  | 'RETRY_FAILURE'
  | 'VALIDATION_FAILURE';

export type FailureSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FailureRecord {
  id: string;
  category: FailureCategory;
  severity: FailureSeverity;
  source: string;
  message: string;
  timestamp: number;
  details?: unknown;
}

export interface FailureThresholds {
  maxFailuresPerMinute: number;
  maxDlqPushesPerMinute: number;
  maxTimeoutsPerMinute: number;
}

export type HealthStatus = 'Healthy' | 'Warning' | 'Critical' | 'Unavailable';

export interface SystemHealthSnapshot {
  status: HealthStatus;
  successRate: number;
  failureRate: number;
  availabilityPercentage: number;
  totalSuccess: number;
  totalFailure: number;
  retryCount: number;
  timeoutCount: number;
  dlqCount: number;
  recoveryCount: number;
  timestamp: number;
}

export interface RecoveryStatistics {
  meanTimeToRecoveryMs: number;
  recoveryAttempts: number;
  recoverySuccesses: number;
  recoveryFailures: number;
  avgRetryDelayMs: number;
  timeoutRecoveries: number;
  dlqRecoveries: number;
}

export interface ReliabilityScoreModel {
  availabilityScore: number;
  successScore: number;
  timeoutScore: number;
  dlqScore: number;
  overallScore: number;
}

export interface ReliabilityRecommendation {
  id: string;
  category: 'RETRY' | 'TIMEOUT' | 'FAILURE' | 'HEALTH' | 'RECOVERY';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  component: string;
  observation: string;
  actionableStep: string;
}

export interface ReliabilityReportData {
  healthSnapshot: SystemHealthSnapshot;
  retryStats: RetryStatistics;
  timeoutStats: TimeoutStatistics;
  recentFailures: FailureRecord[];
  recoveryStats: RecoveryStatistics;
  scoreModel: ReliabilityScoreModel;
  recommendations: ReliabilityRecommendation[];
  timestamp: number;
}
