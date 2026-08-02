/**
 * Certification Engine — WP-6.2
 * Evaluates an 8-point automated certification checklist before granting release approval.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ReleaseMetadata } from './release-metadata';
import { ChecksumGenerator } from './checksum-generator';

export interface CertificationGate {
  id: string;
  name: string;
  passed: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  details: string;
}

export interface CertificationResult {
  overallPassed: boolean;
  totalGates: number;
  passedGates: number;
  certifiedAt: string;
  gates: CertificationGate[];
  summary: string;
}

export class CertificationEngine {
  private projectRoot: string;
  private releaseDir: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.releaseDir = path.join(projectRoot, 'dist-release');
  }

  /**
   * Runs the 8-point production certification check.
   */
  public evaluate(metadata: ReleaseMetadata): CertificationResult {
    const gates: CertificationGate[] = [];

    // 1. Build PASS
    const distPath = path.join(this.projectRoot, 'dist');
    const distExists = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'manifest.json'));
    gates.push({
      id: 'GATE-01',
      name: 'Production Build',
      passed: distExists && metadata.qualityGates.productionBuild,
      severity: 'CRITICAL',
      details: distExists ? 'Vite production build output confirmed in dist/' : 'dist/ or dist/manifest.json missing'
    });

    // 2. Type Check PASS
    gates.push({
      id: 'GATE-02',
      name: 'Type Checker (vue-tsc)',
      passed: metadata.qualityGates.typeCheck,
      severity: 'CRITICAL',
      details: metadata.qualityGates.typeCheck ? '0 TypeScript errors' : 'TypeScript compilation errors detected'
    });

    // 3. All Tests PASS
    gates.push({
      id: 'GATE-03',
      name: 'Test Suites & ESLint',
      passed: metadata.qualityGates.testSuitesPassed === metadata.qualityGates.totalTestSuites,
      severity: 'HIGH',
      details: `${metadata.qualityGates.testSuitesPassed} / ${metadata.qualityGates.totalTestSuites} quality gates passed`
    });

    // 4. Manifest Validation PASS
    const manifestValid = metadata.qualityGates.manifestValidation && distExists;
    gates.push({
      id: 'GATE-04',
      name: 'Manifest V3 Schema Validation',
      passed: manifestValid,
      severity: 'CRITICAL',
      details: manifestValid ? 'Manifest V3 structure validated' : 'Manifest V3 schema validation failed'
    });

    // 5. Bundle Size PASS (< 5MB compressed zip)
    const zipPath = path.join(this.releaseDir, 'extension.zip');
    let bundleSizePass = false;
    let bundleSizeDetails = 'Zip artifact not found';
    if (fs.existsSync(zipPath)) {
      const zipSize = fs.statSync(zipPath).size;
      const zipSizeMb = zipSize / (1024 * 1024);
      bundleSizePass = zipSizeMb <= 5.0;
      bundleSizeDetails = `Bundle size: ${zipSizeMb.toFixed(2)} MB (Limit: <= 5.00 MB)`;
    }
    gates.push({
      id: 'GATE-05',
      name: 'Bundle Size Metric',
      passed: bundleSizePass,
      severity: 'HIGH',
      details: bundleSizeDetails
    });

    // 6. Release Manifest PASS
    const releaseManifestPath = path.join(this.releaseDir, 'release-manifest.json');
    const releaseManifestExists = fs.existsSync(releaseManifestPath);
    gates.push({
      id: 'GATE-06',
      name: 'Release Manifest Integrity',
      passed: releaseManifestExists,
      severity: 'HIGH',
      details: releaseManifestExists ? 'release-manifest.json present' : 'release-manifest.json missing'
    });

    // 7. Checksum PASS
    const sha256Path = path.join(this.releaseDir, 'extension.zip.sha256');
    let checksumPass = false;
    if (fs.existsSync(zipPath) && fs.existsSync(sha256Path)) {
      const sha256Content = fs.readFileSync(sha256Path, 'utf8').trim().split(/\s+/)[0];
      checksumPass = ChecksumGenerator.verifyChecksum(zipPath, sha256Content, 'sha256');
    }
    gates.push({
      id: 'GATE-07',
      name: 'Cryptographic Checksum Verification',
      passed: checksumPass,
      severity: 'CRITICAL',
      details: checksumPass ? 'SHA-256 sidecar matches artifact' : 'Checksum mismatch or missing sidecar file'
    });

    // 8. Repository Health PASS
    const cleanRepo = metadata.repositoryHealth.isClean;
    gates.push({
      id: 'GATE-08',
      name: 'Repository Cleanliness Health',
      passed: cleanRepo,
      severity: 'MEDIUM',
      details: cleanRepo
        ? 'Git repository is clean'
        : `Uncommitted modifications detected (${metadata.repositoryHealth.uncommittedFiles} modified files)`
    });

    const passedGates = gates.filter((g) => g.passed).length;
    const overallPassed = gates.every((g) => g.passed || g.severity === 'MEDIUM');

    return {
      overallPassed,
      totalGates: gates.length,
      passedGates,
      certifiedAt: new Date().toISOString(),
      gates,
      summary: overallPassed
        ? `Certification SUCCESS: ${passedGates}/${gates.length} quality gates passed.`
        : `Certification FAILED: ${gates.length - passedGates} quality gates failed.`
    };
  }

  /**
   * Generates certification-report.md in dist-release/
   */
  public generateCertificationReport(result: CertificationResult, metadata: ReleaseMetadata): string {
    if (!fs.existsSync(this.releaseDir)) {
      fs.mkdirSync(this.releaseDir, { recursive: true });
    }

    const reportPath = path.join(this.releaseDir, 'certification-report.md');
    const badge = result.overallPassed ? '✅ PASSED' : '❌ FAILED';

    let markdown = `# Production Certification Report

## Status: ${badge}

- **Project**: ${metadata.projectName}
- **Version**: \`${metadata.version}\`
- **Certified At**: ${result.certifiedAt}
- **Score**: ${result.passedGates} / ${result.totalGates} Gates Passed

---

## Quality & Compliance Gates Checklist

| Check ID | Gate Name | Severity | Status | Verification Details |
| :--- | :--- | :--- | :--- | :--- |
`;

    for (const gate of result.gates) {
      const statusBadge = gate.passed ? '✅ PASS' : '❌ FAIL';
      markdown += `| **${gate.id}** | ${gate.name} | \`${gate.severity}\` | ${statusBadge} | ${gate.details} |\n`;
    }

    markdown += `
---

### Executive Sign-off
- **Certification Result**: ${result.summary}
- **Release Governance**: WP-6.2 Production Release Framework
`;

    fs.writeFileSync(reportPath, markdown, 'utf8');
    return reportPath;
  }
}
