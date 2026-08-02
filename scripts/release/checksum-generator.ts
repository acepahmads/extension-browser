/**
 * Checksum Generator — WP-6.2
 * Computes SHA-256 and SHA-512 cryptographic hashes for release artifacts.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface ArtifactChecksums {
  sha256: string;
  sha512: string;
}

export class ChecksumGenerator {
  /**
   * Calculates SHA-256 and SHA-512 hashes for a file.
   */
  public static generateFileChecksums(filePath: string): ArtifactChecksums {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cannot compute checksum: File does not exist at "${filePath}"`);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const sha512 = crypto.createHash('sha512').update(fileBuffer).digest('hex');

    return { sha256, sha512 };
  }

  /**
   * Generates sidecar .sha256 and .sha512 files next to the target artifact.
   */
  public static writeSidecarFiles(filePath: string): { sha256Path: string; sha512Path: string } {
    const checksums = this.generateFileChecksums(filePath);
    const filename = path.basename(filePath);

    const sha256Path = `${filePath}.sha256`;
    const sha512Path = `${filePath}.sha512`;

    // Standard GNU coreutils sha256sum format: "<hash>  <filename>"
    fs.writeFileSync(sha256Path, `${checksums.sha256}  ${filename}\n`, 'utf8');
    fs.writeFileSync(sha512Path, `${checksums.sha512}  ${filename}\n`, 'utf8');

    return { sha256Path, sha512Path };
  }

  /**
   * Verifies a file against expected SHA-256 or SHA-512 hash values.
   */
  public static verifyChecksum(filePath: string, expectedHash: string, algorithm: 'sha256' | 'sha512' = 'sha256'): boolean {
    if (!fs.existsSync(filePath)) return false;
    const fileBuffer = fs.readFileSync(filePath);
    const actualHash = crypto.createHash(algorithm).update(fileBuffer).digest('hex');
    return actualHash.toLowerCase() === expectedHash.toLowerCase();
  }
}
