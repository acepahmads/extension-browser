import { ActivityEventType } from './activity.constants';
import { ConfigurationService } from '../../config';
import { extractHostname, truncateUrl } from '../../utils/url';
import { Logger } from '../../services/logger';
import { publish } from '../../services/eventBusFacade';

const MODULE = 'NavigationService';

export class NavigationService {
  private static isInitialized = false;

  public static init(): void {
    if (this.isInitialized || typeof chrome === 'undefined' || !chrome.webNavigation) {
      return;
    }
    this.isInitialized = true;
    Logger.info(MODULE, 'NavigationService initialized - listening to chrome.webNavigation API');

    // 1. Navigation Started (Top frame)
    chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
      if (details.frameId === 0) {
        const url = details.url;
        const resolved = await ConfigurationService.resolveActiveWorkspace(url);

        publish('browser.navigation.started', {
          source: 'Browser',
          severity: 'INFO',
          workspaceId: resolved?.workspace.id || null,
          workspaceName: resolved?.workspace ? `${resolved.workspace.application} (${resolved.workspace.name})` : null,
          tabId: details.tabId,
          windowId: null,
          eventType: ActivityEventType.NAVIGATION_STARTED,
          title: `Navigating to ${extractHostname(url)}`,
          url,
          description: `Navigation started to ${truncateUrl(url, 40)}`,
          status: 'INFO',
          duration: null,
          metadata: { timeStamp: details.timeStamp, frameId: details.frameId }
        });
      }
    });

    // 2. Navigation Completed
    chrome.webNavigation.onCompleted.addListener(async (details) => {
      if (details.frameId === 0) {
        const url = details.url;
        const resolved = await ConfigurationService.resolveActiveWorkspace(url);

        publish('browser.navigation.completed', {
          source: 'Browser',
          severity: 'SUCCESS',
          workspaceId: resolved?.workspace.id || null,
          workspaceName: resolved?.workspace ? `${resolved.workspace.application} (${resolved.workspace.name})` : null,
          tabId: details.tabId,
          windowId: null,
          eventType: ActivityEventType.NAVIGATION_COMPLETED,
          title: `Loaded ${extractHostname(url)}`,
          url,
          description: `Navigation completed for ${truncateUrl(url, 40)}`,
          status: 'SUCCESS',
          duration: null,
          metadata: { timeStamp: details.timeStamp }
        });
      }
    });
  }
}
