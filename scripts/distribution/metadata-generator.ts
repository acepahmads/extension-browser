/**
 * Store Metadata Generator — WP-6.3
 * Generates store-metadata.json containing standardized Web Store listing information.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface StoreMetadataStructure {
  $schema: string;
  extension: {
    name: string;
    shortDescription: string;
    longDescription: string;
    category: string;
    defaultLanguage: string;
    version: string;
    author: string;
  };
  urls: {
    homepage: string;
    support: string;
    privacyPolicy: string;
  };
  permissions: {
    apiPermissions: string[];
    hostPermissions: string[];
  };
  search: {
    keywords: string[];
  };
  releaseNotes: string;
}

export class MetadataGenerator {
  private projectRoot: string;
  private releaseDir: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.releaseDir = path.join(projectRoot, 'dist-release');
  }

  /**
   * Generates store-metadata.json in dist-release/
   */
  public generateMetadata(version: string = '1.0.0'): string {
    let manifest: any = {};
    const manifestPath = path.join(this.projectRoot, 'dist', 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch {}
    }

    const metadata: StoreMetadataStructure = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      extension: {
        name: manifest.name || 'SPPG Companion Extension',
        shortDescription:
          manifest.description || 'Enterprise Integration Companion for Developer Tools, BGN Simulator, and SIPGN analysis',
        longDescription:
          'SPPG Companion is an enterprise-grade browser extension designed for real-time telemetry, BGN simulation analysis, and developer tooling integration. Built with Vue 3, TypeScript, and Chrome Manifest V3 service workers, it provides high-throughput event processing and enterprise governance.',
        category: 'developer_tools',
        defaultLanguage: 'en',
        version: manifest.version || version,
        author: 'BGN Engineering Team'
      },
      urls: {
        homepage: 'https://github.com/acepahmads/extension-browser',
        support: 'https://github.com/acepahmads/extension-browser/issues',
        privacyPolicy: 'https://github.com/acepahmads/extension-browser/blob/main/PRIVACY.md'
      },
      permissions: {
        apiPermissions: manifest.permissions || ['storage', 'activeTab', 'scripting'],
        hostPermissions: manifest.host_permissions || ['https://*/*']
      },
      search: {
        keywords: ['sppg', 'bgn', 'simulator', 'telemetry', 'developer-tools', 'enterprise']
      },
      releaseNotes: `WP-6.3 Production Release Bundle ${manifest.version || version} certified for Chrome Web Store and Enterprise distribution.`
    };

    if (!fs.existsSync(this.releaseDir)) {
      fs.mkdirSync(this.releaseDir, { recursive: true });
    }

    const outputPath = path.join(this.releaseDir, 'store-metadata.json');
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf8');
    return outputPath;
  }
}
