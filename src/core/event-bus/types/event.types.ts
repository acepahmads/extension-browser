/**
 * Bus Event Envelope and Payload Schemas - Phase 1 Core Foundation
 */
import { ActivitySource, ActivitySeverity } from '../../../modules/lifecycle/activity.types';

export interface BusEventEnvelope<T = unknown> {
  id: string;
  version: string; // Default "1.0"
  sequence: number;
  sessionId: string;
  correlationId: string;
  timestamp: number;
  topic: string;
  source: ActivitySource;
  severity: ActivitySeverity;
  payload: T;
}

import { EventPriority } from '../dispatchers/priority-dispatcher';

export interface PublishOptions {
  source?: ActivitySource;
  severity?: ActivitySeverity;
  sessionId?: string;
  correlationId?: string;
  sequence?: number;
  version?: string;
  priority?: EventPriority;
  validate?: boolean;
}

export interface PublishResult<T = unknown> {
  success: boolean;
  event: BusEventEnvelope<T>;
}
