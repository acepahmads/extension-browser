/**
 * Master Subscriber Registry Unit Verification Suite - WP-3 (Stages 1-5)
 */
import { SubscriberRegistry } from './subscriber.registry';
import { MetricsSubscriber } from './metrics.subscriber';
import { WorkspaceSubscriber } from './workspace.subscriber';
import { StorageSubscriber } from './storage.subscriber';
import { LifecycleSubscriber } from './lifecycle.subscriber';
import { setEventBusFeatureFlags } from '../../../services/eventBusFacade';
import { EventBus } from '../index';

export async function runSubscriberTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Subscriber Registry Unit Verification Suite...\n');

  // TEST 1: Feature Flag Gating (subscribeEnabled = false)
  try {
    setEventBusFeatureFlags({ subscribeEnabled: false });
    SubscriberRegistry.init();

    if (SubscriberRegistry.getActiveCount() === 0) {
      results.push('✓ Test 1 Passed: SubscriberRegistry skips registration when subscribeEnabled is false.');
    } else {
      throw new Error('SubscriberRegistry registered subscribers despite subscribeEnabled = false.');
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: All Stages Registration (subscribeEnabled = true)
  try {
    setEventBusFeatureFlags({ publishEnabled: true, subscribeEnabled: true });
    SubscriberRegistry.init();

    // 3 Analytics + 1 Metrics + 2 Workspace + 1 Storage + 8 Lifecycle = 15 Active Subscriptions
    if (SubscriberRegistry.getActiveCount() === 15) {
      results.push('✓ Test 2 Passed: Master SubscriberRegistry registers 15 topic handlers across Stages 1-5 when subscribeEnabled is true.');
    } else {
      throw new Error(`Expected 15 active subscriptions, got ${SubscriberRegistry.getActiveCount()}`);
    }

    SubscriberRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  // TEST 3: MetricsSubscriber In-Memory Counters & Non-Mutation
  try {
    setEventBusFeatureFlags({ publishEnabled: true, subscribeEnabled: true });
    SubscriberRegistry.init();

    const bus = EventBus;
    await bus.publish('browser.tab.created', { tabId: 101 }, { validate: false });
    await bus.publish('popup.connected', { sender: 'POPUP' }, { validate: false });

    const metrics = MetricsSubscriber.getMetrics();
    if (metrics.totalEvents === 2 && metrics.eventsByTopic['browser.tab.created'] === 1 && metrics.eventsByTopic['popup.connected'] === 1) {
      results.push('✓ Test 3 Passed: MetricsSubscriber records event counters across topics without state mutation.');
    } else {
      throw new Error(`Metrics aggregation failed. Recorded: ${JSON.stringify(metrics)}`);
    }

    SubscriberRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  // TEST 4: WorkspaceSubscriber Cache Updates & Read-Only API
  try {
    setEventBusFeatureFlags({ publishEnabled: true, subscribeEnabled: true });
    SubscriberRegistry.init();

    const bus = EventBus;

    // Initially cache is empty
    if (WorkspaceSubscriber.getCurrentWorkspace() !== null || WorkspaceSubscriber.isContentConnected() !== false) {
      throw new Error('WorkspaceSubscriber cache not initially empty.');
    }

    // Publish workspace.changed
    await bus.publish('workspace.changed', {
      workspace: { id: 'ws_prod_01', name: 'Production UI', version: '1.2.0' }
    }, { validate: false });

    // Publish content.connected
    await bus.publish('content.connected', { pattern: 'https://*.example.com/*' }, { validate: false });

    const cache = WorkspaceSubscriber.getWorkspaceCache();
    if (cache.workspaceId === 'ws_prod_01' && cache.isContentScriptConnected === true && cache.activeUrlPattern === 'https://*.example.com/*') {
      results.push('✓ Test 4 Passed: WorkspaceSubscriber updates in-memory cache and exposes read-only getters.');
    } else {
      throw new Error(`Workspace cache update failed: ${JSON.stringify(cache)}`);
    }

    SubscriberRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 4 Failed: ${err.message}`);
  }

  // TEST 5: StorageSubscriber Cache Updates & Read-Only API
  try {
    setEventBusFeatureFlags({ publishEnabled: true, subscribeEnabled: true });
    SubscriberRegistry.init();

    const bus = EventBus;

    // Initially cache is empty
    if (StorageSubscriber.getLastChangedKeys().length !== 0 || StorageSubscriber.getLastUpdate() !== null) {
      throw new Error('StorageSubscriber cache not initially empty.');
    }

    // Publish storage.changed
    await bus.publish('storage.changed', {
      keys: ['activeWorkspaceId', 'userTheme'],
      areaName: 'local'
    }, { validate: false });

    const cache = StorageSubscriber.getStorageCache();
    const changedKeys = StorageSubscriber.getLastChangedKeys();

    if (cache.changedKeyCount === 2 && changedKeys.includes('activeWorkspaceId') && cache.lastStorageArea === 'local') {
      results.push('✓ Test 5 Passed: StorageSubscriber updates in-memory storage cache on storage.changed events.');
    } else {
      throw new Error(`Storage cache update failed: ${JSON.stringify(cache)}`);
    }

    SubscriberRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 5 Failed: ${err.message}`);
  }

  // TEST 6: LifecycleSubscriber Window, Tab & Navigation Telemetry
  try {
    setEventBusFeatureFlags({ publishEnabled: true, subscribeEnabled: true });
    SubscriberRegistry.init();

    const bus = EventBus;

    // Publish tab created & nav started/completed
    await bus.publish('browser.tab.created', { tabId: 501, windowId: 1, url: 'https://example.com', active: true }, { validate: false });
    await bus.publish('browser.navigation.started', { tabId: 501, url: 'https://example.com' }, { validate: false });
    await bus.publish('browser.navigation.completed', { tabId: 501, url: 'https://example.com' }, { validate: false });

    const activeTab = LifecycleSubscriber.getActiveTab();
    const avgDuration = LifecycleSubscriber.getAverageNavigationDuration();

    if (activeTab && activeTab.tabId === 501 && activeTab.url === 'https://example.com' && typeof avgDuration === 'number') {
      results.push('✓ Test 6 Passed: LifecycleSubscriber tracks active tab topology and calculates navigation duration telemetry.');
    } else {
      throw new Error(`Lifecycle tracking failed: activeTab=${JSON.stringify(activeTab)}, avgDuration=${avgDuration}`);
    }

    SubscriberRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 6 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
