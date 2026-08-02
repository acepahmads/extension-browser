/**
 * Master Security Orchestrator
 * Work Package 6.4 — Release Engineering
 */

import path from 'path';
import { runDependencyAudit } from './dependency-audit.js';
import { runSecretScan } from './secret-scanner.js';
import { runLicenseAudit } from './license-audit.js';
import { generateSBOM } from './sbom-generator.js';
import { runIntegrityValidation } from './integrity-validator.js';
import { runSigningEngine } from './signing-engine.js';
import { generateProvenance } from './provenance-generator.js';
import { generateSecurityReports } from './security-report.js';

export function runSecurityPipeline(projectRoot: string) {
  console.log('\n====================================================');
  console.log('  SPPG Release Security & Supply Chain Framework  ');
  console.log('====================================================\n');

  console.log('[Step 1/8] Running Dependency Audit Engine...');
  const depReport = runDependencyAudit(projectRoot);
  console.log(`  └─ Dependency Audit Status: ${depReport.status}`);

  console.log('[Step 2/8] Running Repository Secret Scanner...');
  const secretReport = runSecretScan(projectRoot);
  console.log(`  └─ Secret Scan Status: ${secretReport.status} (${secretReport.secretsFoundCount} secrets found)`);

  console.log('[Step 3/8] Running License Compliance Audit...');
  const licenseReport = runLicenseAudit(projectRoot);
  console.log(`  └─ License Audit Status: ${licenseReport.status} (${licenseReport.totalPackages} packages audited)`);

  console.log('[Step 4/8] Generating Software Bill of Materials (SBOM)...');
  const sbom = generateSBOM(projectRoot);
  const sbomGenerated = sbom.components.length > 0;
  console.log(`  └─ SBOM Generated (${sbom.components.length} components)`);

  console.log('[Step 5/8] Running Cryptographic Integrity Validator...');
  const integrityReport = runIntegrityValidation(projectRoot);
  console.log(`  └─ Integrity Status: ${integrityReport.status}`);

  console.log('[Step 6/8] Executing Release Signing Engine Metadata Generator...');
  const signingMetadata = runSigningEngine(projectRoot, 'Enterprise');
  console.log(`  └─ Signing Profile: ${signingMetadata.profile} (Key ID: ${signingMetadata.keyId})`);

  console.log('[Step 7/8] Generating Build Provenance Metadata...');
  const provenance = generateProvenance(projectRoot);
  console.log(`  └─ Provenance Commit: ${provenance.gitCommit.slice(0, 7)}`);

  console.log('[Step 8/8] Synthesizing Security Reports & Evaluating Quality Gates...');
  const { scoreModel, summary } = generateSecurityReports(
    projectRoot,
    depReport,
    secretReport,
    licenseReport,
    sbomGenerated,
    integrityReport,
    signingMetadata,
    provenance
  );

  console.log('\n====================================================');
  console.log(`  SECURITY QUALITY SCORE: ${scoreModel.totalScore} / 100`);
  console.log(`  QUALITY GATES PASSED: ${scoreModel.qualityGates.filter(q => q.passed).length} / 10`);
  console.log(`  OVERALL PIPELINE STATUS: ${summary.overallStatus === 'PASS' ? '🟢 PASS' : '🔴 FAIL'}`);
  console.log('====================================================\n');

  if (!scoreModel.passed) {
    console.error('Security Quality Gate Score fell below required minimum 90!');
    process.exit(1);
  }
}

// CLI Execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('security-manager.ts')) {
  const root = process.cwd();
  runSecurityPipeline(root);
}
