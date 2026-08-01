/**
 * Subscription Contracts, Handlers, and Options - Phase 1 Core Foundation
 */
import { BusEventEnvelope } from './event.types';

export type EventHandler<T = unknown> = (event: BusEventEnvelope<T>) => void | Promise<void>;

export interface SubscriptionOptions {
  once?: boolean;
  priority?: number; // 0 = High, 1 = Normal, 2 = Low
}

export interface Subscription {
  id: string;
  topicPattern: string;
  handler: EventHandler<any>;
  options: SubscriptionOptions;
  unsubscribe: () => boolean;
}
