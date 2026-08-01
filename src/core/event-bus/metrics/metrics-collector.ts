/**
 * Metrics Collector - Enterprise Event Bus Phase 2
 */
export interface EventBusMetrics {
  publishCount: number;
  subscribeCount: number;
  dispatchCount: number;
  droppedEvents: number;
  processingTime: number;
  avgDispatchTime: number;
}

export class MetricsCollector {
  private publishCount = 0;
  private subscribeCount = 0;
  private dispatchCount = 0;
  private droppedEvents = 0;
  private totalProcessingTime = 0;

  public recordPublish(): void {
    this.publishCount += 1;
  }

  public recordSubscribe(): void {
    this.subscribeCount += 1;
  }

  public recordUnsubscribe(): void {
    if (this.subscribeCount > 0) {
      this.subscribeCount -= 1;
    }
  }

  public recordDispatch(durationMs: number): void {
    this.dispatchCount += 1;
    this.totalProcessingTime += durationMs;
  }

  public recordDropped(): void {
    this.droppedEvents += 1;
  }

  public getMetrics(): EventBusMetrics {
    const avgDispatchTime = this.dispatchCount > 0 
      ? Number((this.totalProcessingTime / this.dispatchCount).toFixed(2))
      : 0;

    return {
      publishCount: this.publishCount,
      subscribeCount: this.subscribeCount,
      dispatchCount: this.dispatchCount,
      droppedEvents: this.droppedEvents,
      processingTime: this.totalProcessingTime,
      avgDispatchTime
    };
  }

  public reset(): void {
    this.publishCount = 0;
    this.subscribeCount = 0;
    this.dispatchCount = 0;
    this.droppedEvents = 0;
    this.totalProcessingTime = 0;
  }
}
