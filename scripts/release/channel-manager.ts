/**
 * Release Channel Manager — WP-6.2
 * Defines release channels, promotion hierarchy, and promotion policies.
 */

import { VersionManager } from './version-manager';

export type ReleaseChannel = 'Development' | 'Alpha' | 'Beta' | 'Release Candidate' | 'General Availability';
export type ChannelIdentifier = 'dev' | 'alpha' | 'beta' | 'rc' | 'ga';

export interface ChannelPolicy {
  name: ReleaseChannel;
  id: ChannelIdentifier;
  allowedPrereleaseTypes: Array<'dev' | 'alpha' | 'beta' | 'rc' | undefined>;
  requiredQualityGateThreshold: number; // 0.0 to 1.0
  allowUncommittedChanges: boolean;
  requiredApprovalRole: string;
  targetBranchPattern: RegExp;
}

export class ChannelManager {
  private static CHANNELS: Record<ChannelIdentifier, ChannelPolicy> = {
    dev: {
      name: 'Development',
      id: 'dev',
      allowedPrereleaseTypes: ['dev'],
      requiredQualityGateThreshold: 0.8,
      allowUncommittedChanges: true,
      requiredApprovalRole: 'Developer',
      targetBranchPattern: /^feature\/|^dev/
    },
    alpha: {
      name: 'Alpha',
      id: 'alpha',
      allowedPrereleaseTypes: ['alpha'],
      requiredQualityGateThreshold: 0.9,
      allowUncommittedChanges: false,
      requiredApprovalRole: 'Tech Lead',
      targetBranchPattern: /^develop$/
    },
    beta: {
      name: 'Beta',
      id: 'beta',
      allowedPrereleaseTypes: ['beta'],
      requiredQualityGateThreshold: 1.0,
      allowUncommittedChanges: false,
      requiredApprovalRole: 'QA Lead',
      targetBranchPattern: /^staging$|^release\//
    },
    rc: {
      name: 'Release Candidate',
      id: 'rc',
      allowedPrereleaseTypes: ['rc'],
      requiredQualityGateThreshold: 1.0,
      allowUncommittedChanges: false,
      requiredApprovalRole: 'Product Owner',
      targetBranchPattern: /^main$|^master$/
    },
    ga: {
      name: 'General Availability',
      id: 'ga',
      allowedPrereleaseTypes: [undefined],
      requiredQualityGateThreshold: 1.0,
      allowUncommittedChanges: false,
      requiredApprovalRole: 'Engineering Director',
      targetBranchPattern: /^main$|^master$/
    }
  };

  /**
   * Retrieves policy for a given channel identifier.
   */
  public static getPolicy(channelId: ChannelIdentifier): ChannelPolicy {
    const policy = this.CHANNELS[channelId];
    if (!policy) {
      throw new Error(`Unknown release channel: "${channelId}"`);
    }
    return policy;
  }

  /**
   * Infers release channel from a version string.
   */
  public static inferChannel(versionString: string): ChannelIdentifier {
    const parsed = VersionManager.parse(versionString);
    if (!parsed.prereleaseType) return 'ga';
    return parsed.prereleaseType;
  }

  /**
   * Validates if a version is compatible with a target channel.
   */
  public static validatePromotion(currentVersion: string, targetChannel: ChannelIdentifier): { valid: boolean; reason?: string } {
    const policy = this.getPolicy(targetChannel);
    const parsed = VersionManager.parse(currentVersion);

    const isAllowedType = policy.allowedPrereleaseTypes.includes(parsed.prereleaseType);
    if (!isAllowedType) {
      return {
        valid: false,
        reason: `Version "${currentVersion}" with prerelease type "${parsed.prereleaseType || 'none'}" is not permitted in channel "${policy.name}"`
      };
    }

    return { valid: true };
  }
}
