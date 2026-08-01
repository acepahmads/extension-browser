/**
 * SPPG Network Interceptor Module (Sprint 2+)
 * Prepared interface for Fetch / XHR / WebRequest interception
 */

export interface NetworkRequestEntry {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  requestBody?: unknown;
  timestamp: number;
}

export interface NetworkResponseEntry {
  requestId: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  responseBody?: unknown;
  durationMs: number;
}

export interface NetworkInterceptorOptions {
  enabled: boolean;
  filterUrls?: string[];
}

export class NetworkInterceptor {
  private static instance: NetworkInterceptor;

  public static getInstance(): NetworkInterceptor {
    if (!this.instance) {
      this.instance = new NetworkInterceptor();
    }
    return this.instance;
  }

  public init(_options?: NetworkInterceptorOptions): void {
    // Interceptor registration hook ready for Sprint 2
  }
}
