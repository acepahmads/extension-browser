/**
 * Shadow Comparator & Pipeline Unit Verification Suite - WP-4 Stage 5
 */
import { ShadowComparator, ShadowComparisonReport } from './shadow.comparator';
import { ShadowMetrics } from './shadow.metrics';
import { ShadowPipeline } from './shadow.pipeline';
import { BusinessRegistry } from '../business.registry';
import { WorkspaceInput } from '../handlers/workspace.business-handler';
import { setEventBusFeatureFlags } from '../../../services/eventBusFacade';

export async function runShadowComparatorTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Shadow Comparator Unit Verification Suite...\n');

  // TEST 1: Identical Output Comparison
  try {
    ShadowMetrics.clear();
    const legacyData = { status: 'OK', id: 'ws_prod' };
    const businessResult = {
      success: true,
      data: { validated: true, workspaceId: 'ws_prod', matchPatternCount: 2, processedAt: Date.now() },
      executionTimeMs: 2,
      error: null
    };

    const report = ShadowComparator.compare('workspace.changed', 'tx_comp_01', legacyData, businessResult, 3, 2);
    ShadowMetrics.record(report);

    const summary = ShadowMetrics.getSummary();

    if (report.category === 'IDENTICAL' && summary.matched === 1 && summary.successRate === 100) {
      results.push('✓ Test 1 Passed: ShadowComparator detects IDENTICAL output parity cleanly.');
    } else {
      throw new Error(`Expected IDENTICAL report, got category: ${report.category}, Summary: ${JSON.stringify(summary)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Validation Mismatch Detection
  try {
    const legacyData = { status: 'OK' };
    const businessResult = {
      success: true,
      data: { validated: false, diagnosticMessages: ['Missing required workspace ID'], processedAt: Date.now() },
      executionTimeMs: 2,
      error: null
    };

    const report = ShadowComparator.compare('workspace.changed', 'tx_comp_02', legacyData, businessResult, 4, 2);
    ShadowMetrics.record(report);

    const summary = ShadowMetrics.getSummary();

    if (report.category === 'VALIDATION_MISMATCH' && summary.mismatch === 1) {
      results.push('✓ Test 2 Passed: ShadowComparator flags VALIDATION_MISMATCH correctly without throwing exceptions.');
    } else {
      throw new Error(`Expected VALIDATION_MISMATCH, got: ${report.category}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  // TEST 3: ShadowPipeline Non-Interruption & Feature Flag Gating
  try {
    BusinessRegistry.initDefaults();

    // Set flags to Shadow Mode
    setEventBusFeatureFlags({
      publishEnabled: true,
      subscribeEnabled: true,
      businessExecutionEnabled: true,
      legacyExecutionEnabled: true,
      shadowComparisonEnabled: true
    });

    const legacyCall = async () => ({ event: 'legacy_workspace_event', id: 'ws_prod_01' });

    const payload: WorkspaceInput = {
      workspace: {
        id: 'ws_prod_01',
        name: 'Prod WS',
        description: 'Production',
        application: 'SPPG',
        environment: 'production',
        baseUrl: 'https://example.com',
        matchPatterns: [],
        enabled: true,
        icon: 'icon',
        color: '#ffffff',
        tags: [],
        version: '1.0',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };

    const result = await ShadowPipeline.executeShadowFlow('workspace.changed', 'tx_pipe_01', payload, legacyCall);

    const metrics = ShadowMetrics.getSummary();

    if (result.event === 'legacy_workspace_event' && metrics.totalEvents >= 1) {
      results.push('✓ Test 3 Passed: ShadowPipeline executes dual flow and returns untouched legacy result.');
    } else {
      throw new Error(`Pipeline execution failed. Result: ${JSON.stringify(result)}, Metrics: ${JSON.stringify(metrics)}`);
    }

    // Reset flags to defaults
    setEventBusFeatureFlags({
      publishEnabled: true,
      subscribeEnabled: false,
      businessExecutionEnabled: false,
      legacyExecutionEnabled: true,
      shadowComparisonEnabled: false
    });
    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
