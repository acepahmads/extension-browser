/**
 * Extension Packaging Engine — WP-6.1
 * Validates Manifest V3 schema, checks static assets, and packages dist/ into dist-release/extension.zip.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

export interface BundleValidationResult {
  valid: boolean;
  manifestVersion: number;
  extensionName: string;
  extensionVersion: string;
  assetCheckPassed: boolean;
  zipSizeBytes: number;
  zipSizeFormatted: string;
  uncompressedSizeBytes: number;
  fileCount: number;
  errors: string[];
}

export class ExtensionBundler {
  private projectRoot: string;
  private distDir: string;
  private releaseDir: string;
  private maxSizeBytes: number = 15 * 1024 * 1024; // 15 MB Limit Guard

  constructor(projectRoot?: string) {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    this.projectRoot = projectRoot || path.resolve(currentDir, '../../');
    this.distDir = path.join(this.projectRoot, 'dist');
    this.releaseDir = path.join(this.projectRoot, 'dist-release');
  }

  /**
   * Validates Chrome Manifest V3 schema & required fields
   */
  public validateManifest(): { valid: boolean; manifest: any; errors: string[] } {
    const manifestPath = path.join(this.distDir, 'manifest.json');
    const errors: string[] = [];

    if (!fs.existsSync(manifestPath)) {
      return { valid: false, manifest: null, errors: ['manifest.json missing from dist/'] };
    }

    let manifest: any;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (err: any) {
      return { valid: false, manifest: null, errors: [`Failed to parse manifest.json: ${err.message}`] };
    }

    if (manifest.manifest_version !== 3) {
      errors.push(`Manifest version must be 3, found: ${manifest.manifest_version}`);
    }
    if (!manifest.name) errors.push('Manifest missing required field: "name"');
    if (!manifest.version) errors.push('Manifest missing required field: "version"');
    if (!manifest.background?.service_worker) {
      errors.push('Manifest V3 missing required field: "background.service_worker"');
    }
    if (!manifest.action) errors.push('Manifest missing required field: "action"');
    if (!Array.isArray(manifest.permissions)) {
      errors.push('Manifest missing or invalid required field: "permissions"');
    }

    return { valid: errors.length === 0, manifest, errors };
  }

  /**
   * Validates presence of critical build output assets
   */
  public validateAssets(manifest: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!manifest) return { valid: false, errors: ['No manifest available for asset check'] };

    const checkFile = (relPath: string, label: string) => {
      const fullPath = path.join(this.distDir, relPath);
      if (!fs.existsSync(fullPath)) {
        errors.push(`Missing build asset for ${label}: ${relPath}`);
      }
    };

    if (manifest.background?.service_worker) {
      checkFile(manifest.background.service_worker, 'Background Service Worker');
    }
    if (manifest.action?.default_popup) {
      checkFile(manifest.action.default_popup, 'Action Default Popup');
    }
    if (manifest.options_page) {
      checkFile(manifest.options_page, 'Options Page');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Formats bytes into human readable size (KB/MB)
   */
  public formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Compresses dist/ directory into dist-release/extension.zip
   */
  public packageExtension(): BundleValidationResult {
    const manifestCheck = this.validateManifest();
    const assetCheck = this.validateAssets(manifestCheck.manifest);
    const errors = [...manifestCheck.errors, ...assetCheck.errors];

    if (!fs.existsSync(this.distDir)) {
      errors.push('dist/ directory does not exist. Run build step first.');
    }

    if (!fs.existsSync(this.releaseDir)) {
      fs.mkdirSync(this.releaseDir, { recursive: true });
    }

    const zipPath = path.join(this.releaseDir, 'extension.zip');
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    let zipSizeBytes = 0;
    let uncompressedSizeBytes = 0;
    let fileCount = 0;

    // Calculate uncompressed file metrics
    const getStatsRecursive = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          getStatsRecursive(fullPath);
        } else {
          fileCount++;
          uncompressedSizeBytes += stat.size;
        }
      }
    };

    if (fs.existsSync(this.distDir)) {
      getStatsRecursive(this.distDir);
    }

    // Zip compression using platform native CLI
    try {
      if (process.platform === 'win32') {
        const psCommand = `powershell -Command "Compress-Archive -Path '${this.distDir}\\*' -DestinationPath '${zipPath}' -Force"`;
        execSync(psCommand, { stdio: ['pipe', 'pipe', 'ignore'] });
      } else {
        const zipCommand = `cd "${this.distDir}" && zip -r "${zipPath}" .`;
        execSync(zipCommand, { stdio: ['pipe', 'pipe', 'ignore'] });
      }

      if (fs.existsSync(zipPath)) {
        zipSizeBytes = fs.statSync(zipPath).size;
      } else {
        errors.push('Failed to generate extension.zip bundle.');
      }
    } catch (err: any) {
      errors.push(`Zip packaging failed: ${err.message}`);
    }

    if (zipSizeBytes > this.maxSizeBytes) {
      errors.push(
        `Bundle size guard violation: ${this.formatBytes(zipSizeBytes)} exceeds max limit of 15 MB.`
      );
    }

    return {
      valid: errors.length === 0,
      manifestVersion: manifestCheck.manifest?.manifest_version || 3,
      extensionName: manifestCheck.manifest?.name || 'SPPG Companion',
      extensionVersion: manifestCheck.manifest?.version || '0.6.0',
      assetCheckPassed: assetCheck.valid,
      zipSizeBytes,
      zipSizeFormatted: this.formatBytes(zipSizeBytes),
      uncompressedSizeBytes,
      fileCount,
      errors
    };
  }
}
