/**
 * Master Release Operations Orchestrator
 * Work Package 6.5 — Release Engineering
 */

import path from 'path';
import { runReleaseCandidateValidation } from './release-candidate.js';
import { promoteToGA } from './ga-manager.js';
import { runReleaseValidation } from './release-validator.js';
import { runDeploymentChecklist } from './deployment-checklist.js';
import { runPostReleaseMonitor } from './post-release-monitor.js';
import { runReleaseRetrospective } from './release-retrospective.js';
import { generateOperationsReports } from './operations-report.js';

export function runReleaseOperations(projectRoot: string) {
  console.log('\n====================================================');
  console.log('  SPPG VERSION 1.0 GENERAL AVAILABILITY (GA) RUNNER  ');
  console.log('====================================================\n');

  console.log('[Step 1/7] Running Release Candidate Validation...');
  const rcStatus = runReleaseCandidateValidation(projectRoot, 'Final_RC');
  console.log(`  └─ RC Stage: ${rcStatus.stage}, Status: ${rcStatus.status}`);

  console.log('[Step 2/7] Promoting Release Candidate to General Availability (GA)...');
  const gaManifest = promoteToGA(projectRoot);
  console.log(`  └─ GA Version Promoted: v${gaManifest.version} (${gaManifest.status})`);

  console.log('[Step 3/7] Running Dynamic Pre-Deployment Checklist...');
  const checklist = runDeploymentChecklist(projectRoot);
  console.log(`  └─ Checklist Status: ${checklist.status} (${checklist.passedChecks}/${checklist.totalChecks} checks passed)`);

  console.log('[Step 4/7] Running Comprehensive Release Payload Validation...');
  const validation = runReleaseValidation(projectRoot);
  console.log(`  └─ Release Payload Validation Status: ${validation.status}`);

  console.log('[Step 5/7] Executing Post-Release Health Monitor...');
  const { metrics, health } = runPostReleaseMonitor(projectRoot);
  console.log(`  └─ Post-Release Health Score: ${health.healthScore}/100`);

  console.log('[Step 6/7] Synthesizing Version 1.0 GA Release Retrospective...');
  const retrospective = runReleaseRetrospective(projectRoot);
  console.log(`  └─ Retrospective Generated for Version ${retrospective.version}`);

  console.log('[Step 7/7] Evaluating GA Quality Gates (GA-01 to GA-10)...');
  const { scoreModel, summary } = generateOperationsReports(
    projectRoot,
    rcStatus,
    gaManifest,
    checklist,
    validation,
    health,
    retrospective
  );

  console.log('\n====================================================');
  console.log(`  GA RELEASE QUALITY SCORE: ${scoreModel.totalScore} / 100`);
  console.log(`  QUALITY GATES PASSED: ${scoreModel.qualityGates.filter(q => q.passed).length} / 10`);
  console.log(`  OVERALL GA RELEASE STATUS: ${summary.overallStatus === 'PASS' ? '🟢 PASSED (VERSION 1.0 GA CERTIFIED)' : '🔴 FAIL'}`);
  console.log('====================================================\n');
}

// CLI Execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('release-operations.ts')) {
  const root = process.cwd();
  runReleaseOperations(root);
}
