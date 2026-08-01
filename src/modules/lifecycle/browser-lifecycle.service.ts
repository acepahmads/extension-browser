import { TabService } from './tab.service';
import { NavigationService } from './navigation.service';
import { WindowService } from './window.service';
import { ActivityEventType } from './activity.constants';
import { Logger } from '../../services/logger';
import { publish } from '../../services/eventBusFacade';

const MODULE = 'BrowserLifecycleService';

export class BrowserLifecycleService {
  private static isStarted = false;

  /**
   * Master initialization of all browser lifecycle services & Chrome API listeners
   */
  public static init(): void {
    if (this.isStarted) return;
    this.isStarted = true;

    Logger.info(MODULE, 'Initializing Master Browser Lifecycle Engine');

    // Initialize sub-services
    TabService.init();
    NavigationService.init();
    WindowService.init();

    // Publish Extension Started event to EventBus
    publish('browser.window.created', {
      source: 'Background',
      severity: 'SUCCESS',
      workspaceId: null,
      workspaceName: null,
      tabId: null,
      windowId: null,
      eventType: ActivityEventType.EXTENSION_STARTED,
      title: 'SPPG Companion Active',
      url: '',
      description: 'SPPG Companion Browser Lifecycle Engine initialized',
      status: 'SUCCESS',
      metadata: { engineVersion: '1.0.0', platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown' }
    });
  }

  /**
   * Helper to generate a test event for Test Center onto EventBus
   */
  public static generateTestEvent(
    type: 'PAGE_LOADED' | 'NAVIGATION' | 'WORKSPACE' | 'STORAGE'
  ): { success: boolean; eventType: string } {
    let topic = 'browser.tab.updated';
    let eventType = ActivityEventType.PAGE_LOADED;

    switch (type) {
      case 'NAVIGATION':
        topic = 'browser.navigation.started';
        eventType = ActivityEventType.NAVIGATION_STARTED;
        break;
      case 'WORKSPACE':
        topic = 'workspace.changed';
        eventType = ActivityEventType.WORKSPACE_DETECTED;
        break;
      case 'STORAGE':
        topic = 'storage.changed';
        eventType = ActivityEventType.STORAGE_UPDATED;
        break;
      case 'PAGE_LOADED':
      default:
        topic = 'browser.tab.updated';
        eventType = ActivityEventType.PAGE_LOADED;
        break;
    }

    publish(topic, {
      source: 'TestCenter',
      severity: 'INFO',
      eventType,
      timestamp: Date.now(),
      description: `Simulated test event [${type}]`
    });

    return { success: true, eventType };
  }
}
