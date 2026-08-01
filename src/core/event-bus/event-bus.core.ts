/**
 * Enterprise Event Bus Core Engine - Phase 2 (Pipeline, Resilience & Metrics)
 */
import { BusEventEnvelope, PublishOptions, PublishResult } from './types/event.types';
import { EventHandler, Subscription, SubscriptionOptions } from './types/subscriber.types';
import { ActivitySource, ActivitySeverity } from '../../modules/lifecycle/activity.types';
import { MiddlewarePipeline, EventMiddlewareHandler } from './middleware/middleware-pipeline';
import { EventValidator } from './validation/event-validator';
import { PriorityDispatcher } from './dispatchers/priority-dispatcher';
import { MetricsCollector } from './metrics/metrics-collector';
import { DeadLetterQueue } from './queues/dead-letter-queue';
import { ErrorHandler, EventBusError, EventBusErrorType } from './handlers/error-handler';

export class EventBusCore {
  private static instance: EventBusCore | null = null;
  private subscriptions: Map<string, Subscription> = new Map();
  private sequenceCounter = 0;

  // Phase 2 Modules
  private middlewarePipeline: MiddlewarePipeline;
  private validator: EventValidator;
  private priorityDispatcher: PriorityDispatcher;
  private metrics: MetricsCollector;
  private dlq: DeadLetterQueue;
  private errorHandler: ErrorHandler;

  private constructor() {
    this.middlewarePipeline = new MiddlewarePipeline();
    this.validator = new EventValidator();
    this.priorityDispatcher = new PriorityDispatcher();
    this.metrics = new MetricsCollector();
    this.dlq = new DeadLetterQueue();
    this.errorHandler = new ErrorHandler(this.dlq, this.metrics);
  }

  /**
   * Singleton instance retriever
   */
  public static getInstance(): EventBusCore {
    if (!EventBusCore.instance) {
      EventBusCore.instance = new EventBusCore();
    }
    return EventBusCore.instance;
  }

  /**
   * Reset instance state (for testing / isolation)
   */
  public static resetInstance(): void {
    EventBusCore.instance = null;
  }

  /**
   * Get active subscription count
   */
  public getSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  /**
   * Register a middleware in the pipeline chain
   */
  public use<T = unknown>(middleware: EventMiddlewareHandler<T>): void {
    this.middlewarePipeline.use(middleware);
  }

  /**
   * Get telemetry metrics
   */
  public getMetrics() {
    return this.metrics.getMetrics();
  }

  /**
   * Get Dead Letter Queue (DLQ)
   */
  public getDLQ(): DeadLetterQueue {
    return this.dlq;
  }

  /**
   * Get Validator
   */
  public getValidator(): EventValidator {
    return this.validator;
  }

  /**
   * Create an Event Envelope, validate, execute middlewares, enqueue to priority dispatcher, and publish
   */
  public async publish<T = unknown>(
    topic: string,
    payload: T,
    options?: PublishOptions
  ): Promise<PublishResult<T>> {
    const startTime = Date.now();
    this.sequenceCounter += 1;
    this.metrics.recordPublish();

    const envelope: BusEventEnvelope<T> = {
      id: `bus_evt_${startTime}_${Math.random().toString(36).substring(2, 7)}`,
      version: options?.version || '1.0',
      sequence: options?.sequence || this.sequenceCounter,
      sessionId: options?.sessionId || `SESSION-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-000`,
      correlationId: options?.correlationId || `CID-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: startTime,
      topic,
      source: options?.source || ('System' as ActivitySource),
      severity: options?.severity || ('INFO' as ActivitySeverity),
      payload
    };

    // 1. Validation Step (if requested or by default)
    if (options?.validate !== false) {
      const validation = this.validator.validate(envelope);
      if (!validation.isValid) {
        const error = new EventBusError(
          EventBusErrorType.VALIDATION_ERROR,
          `Validation failed for topic [${topic}]: ${validation.errors.join('; ')}`,
          envelope
        );
        this.errorHandler.handleError(error, envelope);
        return { success: false, event: envelope };
      }
    }

    // 2. Middleware Pipeline Execution Step
    try {
      const context = await this.middlewarePipeline.execute(envelope);
      if (context.isCancelled) {
        this.metrics.recordDropped();
        return { success: false, event: envelope };
      }
    } catch (err) {
      const error = new EventBusError(
        EventBusErrorType.MIDDLEWARE_ERROR,
        `Middleware chain execution failed for topic [${topic}]`,
        envelope,
        err
      );
      this.errorHandler.handleError(error, envelope);
      return { success: false, event: envelope };
    }

    // 3. Match Subscriptions & Dispatch via Priority Dispatcher
    const matchedSubscriptions = this.getMatchedSubscriptions(topic);
    const priority = options?.priority || 'NORMAL';

    this.priorityDispatcher.enqueue(envelope, matchedSubscriptions, priority);
    await this.priorityDispatcher.flush();

    const duration = Date.now() - startTime;
    this.metrics.recordDispatch(duration);

    return {
      success: true,
      event: envelope
    };
  }

  /**
   * Subscribe to a topic or wildcard pattern
   */
  public subscribe<T = unknown>(
    topicPattern: string,
    handler: EventHandler<T>,
    options?: SubscriptionOptions
  ): Subscription {
    const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const wrappedHandler: EventHandler<T> = async (evt) => {
      if (options?.once) {
        this.unsubscribe(subId);
      }
      return handler(evt);
    };

    const subscription: Subscription = {
      id: subId,
      topicPattern,
      handler: wrappedHandler,
      options: options || {},
      unsubscribe: () => this.unsubscribe(subId)
    };

    this.subscriptions.set(subId, subscription);
    this.metrics.recordSubscribe();
    return subscription;
  }

  /**
   * Unsubscribe by subscription ID
   */
  public unsubscribe(subscriptionId: string): boolean {
    const removed = this.subscriptions.delete(subscriptionId);
    if (removed) {
      this.metrics.recordUnsubscribe();
    }
    return removed;
  }

  /**
   * Subscribe for a single execution
   */
  public once<T = unknown>(topicPattern: string, handler: EventHandler<T>): Subscription {
    return this.subscribe(topicPattern, handler, { once: true });
  }

  /**
   * Broadcast interface
   */
  public broadcast<T = unknown>(topic: string, payload: T): void {
    this.publish(topic, payload).catch(() => {});
  }

  /**
   * Basic Wildcard Matching Logic
   */
  private getMatchedSubscriptions(topic: string): Subscription[] {
    const matched: Subscription[] = [];

    for (const sub of this.subscriptions.values()) {
      if (this.matchTopic(sub.topicPattern, topic)) {
        matched.push(sub);
      }
    }

    return matched;
  }

  /**
   * Helper to match wildcard patterns against topic strings
   */
  private matchTopic(pattern: string, topic: string): boolean {
    if (pattern === topic || pattern === '**' || pattern === '*') {
      return true;
    }

    const patternParts = pattern.split('.');
    const topicParts = topic.split('.');

    for (let i = 0; i < patternParts.length; i++) {
      const p = patternParts[i];
      if (p === '**') {
        return true;
      }
      if (i >= topicParts.length) {
        return false;
      }
      if (p !== '*' && p !== topicParts[i]) {
        return false;
      }
    }

    return patternParts.length === topicParts.length;
  }
}
