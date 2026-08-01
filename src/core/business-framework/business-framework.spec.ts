/**
 * Business Execution Framework Unit Verification Suite - WP-4 (Stages 1, 2, 3 & 4)
 */
import { BusinessRegistry } from './business.registry';
import { BusinessDispatcher } from './business.dispatcher';
import { BusinessHandler } from './business.handler';
import { BusinessError } from './business.error';
import { BusinessExecutionContext } from './business.context';
import { WorkspaceBusinessHandler, WorkspaceInput } from './handlers/workspace.business-handler';
import { StorageBusinessHandler, StorageInput } from './handlers/storage.business-handler';
import { LifecycleBusinessHandler, LifecycleInput } from './handlers/lifecycle.business-handler';

export async function runBusinessFrameworkTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Business Execution Framework Unit Verification Suite...\n');

  // TEST 1: BusinessRegistry Registration & Retrieval
  try {
    BusinessRegistry.clear();
    const testHandler: BusinessHandler = {
      handlerId: 'test_handler_01',
      targetTopic: 'workspace.changed',
      execute: async (ctx) => ({
        success: true,
        data: { id: ctx.payload },
        executionTimeMs: 5,
        error: null
      })
    };

    BusinessRegistry.register(testHandler);
    const handlers = BusinessRegistry.getHandlers('workspace.changed');

    if (handlers.length === 1 && handlers[0].handlerId === 'test_handler_01') {
      results.push('✓ Test 1 Passed: BusinessRegistry registers and retrieves BusinessHandlers cleanly.');
    } else {
      throw new Error(`Expected 1 handler for workspace.changed, got ${handlers.length}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Successful Execution via BusinessDispatcher
  try {
    const context: BusinessExecutionContext = {
      correlationId: 'tx_1001',
      topic: 'workspace.changed',
      timestamp: Date.now(),
      payload: 'ws_prod',
      attempt: 1
    };

    const res = await BusinessDispatcher.dispatch(context);
    if (res.length === 1 && res[0].success && (res[0].data as any).id === 'ws_prod') {
      results.push('✓ Test 2 Passed: BusinessDispatcher routes context and executes BusinessHandler successfully.');
    } else {
      throw new Error(`Execution failed: ${JSON.stringify(res)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  // TEST 3: Retry Policy on Recoverable Errors
  try {
    BusinessRegistry.clear();
    let executionAttempts = 0;

    const retryableHandler: BusinessHandler = {
      handlerId: 'test_retry_handler',
      targetTopic: 'storage.changed',
      execute: async (ctx) => {
        executionAttempts++;
        if (executionAttempts < 2) {
          return {
            success: false,
            data: null,
            executionTimeMs: 2,
            error: new BusinessError('TEMPORARY_LOCK', 'Storage busy', true)
          };
        }
        return {
          success: true,
          data: 'RECOVERED',
          executionTimeMs: 3,
          error: null
        };
      }
    };

    BusinessRegistry.register(retryableHandler);

    const retryContext: BusinessExecutionContext = {
      correlationId: 'tx_1002',
      topic: 'storage.changed',
      timestamp: Date.now(),
      payload: { key: 'theme' },
      attempt: 1
    };

    const res = await BusinessDispatcher.dispatch(retryContext);
    if (executionAttempts === 2 && res[0].success && res[0].data === 'RECOVERED') {
      results.push('✓ Test 3 Passed: BusinessDispatcher executes exponential backoff retry for recoverable errors.');
    } else {
      throw new Error(`Retry logic failed. Attempts: ${executionAttempts}, Result: ${JSON.stringify(res)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  // TEST 4: Stage 2 WorkspaceBusinessHandler Execution & Topic Rejection
  try {
    BusinessRegistry.initDefaults();

    const handler = new WorkspaceBusinessHandler('workspace.changed');

    // Valid workspace.changed execution
    const validCtx: BusinessExecutionContext<WorkspaceInput> = {
      correlationId: 'tx_ws_01',
      topic: 'workspace.changed',
      timestamp: Date.now(),
      payload: {
        workspace: {
          id: 'ws_test_01',
          name: 'Test Workspace',
          description: 'Test WS',
          application: 'SPPG',
          environment: 'production',
          baseUrl: 'https://example.com',
          matchPatterns: [{ id: 'p1', pattern: '*', enabled: true, priority: 1 }],
          enabled: true,
          icon: 'icon',
          color: '#ffffff',
          tags: [],
          version: '1.0',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      },
      attempt: 1
    };

    const validRes = await handler.execute(validCtx);

    // Invalid non-workspace topic execution
    const invalidCtx: BusinessExecutionContext<WorkspaceInput> = {
      correlationId: 'tx_invalid',
      topic: 'storage.changed',
      timestamp: Date.now(),
      payload: {},
      attempt: 1
    };

    const invalidRes = await handler.execute(invalidCtx);

    if (
      validRes.success &&
      validRes.data?.workspaceId === 'ws_test_01' &&
      validRes.data?.matchPatternCount === 1 &&
      !invalidRes.success &&
      invalidRes.error?.errorCode === 'INVALID_DOMAIN_TOPIC'
    ) {
      results.push('✓ Test 4 Passed: WorkspaceBusinessHandler validates workspace topics and rejects non-workspace topics cleanly.');
    } else {
      throw new Error(`WorkspaceBusinessHandler test failed. Valid: ${JSON.stringify(validRes)}, Invalid: ${JSON.stringify(invalidRes)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 4 Failed: ${err.message}`);
  }

  // TEST 5: Stage 3 StorageBusinessHandler Validation & Duplicate Key Detection
  try {
    BusinessRegistry.initDefaults();

    const handler = new StorageBusinessHandler('storage.changed');

    // Valid storage.changed payload
    const validCtx: BusinessExecutionContext<StorageInput> = {
      correlationId: 'tx_st_01',
      topic: 'storage.changed',
      timestamp: Date.now(),
      payload: {
        keys: ['theme', 'activeWorkspaceId'],
        areaName: 'local'
      },
      attempt: 1
    };

    const validRes = await handler.execute(validCtx);

    // Payload with duplicate keys
    const dupCtx: BusinessExecutionContext<StorageInput> = {
      correlationId: 'tx_st_dup',
      topic: 'storage.changed',
      timestamp: Date.now(),
      payload: {
        keys: ['theme', 'theme', 'activeWorkspaceId'],
        areaName: 'local'
      },
      attempt: 1
    };

    const dupRes = await handler.execute(dupCtx);

    // Invalid non-storage topic execution
    const invalidCtx: BusinessExecutionContext<StorageInput> = {
      correlationId: 'tx_invalid_st',
      topic: 'workspace.changed',
      timestamp: Date.now(),
      payload: {},
      attempt: 1
    };

    const invalidRes = await handler.execute(invalidCtx);

    if (
      validRes.success &&
      validRes.data?.validated === true &&
      validRes.data?.changedKeyCount === 2 &&
      dupRes.success &&
      dupRes.data?.hasDuplicateKeys === true &&
      !invalidRes.success &&
      invalidRes.error?.errorCode === 'INVALID_DOMAIN_TOPIC'
    ) {
      results.push('✓ Test 5 Passed: StorageBusinessHandler validates storage payloads, detects duplicate keys, and rejects non-storage topics.');
    } else {
      throw new Error(`StorageBusinessHandler test failed. Valid: ${JSON.stringify(validRes)}, Dup: ${JSON.stringify(dupRes)}, Invalid: ${JSON.stringify(invalidRes)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 5 Failed: ${err.message}`);
  }

  // TEST 6: Stage 4 LifecycleBusinessHandler Execution & Navigation Telemetry
  try {
    BusinessRegistry.initDefaults();

    const handler = new LifecycleBusinessHandler('browser.navigation.completed');

    // Valid navigation completed context
    const navCtx: BusinessExecutionContext<LifecycleInput> = {
      correlationId: 'tx_nav_01',
      topic: 'browser.navigation.completed',
      timestamp: Date.now(),
      payload: {
        tabId: 101,
        windowId: 1,
        url: 'https://example.com/page',
        startTime: 1000,
        endTime: 1450
      },
      attempt: 1
    };

    const navRes = await handler.execute(navCtx);

    // Invalid non-lifecycle topic execution
    const invalidCtx: BusinessExecutionContext<LifecycleInput> = {
      correlationId: 'tx_invalid_lc',
      topic: 'storage.changed',
      timestamp: Date.now(),
      payload: {},
      attempt: 1
    };

    const invalidRes = await handler.execute(invalidCtx);

    if (
      navRes.success &&
      navRes.data?.domain === 'navigation' &&
      navRes.data?.tabId === 101 &&
      navRes.data?.navigationDurationMs === 450 &&
      !invalidRes.success &&
      invalidRes.error?.errorCode === 'INVALID_DOMAIN_TOPIC'
    ) {
      results.push('✓ Test 6 Passed: LifecycleBusinessHandler validates lifecycle payloads, calculates navigation duration, and rejects non-lifecycle topics.');
    } else {
      throw new Error(`LifecycleBusinessHandler test failed. Nav: ${JSON.stringify(navRes)}, Invalid: ${JSON.stringify(invalidRes)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 6 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
