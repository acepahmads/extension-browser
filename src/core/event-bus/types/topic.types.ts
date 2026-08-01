/**
 * Hierarchical Topic Taxonomy and Categories - Phase 1 Core Foundation
 */

export enum EventCategory {
  SYSTEM = 'system',
  LIFECYCLE = 'lifecycle',
  WORKSPACE = 'workspace',
  NAVIGATION = 'navigation',
  STORAGE = 'storage',
  NETWORK = 'network',
  DIAGNOSTICS = 'diagnostics',
  DEVELOPER = 'developer',
  USER = 'user',
  AI = 'ai'
}

export type TopicPattern = string;
