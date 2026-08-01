import { ActivityEventType } from './activity.constants';
import { Logger } from '../../services/logger';
import { publish } from '../../services/eventBusFacade';

const MODULE = 'WindowService';

export class WindowService {
  private static isInitialized = false;

  public static init(): void {
    if (this.isInitialized || typeof chrome === 'undefined' || !chrome.windows) {
      return;
    }
    this.isInitialized = true;
    Logger.info(MODULE, 'WindowService initialized - listening to chrome.windows API');

    // 1. Window Created
    chrome.windows.onCreated.addListener((window) => {
      publish('browser.window.created', {
        source: 'Browser',
        severity: 'INFO',
        workspaceId: null,
        workspaceName: null,
        tabId: null,
        windowId: window.id || null,
        eventType: ActivityEventType.WINDOW_CREATED,
        title: 'Window Created',
        url: '',
        description: `New browser window created (ID: ${window.id}, Type: ${window.type})`,
        status: 'INFO',
        metadata: { state: window.state, incognito: window.incognito }
      });
    });

    // 2. Window Removed
    chrome.windows.onRemoved.addListener((windowId) => {
      publish('browser.window.removed', {
        source: 'Browser',
        severity: 'INFO',
        workspaceId: null,
        workspaceName: null,
        tabId: null,
        windowId,
        eventType: ActivityEventType.WINDOW_REMOVED,
        title: 'Window Closed',
        url: '',
        description: `Browser window closed (ID: ${windowId})`,
        status: 'INFO',
        metadata: {}
      });
    });

    // 3. Window Focus Changed
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        publish('browser.window.focus', {
          source: 'Browser',
          severity: 'INFO',
          workspaceId: null,
          workspaceName: null,
          tabId: null,
          windowId,
          eventType: ActivityEventType.WINDOW_FOCUS_CHANGED,
          title: 'Window Focused',
          url: '',
          description: `Browser window focused (ID: ${windowId})`,
          status: 'INFO',
          metadata: {}
        });
      }
    });
  }
}
