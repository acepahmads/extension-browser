/**
 * Enterprise Performance Benchmarking Interfaces & Data Contracts — WP-5.1
 */

export interface PerformanceSnapshot {
  timestamp: number;
  heapUsedBytes: number;
  queueDepth: number;
  activeSubscriptions: number;
}

export interface PerformanceResult {
  correlationId: string;
  topic: string;
  handlerId?: string;
  success: boolean;
  publishLatencyMs: number;
  middlewareTimeMs: number;
  subscriberTimeMs: number;
  dispatcherTimeMs: number;
  registryLookupTimeMs: number;
  handlerDurationMs: number;
  totalLatencyMs: number;
  retryCount: number;
  routedToDlq: boolean;
  memoryDeltaBytes: number;
  timestamp: number;
}

export type ScenarioIdentifier = 'Scenario A' | 'Scenario B' | 'Scenario C' | 'Scenario D';

export interface BenchmarkScenario {
  id: ScenarioIdentifier;
  name: string;
  totalEvents: number;
  batchSize: number;
  topics: string[];
  description: string;
}

export interface LayerBreakdown {
  publishLatencyMs: number;
  middlewareTimeMs: number;
  subscriberTimeMs: number;
  dispatcherTimeMs: number;
  registryLookupTimeMs: number;
  handlerDurationMs: number;
}

export interface BenchmarkStatistics {
  totalEvents: number;
  successCount: number;
  failureCount: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  avgLatencyMs: number;
  medianLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  totalDurationMs: number;
  eventsPerSecond: number;
  peakThroughput: number;
  memoryDeltaMb: number;
  retryOverheadCount: number;
  layerBreakdown: LayerBreakdown;
}

export interface HandlerRanking {
  handlerId: string;
  targetTopic: string;
  count: number;
  totalDurationMs: number;
  avgDurationMs: number;
  minDurationMs: number;
  maxDurationMs: number;
  p95DurationMs: number;
}

export interface HistogramBucket {
  range: string;
  minMs: number;
  maxMs: number;
  count: number;
  percentage: number;
}

export interface ExecutionHistogram {
  buckets: HistogramBucket[];
}

export type RecommendationSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationCategory = 'LATENCY' | 'MEMORY' | 'RETRY' | 'HANDLER' | 'THROUGHPUT';

export interface OptimizationRecommendation {
  id: string;
  category: RecommendationCategory;
  severity: RecommendationSeverity;
  component: string;
  observation: string;
  recommendation: string;
}

export interface BenchmarkReportData {
  scenario: BenchmarkScenario;
  statistics: BenchmarkStatistics;
  slowestHandlers: HandlerRanking[];
  fastestHandlers: HandlerRanking[];
  histogram: ExecutionHistogram;
  performanceScore: number;
  recommendations: OptimizationRecommendation[];
  timestamp: number;
}
