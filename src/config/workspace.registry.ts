import { Workspace, MatchPattern } from './interfaces';
import { StorageService } from './storage.service';
import { ValidationService } from './validation.service';
import { STORAGE_KEYS, DEFAULT_WORKSPACES_SEED, CONFIG_VERSION } from './constants';
import { Logger } from '../services/logger';

const MODULE = 'WorkspaceRegistry';

export class WorkspaceRegistry {
  /**
   * Get all workspaces (seeds defaults if storage empty)
   */
  public static async getAll(): Promise<Workspace[]> {
    const stored = await StorageService.get<Workspace[]>(STORAGE_KEYS.WORKSPACES);
    if (!stored || stored.length === 0) {
      Logger.info(MODULE, 'Storage empty. Seeding default Workspaces.');
      await StorageService.set(STORAGE_KEYS.WORKSPACES, DEFAULT_WORKSPACES_SEED);
      return DEFAULT_WORKSPACES_SEED;
    }
    return stored;
  }

  /**
   * Get workspace by ID
   */
  public static async getById(id: string): Promise<Workspace | null> {
    const workspaces = await this.getAll();
    return workspaces.find((w) => w.id === id) || null;
  }

  /**
   * Create new workspace
   */
  public static async create(
    workspaceData: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'version'>
  ): Promise<Workspace> {
    const workspaces = await this.getAll();

    const newWorkspace: Workspace = {
      ...workspaceData,
      id: `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      version: CONFIG_VERSION,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const validation = ValidationService.validateWorkspace(newWorkspace);
    if (!validation.valid) {
      throw new Error(`Workspace validation failed: ${validation.errors.join(', ')}`);
    }

    workspaces.push(newWorkspace);
    await StorageService.set(STORAGE_KEYS.WORKSPACES, workspaces);
    Logger.info(MODULE, `Created Workspace [${newWorkspace.application} - ${newWorkspace.name}]`);
    return newWorkspace;
  }

  /**
   * Update existing workspace
   */
  public static async update(
    id: string,
    updates: Partial<Omit<Workspace, 'id' | 'createdAt'>>
  ): Promise<Workspace> {
    const workspaces = await this.getAll();
    const index = workspaces.findIndex((w) => w.id === id);
    if (index === -1) throw new Error(`Workspace [${id}] not found`);

    const updatedWorkspace: Workspace = {
      ...workspaces[index],
      ...updates,
      updatedAt: Date.now()
    };

    const validation = ValidationService.validateWorkspace(updatedWorkspace);
    if (!validation.valid) {
      throw new Error(`Workspace validation failed: ${validation.errors.join(', ')}`);
    }

    workspaces[index] = updatedWorkspace;
    await StorageService.set(STORAGE_KEYS.WORKSPACES, workspaces);
    Logger.info(MODULE, `Updated Workspace [${updatedWorkspace.name}]`);
    return updatedWorkspace;
  }

  /**
   * Delete workspace by ID
   */
  public static async delete(id: string): Promise<boolean> {
    const workspaces = await this.getAll();
    const filtered = workspaces.filter((w) => w.id !== id);
    if (filtered.length === workspaces.length) return false;

    await StorageService.set(STORAGE_KEYS.WORKSPACES, filtered);
    Logger.info(MODULE, `Deleted Workspace [${id}]`);
    return true;
  }

  /**
   * Toggle workspace enabled status
   */
  public static async toggleEnabled(id: string): Promise<boolean> {
    const workspace = await this.getById(id);
    if (!workspace) return false;

    const updated = await this.update(id, { enabled: !workspace.enabled });
    return updated.enabled;
  }

  /**
   * Add a Match Pattern to a Workspace
   */
  public static async addMatchPattern(
    workspaceId: string,
    pattern: Omit<MatchPattern, 'id'>
  ): Promise<Workspace> {
    const workspace = await this.getById(workspaceId);
    if (!workspace) throw new Error(`Workspace [${workspaceId}] not found`);

    const newPattern: MatchPattern = {
      ...pattern,
      id: `mp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    const updatedPatterns = [...workspace.matchPatterns, newPattern];
    return this.update(workspaceId, { matchPatterns: updatedPatterns });
  }

  /**
   * Update a Match Pattern in a Workspace
   */
  public static async updateMatchPattern(
    workspaceId: string,
    patternId: string,
    updates: Partial<Omit<MatchPattern, 'id'>>
  ): Promise<Workspace> {
    const workspace = await this.getById(workspaceId);
    if (!workspace) throw new Error(`Workspace [${workspaceId}] not found`);

    const updatedPatterns = workspace.matchPatterns.map((mp) =>
      mp.id === patternId ? { ...mp, ...updates } : mp
    );

    return this.update(workspaceId, { matchPatterns: updatedPatterns });
  }

  /**
   * Delete a Match Pattern from a Workspace
   */
  public static async deleteMatchPattern(
    workspaceId: string,
    patternId: string
  ): Promise<Workspace> {
    const workspace = await this.getById(workspaceId);
    if (!workspace) throw new Error(`Workspace [${workspaceId}] not found`);

    const updatedPatterns = workspace.matchPatterns.filter((mp) => mp.id !== patternId);
    return this.update(workspaceId, { matchPatterns: updatedPatterns });
  }
}
