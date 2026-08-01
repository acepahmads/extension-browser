/**
 * Master Subscriber Registry - Enterprise EventBus Phase 3 (WP-3)
 */
import { getEventBusFeatureFlags } from '../../../services/eventBusFacade';
import { AnalyticsSubscriber } from './analytics.subscriber';
import { MetricsSubscriber } from './metrics.subscriber';
import { WorkspaceSubscriber } from './workspace.subscriber';
import { StorageSubscriber } from './storage.subscriber';
import { LifecycleSubscriber } from './lifecycle.subscriber';
import { Subscription } from '../types/subscriber.types';

export class SubscriberRegistry {
  private static activeSubscriptions: Subscription[] = [];

  /**
   * Initialize subscriber registry based on feature flag status
   */
  public static init(): void {
    this.clear();

    const flags = getEventBusFeatureFlags();
    if (!flags.subscribeEnabled) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[SubscriberRegistry] Subscriber execution disabled (subscribeEnabled = false)');
      }
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[SubscriberRegistry] Registering production EventBus subscribers...');
    }

    // Stage 1: Analytics & UI Telemetry Subscriber
    const analyticsSubs = AnalyticsSubscriber.init();
    this.activeSubscriptions.push(...analyticsSubs);

    // Stage 2: Metrics & Performance Telemetry Subscriber
    const metricsSubs = MetricsSubscriber.init();
    this.activeSubscriptions.push(...metricsSubs);

    // Stage 3: Workspace State Observer Subscriber
    const workspaceSubs = WorkspaceSubscriber.init();
    this.activeSubscriptions.push(...workspaceSubs);

    // Stage 4: Storage State Observer Subscriber
    const storageSubs = StorageSubscriber.init();
    this.activeSubscriptions.push(...storageSubs);

    // Stage 5: Lifecycle Observer Subscriber
    const lifecycleSubs = LifecycleSubscriber.init();
    this.activeSubscriptions.push(...lifecycleSubs);
  }

  /**
   * Clear all active subscriptions
   */
  public static clear(): void {
    AnalyticsSubscriber.clear();
    MetricsSubscriber.clear();
    WorkspaceSubscriber.clear();
    StorageSubscriber.clear();
    LifecycleSubscriber.clear();
    this.activeSubscriptions = [];
  }

  /**
   * Get active subscription count
   */
  public static getActiveCount(): number {
    return this.activeSubscriptions.length;
  }
}
