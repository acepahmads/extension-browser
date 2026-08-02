/**
 * Security, Signing & Supply Chain Integrity Framework Types
 * Work Package 6.4 — Release Engineering
 */

export interface VulnerabilityItem {
  id: string;
  packageName: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  title: string;
  url?: string;
  patchedIn?: string;
}

export interface DependencyAuditReport {
  timestamp: string;
  totalDependencies: number;
  devDependenciesCount: number;
  duplicateCount: number;
  deprecatedCount: number;
  vulnerabilityCount: number;
  vulnerabilities: VulnerabilityItem[];
  duplicates: string[];
  deprecated: string[];
  status: 'PASS' | 'WARN' | 'FAIL';
}

export interface SecretMatch {
  ruleId: string;
  ruleName: string;
  file: string;
  line: number;
  matchSnippet: string;
  severity: 'high' | 'critical';
}

export interface SecretScanReport {
  timestamp: string;
  scannedFilesCount: number;
  secretsFoundCount: number;
  matches: SecretMatch[];
  status: 'PASS' | 'FAIL';
}

export interface DependencyLicenseInfo {
  name: string;
  version: string;
  license: string;
  repository?: string;
  compatible: boolean;
}

export interface LicenseAuditReport {
  timestamp: string;
  totalPackages: number;
  licenseCounts: Record<string, number>;
  unknownLicensesCount: number;
  incompatibleLicensesCount: number;
  packages: DependencyLicenseInfo[];
  status: 'PASS' | 'WARN' | 'FAIL';
}

export interface SBOMComponent {
  type: 'library' | 'framework' | 'application';
  name: string;
  version: string;
  license: string;
  purl: string;
  hashes: {
    sha256: string;
    sha512: string;
  };
  dependencies: string[];
}

export interface SBOMSpec {
  bomFormat: 'CycloneDX' | 'SPDX';
  specVersion: string;
  serialNumber: string;
  version: number;
  metadata: {
    timestamp: string;
    tools: Array<{ vendor: string; name: string; version: string }>;
    component: {
      name: string;
      version: string;
      type: string;
    };
  };
  components: SBOMComponent[];
}

export interface IntegrityValidationReport {
  timestamp: string;
  extensionZipExists: boolean;
  manifestExists: boolean;
  zipSha256: string;
  zipSha512: string;
  manifestSha256: string;
  structureValid: boolean;
  metadataConsistent: boolean;
  status: 'PASS' | 'FAIL';
}

export interface SigningMetadata {
  timestamp: string;
  profile: 'Development' | 'Enterprise' | 'ChromeWebStore' | 'MicrosoftStore';
  algorithm: 'RSA-PSS-SHA256' | 'ECDSA-P256-SHA256';
  keyId: string;
  signature: string;
  certFingerprint: string;
  status: 'SIGNED_METADATA_GENERATED';
}

export interface BuildProvenance {
  timestamp: string;
  gitCommit: string;
  gitTag: string;
  gitBranch: string;
  isCleanWorkingTree: boolean;
  builder: string;
  nodeVersion: string;
  npmVersion: string;
  viteVersion: string;
  releaseVersion: string;
  artifactHashes: Record<string, string>;
}

export interface QualityGateResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  scoreContribution: number;
  details: string;
}

export interface SecurityScoreModel {
  timestamp: string;
  totalScore: number; // 0 to 100
  minimumRequiredScore: number; // 90
  passed: boolean;
  qualityGates: QualityGateResult[];
}

export interface SecuritySummary {
  timestamp: string;
  version: string;
  dependencyAudit: 'PASS' | 'WARN' | 'FAIL';
  secretScan: 'PASS' | 'FAIL';
  licenseAudit: 'PASS' | 'WARN' | 'FAIL';
  sbomGenerated: boolean;
  integrityValid: boolean;
  signingGenerated: boolean;
  provenanceGenerated: boolean;
  securityScore: number;
  overallStatus: 'PASS' | 'FAIL';
}
