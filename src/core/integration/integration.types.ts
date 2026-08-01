/**
 * Production Integration Layer Data Contracts — WP-5.4
 */

import { BusinessExecutionContext } from '../business-framework/business.context';
import { BusinessHandler } from '../business-framework/business.handler';
import { BusinessResult } from '../business-framework/business.result';
import { TimeoutLevel } from '../reliability/reliability.types';

export interface IntegrationFeatureFlags {
  performanceIntegrationEnabled: boolean;
  reliabilityIntegrationEnabled: boolean;
  observabilityIntegrationEnabled: boolean;
}

export interface IntegrationOptions {
  timeoutMs?: number;
  timeoutLevel?: TimeoutLevel;
  isRecoverable?: (err: any) => boolean;
  sourceLabel?: string;
}

export interface IntegrationContext<TInput = unknown> {
  context: BusinessExecutionContext<TInput>;
  handler: BusinessHandler;
  options?: IntegrationOptions;
}

export interface IntegrationPipelineResult<TOutput = unknown> {
  result: BusinessResult<TOutput>;
  bypassed: boolean;
  measuredDurationMs: number;
  retryAttempts: number;
  recovered: boolean;
  timedOut: boolean;
}

export interface IntegrationMetricsSnapshot {
  totalExecutions: number;
  bypassedExecutions: number;
  integratedExecutions: number;
  performanceInterceptionCount: number;
  reliabilityInterceptionCount: number;
  observabilityInterceptionCount: number;
  flagsSnapshot: IntegrationFeatureFlags;
  timestamp: number;
}
