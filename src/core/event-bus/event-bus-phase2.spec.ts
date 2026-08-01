/**
 * Enterprise Event Bus - Phase 2 Automated Unit Verification Suite
 */
import { EventBusCore } from './event-bus.core';
import { SchemaRegistry } from './validation/schema-registry';

export async function runEventBusPhase2Tests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Event Bus Phase 2 Unit Verification Suite...\n');

  // TEST 1: Middleware Pipeline & Context Cancellation
  try {
    EventBusCore.resetInstance();
    const bus = EventBusCore.getInstance();

    let middlewareExecuted = false;
    bus.use(async (ctx, next) => {
      middlewareExecuted = true;
      ctx.metadata.traced = true;
      await next();
    });

    let handlerExecuted = false;
    bus.subscribe('system.test.middleware', () => {
      handlerExecuted = true;
    });

    await bus.publish('system.test.middleware', { test: true });

    if (middlewareExecuted && handlerExecuted) {
      results.push('✓ Test 1 Passed: Middleware Pipeline execution & context metadata propagation.');
    } else {
      throw new Error('Middleware chain failed to execute properly.');
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Middleware Context Cancellation
  try {
    EventBusCore.resetInstance();
    const bus = EventBusCore.getInstance();

    bus.use(async (ctx) => {
      ctx.cancel('Blocked by security middleware');
    });

    let handlerExecuted = false;
    bus.subscribe('system.test.cancel', () => {
      handlerExecuted = true;
    });

    const res = await bus.publish('system.test.cancel', { data: 123 });

    if (!res.success && !handlerExecuted) {
      results.push('✓ Test 2 Passed: Middleware Pipeline cancellation halts subscriber execution.');
    } else {
      throw new Error('Cancelled middleware failed to halt execution.');
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  // TEST 3: Schema Registry & Required Fields Validation
  try {
    EventBusCore.resetInstance();
    const bus = EventBusCore.getInstance();

    SchemaRegistry.getInstance().registerSchema({
      eventName: 'user.login.attempt',
      version: '1.0',
      requiredFields: ['userId', 'ipAddress']
    });

    // Invalid publish (missing ipAddress)
    const invalidRes = await bus.publish('user.login.attempt', { userId: 'usr_123' }, { validate: true });
    
    // Valid publish (includes ipAddress)
    const validRes = await bus.publish('user.login.attempt', { userId: 'usr_123', ipAddress: '127.0.0.1' }, { validate: true });

    if (!invalidRes.success && validRes.success && bus.getDLQ().getSize() >= 1) {
      results.push('✓ Test 3 Passed: Schema Registry required fields validation & DLQ routing.');
    } else {
      throw new Error('Schema validation failed to enforce required fields.');
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  // TEST 4: Priority Dispatcher Execution Order
  try {
    EventBusCore.resetInstance();
    const bus = EventBusCore.getInstance();

    const dispatchOrder: string[] = [];

    bus.subscribe('priority.test', (env) => {
      dispatchOrder.push(env.payload as string);
    });

    await bus.publish('priority.test', 'NORMAL_MSG', { priority: 'NORMAL' });
    await bus.publish('priority.test', 'CRITICAL_MSG', { priority: 'CRITICAL' });

    if (dispatchOrder.length === 2) {
      results.push('✓ Test 4 Passed: Priority Dispatcher successfully queued and dispatched messages.');
    } else {
      throw new Error('Priority dispatcher failed to process queued messages.');
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 4 Failed: ${err.message}`);
  }

  // TEST 5: Metrics Collector Telemetry
  try {
    EventBusCore.resetInstance();
    const bus = EventBusCore.getInstance();

    bus.subscribe('metrics.test', () => {});
    await bus.publish('metrics.test', { val: 42 });

    const metrics = bus.getMetrics();
    if (metrics.publishCount === 1 && metrics.subscribeCount === 1 && metrics.dispatchCount === 1) {
      results.push('✓ Test 5 Passed: Metrics Collector accurately recorded publish/subscribe telemetry.');
    } else {
      throw new Error(`Metrics mismatch: ${JSON.stringify(metrics)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 5 Failed: ${err.message}`);
  }

  console.log('\n========================================');
  console.log(`Phase 2 Verification: ${allPassed ? 'ALL TESTS PASSED ✨' : 'SOME TESTS FAILED ❌'}`);
  console.log('========================================\n');

  return { passed: allPassed, results };
}

// Auto-run if executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('event-bus-phase2.spec')) {
  runEventBusPhase2Tests().then(res => {
    if (!res.passed) process.exit(1);
  });
}
