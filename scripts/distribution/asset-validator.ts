/**
 * Asset Verification Engine — WP-6.3
 * Validates extension icon sizes, store promotional graphics, and image file specs.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface AssetCheckItem {
  name: string;
  expectedSize: string;
  relPath: string;
  found: boolean;
  sizeBytes?: number;
  status: 'PASS' | 'WARN' | 'FAIL';
  details: string;
}

export interface AssetValidationResult {
  allRequiredPassed: boolean;
  totalAssetsChecked: number;
  passedCount: number;
  warnCount: number;
  failCount: number;
  items: AssetCheckItem[];
  checkedAt: string;
}

export class AssetValidator {
  private projectRoot: string;
  private iconDir: string;
  private distDir: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.iconDir = path.join(projectRoot, 'public', 'icons');
    this.distDir = path.join(projectRoot, 'dist');
  }

  /**
   * Validates icons and store assets.
   */
  public validateAssets(): AssetValidationResult {
    const items: AssetCheckItem[] = [];
    const iconSizes = [16, 32, 48, 64, 128, 256, 512];

    // 1. Icon Assets Check
    for (const size of iconSizes) {
      const fileName = `icon-${size}.png`;
      const publicPath = path.join(this.iconDir, fileName);
      const distPath = path.join(this.distDir, 'icons', fileName);

      const existsInPublic = fs.existsSync(publicPath);
      const existsInDist = fs.existsSync(distPath);
      const found = existsInPublic || existsInDist;

      let sizeBytes = 0;
      if (found) {
        const targetPath = existsInDist ? distPath : publicPath;
        sizeBytes = fs.statSync(targetPath).size;
      }

      const isRequired = [16, 48, 128].includes(size);
      let status: 'PASS' | 'WARN' | 'FAIL' = 'FAIL';

      if (found && sizeBytes > 0) {
        status = 'PASS';
      } else if (!found && !isRequired) {
        status = 'WARN'; // Optional sizes like 256 or 512 for promotional use
      }

      items.push({
        name: `Icon ${size}x${size}`,
        expectedSize: `${size}x${size} PNG`,
        relPath: `public/icons/${fileName}`,
        found,
        sizeBytes: found ? sizeBytes : undefined,
        status,
        details: found
          ? `Icon ${size}x${size} present (${sizeBytes} bytes)`
          : isRequired
          ? `Required icon ${size}x${size} missing!`
          : `Recommended store promotional icon ${size}x${size} missing.`
      });
    }

    // 2. Store Tile Logo & Banner References
    const promoDir = path.join(this.projectRoot, 'docs', 'assets');
    const storeBannerPath = path.join(promoDir, 'store-banner.png');
    const tileLogoPath = path.join(promoDir, 'store-tile-logo.png');

    items.push({
      name: 'Store Tile Logo',
      expectedSize: '440x280 PNG',
      relPath: 'docs/assets/store-tile-logo.png',
      found: fs.existsSync(tileLogoPath),
      status: fs.existsSync(tileLogoPath) ? 'PASS' : 'WARN',
      details: fs.existsSync(tileLogoPath) ? 'Store tile logo present' : 'Store tile logo optional asset missing (440x280)'
    });

    items.push({
      name: 'Store Promotional Banner',
      expectedSize: '920x680 or 1400x560 PNG',
      relPath: 'docs/assets/store-banner.png',
      found: fs.existsSync(storeBannerPath),
      status: fs.existsSync(storeBannerPath) ? 'PASS' : 'WARN',
      details: fs.existsSync(storeBannerPath) ? 'Store marquee banner present' : 'Store banner optional asset missing (920x680)'
    });

    const failCount = items.filter((i) => i.status === 'FAIL').length;
    const warnCount = items.filter((i) => i.status === 'WARN').length;
    const passedCount = items.filter((i) => i.status === 'PASS').length;

    return {
      allRequiredPassed: failCount === 0,
      totalAssetsChecked: items.length,
      passedCount,
      warnCount,
      failCount,
      items,
      checkedAt: new Date().toISOString()
    };
  }
}
