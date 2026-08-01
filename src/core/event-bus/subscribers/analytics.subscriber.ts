/**
 * Analytics & UI Telemetry Subscriber - WP-3 Stage 1
 */
import { EventBus } from '../index';
import { BusEventEnvelope } from '../types/event.types';
import { Subscription } from '../types/subscriber.types';

export class AnalyticsSubscriber {
  private static subscriptions: Subscription[] = [];

  /**
   * Register analytics subscribers for UI telemetry topics
   */
  public static init(): Subscription[] {
    this.clear();

    // 1. Popup Connected Subscriber
    const subPopup = EventBus.subscribe('popup.connected', (evt: BusEventEnvelope) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[AnalyticsSubscriber][PopupConnected]', evt.topic, evt.id);
      }
    });

    // 2. Options Opened Subscriber
    const subOptionsOpened = EventBus.subscribe('options.opened', (evt: BusEventEnvelope) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[AnalyticsSubscriber][OptionsOpened]', evt.topic, evt.id);
      }
    });

    // 3. Options Closed Subscriber
    const subOptionsClosed = EventBus.subscribe('options.closed', (evt: BusEventEnvelope) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[AnalyticsSubscriber][OptionsClosed]', evt.topic, evt.id);
      }
    });

    this.subscriptions.push(subPopup, subOptionsOpened, subOptionsClosed);
    return this.subscriptions;
  }

  /**
   * Unsubscribe all analytics handlers
   */
  public static clear(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }
}
