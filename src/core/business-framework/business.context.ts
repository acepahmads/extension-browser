/**
 * Business Execution Context Interface - WP-4 Stage 1
 */
export interface BusinessExecutionContext<TPayload = unknown> {
  correlationId: string;
  topic: string;
  timestamp: number;
  payload: TPayload;
  attempt: number;
  metadata?: Record<string, unknown>;
}
