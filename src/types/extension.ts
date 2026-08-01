/**
 * Core Domain Models for SPPG Browser Extension
 */

export type EnvironmentType = 'Development' | 'Staging' | 'Production' | 'Testing';

export interface TargetWebsite {
  id: string;
  name: string;
  description: string;
  environment: EnvironmentType;
  baseUrl: string;
  matchPattern: string; // Wildcard pattern, e.g. "http://localhost:5173/*"
  enabled: boolean;
  icon: string;
  colorLabel: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExtensionConfig {
  version: string;
  manifestVersion: number;
  developerMode: boolean;
  theme: 'dark' | 'light' | 'system';
  environment: 'development' | 'production';
}

export interface BrowserContext {
  name: string; // e.g. "Chrome" | "Edge"
  userAgent: string;
  vendor: string;
  platform: string;
  language: string;
}

export interface ActiveTabState {
  id?: number;
  url: string;
  hostname: string;
  title: string;
  favIconUrl?: string;
  status?: string;
  activeTarget?: TargetWebsite | null;
}
