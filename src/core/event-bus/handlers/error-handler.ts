/**
 * Event Bus Error Handler - Enterprise Event Bus Phase 2
 */
import { BusEventEnvelope } from '../types/event.types';
import { DeadLetterQueue } from '../queues/dead-letter-queue';
import { MetricsCollector } from '../metrics/metrics-collector';

export enum EventBusErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MIDDLEWARE_ERROR = 'MIDDLEWARE_ERROR',
  DISPATCH_ERROR = 'DISPATCH_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR'
}

export class EventBusError extends Error {
  constructor(
    public readonly type: EventBusErrorType,
    message: string,
    public readonly envelope?: BusEventEnvelope,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'EventBusError';
  }
}

export class ErrorHandler {
  private dlq: DeadLetterQueue;
  private metrics: MetricsCollector;

  constructor(dlq: DeadLetterQueue, metrics: MetricsCollector) {
    this.dlq = dlq;
    this.metrics = metrics;
  }

  /**
   * Handle and record any event processing error
   */
  public handleError(error: EventBusError | Error, envelope?: BusEventEnvelope): void {
    const errorType = error instanceof EventBusError ? error.type : EventBusErrorType.SYSTEM_ERROR;
    const reason = `[${errorType}] ${error.message}`;

    this.metrics.recordDropped();

    if (envelope) {
      this.dlq.push(envelope, reason);
    }

    console.error(`[EventBus:ErrorHandler] ${reason}`);
  }
}
