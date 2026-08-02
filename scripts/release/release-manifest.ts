/**
 * Release Manifest Generator — WP-6.2
 * Generates release-manifest.json containing artifact details, checksums, bundle size, and compatibility rules.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ReleaseMetadata } from './release-metadata';
import { ChecksumGenerator, ArtifactChecksums } from './checksum-generator';

export interface ManifestArtifact {
  name: string;
  path: string;
  sizeBytes: number;
  checksums: ArtifactChecksums;
}

export interface ReleaseManifestStructure {
  $schema: string;
  manifestVersion: string;
  release: {
    version: string;
    channel: string;
    buildNumber: string;
    timestamp: string;
  };
  provenance: {
    gitCommit: string;
    gitBranch: string;
    gitTag: string;
    repositoryHealth: {
      isClean: boolean;
      uncommittedFiles: number;
    };
    toolchain: {
      node: string;
      npm: string;
      vite: string;
    };
  };
  compatibility: {
    manifestVersion: number;
    minimumChromeVersion: string;
    permissions: string[];
  };
  bundleMetrics?: {
    compressedSizeBytes: number;
    compressedSizeFormatted: string;
    uncompressedSizeBytes: number;
    fileCount: number;
  };
  artifacts: ManifestArtifact[];
  certification: {
    status: 'PASSED' | 'FAILED' | 'PENDING';
    certifiedAt: string;
    engineVersion: string;
  };
}

export class ReleaseManifestEngine {
  private projectRoot: string;
  private releaseDir: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.releaseDir = path.join(projectRoot, 'dist-release');
  }

  /**
   * Builds and saves release-manifest.json in dist-release/
   */
  public generateReleaseManifest(
    metadata: ReleaseMetadata,
    channel: string = 'GA',
    certificationStatus: 'PASSED' | 'FAILED' | 'PENDING' = 'PASSED'
  ): string {
    const zipPath = path.join(this.releaseDir, 'extension.zip');
    const artifacts: ManifestArtifact[] = [];

    if (fs.existsSync(zipPath)) {
      const stats = fs.statSync(zipPath);
      const checksums = ChecksumGenerator.generateFileChecksums(zipPath);

      artifacts.push({
        name: 'extension.zip',
        path: 'dist-release/extension.zip',
        sizeBytes: stats.size,
        checksums
      });
    }

    const manifestData: ReleaseManifestStructure = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      manifestVersion: '1.0.0',
      release: {
        version: metadata.version,
        channel,
        buildNumber: metadata.buildNumber,
        timestamp: metadata.buildTimestamp
      },
      provenance: {
        gitCommit: metadata.gitCommitFull,
        gitBranch: metadata.gitBranch,
        gitTag: metadata.gitTag,
        repositoryHealth: {
          isClean: metadata.repositoryHealth.isClean,
          uncommittedFiles: metadata.repositoryHealth.uncommittedFiles
        },
        toolchain: {
          node: metadata.nodeVersion,
          npm: metadata.npmVersion,
          vite: metadata.viteVersion
        }
      },
      compatibility: {
        manifestVersion: 3,
        minimumChromeVersion: '102.0',
        permissions: ['storage', 'activeTab', 'scripting']
      },
      bundleMetrics: metadata.bundleMetrics
        ? {
            compressedSizeBytes: metadata.bundleMetrics.zipSizeBytes,
            compressedSizeFormatted: metadata.bundleMetrics.zipSizeFormatted,
            uncompressedSizeBytes: metadata.bundleMetrics.uncompressedSizeBytes,
            fileCount: metadata.bundleMetrics.fileCount
          }
        : undefined,
      artifacts,
      certification: {
        status: certificationStatus,
        certifiedAt: new Date().toISOString(),
        engineVersion: '1.0.0'
      }
    };

    if (!fs.existsSync(this.releaseDir)) {
      fs.mkdirSync(this.releaseDir, { recursive: true });
    }

    const outputPath = path.join(this.releaseDir, 'release-manifest.json');
    fs.writeFileSync(outputPath, JSON.stringify(manifestData, null, 2), 'utf8');
    return outputPath;
  }
}
