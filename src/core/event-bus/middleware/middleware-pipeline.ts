/**
 * Middleware Pipeline - Enterprise Event Bus Phase 2
 */
import { BusEventEnvelope } from '../types/event.types';
import { MiddlewareNext } from '../types/middleware.types';

export interface MiddlewareContext<T = unknown> {
  envelope: BusEventEnvelope<T>;
  isCancelled: boolean;
  cancelReason?: string;
  metadata: Record<string, unknown>;
  cancel: (reason?: string) => void;
}

export type EventMiddlewareHandler<T = unknown> = (
  context: MiddlewareContext<T>,
  next: MiddlewareNext
) => Promise<void> | void;

export class MiddlewarePipeline {
  private middlewares: EventMiddlewareHandler[] = [];

  /**
   * Register a middleware in the execution pipeline chain
   */
  public use<T = unknown>(middleware: EventMiddlewareHandler<T>): void {
    this.middlewares.push(middleware as EventMiddlewareHandler);
  }

  /**
   * Execute all registered middlewares in order for the given envelope
   */
  public async execute<T = unknown>(envelope: BusEventEnvelope<T>): Promise<MiddlewareContext<T>> {
    const context: MiddlewareContext<T> = {
      envelope,
      isCancelled: false,
      metadata: {},
      cancel: (reason?: string) => {
        context.isCancelled = true;
        context.cancelReason = reason || 'Cancelled by middleware';
      }
    };

    let index = 0;

    const next: MiddlewareNext = async () => {
      if (context.isCancelled || index >= this.middlewares.length) {
        return;
      }

      const middleware = this.middlewares[index++];
      try {
        await middleware(context, next);
      } catch (err) {
        console.error(`[EventBus:Middleware] Execution error in middleware at index ${index - 1}:`, err);
        throw err;
      }
    };

    if (this.middlewares.length > 0) {
      await next();
    }

    return context;
  }

  /**
   * Clear all registered middlewares
   */
  public clear(): void {
    this.middlewares = [];
  }

  /**
   * Get count of active middlewares
   */
  public getCount(): number {
    return this.middlewares.length;
  }
}
