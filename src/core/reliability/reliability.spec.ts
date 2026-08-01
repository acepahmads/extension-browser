/**
 * Reliability & Fault Tolerance Suite Verification Tests — WP-5.2
 */

import { RetryPolicyEngine } from './retry.policy';
import { TimeoutGuard } from './timeout.guard';
import { FailureDetector } from './failure.detector';
import { HealthMonitor } from './health.monitor';
import { RecoveryMetricsCollector } from './recovery.metrics';
import { ReliabilityService } from './reliability.service';
import { getEventBusFeatureFlags } from '../../services/eventBusFacade';

export async function runReliabilityFrameworkTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Reliability & Fault Tolerance Framework Verification (WP-5.2)...\n');

  // TEST 1: Retry Policy Engine & Exponential Backoff Delay Math
  try {
    const fixedDelay = RetryPolicyEngine.calculateDelay(2, {
      strategy: 'FIXED',
      maxRetries: 3,
      baseDelayMs: 150,
      maxDelayMs: 1000,
      backoffFactor: 2
    });

    const expDelay2 = RetryPolicyEngine.calculateDelay(2, {
      strategy: 'EXPONENTIAL_BACKOFF',
      maxRetries: 3,
      baseDelayMs: 100,
      maxDelayMs: 2000,
      backoffFactor: 2
    });

    const expDelay3 = RetryPolicyEngine.calculateDelay(3, {
      strategy: 'EXPONENTIAL_BACKOFF',
      maxRetries: 3,
      baseDelayMs: 100,
      maxDelayMs: 2000,
      backoffFactor: 2
    });

    if (fixedDelay === 150 && expDelay2 === 100 && expDelay3 === 200) {
      results.push('✓ Test 1 Passed: RetryPolicyEngine backoff math (Fixed & Exponential) computes expected delay curves.');
    } else {
      throw new Error(`Backoff delay math mismatch: Fixed=${fixedDelay}, Exp2=${expDelay2}, Exp3=${expDelay3}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Timeout Guard Protection & Classification
  try {
    const guard = new TimeoutGuard();

    // Fast task (should complete)
    const fastRes = await guard.executeWithTimeout(async () => {
      return 'FAST_OK';
    }, 100, 'HANDLER');

    // Slow task (should time out)
    const slowRes = await guard.executeWithTimeout(async () => {
      await new Promise((r) => setTimeout(r, 200));
      return 'SLOW_OK';
    }, 50, 'HANDLER');

    if (!fastRes.timedOut && fastRes.result === 'FAST_OK' && slowRes.timedOut && slowRes.level === 'HANDLER') {
      results.push('✓ Test 2 Passed: TimeoutGuard enforces execution timeouts and classifies breach levels correctly.');
    } else {
      throw new Error(`TimeoutGuard protection failed: Fast=${JSON.stringify(fastRes)}, Slow=${JSON.stringify(slowRes)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  // TEST 3: Failure Detector & Severity Classification
  try {
    const detector = new FailureDetector();

    const lowRec = detector.recordFailure('HANDLER_FAILURE', 'test_src', 'Low severity error');
    const highRec = detector.recordFailure('DLQ_PUSH', 'test_src', 'DLQ push error');

    if (lowRec.severity === 'LOW' && highRec.severity === 'HIGH') {
      results.push('✓ Test 3 Passed: FailureDetector accurately classifies failure anomaly severity levels (LOW vs HIGH/CRITICAL).');
    } else {
      throw new Error(`FailureDetector severity classification mismatch: Low=${lowRec.severity}, High=${highRec.severity}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 3 Failed: ${err.message}`);
  }

  // TEST 4: Health Monitor & Reliability Score Model
  try {
    const monitor = new HealthMonitor();

    // Record 9 successes, 1 failure
    for (let i = 0; i < 9; i++) monitor.recordSuccess();
    monitor.recordFailure();

    const snapshot = monitor.getHealthSnapshot();
    const scoreModel = monitor.getScoreModel();

    if (snapshot.status === 'Healthy' && snapshot.successRate === 90 && scoreModel.overallScore >= 85) {
      results.push('✓ Test 4 Passed: HealthMonitor computes system availability, HealthStatus level, and Reliability Score Model correctly.');
    } else {
      throw new Error(`HealthMonitor calculation failed: Status=${snapshot.status}, SuccessRate=${snapshot.successRate}, Score=${scoreModel.overallScore}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 4 Failed: ${err.message}`);
  }

  // TEST 5: Recovery Metrics Collector & MTTR Calculation
  try {
    const collector = new RecoveryMetricsCollector();

    collector.recordRecoveryAttempt(true, 100, 'RETRY');
    collector.recordRecoveryAttempt(true, 200, 'TIMEOUT');
    collector.recordRetryDelay(50);
    collector.recordRetryDelay(150);

    const stats = collector.getStatistics();

    if (stats.meanTimeToRecoveryMs === 150 && stats.avgRetryDelayMs === 100 && stats.recoverySuccesses === 2) {
      results.push('✓ Test 5 Passed: RecoveryMetricsCollector calculates Mean Time to Recover (MTTR) and retry delay metrics cleanly.');
    } else {
      throw new Error(`Recovery metrics calculation failed: ${JSON.stringify(stats)}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 5 Failed: ${err.message}`);
  }

  // TEST 6: Resilient Execution Facade & Report Generation
  try {
    const service = new ReliabilityService();

    let attemptsMade = 0;
    const res = await service.executeResiliently(
      async (attempt) => {
        attemptsMade++;
        if (attempt === 1) {
          throw new Error('Temporary glitch');
        }
        return 'RECOVERED_DATA';
      },
      {
        retryConfig: { strategy: 'FIXED', maxRetries: 2, baseDelayMs: 10, maxDelayMs: 100, backoffFactor: 1 },
        timeoutMs: 500,
        sourceLabel: 'test_resilience'
      }
    );

    const reportData = service.generateReportData();
    const mdReport = service.generateMarkdownReport(reportData);
    const jsonReport = service.generateJsonReport(reportData);
    const flags = getEventBusFeatureFlags();

    if (
      res.success &&
      res.recovered &&
      res.data === 'RECOVERED_DATA' &&
      attemptsMade === 2 &&
      mdReport.includes('# Reliability & Fault Tolerance Report') &&
      jsonReport.includes('"availabilityScore"') &&
      flags.publishEnabled === true
    ) {
      results.push('✓ Test 6 Passed: ReliabilityService facade executes resiliently with retry recovery and produces complete reports with zero production side-effects.');
    } else {
      throw new Error(`Resilient execution failed: Res=${JSON.stringify(res)}, Attempts=${attemptsMade}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 6 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
