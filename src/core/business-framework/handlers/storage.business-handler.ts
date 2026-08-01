/**
 * Storage Domain Business Handler - WP-4 Stage 3
 */
import { BusinessHandler } from '../business.handler';
import { BusinessExecutionContext } from '../business.context';
import { BusinessResult } from '../business.result';
import { BusinessError } from '../business.error';

export interface StorageInput {
  keys?: string[];
  key?: string;
  changes?: Record<string, { oldValue?: unknown; newValue?: unknown }>;
  areaName?: string;
  area?: string;
  snapshot?: Record<string, unknown>;
  previous?: Record<string, unknown>;
}

export interface StorageOutput {
  validated: boolean;
  storageArea: string;
  changedKeyCount: number;
  keys: string[];
  hasDuplicateKeys: boolean;
  diagnosticMessages: string[];
  processedAt: number;
}

export class StorageBusinessHandler implements BusinessHandler<StorageInput, StorageOutput> {
  public readonly handlerId = 'StorageBusinessHandler';
  public readonly targetTopic: string;

  constructor(targetTopic = 'storage.changed') {
    this.targetTopic = targetTopic;
  }

  public async execute(
    context: BusinessExecutionContext<StorageInput>
  ): Promise<BusinessResult<StorageOutput>> {
    const startTime = Date.now();

    // Verify topic belongs to storage.* domain
    if (!context.topic.startsWith('storage.')) {
      return {
        success: false,
        data: null,
        executionTimeMs: Date.now() - startTime,
        error: new BusinessError(
          'INVALID_DOMAIN_TOPIC',
          `StorageBusinessHandler cannot process topic: ${context.topic}`,
          false
        )
      };
    }

    const payload = context.payload || {};
    const diagnostics: string[] = [];
    let keys: string[] = [];

    // Parse keys
    if (Array.isArray(payload.keys)) {
      keys = payload.keys;
    } else if (payload.changes && typeof payload.changes === 'object') {
      keys = Object.keys(payload.changes);
    } else if (payload.key) {
      keys = [payload.key];
    } else {
      diagnostics.push('Malformed payload: missing keys, key, or changes object.');
    }

    // Detect duplicates
    const uniqueKeys = new Set(keys);
    const hasDuplicateKeys = uniqueKeys.size < keys.length;
    if (hasDuplicateKeys) {
      diagnostics.push(`Duplicate keys detected in payload: ${keys.join(', ')}`);
    }

    const storageArea = payload.areaName || payload.area || 'local';

    if (keys.length === 0) {
      diagnostics.push('Zero keys provided in storage event.');
    }

    const output: StorageOutput = {
      validated: diagnostics.length === 0,
      storageArea,
      changedKeyCount: keys.length,
      keys: Array.from(uniqueKeys),
      hasDuplicateKeys,
      diagnosticMessages: diagnostics,
      processedAt: Date.now()
    };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[StorageBusinessHandler][Executed Validation]', context.topic, output);
    }

    return {
      success: true,
      data: output,
      executionTimeMs: Date.now() - startTime,
      error: null
    };
  }
}
