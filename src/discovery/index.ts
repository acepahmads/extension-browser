/**
 * SPPG Discovery Engine Module (Sprint 2+)
 * Prepared for discovering endpoints, microservices, and SPA routes
 */

export interface DiscoveredEndpoint {
  url: string;
  method: string;
  category: 'API' | 'STATIC' | 'WEBSOCKET';
  firstSeen: number;
  lastSeen: number;
  callCount: number;
}

export class DiscoveryEngine {
  private static instance: DiscoveryEngine;

  public static getInstance(): DiscoveryEngine {
    if (!this.instance) {
      this.instance = new DiscoveryEngine();
    }
    return this.instance;
  }

  public getDiscoveredEndpoints(): DiscoveredEndpoint[] {
    return [];
  }
}
