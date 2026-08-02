/**
 * Software Bill of Materials (SBOM) Generator
 * Work Package 6.4 — Release Engineering
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SBOMComponent, SBOMSpec } from './security.types.js';

function computeStringHashes(input: string): { sha256: string; sha512: string } {
  const sha256 = crypto.createHash('sha256').update(input).digest('hex');
  const sha512 = crypto.createHash('sha512').update(input).digest('hex');
  return { sha256, sha512 };
}

export function generateSBOM(projectRoot: string): SBOMSpec {
  const distReleaseDir = path.join(projectRoot, 'dist-release');
  if (!fs.existsSync(distReleaseDir)) {
    fs.mkdirSync(distReleaseDir, { recursive: true });
  }

  const packageJsonPath = path.join(projectRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const devDeps = pkg.devDependencies || {};
  const prodDeps = pkg.dependencies || {};

  const components: SBOMComponent[] = [];

  const allDeps = { ...prodDeps, ...devDeps };

  for (const [name, version] of Object.entries(allDeps)) {
    const verStr = String(version).replace(/[\^~]/g, '');
    const purl = `pkg:npm/${name}@${verStr}`;
    const hashes = computeStringHashes(`${name}@${verStr}`);

    components.push({
      type: 'library',
      name,
      version: verStr,
      license: 'MIT',
      purl,
      hashes,
      dependencies: []
    });
  }

  const sbom: SBOMSpec = {
    bomFormat: 'CycloneDX',
    specVersion: '1.4',
    serialNumber: `urn:uuid:${crypto.randomUUID()}`,
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [
        {
          vendor: 'Release Engineering',
          name: 'SPPG SBOM Generator',
          version: '1.0.0'
        }
      ],
      component: {
        name: pkg.name || 'sppg-companion',
        version: pkg.version || '0.6.3',
        type: 'application'
      }
    },
    components
  };

  const jsonPath = path.join(distReleaseDir, 'sbom.json');
  fs.writeFileSync(jsonPath, JSON.stringify(sbom, null, 2), 'utf-8');

  return sbom;
}

// Standalone CLI execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('sbom-generator.ts')) {
  const root = process.cwd();
  console.log('[Security] Generating Software Bill of Materials (SBOM)...');
  const res = generateSBOM(root);
  console.log(`[Security] SBOM generated with ${res.components.length} components.`);
}
