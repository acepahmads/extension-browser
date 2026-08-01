import { Logger } from '../services/logger';
import { MessageBus } from '../services/messageBus';
import { publish, setEventBusFeatureFlags } from '../services/eventBusFacade';
import { SubscriberRegistry } from '../core/event-bus/subscribers/subscriber.registry';
import { BusinessSubscriber } from '../core/business-framework/business.subscriber';
import { ConfigurationService } from '../config';
import { Workspace, MatchPattern } from '../config/interfaces';
import { BrowserLifecycleService, ActivityService, ActivityFilterOptions, ActivityEventType } from '../modules/lifecycle';
import { MessageType, TabInfoPayload, ExtensionStatusPayload } from '../types/messages';
import { extractHostname } from '../utils/url';

const MODULE = 'BackgroundWorker';

// In-memory active state cache
let activeTabInfo: TabInfoPayload = {
  url: 'chrome://newtab',
  hostname: 'Browser Internal',
  title: 'New Tab',
  timestamp: Date.now()
};

let currentActiveWorkspace: Workspace | null = null;
let currentMatchedPattern: MatchPattern | null = null;
let isDevMode = true;

/**
 * Initialize SPPG Companion Background Service Worker
 */
async function initBackground(): Promise<void> {
  Logger.info(MODULE, 'SPPG Companion Service Worker initialized (MV3)');

  // 1. Initialize Configuration Layer & Workspace Registry
  const config = await ConfigurationService.init();
  if (config.settings.eventBusFlags) {
    setEventBusFeatureFlags(config.settings.eventBusFlags);
  }

  // 2. Initialize EventBus Subscriber Registry (gated by subscribeEnabled)
  SubscriberRegistry.init();

  // 3. Initialize Business Framework Execution Engine (gated by businessExecutionEnabled)
  BusinessSubscriber.init();

  // 4. Initialize Master Browser Lifecycle Engine
  BrowserLifecycleService.init();

  // 5. Extension Install / Update Event Listener
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        Logger.info(MODULE, 'SPPG Companion Installed successfully [v1.0.0]');
        publish('browser.window.created', {
          source: 'System',
          severity: 'SUCCESS',
          workspaceId: null,
          workspaceName: null,
          tabId: null,
          windowId: null,
          eventType: ActivityEventType.EXTENSION_INSTALLED,
          title: 'SPPG Extension Installed',
          url: '',
          description: 'SPPG Companion extension installed successfully',
          status: 'SUCCESS',
          metadata: { version: '1.0.0', reason: details.reason }
        });
      } else if (details.reason === 'update') {
        Logger.info(MODULE, `SPPG Companion Updated to version [v1.0.0] from [${details.previousVersion}]`);
        publish('browser.window.created', {
          source: 'System',
          severity: 'INFO',
          workspaceId: null,
          workspaceName: null,
          tabId: null,
          windowId: null,
          eventType: ActivityEventType.EXTENSION_UPDATED,
          title: 'SPPG Extension Updated',
          url: '',
          description: `Extension updated from v${details.previousVersion || 'unknown'} to v1.0.0`,
          status: 'INFO',
          metadata: { previousVersion: details.previousVersion, currentVersion: '1.0.0' }
        });
      }
    });

    // 6. Browser Startup Listener
    chrome.runtime.onStartup.addListener(() => {
      Logger.info(MODULE, 'Browser started - SPPG Companion background worker active');
      publish('browser.window.created', {
        source: 'Browser',
        severity: 'SUCCESS',
        workspaceId: null,
        workspaceName: null,
        tabId: null,
        windowId: null,
        eventType: ActivityEventType.BROWSER_STARTED,
        title: 'Browser Started',
        url: '',
        description: 'Browser startup sequence detected.',
        status: 'SUCCESS',
        metadata: {}
      });
    });
  }

  // 7. Chrome Storage Change Observer
  if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      publish('storage.changed', {
        source: 'Storage',
        severity: 'INFO',
        workspaceId: currentActiveWorkspace?.id || null,
        workspaceName: currentActiveWorkspace ? `${currentActiveWorkspace.application} (${currentActiveWorkspace.name})` : null,
        tabId: activeTabInfo.tabId || null,
        windowId: null,
        eventType: ActivityEventType.STORAGE_UPDATED,
        title: 'Storage Updated',
        url: activeTabInfo.url || '',
        description: `Storage area [${areaName}] updated with ${Object.keys(changes).length} key(s)`,
        status: 'INFO',
        metadata: { areaName, updatedKeys: Object.keys(changes) }
      });
    });
  }

  // 6. Heartbeat Mechanism (Pulse log every 30 seconds)
  setInterval(async () => {
    Logger.debug(MODULE, 'Heartbeat pulse - Service Worker healthy', {
      timestamp: new Date().toISOString(),
      currentTab: activeTabInfo.hostname,
      activeWorkspace: currentActiveWorkspace ? `${currentActiveWorkspace.application} - ${currentActiveWorkspace.name}` : 'None'
    });
  }, 30000);

  // 7. Tab Navigation Listener via chrome.tabs API
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab && tab.url) {
          await updateActiveTab(tab.id, tab.url, tab.title || '');
        }
      } catch (err) {
        Logger.debug(MODULE, 'Error retrieving active tab on activation', err);
      }
    });
  }

  // Log Background Ready Lifecycle Event
  ActivityService.createEvent({
    source: 'Background',
    severity: 'SUCCESS',
    workspaceId: null,
    workspaceName: null,
    tabId: null,
    windowId: null,
    eventType: ActivityEventType.BACKGROUND_READY,
    title: 'Background Engine Ready',
    url: '',
    description: `Service Worker background services ready for session ${ActivityService.getSessionId()}`,
    status: 'SUCCESS',
    metadata: { sessionId: ActivityService.getSessionId(), activeWorkspaces: (await ConfigurationService.Workspaces.getAll()).length }
  });

  // 8. Setup Message Bus Listener
  MessageBus.listen((message, _sender, sendResponse) => {
    Logger.debug(MODULE, `Received message: ${message.type}`, message.payload);

    (async () => {
      switch (message.type) {
        case MessageType.TAB_URL_CHANGED: {
          const payload = message.payload as TabInfoPayload;
          if (payload) {
            await updateActiveTab(payload.tabId, payload.url, payload.title);
          }
          sendResponse({
            success: true,
            data: {
              activeTab: activeTabInfo,
              activeWorkspace: currentActiveWorkspace,
              matchedPattern: currentMatchedPattern
            }
          });
          break;
        }

        case MessageType.POPUP_CONNECTED: {
          ActivityService.createEvent({
            source: 'Popup',
            severity: 'INFO',
            workspaceId: currentActiveWorkspace?.id || null,
            workspaceName: currentActiveWorkspace ? `${currentActiveWorkspace.application} (${currentActiveWorkspace.name})` : null,
            tabId: activeTabInfo.tabId || null,
            windowId: null,
            eventType: ActivityEventType.POPUP_CONNECTED,
            title: 'Popup Connected',
            url: activeTabInfo.url || '',
            description: 'SPPG Companion Popup interface opened and connected to Background Worker',
            status: 'INFO',
            metadata: { activeWorkspace: currentActiveWorkspace?.name }
          });
          publish('popup.connected', {
            source: 'Popup',
            severity: 'INFO',
            workspaceId: currentActiveWorkspace?.id || null,
            workspaceName: currentActiveWorkspace ? `${currentActiveWorkspace.application} (${currentActiveWorkspace.name})` : null,
            tabId: activeTabInfo.tabId || null,
            windowId: null,
            eventType: ActivityEventType.POPUP_CONNECTED,
            title: 'Popup Connected',
            url: activeTabInfo.url || '',
            description: 'SPPG Companion Popup interface opened and connected to Background Worker',
            status: 'INFO',
            metadata: { activeWorkspace: currentActiveWorkspace?.name }
          });
          sendResponse({ success: true, data: { connected: true } });
          break;
        }

        case MessageType.OPTIONS_OPENED: {
          ActivityService.startOperationTimer('options_view');
          ActivityService.createEvent({
            source: 'Popup',
            severity: 'INFO',
            workspaceId: null,
            workspaceName: null,
            tabId: null,
            windowId: null,
            eventType: ActivityEventType.OPTIONS_OPENED,
            title: 'Options Opened',
            url: '/options/index.html',
            description: 'SPPG Developer Console / Options dashboard view opened',
            status: 'INFO',
            metadata: {}
          });
          publish('options.opened', {
            source: 'Popup',
            severity: 'INFO',
            workspaceId: null,
            workspaceName: null,
            tabId: null,
            windowId: null,
            eventType: ActivityEventType.OPTIONS_OPENED,
            title: 'Options Opened',
            url: '/options/index.html',
            description: 'SPPG Developer Console / Options dashboard view opened',
            status: 'INFO',
            metadata: {}
          });
          sendResponse({ success: true, data: { opened: true } });
          break;
        }

        case MessageType.OPTIONS_CLOSED: {
          const duration = ActivityService.endOperationDuration('options_view');
          ActivityService.createEvent({
            source: 'Popup',
            severity: 'INFO',
            workspaceId: null,
            workspaceName: null,
            tabId: null,
            windowId: null,
            eventType: ActivityEventType.OPTIONS_CLOSED,
            title: 'Options Closed',
            url: '/options/index.html',
            description: `Options dashboard closed${duration ? ` (View duration: ${duration} ms)` : ''}`,
            status: 'INFO',
            duration,
            metadata: { durationMs: duration }
          });
          publish('options.closed', {
            source: 'Popup',
            severity: 'INFO',
            workspaceId: null,
            workspaceName: null,
            tabId: null,
            windowId: null,
            eventType: ActivityEventType.OPTIONS_CLOSED,
            title: 'Options Closed',
            url: '/options/index.html',
            description: `Options dashboard closed${duration ? ` (View duration: ${duration} ms)` : ''}`,
            status: 'INFO',
            duration,
            metadata: { durationMs: duration }
          });
          sendResponse({ success: true, data: { closed: true } });
          break;
        }

        case MessageType.CONTENT_SCRIPT_CONNECTED: {
          const payload = message.payload as TabInfoPayload;
          ActivityService.createEvent({
            source: 'Content Script',
            severity: 'SUCCESS',
            workspaceId: currentActiveWorkspace?.id || null,
            workspaceName: currentActiveWorkspace ? `${currentActiveWorkspace.application} (${currentActiveWorkspace.name})` : null,
            tabId: payload?.tabId || null,
            windowId: null,
            eventType: ActivityEventType.CONTENT_SCRIPT_CONNECTED,
            title: 'Content Script Injected',
            url: payload?.url || '',
            description: `Content script observer connected on page: ${extractHostname(payload?.url || '')}`,
            status: 'SUCCESS',
            metadata: { title: payload?.title, url: payload?.url }
          });
          publish('content.connected', {
            source: 'Content Script',
            severity: 'SUCCESS',
            workspaceId: currentActiveWorkspace?.id || null,
            workspaceName: currentActiveWorkspace ? `${currentActiveWorkspace.application} (${currentActiveWorkspace.name})` : null,
            tabId: payload?.tabId || null,
            windowId: null,
            eventType: ActivityEventType.CONTENT_SCRIPT_CONNECTED,
            title: 'Content Script Injected',
            url: payload?.url || '',
            description: `Content script observer connected on page: ${extractHostname(payload?.url || '')}`,
            status: 'SUCCESS',
            metadata: { title: payload?.title, url: payload?.url }
          });
          sendResponse({ success: true, data: { connected: true } });
          break;
        }

        case MessageType.GET_EXTENSION_STATUS: {
          const status: ExtensionStatusPayload = {
            version: '1.0.0',
            configVersion: ConfigurationService.VERSION,
            appName: ConfigurationService.APP_NAME,
            manifestVersion: 3,
            browser: getBrowserName(),
            isDevMode,
            activeTab: activeTabInfo,
            activeWorkspace: currentActiveWorkspace,
            matchedPattern: currentMatchedPattern,
            timestamp: Date.now()
          };
          sendResponse({ success: true, data: status });
          break;
        }

        case MessageType.GET_WORKSPACES: {
          const workspaces = await ConfigurationService.Workspaces.getAll();
          sendResponse({ success: true, data: workspaces });
          break;
        }

        case MessageType.CREATE_WORKSPACE: {
          const wsData = message.payload as Omit<Workspace, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
          const created = await ConfigurationService.Workspaces.create(wsData);

          ActivityService.createEvent({
            source: 'Workspace Registry',
            severity: 'SUCCESS',
            workspaceId: created.id,
            workspaceName: `${created.application} (${created.name})`,
            tabId: null,
            windowId: null,
            eventType: ActivityEventType.SETTINGS_UPDATED,
            title: 'Workspace Created',
            url: created.baseUrl,
            description: `New workspace registered: ${created.application} (${created.name})`,
            status: 'SUCCESS',
            metadata: { workspaceId: created.id }
          });

          sendResponse({ success: true, data: created });
          break;
        }

        case MessageType.UPDATE_WORKSPACE: {
          const { id, updates } = message.payload as { id: string; updates: Partial<Workspace> };
          const updated = await ConfigurationService.Workspaces.update(id, updates);

          if (updated) {
            ActivityService.createEvent({
              source: 'Workspace Registry',
              severity: 'INFO',
              workspaceId: updated.id,
              workspaceName: `${updated.application} (${updated.name})`,
              tabId: null,
              windowId: null,
              eventType: ActivityEventType.SETTINGS_UPDATED,
              title: 'Workspace Updated',
              url: updated.baseUrl,
              description: `Workspace configuration updated for: ${updated.name}`,
              status: 'INFO',
              metadata: { updates }
            });
          }

          sendResponse({ success: true, data: updated });
          break;
        }

        case MessageType.DELETE_WORKSPACE: {
          const { id } = message.payload as { id: string };
          const deleted = await ConfigurationService.Workspaces.delete(id);

          if (deleted) {
            ActivityService.createEvent({
              source: 'Workspace Registry',
              severity: 'WARNING',
              workspaceId: id,
              workspaceName: null,
              tabId: null,
              windowId: null,
              eventType: ActivityEventType.SETTINGS_UPDATED,
              title: 'Workspace Removed',
              url: '',
              description: `Workspace [${id}] removed from registry`,
              status: 'WARNING',
              metadata: { workspaceId: id }
            });
          }

          sendResponse({ success: true, data: { deleted } });
          break;
        }

        case MessageType.TOGGLE_WORKSPACE: {
          const { id } = message.payload as { id: string };
          const enabled = await ConfigurationService.Workspaces.toggleEnabled(id);

          ActivityService.createEvent({
            source: 'Workspace Registry',
            severity: 'INFO',
            workspaceId: id,
            workspaceName: null,
            tabId: null,
            windowId: null,
            eventType: ActivityEventType.SETTINGS_UPDATED,
            title: 'Workspace Toggled',
            url: '',
            description: `Workspace [${id}] state set to ${enabled ? 'enabled' : 'disabled'}`,
            status: 'INFO',
            metadata: { enabled }
          });

          sendResponse({ success: true, data: { enabled } });
          break;
        }

        case MessageType.GET_ACTIVITIES: {
          const options = message.payload as ActivityFilterOptions | undefined;
          const activities = options ? ActivityService.filterEvents(options) : ActivityService.getAllEvents();
          sendResponse({ success: true, data: activities });
          break;
        }

        case MessageType.CLEAR_ACTIVITIES: {
          ActivityService.clearEvents();
          sendResponse({ success: true, data: { cleared: true } });
          break;
        }

        case MessageType.GENERATE_TEST_EVENT: {
          const { eventType } = (message.payload as { eventType: 'PAGE_LOADED' | 'NAVIGATION' | 'WORKSPACE' | 'STORAGE' }) || { eventType: 'PAGE_LOADED' };
          const dummy = BrowserLifecycleService.generateTestEvent(eventType);
          sendResponse({ success: true, data: dummy });
          break;
        }

        case MessageType.TOGGLE_DEV_MODE: {
          isDevMode = !isDevMode;
          Logger.setMode(isDevMode ? 'development' : 'production');
          Logger.info(MODULE, `Developer mode set to: ${isDevMode}`);

          ActivityService.createEvent({
            source: 'Logger',
            severity: 'INFO',
            workspaceId: null,
            workspaceName: null,
            tabId: null,
            windowId: null,
            eventType: ActivityEventType.SETTINGS_UPDATED,
            title: 'Developer Mode Toggled',
            url: '',
            description: `Developer mode set to ${isDevMode ? 'Development (Verbose)' : 'Production (Silent)'}`,
            status: 'INFO',
            metadata: { isDevMode, loggerMode: Logger.getMode() }
          });

          sendResponse({ success: true, data: { isDevMode } });
          break;
        }

        default:
          sendResponse({ success: true, data: 'Event processed' });
          break;
      }
    })();

    return true; // Keep message channel open for async response
  });
}

async function updateActiveTab(id: number | undefined, url: string, title: string): Promise<void> {
  const hostname = extractHostname(url);
  const previousWorkspace = currentActiveWorkspace;
  const resolved = await ConfigurationService.resolveActiveWorkspace(url);

  if (resolved) {
    currentActiveWorkspace = resolved.workspace;
    currentMatchedPattern = resolved.matchedPattern;
  } else {
    currentActiveWorkspace = null;
    currentMatchedPattern = null;
  }

  // Detect Workspace Events
  if (resolved && (!previousWorkspace || previousWorkspace.id !== resolved.workspace.id)) {
    // Workspace Detected / Workspace Changed
    if (!previousWorkspace) {
      ActivityService.createEvent({
        source: 'Workspace Resolver',
        severity: 'SUCCESS',
        workspaceId: resolved.workspace.id,
        workspaceName: `${resolved.workspace.application} (${resolved.workspace.name})`,
        tabId: id || null,
        windowId: null,
        eventType: ActivityEventType.WORKSPACE_DETECTED,
        title: `Workspace Detected: ${resolved.workspace.application}`,
        url,
        description: `Active tab matched workspace [${resolved.workspace.name}] via pattern: ${resolved.matchedPattern.pattern}`,
        status: 'SUCCESS',
        metadata: { environment: resolved.workspace.environment, matchedPattern: resolved.matchedPattern.pattern }
      });
    } else {
      ActivityService.createEvent({
        source: 'Workspace Resolver',
        severity: 'INFO',
        workspaceId: resolved.workspace.id,
        workspaceName: `${resolved.workspace.application} (${resolved.workspace.name})`,
        tabId: id || null,
        windowId: null,
        eventType: ActivityEventType.WORKSPACE_CHANGED,
        title: `Workspace Switched: ${resolved.workspace.application}`,
        url,
        description: `Switched workspace from [${previousWorkspace.name}] to [${resolved.workspace.name}]`,
        status: 'INFO',
        metadata: { fromWorkspaceId: previousWorkspace.id, toWorkspaceId: resolved.workspace.id }
      });
      publish('workspace.changed', {
        source: 'Workspace Resolver',
        severity: 'INFO',
        workspaceId: resolved.workspace.id,
        workspaceName: `${resolved.workspace.application} (${resolved.workspace.name})`,
        tabId: id || null,
        windowId: null,
        eventType: ActivityEventType.WORKSPACE_CHANGED,
        title: `Workspace Switched: ${resolved.workspace.application}`,
        url,
        description: `Switched workspace from [${previousWorkspace.name}] to [${resolved.workspace.name}]`,
        status: 'INFO',
        metadata: { fromWorkspaceId: previousWorkspace.id, toWorkspaceId: resolved.workspace.id }
      });
    }
  } else if (!resolved && previousWorkspace) {
    ActivityService.createEvent({
      source: 'Workspace Resolver',
      severity: 'INFO',
      workspaceId: null,
      workspaceName: null,
      tabId: id || null,
      windowId: null,
      eventType: ActivityEventType.WORKSPACE_CHANGED,
      title: 'Workspace Left',
      url,
      description: `Switched from workspace [${previousWorkspace.name}] to unmonitored tab`,
      status: 'INFO',
      metadata: { fromWorkspaceId: previousWorkspace.id }
    });
    publish('workspace.changed', {
      source: 'Workspace Resolver',
      severity: 'INFO',
      workspaceId: null,
      workspaceName: null,
      tabId: id || null,
      windowId: null,
      eventType: ActivityEventType.WORKSPACE_CHANGED,
      title: 'Workspace Left',
      url,
      description: `Switched from workspace [${previousWorkspace.name}] to unmonitored tab`,
      status: 'INFO',
      metadata: { fromWorkspaceId: previousWorkspace.id }
    });
  }

  activeTabInfo = {
    tabId: id,
    url,
    hostname,
    title,
    activeWorkspace: currentActiveWorkspace,
    matchedPattern: currentMatchedPattern,
    timestamp: Date.now()
  };

  Logger.info(
    MODULE,
    `Active Tab Updated: ${hostname} (${url}) -> Active Workspace: [${currentActiveWorkspace ? currentActiveWorkspace.application + ' - ' + currentActiveWorkspace.name : 'None'}]`
  );
}

function getBrowserName(): string {
  if (typeof navigator !== 'undefined' && navigator.userAgent.includes('Edg/')) {
    return 'Microsoft Edge';
  }
  return 'Google Chrome';
}

// Start Service Worker
initBackground();
