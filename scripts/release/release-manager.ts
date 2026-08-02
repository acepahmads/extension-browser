/**
 * Master Release Orchestrator & CLI — WP-6.2
 * Orchestrates Versioning, Channel Validation, Build Packaging, Checksum Generation,
 * Release Manifest Creation, 8-Point Certification, and Rollback Procedures.
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import { VersionManager } from './version-manager';
import { ChannelManager, ChannelIdentifier } from './channel-manager';
import { ReleaseMetadataEngine } from './release-metadata';
import { ExtensionBundler } from './bundle-extension';
import { ChecksumGenerator } from './checksum-generator';
import { ReleaseManifestEngine } from './release-manifest';
import { CertificationEngine } from './certification-engine';
import { ReleaseReportGenerator } from './release-report';
import { RollbackManager, RollbackStrategy } from './rollback-manager';

export class ReleaseManager {
  private projectRoot: string;

  constructor() {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    this.projectRoot = path.resolve(currentDir, '../../');
  }

  /**
   * Main certification and release build entry point.
   */
  public async executeRelease(targetChannel: ChannelIdentifier = 'ga'): Promise<boolean> {
    console.log('====================================================');
    console.log('🚀 PRODUCTION RELEASE & CERTIFICATION PIPELINE (WP-6.2)');
    console.log('====================================================\n');

    // 1. Collect Metadata & Version
    const metadataEngine = new ReleaseMetadataEngine(this.projectRoot);
    const metadata = metadataEngine.collectMetadata(true);

    console.log(`📌 Version Detected : ${metadata.version}`);
    console.log(`🏷️ Git Tag         : ${metadata.gitTag} (${metadata.gitCommitHash})`);
    console.log(`🌿 Git Branch      : ${metadata.gitBranch}`);
    console.log(`📡 Target Channel  : ${targetChannel.toUpperCase()}`);

    // 2. Validate Channel Promotion Rules
    const promotionCheck = ChannelManager.validatePromotion(metadata.version, targetChannel);
    if (!promotionCheck.valid) {
      console.error(`💥 Release Aborted: Channel promotion policy failure.`);
      console.error(`   Reason: ${promotionCheck.reason}\n`);
      return false;
    }
    console.log(`✅ Channel Promotion Rules: PASSED (${targetChannel.toUpperCase()})\n`);

    // 3. Bundle Extension Packaging
    const bundler = new ExtensionBundler(this.projectRoot);
    const bundleResult = bundler.packageExtension();

    if (!bundleResult.valid) {
      console.error('💥 Packaging Failed:', bundleResult.errors);
      return false;
    }

    metadata.bundleMetrics = {
      zipSizeBytes: bundleResult.zipSizeBytes,
      zipSizeFormatted: bundleResult.zipSizeFormatted,
      uncompressedSizeBytes: bundleResult.uncompressedSizeBytes,
      fileCount: bundleResult.fileCount
    };

    // 4. Generate Checksums (SHA-256 and SHA-512)
    const zipPath = path.join(this.projectRoot, 'dist-release', 'extension.zip');
    const sidecars = ChecksumGenerator.writeSidecarFiles(zipPath);
    console.log(`🔒 Cryptographic Checksums Generated:`);
    console.log(`   SHA-256: ${sidecars.sha256Path}`);
    console.log(`   SHA-512: ${sidecars.sha512Path}\n`);

    // 5. Generate Release Manifest
    const manifestEngine = new ReleaseManifestEngine(this.projectRoot);
    const manifestPath = manifestEngine.generateReleaseManifest(metadata, targetChannel.toUpperCase(), 'PASSED');
    console.log(`📋 Release Manifest Created: ${manifestPath}\n`);

    // 6. Execute 8-Point Certification Check
    const certEngine = new CertificationEngine(this.projectRoot);
    const certResult = certEngine.evaluate(metadata);
    const certReportPath = certEngine.generateCertificationReport(certResult, metadata);

    console.log('====================================================');
    console.log(`📊 PRODUCTION CERTIFICATION RESULT: ${certResult.overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   Gates Passed: ${certResult.passedGates} / ${certResult.totalGates}`);
    console.log(`   Report Path : ${certReportPath}`);
    console.log('====================================================\n');

    // 7. Generate Final Release Reports
    const reporter = new ReleaseReportGenerator(this.projectRoot);
    const reportMdPath = reporter.generateMarkdownReport(metadata, certResult, targetChannel.toUpperCase());
    const reportJsonPath = reporter.generateJsonSummary(metadata, certResult, targetChannel.toUpperCase());

    console.log(`📝 Formatted Release Report: ${reportMdPath}`);
    console.log(`📊 Machine Summary JSON    : ${reportJsonPath}`);

    return certResult.overallPassed;
  }

  /**
   * Executes a rollback operation.
   */
  public executeRollback(strategy: RollbackStrategy, target: string, reason?: string): boolean {
    const rollbackManager = new RollbackManager(this.projectRoot);
    const result = rollbackManager.executeRollback({ strategy, target, reason });
    console.log(`🔄 Rollback Execution: ${result.message}`);
    console.log(`📊 Rollback Report Path: ${result.reportPath}`);
    return result.success;
  }
}

// CLI Execution Entry Point
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)) {
  const args = process.argv.slice(2);
  const actionArg = args.find((a) => a.startsWith('--action='))?.split('=')[1] || 'release';
  const channelArg = (args.find((a) => a.startsWith('--channel='))?.split('=')[1] || 'ga') as ChannelIdentifier;
  const strategyArg = (args.find((a) => a.startsWith('--strategy='))?.split('=')[1] || 'VERSION') as RollbackStrategy;
  const targetArg = args.find((a) => a.startsWith('--target='))?.split('=')[1] || '0.5.0';

  const manager = new ReleaseManager();

  if (actionArg === 'rollback') {
    const success = manager.executeRollback(strategyArg, targetArg, 'CLI rollback request');
    process.exit(success ? 0 : 1);
  } else {
    manager
      .executeRelease(channelArg)
      .then((success) => process.exit(success ? 0 : 1))
      .catch((err) => {
        console.error('Release execution error:', err);
        process.exit(1);
      });
  }
}
