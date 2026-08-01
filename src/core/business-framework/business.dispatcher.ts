/**
 * Business Dispatcher & Retry Engine - WP-4 Stage 1
 */
import { BusinessExecutionContext } from './business.context';
import { BusinessResult } from './business.result';
import { IntegrationMiddleware } from '../integration/integration.middleware';

export class BusinessDispatcher {
  /**
   * Dispatch an execution context to registered BusinessHandlers through the Production Integration Pipeline
   */
  public static async dispatch<TInput = unknown, TOutput = unknown>(
    context: BusinessExecutionContext<TInput>
  ): Promise<BusinessResult<TOutput>[]> {
    return IntegrationMiddleware.dispatchWithPipeline<TInput, TOutput>(context);
  }
}
