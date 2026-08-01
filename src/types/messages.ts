/**
 * IPC Message Types and Schemas for SPPG Companion
 */

import { Workspace, MatchPattern } from '../config/interfaces';
import { ActivityEvent } from '../modules/lifecycle/activity.types';

export enum MessageType {
  TAB_URL_CHANGED = 'TAB_URL_CHANGED',
  GET_EXTENSION_STATUS = 'GET_EXTENSION_STATUS',
  GET_CURRENT_TAB = 'GET_CURRENT_TAB',
  TOGGLE_DEV_MODE = 'TOGGLE_DEV_MODE',
  EXTENSION_HEARTBEAT = 'EXTENSION_HEARTBEAT',
  STATUS_RESPONSE = 'STATUS_RESPONSE',

  // Workspace Registry & Configuration Messages
  GET_WORKSPACES = 'GET_WORKSPACES',
  CREATE_WORKSPACE = 'CREATE_WORKSPACE',
  UPDATE_WORKSPACE = 'UPDATE_WORKSPACE',
  DELETE_WORKSPACE = 'DELETE_WORKSPACE',
  TOGGLE_WORKSPACE = 'TOGGLE_WORKSPACE',
  ADD_MATCH_PATTERN = 'ADD_MATCH_PATTERN',
  UPDATE_MATCH_PATTERN = 'UPDATE_MATCH_PATTERN',
  DELETE_MATCH_PATTERN = 'DELETE_MATCH_PATTERN',
  RESOLVE_WORKSPACE = 'RESOLVE_WORKSPACE',

  // Browser Lifecycle & Activity Engine Messages
  ACTIVITY_EVENT_LOGGED = 'ACTIVITY_EVENT_LOGGED',
  GET_ACTIVITIES = 'GET_ACTIVITIES',
  CLEAR_ACTIVITIES = 'CLEAR_ACTIVITIES',
  GENERATE_TEST_EVENT = 'GENERATE_TEST_EVENT',
  POPUP_CONNECTED = 'POPUP_CONNECTED',
  OPTIONS_OPENED = 'OPTIONS_OPENED',
  OPTIONS_CLOSED = 'OPTIONS_CLOSED',
  CONTENT_SCRIPT_CONNECTED = 'CONTENT_SCRIPT_CONNECTED'
}

export interface TabInfoPayload {
  tabId?: number;
  url: string;
  hostname: string;
  title: string;
  timestamp: number;
  activeWorkspace?: Workspace | null;
  matchedPattern?: MatchPattern | null;
}

export interface ExtensionStatusPayload {
  version: string;
  configVersion: string;
  appName: string;
  manifestVersion: number;
  browser: string;
  isDevMode: boolean;
  activeTab?: TabInfoPayload;
  activeWorkspace?: Workspace | null;
  matchedPattern?: MatchPattern | null;
  timestamp: number;
}

export interface ExtensionMessage<T = unknown> {
  type: MessageType;
  sender?: 'CONTENT_SCRIPT' | 'BACKGROUND' | 'POPUP' | 'OPTIONS';
  payload?: T;
}

export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
