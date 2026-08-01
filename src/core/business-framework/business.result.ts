/**
 * Business Execution Result Interface - WP-4 Stage 1
 */
import { BusinessError } from './business.error';

export interface BusinessResult<TData = unknown> {
  success: boolean;
  data: TData | null;
  executionTimeMs: number;
  error: BusinessError | null;
}
