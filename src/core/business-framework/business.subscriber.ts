/**
 * Business Execution Framework Subscriber - WP-4 Stage 1
 */
import { EventBus } from '../event-bus';
import { BusEventEnvelope } from '../event-bus/types/event.types';
import { Subscription } from '../event-bus/types/subscriber.types';
import { getEventBusFeatureFlags } from '../../services/eventBusFacade';
import { BusinessDispatcher } from './business.dispatcher';
import { BusinessExecutionContext } from './business.context';
import { BusinessRegistry } from './business.registry';

export class BusinessSubscriber {
  private static subscriptions: Subscription[] = [];

  /**
   * Initialize BusinessSubscriber gated by businessExecutionEnabled feature flag
   */
  public static init(): Subscription[] {
    this.clear();

    const flags = getEventBusFeatureFlags();
    if (!flags.businessExecutionEnabled) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[BusinessSubscriber] Business execution disabled (businessExecutionEnabled = false)');
      }
      return [];
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[BusinessSubscriber] Initializing Business Execution Framework & Handlers...');
    }

    // Register default domain business handlers
    BusinessRegistry.initDefaults();

    // Subscribe to all EventBus topic traffic for business handlers
    const subBusiness = EventBus.subscribe('**', (evt: BusEventEnvelope) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[BusinessSubscriber][Trace]', `EventBus -> BusinessSubscriber -> BusinessDispatcher [Topic: ${evt.topic}, ID: ${evt.id}]`);
      }
      const context: BusinessExecutionContext = {
        correlationId: evt.id,
        topic: evt.topic,
        timestamp: evt.timestamp,
        payload: evt.payload,
        attempt: 1
      };
      BusinessDispatcher.dispatch(context);
    });

    this.subscriptions.push(subBusiness);
    return this.subscriptions;
  }

  /**
   * Clear all business subscriptions
   */
  public static clear(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
}
