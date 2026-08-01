import { defineStore } from 'pinia';
import { Workspace, MatchPattern } from '../config/interfaces';
import { ConfigurationService } from '../config';
import { extractHostname } from '../utils/url';
import { MessageBus } from '../services/messageBus';
import { MessageType, ExtensionStatusPayload } from '../types/messages';

export const useBrowserStore = defineStore('browser', {
  state: () => ({
    browserName: (typeof navigator !== 'undefined' && navigator.userAgent.includes('Edg/')) ? 'Microsoft Edge' : 'Google Chrome',
    currentTabId: undefined as number | undefined,
    currentUrl: 'http://localhost:5173/',
    currentDomain: 'localhost',
    currentTitle: 'Developer Workspace',
    activeWorkspace: null as Workspace | null,
    activeMatchedPattern: null as MatchPattern | null,
    workspacesList: [] as Workspace[]
  }),

  actions: {
    async loadWorkspaces() {
      this.workspacesList = await ConfigurationService.Workspaces.getAll();
      if (this.currentUrl) {
        const resolved = await ConfigurationService.resolveActiveWorkspace(this.currentUrl);
        if (resolved) {
          this.activeWorkspace = resolved.workspace;
          this.activeMatchedPattern = resolved.matchedPattern;
        } else {
          this.activeWorkspace = null;
          this.activeMatchedPattern = null;
        }
      }
    },

    async loadActiveTab() {
      await this.loadWorkspaces();

      // 1. Query browser active tab directly if available
      if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          if (tabs.length > 0 && tabs[0].url) {
            const activeTab = tabs[0];
            const tabUrl = activeTab.url || '';
            this.currentTabId = activeTab.id;
            this.currentUrl = tabUrl;
            this.currentDomain = extractHostname(tabUrl);
            this.currentTitle = activeTab.title || 'Untitled Tab';

            // Resolve Active Workspace dynamically via Configuration Layer
            const resolved = await ConfigurationService.resolveActiveWorkspace(tabUrl);
            if (resolved) {
              this.activeWorkspace = resolved.workspace;
              this.activeMatchedPattern = resolved.matchedPattern;
            } else {
              this.activeWorkspace = null;
              this.activeMatchedPattern = null;
            }
          }
        });
      }

      // 2. Fallback to background query via IPC
      try {
        const response = await MessageBus.send<null, ExtensionStatusPayload>({
          type: MessageType.GET_EXTENSION_STATUS,
          sender: 'POPUP'
        });

        if (response.success && response.data?.activeTab) {
          const tab = response.data.activeTab;
          if (tab.url && tab.url !== 'chrome://newtab') {
            this.currentUrl = tab.url;
            this.currentDomain = tab.hostname || extractHostname(tab.url);
            this.currentTitle = tab.title || this.currentTitle;
            this.activeWorkspace = response.data.activeWorkspace || (await ConfigurationService.resolveActiveWorkspace(tab.url))?.workspace || null;
            this.activeMatchedPattern = response.data.matchedPattern || (await ConfigurationService.resolveActiveWorkspace(tab.url))?.matchedPattern || null;
          }
        }
      } catch (err) {
        console.debug('Active tab query fallback notice', err);
      }
    },

    async createWorkspace(workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'version'>) {
      const created = await ConfigurationService.Workspaces.create(workspace);
      await this.loadWorkspaces();
      return created;
    },

    async updateWorkspace(id: string, updates: Partial<Omit<Workspace, 'id' | 'createdAt'>>) {
      const updated = await ConfigurationService.Workspaces.update(id, updates);
      await this.loadWorkspaces();
      return updated;
    },

    async deleteWorkspace(id: string) {
      const success = await ConfigurationService.Workspaces.delete(id);
      await this.loadWorkspaces();
      return success;
    },

    async toggleWorkspaceEnabled(id: string) {
      const enabled = await ConfigurationService.Workspaces.toggleEnabled(id);
      await this.loadWorkspaces();
      return enabled;
    },

    async addMatchPattern(workspaceId: string, pattern: Omit<MatchPattern, 'id'>) {
      const updated = await ConfigurationService.Workspaces.addMatchPattern(workspaceId, pattern);
      await this.loadWorkspaces();
      return updated;
    },

    async updateMatchPattern(workspaceId: string, patternId: string, updates: Partial<Omit<MatchPattern, 'id'>>) {
      const updated = await ConfigurationService.Workspaces.updateMatchPattern(workspaceId, patternId, updates);
      await this.loadWorkspaces();
      return updated;
    },

    async deleteMatchPattern(workspaceId: string, patternId: string) {
      const updated = await ConfigurationService.Workspaces.deleteMatchPattern(workspaceId, patternId);
      await this.loadWorkspaces();
      return updated;
    }
  }
});
