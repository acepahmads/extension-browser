import { EnvironmentType } from './types';
import { EnvironmentMetadata } from './interfaces';

export class EnvironmentRegistry {
  private static environments: Record<EnvironmentType, EnvironmentMetadata> = {
    development: {
      key: 'development',
      label: 'Development',
      color: '#3b82f6',
      badgeClass: 'bg-blue-950/80 border-blue-500/40 text-blue-300'
    },
    staging: {
      key: 'staging',
      label: 'Staging',
      color: '#8b5cf6',
      badgeClass: 'bg-purple-950/80 border-purple-500/40 text-purple-300'
    },
    uat: {
      key: 'uat',
      label: 'UAT',
      color: '#ec4899',
      badgeClass: 'bg-pink-950/80 border-pink-500/40 text-pink-300'
    },
    production: {
      key: 'production',
      label: 'Production',
      color: '#f59e0b',
      badgeClass: 'bg-amber-950/80 border-amber-500/40 text-amber-300'
    },
    demo: {
      key: 'demo',
      label: 'Demo',
      color: '#06b6d4',
      badgeClass: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
    },
    testing: {
      key: 'testing',
      label: 'Testing',
      color: '#10b981',
      badgeClass: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
    }
  };

  public static getAll(): EnvironmentMetadata[] {
    return Object.values(this.environments);
  }

  public static get(key: EnvironmentType): EnvironmentMetadata {
    return (
      this.environments[key] || {
        key: 'development',
        label: 'Development',
        color: '#3b82f6',
        badgeClass: 'bg-blue-950/80 border-blue-500/40 text-blue-300'
      }
    );
  }

  public static getBadgeClass(key: EnvironmentType): string {
    return this.get(key).badgeClass;
  }
}
