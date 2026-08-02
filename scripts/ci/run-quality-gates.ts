/**
 * Continuous Integration Quality Gates Runner — WP-6.1
 * Executes 5 mandatory quality gates before release packaging:
 * 1. Type Check (vue-tsc --noEmit)
 * 2. Production Build (vite build)
 * 3. Test Suites Matrix (11 / 11 Verification Suites)
 * 4. Chrome MV3 Manifest & Asset Integrity Validation
 * 5. Bundle Size Check (< 15 MB Threshold)
 */

import { execSync } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { runProductionIntegrationTests } from '../../src/core/integration/integration.spec';
import { runObservabilityPlatformTests } from '../../src/core/observability/observability.spec';
import { runReliabilityFrameworkTests } from '../../src/core/reliability/reliability.spec';
import { runPerformanceBenchmarkTests } from '../../src/core/performance/benchmark.spec';
import { runBusinessCutoverTests } from '../../src/core/business-framework/cutover/business-cutover.spec';
import { runBusinessFrameworkTests } from '../../src/core/business-framework/business-framework.spec';
import { runShadowValidationTests } from '../../src/core/business-framework/shadow/shadow-validation.spec';
import { runShadowComparatorTests } from '../../src/core/business-framework/shadow/shadow-comparator.spec';
import { runEventBusUnitTests } from '../../src/core/event-bus/event-bus.spec';
import { runSubscriberTests } from '../../src/core/event-bus/subscribers/subscriber.spec';
import { runEventBusPhase2Tests } from '../../src/core/event-bus/event-bus-phase2.spec';
import { ExtensionBundler } from '../release/bundle-extension';

export interface QualityGateResults {
  allPassed: boolean;
  typeCheckPassed: boolean;
  buildPassed: boolean;
  testSuitesPassed: number;
  totalTestSuites: number;
  manifestValid: boolean;
  bundleSizeValid: boolean;
  errors: string[];
}

export async function runQualityGates(): Promise<QualityGateResults> {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../');
  const errors: string[] = [];
  let typeCheckPassed = false;
  let buildPassed = false;
  let testSuitesPassed = 0;
  let manifestValid = false;
  let bundleSizeValid = false;

  console.log('====================================================');
  console.log('🛡️ EXECUTING CONTINUOUS INTEGRATION QUALITY GATES');
  console.log('====================================================\n');

  // GATE 1: Type Check
  console.log('--- GATE 1: TypeScript & Vue Type Check ---');
  try {
    execSync('npm run type-check', { cwd: projectRoot, stdio: 'inherit' });
    typeCheckPassed = true;
    console.log('✅ Gate 1 PASSED: vue-tsc --noEmit (0 Errors)\n');
  } catch (err) {
    errors.push('Gate 1 Failed: vue-tsc --noEmit returned compilation errors');
    console.error('❌ Gate 1 FAILED: Type check failed\n');
  }

  // GATE 2: Production Build
  console.log('--- GATE 2: Production Vite Build ---');
  try {
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    buildPassed = true;
    console.log('✅ Gate 2 PASSED: vite build (Clean Production Bundle)\n');
  } catch (err) {
    errors.push('Gate 2 Failed: vite build failed');
    console.error('❌ Gate 2 FAILED: Build failed\n');
  }

  // GATE 3: 11 Verification Test Suites
  console.log('--- GATE 3: Test Matrix Execution (11 Suites) ---');
  const testSuites = [
    { name: 'Production Integration Layer (WP-5.4)', fn: runProductionIntegrationTests },
    { name: 'Observability Platform (WP-5.3)', fn: runObservabilityPlatformTests },
    { name: 'Reliability & Fault Tolerance (WP-5.2)', fn: runReliabilityFrameworkTests },
    { name: 'Performance Benchmark (WP-5.1)', fn: runPerformanceBenchmarkTests },
    { name: 'Business Cutover & Rollback', fn: runBusinessCutoverTests },
    { name: 'Business Framework Core', fn: runBusinessFrameworkTests },
    { name: 'Shadow Validation Campaign', fn: runShadowValidationTests },
    { name: 'Shadow Comparator Engine', fn: runShadowComparatorTests },
    { name: 'EventBus Core Unit', fn: runEventBusUnitTests },
    { name: 'EventBus Subscriber Registry', fn: runSubscriberTests },
    { name: 'EventBus Phase 2 Pipeline', fn: runEventBusPhase2Tests }
  ];

  for (const suite of testSuites) {
    try {
      const res = await suite.fn();
      let passed = false;
      if (typeof res === 'object' && res !== null) {
        passed = (res as any).passed === true;
      } else {
        passed = res === true;
      }

      if (passed) {
        testSuitesPassed++;
      } else {
        errors.push(`Gate 3 Failed: ${suite.name} suite failed`);
      }
    } catch (err: any) {
      errors.push(`Gate 3 Exception in ${suite.name}: ${err?.message || err}`);
    }
  }

  if (testSuitesPassed === testSuites.length) {
    console.log(`✅ Gate 3 PASSED: 11 / 11 Test Suites PASSED (100% Success Rate)\n`);
  } else {
    console.error(`❌ Gate 3 FAILED: Only ${testSuitesPassed} / 11 Test Suites Passed\n`);
  }

  // GATE 4 & 5: Manifest V3 & Asset Integrity + Bundle Size Check
  console.log('--- GATE 4 & 5: Manifest V3 Validation & Bundle Size Guard ---');
  const bundler = new ExtensionBundler(projectRoot);
  const manifestRes = bundler.validateManifest();
  const assetRes = bundler.validateAssets(manifestRes.manifest);

  manifestValid = manifestRes.valid && assetRes.valid;
  if (manifestValid) {
    console.log('✅ Gate 4 PASSED: Chrome Manifest V3 & Asset Integrity Verified\n');
  } else {
    const manifestErrs = [...manifestRes.errors, ...assetRes.errors];
    errors.push(...manifestErrs.map((e) => `Gate 4 Failed: ${e}`));
    console.error(`❌ Gate 4 FAILED: Manifest/Asset Validation Errors:`, manifestErrs, '\n');
  }

  const bundleRes = bundler.packageExtension();
  bundleSizeValid = bundleRes.valid;
  if (bundleSizeValid) {
    console.log(`✅ Gate 5 PASSED: Bundle Size Guard PASS (${bundleRes.zipSizeFormatted} < 15 MB)\n`);
  } else {
    errors.push(...bundleRes.errors.map((e) => `Gate 5 Failed: ${e}`));
    console.error(`❌ Gate 5 FAILED: Bundle packaging/size errors:`, bundleRes.errors, '\n');
  }

  const allPassed =
    typeCheckPassed &&
    buildPassed &&
    testSuitesPassed === testSuites.length &&
    manifestValid &&
    bundleSizeValid;

  console.log('====================================================');
  if (allPassed) {
    console.log('🎉 ALL QUALITY GATES PASSED (5/5 PASSED)');
  } else {
    console.error('💥 QUALITY GATES FAILED:', errors.length, 'Error(s)');
  }
  console.log('====================================================\n');

  return {
    allPassed,
    typeCheckPassed,
    buildPassed,
    testSuitesPassed,
    totalTestSuites: testSuites.length,
    manifestValid,
    bundleSizeValid,
    errors
  };
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)) {
  runQualityGates()
    .then((res) => {
      if (!res.allPassed) {
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Quality gates execution error:', err);
      process.exit(1);
    });
}
