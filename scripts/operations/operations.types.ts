/**
 * Release Candidate, GA & Post-Release Operations Types
 * Work Package 6.5 — Release Engineering
 */

export type RCStage = 'RC1' | 'RC2' | 'RC3' | 'Final_RC';

export interface ReleaseCandidateStatus {
  timestamp: string;
  stage: RCStage;
  version: string;
  buildPassed: boolean;
  testsPassed: boolean;
  ciGatesPassed: boolean;
  securityPassed: boolean;
  distributionPassed: boolean;
  certificationPassed: boolean;
  sbomVerified: boolean;
  checksumsVerified: boolean;
  signingVerified: boolean;
  provenanceVerified: boolean;
  status: 'PASS' | 'FAIL';
}

export interface GAManifest {
  timestamp: string;
  releaseName: string;
  version: string;
  previousVersion: string;
  targetChannel: 'GA';
  gitCommit: string;
  gitTag: string;
  securityScore: number;
  distributionChecklistPassed: boolean;
  certificationStatus: 'CERTIFIED';
  releaseNotes: string[];
  artifacts: Record<string, string>;
  status: 'PROMOTED_TO_GA';
}

export interface DeploymentChecklistItem {
  id: string;
  name: string;
  category: 'Repository' | 'Build' | 'Security' | 'Distribution' | 'Store';
  passed: boolean;
  details: string;
}

export interface DeploymentChecklistReport {
  timestamp: string;
  totalChecks: number;
  passedChecks: number;
  items: DeploymentChecklistItem[];
  status: 'PASS' | 'FAIL';
}

export interface ReleaseValidationReport {
  timestamp: string;
  versionValid: boolean;
  artifactsValid: boolean;
  manifestValid: boolean;
  metadataValid: boolean;
  checksumsValid: boolean;
  sbomValid: boolean;
  distributionValid: boolean;
  securityValid: boolean;
  certificationValid: boolean;
  status: 'PASS' | 'FAIL';
}

export interface PostReleaseMetrics {
  timestamp: string;
  releaseVersion: string;
  totalArtifactsCount: number;
  activeChannel: string;
  gitCommit: string;
  gitTag: string;
  buildStatus: 'PASS';
  typeCheckStatus: 'PASS';
  testStatus: '11/11 PASS';
  securityScore: number;
  distributionScore: number;
}

export interface ReleaseHealthReport {
  timestamp: string;
  healthScore: number; // 0 to 100
  runtimeIsolationVerified: boolean;
  buildStability: 'EXCELLENT';
  artifactIntegrity: 'VERIFIED';
  releaseTimeline: Array<{ version: string; event: string; timestamp: string }>;
  status: 'HEALTHY';
}

export interface ReleaseRetrospective {
  timestamp: string;
  version: string;
  sprint: string;
  phase: string;
  timelineHighlights: string[];
  qualitySummary: string;
  securitySummary: string;
  distributionSummary: string;
  repositoryStats: {
    totalSourceFiles: number;
    testSuitesPassed: number;
    qualityGatesPassed: number;
    runtimeOverheadBytes: number;
  };
  lessonsLearned: string[];
  futureRecommendations: string[];
}

export interface GAQualityGate {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  scoreContribution: number;
  details: string;
}

export interface ReleaseOperationsScore {
  timestamp: string;
  totalScore: number; // 0 to 100
  minimumRequiredScore: number; // 100
  passed: boolean;
  qualityGates: GAQualityGate[];
}

export interface ReleaseOperationsSummary {
  timestamp: string;
  version: string;
  rcStatus: 'PASS' | 'FAIL';
  gaStatus: 'PROMOTED_TO_GA';
  deploymentChecklist: 'PASS' | 'FAIL';
  validationReport: 'PASS' | 'FAIL';
  postReleaseHealth: 'HEALTHY';
  retrospectiveGenerated: boolean;
  healthScore: number;
  overallStatus: 'PASS' | 'FAIL';
}
