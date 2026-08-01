/**
 * Priority Dispatcher & Queue - Enterprise Event Bus Phase 2
 */
import { BusEventEnvelope } from '../types/event.types';
import { Subscription } from '../types/subscriber.types';

export type EventPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface QueuedDispatchItem<T = unknown> {
  id: string;
  envelope: BusEventEnvelope<T>;
  subscriptions: Subscription[];
  priority: EventPriority;
  priorityWeight: number;
  enqueuedAt: number;
}

export class PriorityDispatcher {
  private queue: QueuedDispatchItem[] = [];

  private priorityWeights: Record<EventPriority, number> = {
    LOW: 0,
    NORMAL: 1,
    HIGH: 2,
    CRITICAL: 3
  };

  /**
   * Enqueue dispatch item according to priority weight
   */
  public enqueue<T = unknown>(
    envelope: BusEventEnvelope<T>,
    subscriptions: Subscription[],
    priority: EventPriority = 'NORMAL'
  ): void {
    const item: QueuedDispatchItem<T> = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      envelope,
      subscriptions,
      priority,
      priorityWeight: this.priorityWeights[priority] || 1,
      enqueuedAt: Date.now()
    };

    this.queue.push(item as QueuedDispatchItem);
    // Sort descending by priorityWeight (CRITICAL first)
    this.queue.sort((a, b) => b.priorityWeight - a.priorityWeight);
  }

  /**
   * Dequeue next highest-priority item
   */
  public dequeue(): QueuedDispatchItem | undefined {
    return this.queue.shift();
  }

  /**
   * Flush all items in priority order
   */
  public async flush(): Promise<void> {
    while (this.queue.length > 0) {
      const item = this.dequeue();
      if (item) {
        for (const sub of item.subscriptions) {
          try {
            await sub.handler(item.envelope);
          } catch (err) {
            console.error(`[PriorityDispatcher] Error executing subscription [${sub.id}]:`, err);
          }
        }
      }
    }
  }

  /**
   * Get queue length
   */
  public getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Clear queue
   */
  public clear(): void {
    this.queue = [];
  }
}
