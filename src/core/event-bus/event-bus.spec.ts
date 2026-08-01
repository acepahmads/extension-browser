/**
 * Event Bus Core Foundation Unit Verification Tests
 */
import { EventBusCore } from './event-bus.core';

export async function runEventBusUnitTests(): Promise<{ passed: boolean; logs: string[] }> {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);

  try {
    log('Starting Event Bus Phase 1 Core Foundation Unit Verification...');
    EventBusCore.resetInstance();
    const eventBus = EventBusCore.getInstance();

    // Test 1: Subscribe & Publish
    let receivedPayload: unknown = null;
    const sub1 = eventBus.subscribe<{ message: string }>('system.lifecycle.started', (evt) => {
      receivedPayload = evt.payload;
    });

    const pubResult = await eventBus.publish('system.lifecycle.started', { message: 'Engine Active', timestamp: Date.now() });

    if (!pubResult.success || pubResult.event.version !== '1.0') {
      throw new Error('Publish failed or envelope version != 1.0');
    }
    if (!receivedPayload || (receivedPayload as any).message !== 'Engine Active') {
      throw new Error('Subscriber failed to receive published payload');
    }
    log('✓ Test 1 Passed: Publish & Subscribe verified with Envelope version 1.0.');

    // Test 2: Wildcard Subscribe
    let wildcardHits = 0;
    eventBus.subscribe('workspace.*', () => {
      wildcardHits += 1;
    });

    await eventBus.publish('workspace.changed', { id: 'ws_1' });
    await eventBus.publish('workspace.detected', { id: 'ws_2' });

    if (wildcardHits !== 2) {
      throw new Error(`Wildcard subscription failed. Expected 2 hits, got ${wildcardHits}`);
    }
    log('✓ Test 2 Passed: Wildcard pattern matching ("workspace.*") verified.');

    // Test 3: Once Subscription
    let onceHits = 0;
    eventBus.once('navigation.completed', () => {
      onceHits += 1;
    });

    await eventBus.publish('navigation.completed', { url: 'https://example.com' });
    await eventBus.publish('navigation.completed', { url: 'https://example.com/2' });

    if (onceHits !== 1) {
      throw new Error(`Once subscription failed. Expected 1 hit, got ${onceHits}`);
    }
    log('✓ Test 3 Passed: Once subscription self-unsubscription verified.');

    // Test 4: Unsubscribe
    let sub2Hits = 0;
    const sub2 = eventBus.subscribe('storage.updated', () => {
      sub2Hits += 1;
    });

    await eventBus.publish('storage.updated', { key: 'theme' });
    sub2.unsubscribe();
    await eventBus.publish('storage.updated', { key: 'theme' });

    if (sub2Hits !== 1) {
      throw new Error(`Unsubscribe failed. Expected 1 hit before unsubscribe, got ${sub2Hits}`);
    }
    log('✓ Test 4 Passed: Unsubscribe mechanism verified.');

    sub1.unsubscribe();
    log('All Event Bus Phase 1 Unit Verifications PASSED successfully!');
    return { passed: true, logs };
  } catch (err: any) {
    log(`❌ Unit Verification Failed: ${err?.message || err}`);
    return { passed: false, logs };
  }
}
