// src/services/eventBusFacade.ts
/**
 * Facade for publishing events onto the Enterprise EventBus.
 * All runtime listeners call this function to publish events directly
 * to the EventBus and Business Execution Framework.
 * Development‑only logging is emitted when NODE_ENV !== 'production'.
 */
import { EventBus, EventPriority } from '../core/event-bus';
import { EventBusFeatureFlags } from '../config/interfaces';

export type { EventPriority };

let featureFlags: EventBusFeatureFlags = {
  publishEnabled: true,
  subscribeEnabled: false,
  performanceIntegrationEnabled: false,
  reliabilityIntegrationEnabled: false,
  observabilityIntegrationEnabled: false
};

/**
 * Update EventBus feature flags at runtime.
 */
export function setEventBusFeatureFlags(flags: Partial<EventBusFeatureFlags>): void {
  featureFlags = {
    ...featureFlags,
    ...flags
  };
}

/**
 * Retrieve current EventBus feature flags.
 */
export function getEventBusFeatureFlags(): EventBusFeatureFlags {
  return { ...featureFlags };
}

/**
 * Publish an event to the EventBus.
 *
 * @param topic   Fully‑qualified topic name (e.g. "browser.window.created")
 * @param payload Payload matching the existing ActivityService shape
 * @param priority Optional priority (defaults to "NORMAL")
 */
export function publish(
  topic: string,
  payload: unknown,
  priority: EventPriority = 'NORMAL'
): void {
  try {
    // 1. Feature Flag Check
    if (!featureFlags.publishEnabled) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      // Development‑only diagnostic
      // eslint-disable-next-line no-console
      console.debug('[EventBus][Publish]', topic);
    }

    // 2. Publish to EventBus Core with exception shield on promise
    EventBus.publish(topic, payload, { priority }).catch((err) => {
      // eslint-disable-next-line no-console
      console.warn(`[EventBusFacade] Async publish error for topic [${topic}]:`, err);
    });
  } catch (error) {
    // 3. Exception Isolation Shield: Never bubble sync errors to callers
    // eslint-disable-next-line no-console
    console.error(`[EventBusFacade] Sync publish exception caught for topic [${topic}]:`, error);
  }
}


