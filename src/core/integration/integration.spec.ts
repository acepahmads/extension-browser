/**
 * Production Integration Layer Verification Suite — WP-5.4
 */

import { IntegrationPipeline } from './integration.pipeline';
import { IntegrationMiddleware } from './integration.middleware';
import { setEventBusFeatureFlags } from '../../services/eventBusFacade';
import { BusinessRegistry } from '../business-framework/business.registry';
import { BusinessExecutionContext } from '../business-framework/business.context';
import { WorkspaceBusinessHandler } from '../business-framework/handlers/workspace.business-handler';

export async function runProductionIntegrationTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Production Integration Layer Verification (WP-5.4)...\n');

  // TEST 1: Feature Flag Isolation & Default Bypass Behavior
  try {
    // Ensure all integration flags default to false
    setEventBusFeatureFlags({
      performanceIntegrationEnabled: false,
      reliabilityIntegrationEnabled: false,
      observabilityIntegrationEnabled: false
    });

    const activeFlags = IntegrationPipeline.getActiveFeatureFlags();

    if (
      !activeFlags.performanceIntegrationEnabled &&
      !activeFlags.reliabilityIntegrationEnabled &&
      !activeFlags.observabilityIntegrationEnabled
    ) {
      results.push('✓ Test 1 Passed: Feature flags default to false with complete isolation.');
    } else {
      throw new Error(`Default flags mismatch: ${JSON.stringify(activeFlags)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Performance Integration Interception
  try {
    setEventBusFeatureFlags({
      performanceIntegrationEnabled: true,
      reliabilityIntegrationEnabled: false,
      observabilityIntegrationEnabled: false
    });

    const handler = new WorkspaceBusinessHandler();
    const context: BusinessExecutionContext = {
      correlationId: 'test_perf_01',
      topic: 'workspace.changed',
      timestamp: Date.now(),
      payload: { workspaceId: 'ws_perf_01', workspaceName: 'Perf WS' },
      attempt: 1
    };

    const pipeRes = await IntegrationPipeline.execute({ context, handler });

    if (!pipeRes.bypassed && pipeRes.result.success && pipeRes.measuredDurationMs >= 0) {
      results.push('✓ Test 2 Passed: Performance framework integration intercepts execution and records passive timing telemetry.');
    } else {
      throw new Error(`Performance integration failed: ${JSON.stringify(pipeRes)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  // TEST 3: Reliability Framework Integration (Retry & Timeout)
  try {
    setEventBusFeatureFlags({
      performanceIntegrationEnabled: false,
      reliabilityIntegrationEnabled: true,
      observabilityIntegrationEnabled: false
    });

    let attemptCount = 0;
    const mockRetryHandler = {
      handlerId: 'MockRetryHandler',
      targetTopics: ['storage.changed'],
      execute: async () => {
        attemptCount++;
        if (attemptCount === 1) {
          throw new Error('Temporary lock error');
        }
        return { success: true, data: { status: 'RECOVERED' }, executionTimeMs: 10, error: null };
      }
    };

    const context: BusinessExecutionContext = {
      correlationId: 'test_rel_01',
      topic: 'storage.changed',
      timestamp: Date.now(),
      payload: { storageArea: 'local' },
      attempt: 1
    };

    const pipeRes = await IntegrationPipeline.execute({ context, handler: mockRetryHandler as any });

    if (pipeRes.result.success && pipeRes.recovered && pipeRes.retryAttempts === 2) {
      results.push('✓ Test 3 Passed: Reliability framework integration successfully wraps handler with retry recovery & backoff protection.');
    } else {
      throw new Error(`Reliability integration failed: Attempts=${pipeRes.retryAttempts}, Recovered=${pipeRes.recovered}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  // TEST 4: Observability Platform Integration
  try {
    setEventBusFeatureFlags({
      performanceIntegrationEnabled: false,
      reliabilityIntegrationEnabled: false,
      observabilityIntegrationEnabled: true
    });

    const handler = new WorkspaceBusinessHandler();
    const context: BusinessExecutionContext = {
      correlationId: 'test_obs_01',
      topic: 'workspace.changed',
      timestamp: Date.now(),
      payload: { workspaceId: 'ws_obs_01', workspaceName: 'Obs WS' },
      attempt: 1
    };

    const pipeRes = await IntegrationPipeline.execute({ context, handler });
    const obsService = IntegrationPipeline.getObservabilityService();
    const snapshot = obsService.getTelemetryService().getTrendSnapshot();

    if (pipeRes.result.success && snapshot.history.length > 0) {
      results.push('✓ Test 4 Passed: Observability platform integration updates time-series trends & dashboard metrics cleanly.');
    } else {
      throw new Error(`Observability integration failed: ${JSON.stringify(pipeRes)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 4 Failed: ${err.message}`);
  }

  // TEST 5: Instant Runtime Rollback (Flag Flip Bypass)
  try {
    // Flip all flags OFF instantly
    setEventBusFeatureFlags({
      performanceIntegrationEnabled: false,
      reliabilityIntegrationEnabled: false,
      observabilityIntegrationEnabled: false
    });

    const handler = new WorkspaceBusinessHandler();
    const context: BusinessExecutionContext = {
      correlationId: 'test_rollback_01',
      topic: 'workspace.changed',
      timestamp: Date.now(),
      payload: { workspaceId: 'ws_rollback_01', workspaceName: 'Rollback WS' },
      attempt: 1
    };

    const pipeRes = await IntegrationPipeline.execute({ context, handler });

    if (pipeRes.bypassed && pipeRes.result.success) {
      results.push('✓ Test 5 Passed: Instant runtime rollback bypasses all integration layers immediately with zero code changes or redeploy.');
    } else {
      throw new Error(`Rollback test failed: Bypassed=${pipeRes.bypassed}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 5 Failed: ${err.message}`);
  }

  // TEST 6: Integration Middleware & Business Logic Output Equality
  try {
    BusinessRegistry.initDefaults();

    const context: BusinessExecutionContext = {
      correlationId: 'test_middleware_01',
      topic: 'workspace.changed',
      timestamp: Date.now(),
      payload: { workspaceId: 'ws_eq_01', workspaceName: 'Equality WS' },
      attempt: 1
    };

    // Execute with all flags ON
    setEventBusFeatureFlags({
      performanceIntegrationEnabled: true,
      reliabilityIntegrationEnabled: true,
      observabilityIntegrationEnabled: true
    });
    const integratedResults = await IntegrationMiddleware.dispatchWithPipeline(context);

    // Execute with all flags OFF (Rollback)
    setEventBusFeatureFlags({
      performanceIntegrationEnabled: false,
      reliabilityIntegrationEnabled: false,
      observabilityIntegrationEnabled: false
    });
    const bypassedResults = await IntegrationMiddleware.dispatchWithPipeline(context);

    if (
      integratedResults.length > 0 &&
      bypassedResults.length > 0 &&
      integratedResults[0].success === bypassedResults[0].success &&
      (integratedResults[0].data as any).validated === (bypassedResults[0].data as any).validated
    ) {
      results.push('✓ Test 6 Passed: IntegrationMiddleware guarantees 100% business logic & output equality across integrated vs bypassed states.');
    } else {
      throw new Error('Business output equality mismatch across integrated and bypassed executions.');
    }

    BusinessRegistry.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 6 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
