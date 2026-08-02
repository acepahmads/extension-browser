/**
 * Store Readiness & Distribution Package Validator — WP-6.3
 * Validates extension package integrity across profiles and verifies Chrome Web Store requirements.
 */

import * as fs from 'fs';
import * as path from 'path';

export type DeploymentProfile = 'development' | 'qa' | 'production' | 'enterprise';

export interface ValidationIssue {
  ruleId: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
}

export interface StoreReadinessResult {
  valid: boolean;
  profile: DeploymentProfile;
  issues: ValidationIssue[];
  manifestVersion: number;
  extensionVersion: string;
  checkedAt: string;
}

export class DistributionValidator {
  private projectRoot: string;
  private distPath: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.distPath = path.join(projectRoot, 'dist');
  }

  /**
   * Validates package structure and store readiness requirements.
   */
  public validate(profile: DeploymentProfile = 'production'): StoreReadinessResult {
    const issues: ValidationIssue[] = [];
    const manifestPath = path.join(this.distPath, 'manifest.json');

    if (!fs.existsSync(manifestPath)) {
      issues.push({
        ruleId: 'STORE-001',
        category: 'Manifest',
        severity: 'CRITICAL',
        message: 'dist/manifest.json does not exist. Run "npm run build" first.'
      });

      return {
        valid: false,
        profile,
        issues,
        manifestVersion: 0,
        extensionVersion: '0.0.0',
        checkedAt: new Date().toISOString()
      };
    }

    let manifest: any = {};
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (err: any) {
      issues.push({
        ruleId: 'STORE-002',
        category: 'Manifest',
        severity: 'CRITICAL',
        message: `Failed to parse dist/manifest.json: ${err.message}`
      });
      return {
        valid: false,
        profile,
        issues,
        manifestVersion: 0,
        extensionVersion: '0.0.0',
        checkedAt: new Date().toISOString()
      };
    }

    // 1. Manifest Version
    if (manifest.manifest_version !== 3) {
      issues.push({
        ruleId: 'STORE-003',
        category: 'Manifest Version',
        severity: 'CRITICAL',
        message: `Manifest version must be 3. Found: ${manifest.manifest_version}`
      });
    }

    // 2. Name & Description constraints
    if (!manifest.name || manifest.name.trim().length === 0) {
      issues.push({
        ruleId: 'STORE-004',
        category: 'Metadata',
        severity: 'CRITICAL',
        message: 'Manifest is missing a name attribute.'
      });
    } else if (manifest.name.length > 45) {
      issues.push({
        ruleId: 'STORE-005',
        category: 'Metadata',
        severity: 'HIGH',
        message: `Extension name length (${manifest.name.length}) exceeds Chrome Web Store limit (45 chars).`
      });
    }

    if (!manifest.description || manifest.description.trim().length === 0) {
      issues.push({
        ruleId: 'STORE-006',
        category: 'Metadata',
        severity: 'HIGH',
        message: 'Manifest is missing a description attribute.'
      });
    } else if (manifest.description.length > 132) {
      issues.push({
        ruleId: 'STORE-007',
        category: 'Metadata',
        severity: 'MEDIUM',
        message: `Manifest short description length (${manifest.description.length}) exceeds 132 chars limit.`
      });
    }

    // 3. Icons Existence
    if (!manifest.icons) {
      issues.push({
        ruleId: 'STORE-008',
        category: 'Icons',
        severity: 'CRITICAL',
        message: 'Manifest is missing "icons" field.'
      });
    } else {
      const requiredSizes = ['16', '48', '128'];
      for (const size of requiredSizes) {
        const iconRelPath = manifest.icons[size];
        if (!iconRelPath) {
          issues.push({
            ruleId: `STORE-009-${size}`,
            category: 'Icons',
            severity: 'HIGH',
            message: `Manifest icons dictionary missing ${size}x${size} icon.`
          });
        } else {
          const fullIconPath = path.join(this.distPath, iconRelPath);
          if (!fs.existsSync(fullIconPath)) {
            issues.push({
              ruleId: `STORE-010-${size}`,
              category: 'Icons',
              severity: 'CRITICAL',
              message: `Icon file declared in manifest not found at dist/${iconRelPath}.`
            });
          }
        }
      }
    }

    // 4. Background Service Worker
    if (!manifest.background || !manifest.background.service_worker) {
      issues.push({
        ruleId: 'STORE-011',
        category: 'Background Worker',
        severity: 'CRITICAL',
        message: 'Manifest V3 requires "background.service_worker" entry.'
      });
    } else {
      const workerPath = path.join(this.distPath, manifest.background.service_worker);
      if (!fs.existsSync(workerPath)) {
        issues.push({
          ruleId: 'STORE-012',
          category: 'Background Worker',
          severity: 'CRITICAL',
          message: `Background service worker script not found at dist/${manifest.background.service_worker}.`
        });
      }
    }

    // 5. Popup & Action
    if (manifest.action && manifest.action.default_popup) {
      const popupPath = path.join(this.distPath, manifest.action.default_popup);
      if (!fs.existsSync(popupPath)) {
        issues.push({
          ruleId: 'STORE-013',
          category: 'UI Entry Point',
          severity: 'HIGH',
          message: `Default popup declared in manifest not found at dist/${manifest.action.default_popup}.`
        });
      }
    }

    // 6. Content Scripts
    if (manifest.content_scripts && Array.isArray(manifest.content_scripts)) {
      for (const cs of manifest.content_scripts) {
        if (cs.js && Array.isArray(cs.js)) {
          for (const jsFile of cs.js) {
            const csPath = path.join(this.distPath, jsFile);
            if (!fs.existsSync(csPath)) {
              issues.push({
                ruleId: 'STORE-014',
                category: 'Content Scripts',
                severity: 'CRITICAL',
                message: `Content script not found at dist/${jsFile}.`
              });
            }
          }
        }
      }
    }

    // 7. Version Consistency with package.json
    let pkgVersion = '';
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      pkgVersion = pkg.version ? pkg.version.replace(/^v/, '') : '';
    } catch {}

    const manifestVersion = manifest.version ? manifest.version.replace(/^v/, '') : '';
    if (pkgVersion && manifestVersion && pkgVersion !== manifestVersion) {
      issues.push({
        ruleId: 'STORE-015',
        category: 'Version Consistency',
        severity: 'MEDIUM',
        message: `Version mismatch: package.json is "${pkgVersion}" while dist/manifest.json is "${manifestVersion}".`
      });
    }

    const criticalOrHighCount = issues.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;

    return {
      valid: criticalOrHighCount === 0,
      profile,
      issues,
      manifestVersion: manifest.manifest_version || 3,
      extensionVersion: manifestVersion || '1.0.0',
      checkedAt: new Date().toISOString()
    };
  }
}
