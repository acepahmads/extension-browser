/**
 * Business Handler Contract - WP-4 Stage 1
 */
import { BusinessExecutionContext } from './business.context';
import { BusinessResult } from './business.result';

export interface BusinessHandler<TInput = unknown, TOutput = unknown> {
  readonly handlerId: string;
  readonly targetTopic: string;
  execute(context: BusinessExecutionContext<TInput>): Promise<BusinessResult<TOutput>>;
}
