/**
 * Metrics & Performance Subscriber - WP-3 Stage 2
 * Passive telemetry observer collecting in-memory EventBus statistics.
 */
import { EventBus } from '../index';
import { BusEventEnvelope } from '../types/event.types';
import { Subscription } from '../types/subscriber.types';

export interface PerformanceMetricsSnapshot {
  totalEvents: number;
  eventsByTopic: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  averageDispatchDurationMs: number;
  maxDispatchDurationMs: number;
  minDispatchDurationMs: number;
  totalErrors: number;
}

export class MetricsSubscriber {
  private static subscriptions: Subscription[] = [];

  // In-memory telemetry state
  private static totalEvents = 0;
  private static totalErrors = 0;
  private static eventsByTopic: Record<string, number> = {};
  private static eventsBySeverity: Record<string, number> = {};
  private static totalDurationMs = 0;
  private static maxDurationMs = 0;
  private static minDurationMs = Infinity;

  /**
   * Register passive metrics subscriber on wildcard topic '**'
   */
  public static init(): Subscription[] {
    this.clear();

    const subMetrics = EventBus.subscribe('**', (evt: BusEventEnvelope) => {
      this.recordEvent(evt);
    });

    this.subscriptions.push(subMetrics);
    return this.subscriptions;
  }

  /**
   * Record telemetry event (O(1) complexity)
   */
  public static recordEvent(evt: BusEventEnvelope): void {
    this.totalEvents += 1;

    // Track Topic Counts
    const topic = evt.topic || 'unknown';
    this.eventsByTopic[topic] = (this.eventsByTopic[topic] || 0) + 1;

    // Track Severity Counts
    const severity = evt.severity || 'UNKNOWN';
    this.eventsBySeverity[severity] = (this.eventsBySeverity[severity] || 0) + 1;

    // Calculate Duration Metrics
    if (evt.timestamp) {
      const duration = Date.now() - evt.timestamp;
      this.totalDurationMs += duration;
      if (duration > this.maxDurationMs) {
        this.maxDurationMs = duration;
      }
      if (duration < this.minDurationMs) {
        this.minDurationMs = duration;
      }
    }

    // Diagnostic Snapshot every 100 events in dev mode
    if (process.env.NODE_ENV !== 'production' && this.totalEvents % 100 === 0) {
      // eslint-disable-next-line no-console
      console.debug('[MetricsSubscriber][100-Event Snapshot]', this.getMetrics());
    }
  }

  /**
   * Record subscriber error count
   */
  public static recordError(): void {
    this.totalErrors += 1;
  }

  /**
   * Retrieve in-memory performance metrics snapshot
   */
  public static getMetrics(): PerformanceMetricsSnapshot {
    return {
      totalEvents: this.totalEvents,
      eventsByTopic: { ...this.eventsByTopic },
      eventsBySeverity: { ...this.eventsBySeverity },
      averageDispatchDurationMs: this.totalEvents > 0 ? parseFloat((this.totalDurationMs / this.totalEvents).toFixed(2)) : 0,
      maxDispatchDurationMs: this.maxDurationMs,
      minDispatchDurationMs: this.minDurationMs === Infinity ? 0 : this.minDurationMs,
      totalErrors: this.totalErrors
    };
  }

  /**
   * Reset in-memory telemetry counters and unsubscribe
   */
  public static clear(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
    this.totalEvents = 0;
    this.totalErrors = 0;
    this.eventsByTopic = {};
    this.eventsBySeverity = {};
    this.totalDurationMs = 0;
    this.maxDurationMs = 0;
    this.minDurationMs = Infinity;
  }
}
