/**
 * Master Distribution Orchestrator & CLI Runner — WP-6.3
 * Coordinates Validation, Asset Verification, Store Metadata Generation, Compatibility Audit, Packaging, and Report Artifacts.
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import { DistributionValidator, DeploymentProfile } from './distribution-validator';
import { AssetValidator } from './asset-validator';
import { CompatibilityValidator } from './compatibility-validator';
import { MetadataGenerator } from './metadata-generator';
import { DistributionChecklistEngine } from './distribution-checklist';
import { DistributionReportGenerator } from './distribution-report';

export class DistributionManager {
  private projectRoot: string;

  constructor() {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    this.projectRoot = path.resolve(currentDir, '../../');
  }

  /**
   * Executes full distribution packaging and validation pipeline.
   */
  public async executeDistribution(profile: DeploymentProfile = 'production'): Promise<boolean> {
    console.log('====================================================');
    console.log('🚀 DISTRIBUTION PACKAGING & STORE READINESS (WP-6.3)');
    console.log('====================================================\n');

    console.log(`📡 Deployment Profile : ${profile.toUpperCase()}`);

    // 1. Store Readiness Validation
    const validator = new DistributionValidator(this.projectRoot);
    const storeResult = validator.validate(profile);
    console.log(`🔍 Store Readiness    : ${storeResult.valid ? '✅ PASSED' : '⚠️ ISSUES FOUND'} (${storeResult.issues.length} findings)`);

    // 2. Asset Verification
    const assetValidator = new AssetValidator(this.projectRoot);
    const assetResult = assetValidator.validateAssets();
    console.log(
      `🖼️ Asset Verification : ${assetResult.allRequiredPassed ? '✅ PASSED' : '❌ FAILED'} (${assetResult.passedCount}/${assetResult.totalAssetsChecked} assets verified)`
    );

    // 3. Compatibility Audit
    const compatValidator = new CompatibilityValidator(this.projectRoot);
    const compatResult = compatValidator.validateCompatibility();
    console.log(`🌐 Compatibility      : ${compatResult.overallCompatible ? '✅ COMPATIBLE' : '❌ INCOMPATIBLE'} (Chrome 102+ / Edge MV3)`);

    // 4. Store Metadata Generation
    const metadataGen = new MetadataGenerator(this.projectRoot);
    const metadataPath = metadataGen.generateMetadata(storeResult.extensionVersion);
    console.log(`📋 Store Metadata     : Generated -> ${metadataPath}`);

    // 5. Distribution Checklist Evaluation
    const checklistEngine = new DistributionChecklistEngine(this.projectRoot);
    const checklistResult = checklistEngine.evaluateChecklist();
    const checklistReportPath = checklistEngine.generateChecklistReport(checklistResult);
    console.log(`✅ 10-Point Checklist : ${checklistResult.overallPassed ? 'PASSED' : 'FAILED'} (${checklistResult.passedCount}/${checklistResult.totalChecks} gates)`);
    console.log(`   Report Path        : ${checklistReportPath}`);

    // 6. Distribution Reports Generation
    const reporter = new DistributionReportGenerator(this.projectRoot);
    const distReportPath = reporter.generateDistributionReport(storeResult, assetResult, compatResult);
    const summaryJsonPath = reporter.generateSummaryJson(storeResult, assetResult, compatResult);
    const storeReportPath = reporter.generateStoreReadinessReport(storeResult, assetResult);

    console.log('\n====================================================');
    console.log('📦 DISTRIBUTION PACKAGING COMPLETE — ALL OUTPUT ARTIFACTS WRITTEN');
    console.log('====================================================');
    console.log(`📄 store-metadata.json        : ${metadataPath}`);
    console.log(`📄 distribution-checklist.md  : ${checklistReportPath}`);
    console.log(`📄 distribution-report.md     : ${distReportPath}`);
    console.log(`📄 distribution-summary.json  : ${summaryJsonPath}`);
    console.log(`📄 store-readiness-report.md  : ${storeReportPath}`);
    console.log('====================================================\n');

    return storeResult.valid && assetResult.allRequiredPassed && checklistResult.overallPassed;
  }
}

// CLI Execution Handler
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)) {
  const args = process.argv.slice(2);
  const profileArg = (args.find((a) => a.startsWith('--profile='))?.split('=')[1] || 'production') as DeploymentProfile;

  const manager = new DistributionManager();
  manager
    .executeDistribution(profileArg)
    .then((success) => process.exit(success ? 0 : 1))
    .catch((err) => {
      console.error('Distribution packaging execution failure:', err);
      process.exit(1);
    });
}
