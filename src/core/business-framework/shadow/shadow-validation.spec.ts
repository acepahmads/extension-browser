/**
 * Shadow Validation Campaign Unit Verification Suite - WP-4 Stage 5.5
 */
import { ShadowValidationService } from './shadow-validation.service';
import { ShadowMetrics } from './shadow.metrics';
import { ShadowComparator } from './shadow.comparator';

export async function runShadowValidationTests(): Promise<{ passed: boolean; results: string[] }> {
  const results: string[] = [];
  let allPassed = true;

  console.log('🧪 Starting Shadow Validation Campaign Unit Verification Suite...\n');

  // TEST 1: Health Score Algorithm Evaluation
  try {
    const perfect = ShadowValidationService.evaluateHealthScore(100);
    const excellent = ShadowValidationService.evaluateHealthScore(99.5);
    const good = ShadowValidationService.evaluateHealthScore(96);
    const warning = ShadowValidationService.evaluateHealthScore(92);
    const critical = ShadowValidationService.evaluateHealthScore(85);

    if (
      perfect.level === 'PERFECT' &&
      excellent.level === 'EXCELLENT' &&
      good.level === 'GOOD' &&
      warning.level === 'WARNING' &&
      critical.level === 'CRITICAL'
    ) {
      results.push('✓ Test 1 Passed: Health Score algorithm categorizes levels (PERFECT, EXCELLENT, GOOD, WARNING, CRITICAL) accurately.');
    } else {
      throw new Error(`Health Score evaluation failed: ${JSON.stringify({ perfect, excellent, good, warning, critical })}`);
    }
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 1 Failed: ${err.message}`);
  }

  // TEST 2: Migration Readiness Algorithm Evaluation
  try {
    ShadowMetrics.clear();

    // 100% matched events
    const rep1 = ShadowComparator.compare('workspace.changed', 'tx_v01', { ok: true }, { success: true, data: { validated: true }, executionTimeMs: 1, error: null }, 2, 1);
    ShadowMetrics.record(rep1);

    const report1 = ShadowValidationService.generateValidationReport();

    if (
      report1.summary.healthScore.level === 'PERFECT' &&
      report1.summary.migrationReadiness === 'READY FOR LEGACY REMOVAL' &&
      report1.formattedMarkdown.includes('PERFECT') &&
      report1.formattedJson.includes('READY FOR LEGACY REMOVAL')
    ) {
      results.push('✓ Test 2 Passed: Migration readiness evaluates READY FOR LEGACY REMOVAL when parity is 100%.');
    } else {
      throw new Error(`Migration readiness failed. Report: ${JSON.stringify(report1.summary)}`);
    }

    ShadowMetrics.clear();
  } catch (err: any) {
    allPassed = false;
    results.push(`❌ Test 2 Failed: ${err.message}`);
  }

  return { passed: allPassed, results };
}
