/**
 * Lifecycle Domain Business Handler - WP-4 Stage 4
 */
import { BusinessHandler } from '../business.handler';
import { BusinessExecutionContext } from '../business.context';
import { BusinessResult } from '../business.result';
import { BusinessError } from '../business.error';

export interface LifecycleInput {
  windowId?: number;
  tabId?: number;
  url?: string;
  title?: string;
  status?: string;
  active?: boolean;
  focused?: boolean;
  navigationId?: string;
  transitionType?: string;
  startTime?: number;
  endTime?: number;
}

export interface LifecycleOutput {
  validated: boolean;
  domain: 'window' | 'tab' | 'navigation';
  windowId: number | null;
  tabId: number | null;
  activeTabUrl: string | null;
  navigationDurationMs: number | null;
  isWindowFocused: boolean;
  diagnosticMessages: string[];
  processedAt: number;
}

export class LifecycleBusinessHandler implements BusinessHandler<LifecycleInput, LifecycleOutput> {
  public readonly handlerId = 'LifecycleBusinessHandler';
  public readonly targetTopic: string;

  constructor(targetTopic = 'browser.tab.updated') {
    this.targetTopic = targetTopic;
  }

  public async execute(
    context: BusinessExecutionContext<LifecycleInput>
  ): Promise<BusinessResult<LifecycleOutput>> {
    const startTimeMs = Date.now();

    // Verify topic belongs to browser.window.*, browser.tab.*, or browser.navigation.* domain
    if (!context.topic.startsWith('browser.window.') &&
        !context.topic.startsWith('browser.tab.') &&
        !context.topic.startsWith('browser.navigation.')) {
      return {
        success: false,
        data: null,
        executionTimeMs: Date.now() - startTimeMs,
        error: new BusinessError(
          'INVALID_DOMAIN_TOPIC',
          `LifecycleBusinessHandler cannot process topic: ${context.topic}`,
          false
        )
      };
    }

    const payload = context.payload || {};
    const diagnostics: string[] = [];

    let domain: 'window' | 'tab' | 'navigation' = 'tab';
    if (context.topic.startsWith('browser.window.')) {
      domain = 'window';
    } else if (context.topic.startsWith('browser.navigation.')) {
      domain = 'navigation';
    }

    const windowId = payload.windowId !== undefined ? payload.windowId : null;
    const tabId = payload.tabId !== undefined ? payload.tabId : null;
    const activeTabUrl = payload.url || null;
    const isWindowFocused = payload.focused !== undefined ? Boolean(payload.focused) : true;

    let navigationDurationMs: number | null = null;
    if (payload.startTime && payload.endTime && payload.endTime >= payload.startTime) {
      navigationDurationMs = payload.endTime - payload.startTime;
    }

    if (domain === 'window' && windowId === null) {
      diagnostics.push('Missing windowId in window event payload.');
    }
    if (domain === 'tab' && tabId === null) {
      diagnostics.push('Missing tabId in tab event payload.');
    }

    const output: LifecycleOutput = {
      validated: diagnostics.length === 0,
      domain,
      windowId,
      tabId,
      activeTabUrl,
      navigationDurationMs,
      isWindowFocused,
      diagnosticMessages: diagnostics,
      processedAt: Date.now()
    };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[LifecycleBusinessHandler][Executed Validation]', context.topic, output);
    }

    return {
      success: true,
      data: output,
      executionTimeMs: Date.now() - startTimeMs,
      error: null
    };
  }
}
