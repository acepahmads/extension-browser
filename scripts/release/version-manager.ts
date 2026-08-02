/**
 * Semantic Version Manager — WP-6.2
 * Provides SemVer 2.0.0 parsing, validation, comparison, and version bumping.
 */

export interface SemVerComponents {
  major: number;
  minor: number;
  patch: number;
  prereleaseType?: 'alpha' | 'beta' | 'rc' | 'dev';
  prereleaseNumber?: number;
  buildMetadata?: string;
  raw: string;
}

export class VersionManager {
  // Regex following SemVer 2.0.0 specification
  private static SEMVER_REGEX =
    /^(?:v)?(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

  /**
   * Validates if a string is a valid SemVer string.
   */
  public static validate(versionString: string): boolean {
    return this.SEMVER_REGEX.test(versionString.trim());
  }

  /**
   * Parses a SemVer string into structured components.
   */
  public static parse(versionString: string): SemVerComponents {
    const cleanStr = versionString.trim();
    const match = this.SEMVER_REGEX.exec(cleanStr);

    if (!match || !match.groups) {
      throw new Error(`Invalid SemVer version string: "${versionString}"`);
    }

    const major = parseInt(match.groups.major, 10);
    const minor = parseInt(match.groups.minor, 10);
    const patch = parseInt(match.groups.patch, 10);
    const prereleaseRaw = match.groups.prerelease;
    const buildMetadata = match.groups.buildmetadata;

    let prereleaseType: 'alpha' | 'beta' | 'rc' | 'dev' | undefined;
    let prereleaseNumber: number | undefined;

    if (prereleaseRaw) {
      const parts = prereleaseRaw.split('.');
      const typePart = parts[0].toLowerCase();
      if (['alpha', 'beta', 'rc', 'dev'].includes(typePart)) {
        prereleaseType = typePart as 'alpha' | 'beta' | 'rc' | 'dev';
        if (parts.length > 1 && /^\d+$/.test(parts[1])) {
          prereleaseNumber = parseInt(parts[1], 10);
        }
      }
    }

    return {
      major,
      minor,
      patch,
      prereleaseType,
      prereleaseNumber,
      buildMetadata,
      raw: cleanStr
    };
  }

  /**
   * Bumps a version according to release type.
   */
  public static bump(
    currentVersion: string,
    releaseType: 'major' | 'minor' | 'patch' | 'alpha' | 'beta' | 'rc' | 'dev'
  ): string {
    const parsed = this.parse(currentVersion);

    let major = parsed.major;
    let minor = parsed.minor;
    let patch = parsed.patch;
    let prerelease: string | undefined = undefined;

    switch (releaseType) {
      case 'major':
        major++;
        minor = 0;
        patch = 0;
        break;
      case 'minor':
        minor++;
        patch = 0;
        break;
      case 'patch':
        if (parsed.prereleaseType) {
          // Bumping pre-release to stable patch keeps same major.minor.patch
        } else {
          patch++;
        }
        break;
      case 'alpha':
      case 'beta':
      case 'rc':
      case 'dev':
        if (parsed.prereleaseType === releaseType && parsed.prereleaseNumber !== undefined) {
          prerelease = `${releaseType}.${parsed.prereleaseNumber + 1}`;
        } else {
          prerelease = `${releaseType}.1`;
        }
        break;
    }

    let result = `${major}.${minor}.${patch}`;
    if (prerelease) {
      result += `-${prerelease}`;
    }
    return result;
  }

  /**
   * Compares two SemVer version strings.
   * Returns -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2.
   */
  public static compare(v1: string, v2: string): number {
    const p1 = this.parse(v1);
    const p2 = this.parse(v2);

    if (p1.major !== p2.major) return p1.major > p2.major ? 1 : -1;
    if (p1.minor !== p2.minor) return p1.minor > p2.minor ? 1 : -1;
    if (p1.patch !== p2.patch) return p1.patch > p2.patch ? 1 : -1;

    // Stable versions are greater than pre-releases
    if (!p1.prereleaseType && p2.prereleaseType) return 1;
    if (p1.prereleaseType && !p2.prereleaseType) return -1;
    if (!p1.prereleaseType && !p2.prereleaseType) return 0;

    // Compare pre-release order: dev < alpha < beta < rc
    const rank: Record<string, number> = { dev: 1, alpha: 2, beta: 3, rc: 4 };
    const r1 = rank[p1.prereleaseType!] || 0;
    const r2 = rank[p2.prereleaseType!] || 0;

    if (r1 !== r2) return r1 > r2 ? 1 : -1;

    const n1 = p1.prereleaseNumber || 0;
    const n2 = p2.prereleaseNumber || 0;
    if (n1 !== n2) return n1 > n2 ? 1 : -1;

    return 0;
  }
}
