/**
 * Activity Engine Constants and Event Enum
 */

export const MAX_EVENT_BUFFER_SIZE = 500;

export enum ActivityEventType {
  EXTENSION_INSTALLED = 'Extension Installed',
  EXTENSION_UPDATED = 'Extension Updated',
  EXTENSION_STARTED = 'Extension Started',
  BROWSER_STARTED = 'Browser Started',
  BACKGROUND_READY = 'Background Ready',
  POPUP_CONNECTED = 'Popup Connected',
  OPTIONS_OPENED = 'Options Opened',
  OPTIONS_CLOSED = 'Options Closed',
  WINDOW_CREATED = 'Window Created',
  WINDOW_REMOVED = 'Window Removed',
  WINDOW_FOCUS_CHANGED = 'Window Focus Changed',
  TAB_CREATED = 'Tab Created',
  TAB_UPDATED = 'Tab Updated',
  TAB_ACTIVATED = 'Tab Activated',
  TAB_REMOVED = 'Tab Removed',
  NAVIGATION_STARTED = 'Navigation Started',
  NAVIGATION_COMPLETED = 'Navigation Completed',
  PAGE_LOADED = 'Page Loaded',
  CONTENT_SCRIPT_CONNECTED = 'Content Script Connected',
  WORKSPACE_DETECTED = 'Workspace Detected',
  WORKSPACE_CHANGED = 'Workspace Changed',
  SETTINGS_UPDATED = 'Settings Updated',
  STORAGE_UPDATED = 'Storage Updated'
}

export const EVENT_ICONS: Record<string, string> = {
  [ActivityEventType.EXTENSION_INSTALLED]: '📦',
  [ActivityEventType.EXTENSION_UPDATED]: '🔄',
  [ActivityEventType.EXTENSION_STARTED]: '⚡',
  [ActivityEventType.BROWSER_STARTED]: '🚀',
  [ActivityEventType.BACKGROUND_READY]: '🛡️',
  [ActivityEventType.POPUP_CONNECTED]: '🔌',
  [ActivityEventType.OPTIONS_OPENED]: '⚙️',
  [ActivityEventType.OPTIONS_CLOSED]: '🔒',
  [ActivityEventType.WINDOW_CREATED]: '🪟',
  [ActivityEventType.WINDOW_REMOVED]: '🗑️',
  [ActivityEventType.WINDOW_FOCUS_CHANGED]: '👁️',
  [ActivityEventType.TAB_CREATED]: '📑',
  [ActivityEventType.TAB_UPDATED]: '📝',
  [ActivityEventType.TAB_ACTIVATED]: '🎯',
  [ActivityEventType.TAB_REMOVED]: '❌',
  [ActivityEventType.NAVIGATION_STARTED]: '⛵',
  [ActivityEventType.NAVIGATION_COMPLETED]: '✅',
  [ActivityEventType.PAGE_LOADED]: '📄',
  [ActivityEventType.CONTENT_SCRIPT_CONNECTED]: '🔗',
  [ActivityEventType.WORKSPACE_DETECTED]: '🏛️',
  [ActivityEventType.WORKSPACE_CHANGED]: '🔀',
  [ActivityEventType.SETTINGS_UPDATED]: '⚙️',
  [ActivityEventType.STORAGE_UPDATED]: '💾'
};
