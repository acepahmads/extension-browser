import { TargetWebsite } from '../types/extension';
import { ChromeStorageAdapter } from '../storage';
import { matchWildcardPattern } from '../utils/url';
import { Logger } from './logger';

const MODULE = 'TargetManager';
const STORAGE_KEY = 'target_websites';

const DEFAULT_TARGET_SEEDS: TargetWebsite[] = [
  {
    id: 'target-bgn-sim-dev',
    name: 'BGN Simulator Dev',
    description: 'BGN Simulator Frontend Development Environment',
    environment: 'Development',
    baseUrl: 'http://localhost:5173',
    matchPattern: 'http://localhost:5173/*',
    enabled: true,
    icon: '⚡',
    colorLabel: '#3b82f6',
    createdAt: 1722320000000,
    updatedAt: 1722320000000
  },
  {
    id: 'target-localhost',
    name: 'Localhost Generic',
    description: 'Localhost development portal',
    environment: 'Development',
    baseUrl: 'http://localhost',
    matchPattern: 'http://localhost/*',
    enabled: true,
    icon: '💻',
    colorLabel: '#10b981',
    createdAt: 1722320000000,
    updatedAt: 1722320000000
  },
  {
    id: 'target-127-0-0-1',
    name: 'Localhost IP (127.0.0.1)',
    description: 'Local IP development server',
    environment: 'Development',
    baseUrl: 'http://127.0.0.1',
    matchPattern: 'http://127.0.0.1/*',
    enabled: true,
    icon: '🖥️',
    colorLabel: '#8b5cf6',
    createdAt: 1722320000000,
    updatedAt: 1722320000000
  },
  {
    id: 'target-sipgn-prod',
    name: 'SIPGN Portal BGN',
    description: 'Portal SIPGN Badan Gizi Nasional Production',
    environment: 'Production',
    baseUrl: 'https://sipgn-aimenu.bgn.go.id',
    matchPattern: 'https://sipgn-aimenu.bgn.go.id/*',
    enabled: true,
    icon: '🏛️',
    colorLabel: '#f59e0b',
    createdAt: 1722320000000,
    updatedAt: 1722320000000
  }
];

export class TargetManager {
  private static storage = new ChromeStorageAdapter();

  /**
   * Get all configured target websites (auto-seed if storage empty)
   */
  public static async getTargets(): Promise<TargetWebsite[]> {
    try {
      const stored = await this.storage.get<TargetWebsite[]>(STORAGE_KEY);
      if (!stored || stored.length === 0) {
        Logger.info(MODULE, 'No target configuration found in storage. Seeding default targets.');
        await this.storage.set<TargetWebsite[]>(STORAGE_KEY, DEFAULT_TARGET_SEEDS);
        return DEFAULT_TARGET_SEEDS;
      }
      return stored;
    } catch (err) {
      Logger.error(MODULE, 'Failed to fetch target websites', err);
      return DEFAULT_TARGET_SEEDS;
    }
  }

  /**
   * Add a new target website configuration
   */
  public static async addTarget(
    target: Omit<TargetWebsite, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TargetWebsite> {
    const targets = await this.getTargets();
    const newTarget: TargetWebsite = {
      ...target,
      id: `target_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    targets.push(newTarget);
    await this.storage.set(STORAGE_KEY, targets);
    Logger.info(MODULE, `Added target website: [${newTarget.name}] (${newTarget.matchPattern})`);
    return newTarget;
  }

  /**
   * Update an existing target website
   */
  public static async updateTarget(
    id: string,
    updates: Partial<Omit<TargetWebsite, 'id' | 'createdAt'>>
  ): Promise<TargetWebsite | null> {
    const targets = await this.getTargets();
    const index = targets.findIndex((t) => t.id === id);
    if (index === -1) return null;

    targets[index] = {
      ...targets[index],
      ...updates,
      updatedAt: Date.now()
    };

    await this.storage.set(STORAGE_KEY, targets);
    Logger.info(MODULE, `Updated target website: [${targets[index].name}]`);
    return targets[index];
  }

  /**
   * Delete a target website profile
   */
  public static async deleteTarget(id: string): Promise<boolean> {
    const targets = await this.getTargets();
    const filtered = targets.filter((t) => t.id !== id);
    if (filtered.length === targets.length) return false;

    await this.storage.set(STORAGE_KEY, filtered);
    Logger.info(MODULE, `Deleted target website: ID [${id}]`);
    return true;
  }

  /**
   * Toggle target enabled status
   */
  public static async toggleEnabled(id: string): Promise<boolean> {
    const targets = await this.getTargets();
    const target = targets.find((t) => t.id === id);
    if (!target) return false;

    target.enabled = !target.enabled;
    target.updatedAt = Date.now();
    await this.storage.set(STORAGE_KEY, targets);
    Logger.info(MODULE, `Toggled target [${target.name}] enabled status to: ${target.enabled}`);
    return target.enabled;
  }

  /**
   * Pattern Matching Engine: Resolves active target matching current page URL
   */
  public static async findMatchingTarget(url: string): Promise<TargetWebsite | null> {
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      return null;
    }

    const targets = await this.getTargets();
    const enabledTargets = targets.filter((t) => t.enabled);

    for (const target of enabledTargets) {
      if (matchWildcardPattern(target.matchPattern, url)) {
        Logger.debug(MODULE, `Matched URL [${url}] to target profile: [${target.name}]`);
        return target;
      }
    }

    return null;
  }
}
