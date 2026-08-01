/**
 * Target Integration Pipeline Orchestrator — WP-5.4
 */

import { getEventBusFeatureFlags } from '../../services/eventBusFacade';
import { BusinessExecutionContext } from '../business-framework/business.context';
import { BusinessHandler } from '../business-framework/business.handler';
import { BusinessResult } from '../business-framework/business.result';
import { BusinessError } from '../business-framework/business.error';
import { ReliabilityService } from '../reliability/reliability.service';
import { BenchmarkService } from '../performance/benchmark.service';
import { ObservabilityService } from '../observability/observability.service';
import {
  IntegrationContext,
  IntegrationFeatureFlags,
  IntegrationPipelineResult
} from './integration.types';

export class IntegrationPipeline {
  private static reliabilityService = new ReliabilityService();
  private static observabilityService = new ObservabilityService();

  /**
   * Helper to retrieve active integration feature flags with default false fallbacks
   */
  public static getActiveFeatureFlags(): IntegrationFeatureFlags {
    const flags = getEventBusFeatureFlags();
    return {
      performanceIntegrationEnabled: flags.performanceIntegrationEnabled === true,
      reliabilityIntegrationEnabled: flags.reliabilityIntegrationEnabled === true,
      observabilityIntegrationEnabled: flags.observabilityIntegrationEnabled === true
    };
  }

  /**
   * Execute legacy dispatcher retry loop when reliability framework wrapper is inactive
   */
  private static async executeWithLegacyRetry<TInput = unknown, TOutput = unknown>(
    context: BusinessExecutionContext<TInput>,
    handler: BusinessHandler
  ): Promise<{ result: BusinessResult<TOutput>; attempts: number }> {
    const startTime = performance.now();
    let attempt = 0;
    let lastError: BusinessError | null = null;
    let success = false;
    let data: TOutput | null = null;

    while (attempt < 3 && !success) {
      attempt++;
      const currentContext: BusinessExecutionContext<TInput> = {
        ...context,
        attempt
      };

      try {
        const res = await handler.execute(currentContext as any);
        if (res.success) {
          success = true;
          data = res.data as TOutput;
          lastError = null;
        } else if (res.error) {
          lastError = res.error;
          if (!res.error.isRecoverable) {
            break; // Do not retry fatal errors
          }
        }
      } catch (err: any) {
        lastError =
          err instanceof BusinessError
            ? err
            : new BusinessError('HANDLER_EXCEPTION', err?.message || 'Unknown handler error', false, err);
        if (!lastError.isRecoverable) {
          break;
        }
      }

      if (!success && attempt < 3 && lastError?.isRecoverable) {
        const delay = 100 * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    const executionTimeMs = Math.max(0, performance.now() - startTime);
    return {
      result: {
        success,
        data,
        executionTimeMs,
        error: lastError
      },
      attempts: attempt
    };
  }

  /**
   * Execute target pipeline wrapping handler execution according to active feature flags
   */
  public static async execute<TInput = unknown, TOutput = unknown>(
    integrationContext: IntegrationContext<TInput>
  ): Promise<IntegrationPipelineResult<TOutput>> {
    const { context, handler, options } = integrationContext;
    const flags = this.getActiveFeatureFlags();

    // 0. Immediate Zero-Bypass check when all integration flags are disabled
    if (
      !flags.performanceIntegrationEnabled &&
      !flags.reliabilityIntegrationEnabled &&
      !flags.observabilityIntegrationEnabled
    ) {
      const legacyRes = await this.executeWithLegacyRetry<TInput, TOutput>(context, handler);

      return {
        result: legacyRes.result,
        bypassed: true,
        measuredDurationMs: legacyRes.result.executionTimeMs,
        retryAttempts: legacyRes.attempts,
        recovered: legacyRes.attempts > 1 && legacyRes.result.success,
        timedOut: false
      };
    }

    const startTime = performance.now();
    let measuredDurationMs = 0;
    let retryAttempts = 1;
    let recovered = false;
    let timedOut = false;
    let businessResult: BusinessResult<TOutput>;

    // 1. Reliability Wrapper Phase (if reliabilityIntegrationEnabled)
    if (flags.reliabilityIntegrationEnabled) {
      const resilientRes = await this.reliabilityService.executeResiliently<BusinessResult<TOutput>>(
        async () => {
          // 2. Performance Measurement Phase (if performanceIntegrationEnabled)
          const pStart = performance.now();
          const handlerRes = await handler.execute(context as any);
          const pDuration = Math.max(0, performance.now() - pStart);

          if (flags.performanceIntegrationEnabled) {
            BenchmarkService.measureSingleEvent(context.topic, context.payload);
          }

          if (!handlerRes.success && handlerRes.error) {
            throw handlerRes.error;
          }

          return { ...handlerRes, executionTimeMs: pDuration } as BusinessResult<TOutput>;
        },
        {
          timeoutMs: options?.timeoutMs,
          timeoutLevel: options?.timeoutLevel || 'HANDLER',
          isRecoverable: options?.isRecoverable || ((err) => err?.isRecoverable !== false),
          sourceLabel: handler.handlerId
        }
      );

      retryAttempts = resilientRes.attempts;
      recovered = resilientRes.recovered;
      timedOut = resilientRes.timedOut;

      if (resilientRes.success && resilientRes.data) {
        businessResult = resilientRes.data;
      } else {
        const err =
          resilientRes.error instanceof BusinessError
            ? resilientRes.error
            : new BusinessError(
                'HANDLER_FAILURE',
                resilientRes.error?.message || 'Resilient execution failed',
                false,
                resilientRes.error
              );
        businessResult = {
          success: false,
          data: null,
          executionTimeMs: resilientRes.totalDurationMs,
          error: err
        };
      }
    } else {
      // Direct execution with legacy retry protection when Reliability Framework is inactive
      const legacyRes = await this.executeWithLegacyRetry<TInput, TOutput>(context, handler);
      businessResult = legacyRes.result;
      retryAttempts = legacyRes.attempts;
      recovered = legacyRes.attempts > 1 && legacyRes.result.success;

      if (flags.performanceIntegrationEnabled) {
        BenchmarkService.measureSingleEvent(context.topic, context.payload);
      }
    }

    measuredDurationMs = Math.max(0, performance.now() - startTime);

    // 3. Observability Collector Phase (if observabilityIntegrationEnabled)
    if (flags.observabilityIntegrationEnabled) {
      this.observabilityService.captureSnapshot(
        undefined,
        this.reliabilityService.getHealthMonitor().getHealthSnapshot(),
        this.reliabilityService.getHealthMonitor().getScoreModel()
      );
    }

    return {
      result: businessResult,
      bypassed: false,
      measuredDurationMs,
      retryAttempts,
      recovered,
      timedOut
    };
  }

  public static getReliabilityService(): ReliabilityService {
    return this.reliabilityService;
  }

  public static getObservabilityService(): ObservabilityService {
    return this.observabilityService;
  }
}
