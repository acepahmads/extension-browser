import { EnvironmentType } from './types';

export interface MatchPattern {
  id: string;
  pattern: string;
  enabled: boolean;
  priority: number; // Higher number = higher precedence
}

export interface Workspace {
  id: string;
  application: string;
  name: string;
  description: string;
  environment: EnvironmentType;
  baseUrl: string;
  matchPatterns: MatchPattern[];
  enabled: boolean;
  icon: string;
  color: string;
  tags: string[];
  version: string;
  createdAt: number;
  updatedAt: number;
}

export interface EnvironmentMetadata {
  key: EnvironmentType;
  label: string;
  color: string;
  badgeClass: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface EventBusFeatureFlags {
  publishEnabled: boolean;
  subscribeEnabled: boolean;
  businessExecutionEnabled?: boolean;
  legacyExecutionEnabled?: boolean;
  shadowComparisonEnabled?: boolean;
  performanceIntegrationEnabled?: boolean;
  reliabilityIntegrationEnabled?: boolean;
  observabilityIntegrationEnabled?: boolean;
}

export interface SystemSettings {
  configVersion: string;
  developerMode: boolean;
  theme: 'dark' | 'light' | 'system';
  activeWorkspaceId?: string | null;
  eventBusFlags?: EventBusFeatureFlags;
  lastUpdated: number;
}

