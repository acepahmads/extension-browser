/**
 * Release Orchestrator Script — WP-6.1
 * Executes Quality Gates, version injection, extension packaging, and metadata generation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { runQualityGates } from '../ci/run-quality-gates';
import { ReleaseMetadataEngine } from './release-metadata';
import { ExtensionBundler } from './bundle-extension';

export async function buildRelease(): Promise<boolean> {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const projectRoot = path.resolve(currentDir, '../../');
  console.log('====================================================');
  console.log('🚀 SPPG COMPANION — RELEASE BUILD PIPELINE (WP-6.1)');
  console.log('====================================================\n');

  // Step 1: Run Quality Gates
  const qualityResults = await runQualityGates();
  if (!qualityResults.allPassed) {
    console.error('💥 Release Build Aborted: Quality Gates failed.\n');
    return false;
  }

  // Step 2: Metadata & Version Injection into dist/manifest.json
  const metadataEngine = new ReleaseMetadataEngine(projectRoot);
  const metadata = metadataEngine.collectMetadata(true);

  const manifestPath = path.join(projectRoot, 'dist', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.version = metadata.version.replace(/^v/, '');
      manifest.build_metadata = {
        buildNumber: metadata.buildNumber,
        gitCommitHash: metadata.gitCommitHash,
        buildTimestamp: metadata.buildTimestamp
      };
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      console.log(`✅ Injected version [${metadata.version}] & build metadata into dist/manifest.json`);
    } catch (err: any) {
      console.error(`⚠️ Warning: Failed to inject metadata into manifest: ${err.message}`);
    }
  }

  // Step 3: Bundle Extension ZIP
  const bundler = new ExtensionBundler(projectRoot);
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

  // Step 4: Write Metadata Artifacts (build-report.json & release-notes.md)
  const reportPath = metadataEngine.generateBuildReport(metadata);
  const notesPath = metadataEngine.generateReleaseNotes(metadata);

  console.log('====================================================');
  console.log('🎉 RELEASE BUILD & PACKAGING COMPLETE');
  console.log('====================================================');
  console.log(`📦 Extension ZIP : dist-release/extension.zip (${bundleResult.zipSizeFormatted})`);
  console.log(`📊 Build Report  : ${reportPath}`);
  console.log(`📝 Release Notes : ${notesPath}`);
  console.log(`🏷️ Version Tag   : ${metadata.version} (${metadata.gitCommitHash})`);
  console.log('====================================================\n');

  return true;
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)) {
  buildRelease()
    .then((success) => {
      if (!success) process.exit(1);
    })
    .catch((err) => {
      console.error('Release build execution failure:', err);
      process.exit(1);
    });
}
