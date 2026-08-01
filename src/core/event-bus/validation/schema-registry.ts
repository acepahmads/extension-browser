/**
 * Schema Registry - Enterprise Event Bus Phase 2
 */
export interface EventSchemaContract {
  eventName: string;
  version: string;
  requiredFields: string[];
}

export class SchemaRegistry {
  private static instance: SchemaRegistry | null = null;
  private schemas: Map<string, EventSchemaContract> = new Map();

  private constructor() {
    this.registerDefaultSchemas();
  }

  public static getInstance(): SchemaRegistry {
    if (!SchemaRegistry.instance) {
      SchemaRegistry.instance = new SchemaRegistry();
    }
    return SchemaRegistry.instance;
  }

  /**
   * Register default system event schemas
   */
  private registerDefaultSchemas(): void {
    this.registerSchema({
      eventName: 'system.lifecycle.started',
      version: '1.0',
      requiredFields: ['timestamp']
    });

    this.registerSchema({
      eventName: 'workspace.resolved',
      version: '1.0',
      requiredFields: ['workspaceId', 'activeCorpus']
    });
  }

  /**
   * Register an event schema contract
   */
  public registerSchema(schema: EventSchemaContract): void {
    const key = `${schema.eventName}:${schema.version}`;
    this.schemas.set(key, schema);
  }

  /**
   * Lookup schema contract by event name and version
   */
  public lookupSchema(eventName: string, version: string = '1.0'): EventSchemaContract | undefined {
    const key = `${eventName}:${version}`;
    return this.schemas.get(key);
  }

  /**
   * Clear all registered schemas
   */
  public clear(): void {
    this.schemas.clear();
    this.registerDefaultSchemas();
  }
}
