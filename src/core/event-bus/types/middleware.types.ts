/**
 * Middleware Pipeline Abstraction - Phase 1 Interface Specification
 */
import { BusEventEnvelope } from './event.types';

export type MiddlewareNext = () => Promise<void>;

export interface EventMiddleware<T = unknown> {
  name: string;
  execute(event: BusEventEnvelope<T>, next: MiddlewareNext): Promise<void>;
}
