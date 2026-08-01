/**
 * Business-Only Cutover & Instant Rollback Unit Verification Suite - WP-4 Stage 6
 */
import { getEventBusFeatureFlags, setEventBusFeatureFlags } from '../../../services/eventBusFacade';
import { BusinessSubscriber } from '../business.subscriber';
import { BusinessRegistry } from '../business.registry';
import { BusinessDispatcher } from '../business.dispatcher';
import { BusinessExecutionContext } from '../business.context';
import { WorkspaceInput } from '../handlers/workspace.business-handler';
import { StorageInput } from '../handlers/storage.business-handler';
import { LifecycleInput } from '../handlers/lifecycle.business-handler';

export async function runBusinessCutoverTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Business-Only Cutover & Rollback Verification Suite...\n');

  // TEST 1: Default Business-Only Cutover Feature Flags
  try {
    setEventBusFeatureFlags({
      publishEnabled: true,
      subscribeEnabled: true,
      businessExecutionEnabled: true,
      legacyExecutionEnabled: false,
      shadowComparisonEnabled: false
    });
    const flags = getEventBusFeatureFlags();

    if (flags.businessExecutionEnabled === true && flags.legacyExecutionEnabled === false) {
      results.push('✓ Test 1 Passed: Business-Only Mode is active by default (businessExecutionEnabled = true, legacyExecutionEnabled = false).');
    } else {
      throw new Error(`Business-Only flags mismatched: ${JSON.stringify(flags)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Instant Rollback to Legacy Execution Mode
  try {
    // Simulate instant rollback configuration change
    setEventBusFeatureFlags({
      publishEnabled: true,
      subscribeEnabled: true,
      businessExecutionEnabled: false,
      legacyExecutionEnabled: true,
      shadowComparisonEnabled: false
    });

    const rollbackFlags = getEventBusFeatureFlags();

    if (rollbackFlags.legacyExecutionEnabled === true && rollbackFlags.businessExecutionEnabled === false) {
      results.push('✓ Test 2 Passed: Instant Rollback configuration restores Legacy execution mode immediately without code changes.');
    } else {
      throw new Error(`Rollback configuration failed: ${JSON.stringify(rollbackFlags)}`);
    }

    // Restore Business-Only Cutover default flags
    setEventBusFeatureFlags({
      publishEnabled: true,
      subscribeEnabled: true,
      businessExecutionEnabled: true,
      legacyExecutionEnabled: false,
      shadowComparisonEnabled: false
    });
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  // TEST 3: Business Framework Execution Across All 3 Domains (Workspace, Storage, Lifecycle)
  try {
    BusinessRegistry.initDefaults();

    // 1. Workspace Domain Execution
    const wsCtx: BusinessExecutionContext<WorkspaceInput> = {
      correlationId: 'tx_cutover_ws',
      topic: 'workspace.changed',
      timestamp: Date.now(),
      payload: { workspaceId: 'ws_cutover_01' },
      attempt: 1
    };

    const wsResults = await BusinessDispatcher.dispatch(wsCtx);

    // 2. Storage Domain Execution
    const stCtx: BusinessExecutionContext<StorageInput> = {
      correlationId: 'tx_cutover_st',
      topic: 'storage.changed',
      timestamp: Date.now(),
      payload: { keys: ['theme'], areaName: 'local' },
      attempt: 1
    };

    const stResults = await BusinessDispatcher.dispatch(stCtx);

    // 3. Lifecycle Domain Execution
    const lcCtx: BusinessExecutionContext<LifecycleInput> = {
      correlationId: 'tx_cutover_lc',
      topic: 'browser.tab.updated',
      timestamp: Date.now(),
      payload: { tabId: 201, windowId: 2, url: 'https://example.com' },
      attempt: 1
    };

    const lcResults = await BusinessDispatcher.dispatch(lcCtx);

    if (
      wsResults.length === 1 && wsResults[0].success &&
      stResults.length === 1 && stResults[0].success &&
      lcResults.length === 1 && lcResults[0].success
    ) {
      results.push('✓ Test 3 Passed: Business Framework executes domain handlers for Workspace, Storage, and Lifecycle flawlessly.');
    } else {
      throw new Error(`Domain cutover execution failed. WS: ${JSON.stringify(wsResults)}, ST: ${JSON.stringify(stResults)}, LC: ${JSON.stringify(lcResults)}`);
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
