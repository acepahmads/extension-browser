/**
 * Shadow Comparator Engine - WP-4 Stage 5
 */
import { BusinessResult } from '../business.result';

export type MismatchCategory =
  | 'IDENTICAL'
  | 'PAYLOAD_MISMATCH'
  | 'VALIDATION_MISMATCH'
  | 'ERROR_MISMATCH'
  | 'TIMING_ONLY'
  | 'UNSUPPORTED'
  | 'UNKNOWN';

export interface ShadowComparisonReport {
  topic: string;
  correlationId: string;
  timestamp: number;
  category: MismatchCategory;
  legacyResult: unknown;
  businessResult: BusinessResult<unknown> | null;
  differenceSummary: string;
  legacyDurationMs: number;
  businessDurationMs: number;
  comparisonDurationMs: number;
}

export class ShadowComparator {
  /**
   * Safely compare legacy execution result against Business Framework result.
   * NEVER throws an exception. Returns ShadowComparisonReport.
   */
  public static compare(
    topic: string,
    correlationId: string,
    legacyResult: unknown,
    businessResult: BusinessResult<unknown> | null,
    legacyDurationMs: number,
    businessDurationMs: number
  ): ShadowComparisonReport {
    const compStartTime = Date.now();
    let category: MismatchCategory = 'UNKNOWN';
    let differenceSummary = 'Outputs match perfectly.';

    try {
      if (!businessResult) {
        category = 'UNSUPPORTED';
        differenceSummary = 'Business framework result unavailable or handler not registered.';
      } else if (legacyResult && !businessResult.success) {
        category = 'ERROR_MISMATCH';
        differenceSummary = `Legacy execution succeeded but Business handler failed: ${businessResult.error?.message || 'Unknown error'}`;
      } else if (!legacyResult && businessResult.success) {
        category = 'ERROR_MISMATCH';
        differenceSummary = 'Legacy execution failed or returned null but Business handler succeeded.';
      } else if (businessResult.data && typeof businessResult.data === 'object') {
        const bData = businessResult.data as Record<string, unknown>;
        if (bData.validated === false) {
          category = 'VALIDATION_MISMATCH';
          differenceSummary = `Business handler validation failed diagnostics: ${(bData.diagnosticMessages as string[])?.join('; ') || 'Invalid payload'}`;
        } else {
          category = 'IDENTICAL';
        }
      } else {
        category = 'IDENTICAL';
      }
    } catch (err: any) {
      category = 'UNKNOWN';
      differenceSummary = `Comparator engine exception: ${err.message || 'Unknown error'}`;
    }

    const report: ShadowComparisonReport = {
      topic,
      correlationId,
      timestamp: Date.now(),
      category,
      legacyResult,
      businessResult,
      differenceSummary,
      legacyDurationMs,
      businessDurationMs,
      comparisonDurationMs: Date.now() - compStartTime
    };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[ShadowComparator][Trace]', `[Topic: ${topic}] Category: ${category} | ${differenceSummary}`);
    }

    return report;
  }
}
