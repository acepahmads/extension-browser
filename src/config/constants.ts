import { Workspace } from './interfaces';

export const CONFIG_VERSION = '1.0.0';
export const APP_NAME = 'SPPG Companion';
export const APP_TAGLINE = 'Enterprise Integration Companion';

export const STORAGE_KEYS = {
  WORKSPACES: 'sppg_companion_workspaces',
  SETTINGS: 'sppg_companion_settings'
} as const;

export const DEFAULT_WORKSPACES_SEED: Workspace[] = [
  {
    id: 'ws_bgn_simulator_dev',
    application: 'BGN Simulator',
    name: 'Development',
    description: 'BGN Simulator Local Development Workspace',
    environment: 'development',
    baseUrl: 'http://localhost:5173',
    matchPatterns: [
      {
        id: 'mp_bgn_sim_localhost',
        pattern: 'http://localhost:5173/*',
        enabled: true,
        priority: 10
      },
      {
        id: 'mp_bgn_sim_ip',
        pattern: 'http://127.0.0.1:5173/*',
        enabled: true,
        priority: 5
      }
    ],
    enabled: true,
    icon: '⚡',
    color: '#3b82f6',
    tags: ['Local', 'Development', 'BGN-Simulator'],
    version: CONFIG_VERSION,
    createdAt: 1722320000000,
    updatedAt: 1722320000000
  },
  {
    id: 'ws_sipgn_production',
    application: 'SIPGN',
    name: 'Production',
    description: 'Portal SIPGN Badan Gizi Nasional Production',
    environment: 'production',
    baseUrl: 'https://sipgn-aimenu.bgn.go.id',
    matchPatterns: [
      {
        id: 'mp_sipgn_prod_main',
        pattern: 'https://sipgn-aimenu.bgn.go.id/*',
        enabled: true,
        priority: 10
      },
      {
        id: 'mp_sipgn_prod_wildcard',
        pattern: 'https://*.bgn.go.id/*',
        enabled: true,
        priority: 5
      }
    ],
    enabled: true,
    icon: '🏛️',
    color: '#f59e0b',
    tags: ['Government', 'Production', 'SIPGN'],
    version: CONFIG_VERSION,
    createdAt: 1722320000000,
    updatedAt: 1722320000000
  }
];
