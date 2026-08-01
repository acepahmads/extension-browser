/**
 * Event Bus Module Entry Point - Phase 2 (Pipeline, Resilience & Metrics)
 */
import { EventBusCore } from './event-bus.core';

export * from './types/event.types';
export * from './types/topic.types';
export * from './types/subscriber.types';
export * from './types/middleware.types';

export * from './middleware/middleware-pipeline';
export * from './validation/event-validator';
export * from './validation/schema-registry';
export * from './dispatchers/priority-dispatcher';
export * from './metrics/metrics-collector';
export * from './queues/dead-letter-queue';
export * from './handlers/error-handler';

export { EventBusCore };
export const EventBus = EventBusCore.getInstance();
