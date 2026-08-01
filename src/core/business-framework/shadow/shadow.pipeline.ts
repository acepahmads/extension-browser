/**
 * Shadow Pipeline Coordinator - WP-4 Stage 5
 */
import { getEventBusFeatureFlags } from '../../../services/eventBusFacade';
import { BusinessDispatcher } from '../business.dispatcher';
import { BusinessExecutionContext } from '../business.context';
import { BusinessResult } from '../business.result';
import { ShadowComparator, ShadowComparisonReport } from './shadow.comparator';
import { ShadowMetrics } from './shadow.metrics';

export class ShadowPipeline {
  /**
   * Execute legacy operation and safely run Business Framework shadow comparison if enabled.
   * NEVER alters legacy return value or propagates comparison errors.
   */
  public static async executeShadowFlow<TLegacy = unknown, TPayload = unknown>(
    topic: string,
    correlationId: string,
    payload: TPayload,
    legacyFn: () => Promise<TLegacy> | TLegacy
  ): Promise<TLegacy> {
    const flags = getEventBusFeatureFlags();

    const legacyStart = Date.now();
    let legacyResult: TLegacy;

    // 1. Execute authoritative legacy logic
    try {
      legacyResult = await legacyFn();
    } catch (err) {
      // Re-throw legacy execution errors untouched
      throw err;
    }

    const legacyDurationMs = Date.now() - legacyStart;

    // 2. If shadow comparison or business execution is not enabled, return legacy result immediately
    if (!flags.businessExecutionEnabled && !flags.shadowComparisonEnabled) {
      return legacyResult;
    }

    // 3. Perform isolated observer shadow execution
    try {
      const busStart = Date.now();
      const context: BusinessExecutionContext<TPayload> = {
        correlationId,
        topic,
        timestamp: Date.now(),
        payload,
        attempt: 1
      };

      const dispatchResults = await BusinessDispatcher.dispatch(context);
      const busDurationMs = Date.now() - busStart;
      const businessResult = (dispatchResults.length > 0 ? dispatchResults[0] : null) as BusinessResult<unknown> | null;

      // 4. Compare results if shadowComparisonEnabled is active
      if (flags.shadowComparisonEnabled) {
        const report: ShadowComparisonReport = ShadowComparator.compare(
          topic,
          correlationId,
          legacyResult,
          businessResult,
          legacyDurationMs,
          busDurationMs
        );
        ShadowMetrics.record(report);
      }
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[ShadowPipeline] Isolated shadow execution caught error (legacy result unaffected):', err.message);
      }
    }

    // 5. Always return untouched legacy result
    return legacyResult;
  }
}
