import { ActivityEventType } from './activity.constants';
import { ConfigurationService } from '../../config';
import { extractHostname, truncateUrl } from '../../utils/url';
import { Logger } from '../../services/logger';
import { publish } from '../../services/eventBusFacade';

const MODULE = 'TabService';

export class TabService {
  private static isInitialized = false;

  public static init(): void {
    if (this.isInitialized || typeof chrome === 'undefined' || !chrome.tabs) {
      return;
    }
    this.isInitialized = true;
    Logger.info(MODULE, 'TabService initialized - listening to chrome.tabs API');

    // 1. Tab Created
    chrome.tabs.onCreated.addListener(async (tab) => {
      const url = tab.url || 'chrome://newtab';
      const resolved = await ConfigurationService.resolveActiveWorkspace(url);

      publish('browser.tab.created', {
        source: 'Browser',
        severity: 'INFO',
        workspaceId: resolved?.workspace.id || null,
        workspaceName: resolved?.workspace ? `${resolved.workspace.application} (${resolved.workspace.name})` : null,
        tabId: tab.id || null,
        windowId: tab.windowId || null,
        eventType: ActivityEventType.TAB_CREATED,
        title: tab.title || 'New Tab',
        url,
        description: `New tab created (ID: ${tab.id})`,
        status: 'INFO',
        metadata: { active: tab.active, pinned: tab.pinned }
      });
    });

    // 2. Tab Updated
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' || changeInfo.url) {
        const url = tab.url || changeInfo.url || 'about:blank';
        const title = tab.title || 'Untitled Tab';
        const resolved = await ConfigurationService.resolveActiveWorkspace(url);

        publish('browser.tab.updated', {
          source: 'Browser',
          severity: changeInfo.status === 'complete' ? 'SUCCESS' : 'INFO',
          workspaceId: resolved?.workspace.id || null,
          workspaceName: resolved?.workspace ? `${resolved.workspace.application} (${resolved.workspace.name})` : null,
          tabId,
          windowId: tab.windowId || null,
          eventType: changeInfo.status === 'complete' ? ActivityEventType.PAGE_LOADED : ActivityEventType.TAB_UPDATED,
          title,
          url,
          description: changeInfo.status === 'complete' ? `Page loaded: ${title} (${truncateUrl(url, 30)})` : `Tab updated: ${extractHostname(url)}`,
          status: changeInfo.status === 'complete' ? 'SUCCESS' : 'INFO',
          duration: null,
          metadata: { status: changeInfo.status, hostname: extractHostname(url) }
        });
      }
    });

    // 3. Tab Activated (Switched Tab)
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        const url = tab.url || '';
        const title = tab.title || 'Untitled Tab';
        const resolved = await ConfigurationService.resolveActiveWorkspace(url);

        publish('browser.tab.updated', {
          source: 'Browser',
          severity: 'INFO',
          workspaceId: resolved?.workspace.id || null,
          workspaceName: resolved?.workspace ? `${resolved.workspace.application} (${resolved.workspace.name})` : null,
          tabId: activeInfo.tabId,
          windowId: activeInfo.windowId,
          eventType: ActivityEventType.TAB_ACTIVATED,
          title,
          url,
          description: `Switched active tab to: ${title}`,
          status: 'INFO',
          metadata: { windowId: activeInfo.windowId }
        });
      } catch (err) {
        Logger.debug(MODULE, 'Tab query error on tab activated', err);
      }
    });

    // 4. Tab Removed
    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
      publish('browser.tab.removed', {
        source: 'Browser',
        severity: 'INFO',
        workspaceId: null,
        workspaceName: null,
        tabId,
        windowId: removeInfo.windowId,
        eventType: ActivityEventType.TAB_REMOVED,
        title: 'Tab Closed',
        url: '',
        description: `Tab closed (ID: ${tabId})`,
        status: 'INFO',
        metadata: { isWindowClosing: removeInfo.isWindowClosing }
      });
    });
  }
}
