/**
 * Event Validator - Enterprise Event Bus Phase 2
 */
import { BusEventEnvelope } from '../types/event.types';
import { SchemaRegistry } from './schema-registry';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class EventValidator {
  private registry: SchemaRegistry;

  constructor() {
    this.registry = SchemaRegistry.getInstance();
  }

  /**
   * Validate event envelope and payload against schema rules
   */
  public validate<T = unknown>(envelope: BusEventEnvelope<T>): ValidationResult {
    const errors: string[] = [];

    // 1. Envelope Structure Validation
    if (!envelope.id) errors.push('Missing envelope ID');
    if (!envelope.version) errors.push('Missing envelope version');
    if (!envelope.topic) errors.push('Missing envelope topic');
    if (!envelope.timestamp || envelope.timestamp <= 0) errors.push('Invalid timestamp');

    // 2. Schema Contract Lookup & Required Fields Validation
    const schema = this.registry.lookupSchema(envelope.topic, envelope.version);
    if (schema && envelope.payload && typeof envelope.payload === 'object') {
      const payloadObj = envelope.payload as Record<string, unknown>;
      for (const field of schema.requiredFields) {
        if (payloadObj[field] === undefined || payloadObj[field] === null) {
          errors.push(`Missing required payload field: "${field}" for topic "${envelope.topic}"`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
