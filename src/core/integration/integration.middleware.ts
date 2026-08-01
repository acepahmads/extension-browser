/**
 * Dispatcher Integration Middleware Adapter — WP-5.4
 */

import { BusinessRegistry } from '../business-framework/business.registry';
import { BusinessExecutionContext } from '../business-framework/business.context';
import { BusinessResult } from '../business-framework/business.result';
import { IntegrationPipeline } from './integration.pipeline';
import { IntegrationOptions } from './integration.types';
import { DeadLetterQueue } from '../event-bus/queues/dead-letter-queue';
import { BusEventEnvelope } from '../event-bus/types/event.types';

export class IntegrationMiddleware {
  private static dlq = new DeadLetterQueue();

  /**
   * Dispatch a BusinessExecutionContext through the Integration Pipeline for all registered handlers
   */
  public static async dispatchWithPipeline<TInput = unknown, TOutput = unknown>(
    context: BusinessExecutionContext<TInput>,
    options?: IntegrationOptions
  ): Promise<BusinessResult<TOutput>[]> {
    const handlers = BusinessRegistry.getHandlers(context.topic);
    const results: BusinessResult<TOutput>[] = [];

    for (const handler of handlers) {
      const pipelineRes = await IntegrationPipeline.execute<TInput, TOutput>({
        context,
        handler,
        options
      });

      const res = pipelineRes.result;

      // Handle DLQ routing on fatal failure if exhausted
      if (!res.success && res.error) {
        const envelope: BusEventEnvelope = {
          id: context.correlationId,
          version: '1.0',
          sequence: 1,
          sessionId: 'integration_session',
          correlationId: context.correlationId,
          timestamp: context.timestamp,
          topic: context.topic,
          source: 'Background',
          severity: 'ERROR',
          payload: context.payload
        };
        this.dlq.push(envelope, res.error.message, pipelineRes.retryAttempts);
      }

      results.push(res);
    }

    return results;
  }
}
