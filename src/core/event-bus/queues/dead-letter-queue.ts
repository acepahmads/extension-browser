/**
 * Dead Letter Queue (DLQ) - Enterprise Event Bus Phase 2
 */
import { BusEventEnvelope } from '../types/event.types';

export interface DLQEntry<T = unknown> {
  id: string;
  envelope: BusEventEnvelope<T>;
  reason: string;
  failedAt: number;
  attempts: number;
}

export class DeadLetterQueue {
  private queue: DLQEntry[] = [];
  private maxCapacity = 500;

  /**
   * Push an unhandled or failed event envelope to DLQ
   */
  public push<T = unknown>(envelope: BusEventEnvelope<T>, reason: string, attempts = 1): void {
    if (this.queue.length >= this.maxCapacity) {
      this.queue.shift(); // Evict oldest entry if capacity reached
    }

    const entry: DLQEntry<T> = {
      id: `dlq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      envelope,
      reason,
      failedAt: Date.now(),
      attempts
    };

    this.queue.push(entry as DLQEntry);
  }

  /**
   * Get all DLQ entries
   */
  public getEntries(): DLQEntry[] {
    return [...this.queue];
  }

  /**
   * Get DLQ size
   */
  public getSize(): number {
    return this.queue.length;
  }

  /**
   * Clear DLQ
   */
  public clear(): void {
    this.queue = [];
  }
}
