import { SystemSettings } from './interfaces';
import { StorageService } from './storage.service';
import { STORAGE_KEYS, CONFIG_VERSION } from './constants';

const DEFAULT_SETTINGS: SystemSettings = {
  configVersion: CONFIG_VERSION,
  developerMode: true,
  theme: 'dark',
  activeWorkspaceId: null,
  eventBusFlags: {
    publishEnabled: true,
    subscribeEnabled: true,
    businessExecutionEnabled: true,
    legacyExecutionEnabled: false,
    shadowComparisonEnabled: false
  },
  lastUpdated: Date.now()
};

export class SettingsService {
  public static async get(): Promise<SystemSettings> {
    const stored = await StorageService.get<SystemSettings>(STORAGE_KEYS.SETTINGS);
    if (!stored) {
      await StorageService.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    if (!stored.eventBusFlags) {
      return {
        ...stored,
        eventBusFlags: DEFAULT_SETTINGS.eventBusFlags
      };
    }
    return stored;
  }

  public static async update(updates: Partial<SystemSettings>): Promise<SystemSettings> {
    const current = await this.get();
    const updated: SystemSettings = {
      ...current,
      ...updates,
      lastUpdated: Date.now()
    };
    await StorageService.set(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  public static async toggleDevMode(): Promise<boolean> {
    const settings = await this.get();
    const updated = await this.update({ developerMode: !settings.developerMode });
    return updated.developerMode;
  }
}
