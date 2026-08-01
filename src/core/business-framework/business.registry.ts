/**
 * Master Business Registry - WP-4 Stage 1
 */
import { BusinessHandler } from './business.handler';
import { WorkspaceBusinessHandler } from './handlers/workspace.business-handler';
import { StorageBusinessHandler } from './handlers/storage.business-handler';
import { LifecycleBusinessHandler } from './handlers/lifecycle.business-handler';

export class BusinessRegistry {
  private static handlersMap = new Map<string, BusinessHandler[]>();

  /**
   * Initialize default domain business handlers
   */
  public static initDefaults(): void {
    this.clear();

    // 1. Workspace Domain Handlers
    this.register(new WorkspaceBusinessHandler('workspace.changed'));
    this.register(new WorkspaceBusinessHandler('workspace.created'));
    this.register(new WorkspaceBusinessHandler('workspace.updated'));

    // 2. Storage Domain Handlers
    this.register(new StorageBusinessHandler('storage.changed'));
    this.register(new StorageBusinessHandler('storage.created'));
    this.register(new StorageBusinessHandler('storage.updated'));
    this.register(new StorageBusinessHandler('storage.removed'));

    // 3. Lifecycle Domain Handlers
    this.register(new LifecycleBusinessHandler('browser.window.created'));
    this.register(new LifecycleBusinessHandler('browser.window.removed'));
    this.register(new LifecycleBusinessHandler('browser.window.focus'));
    this.register(new LifecycleBusinessHandler('browser.tab.created'));
    this.register(new LifecycleBusinessHandler('browser.tab.updated'));
    this.register(new LifecycleBusinessHandler('browser.tab.removed'));
    this.register(new LifecycleBusinessHandler('browser.navigation.started'));
    this.register(new LifecycleBusinessHandler('browser.navigation.completed'));
  }

  /**
   * Register a BusinessHandler for a target topic
   */
  public static register(handler: BusinessHandler): void {
    const existing = this.handlersMap.get(handler.targetTopic) || [];
    existing.push(handler);
    this.handlersMap.set(handler.targetTopic, existing);
  }

  /**
   * Retrieve handlers for a target topic
   */
  public static getHandlers(topic: string): BusinessHandler[] {
    return this.handlersMap.get(topic) || [];
  }

  /**
   * Clear all registered handlers
   */
  public static clear(): void {
    this.handlersMap.clear();
  }

  /**
   * Get total registered handler count
   */
  public static getHandlerCount(): number {
    let count = 0;
    this.handlersMap.forEach((handlers) => {
      count += handlers.length;
    });
    return count;
  }
}
