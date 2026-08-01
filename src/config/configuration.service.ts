import { WorkspaceRegistry } from './workspace.registry';
import { WorkspaceResolver, ResolutionResult } from './workspace.resolver';
import { EnvironmentRegistry } from './environment.registry';
import { SettingsService } from './settings.service';
import { ValidationService } from './validation.service';
import { StorageService } from './storage.service';
import { CONFIG_VERSION, APP_NAME, APP_TAGLINE } from './constants';
import { Workspace, MatchPattern, SystemSettings } from './interfaces';

export class ConfigurationService {
  public static readonly VERSION = CONFIG_VERSION;
  public static readonly APP_NAME = APP_NAME;
  public static readonly APP_TAGLINE = APP_TAGLINE;

  // Storage Abstraction
  public static readonly Storage = StorageService;

  // Workspace Registry Sub-system
  public static readonly Workspaces = WorkspaceRegistry;

  // Workspace Resolver Sub-system
  public static readonly Resolver = WorkspaceResolver;

  // Environment Registry Sub-system
  public static readonly Environments = EnvironmentRegistry;

  // System Settings Sub-system
  public static readonly Settings = SettingsService;

  // Validation Sub-system
  public static readonly Validation = ValidationService;

  /**
   * Helper shortcut to resolve active workspace from URL
   */
  public static async resolveActiveWorkspace(url: string): Promise<ResolutionResult | null> {
    return WorkspaceResolver.resolveUrl(url);
  }

  /**
   * Initialize Configuration Layer
   */
  public static async init(): Promise<{ settings: SystemSettings; workspaces: Workspace[] }> {
    const settings = await SettingsService.get();
    const workspaces = await WorkspaceRegistry.getAll();
    return { settings, workspaces };
  }
}
