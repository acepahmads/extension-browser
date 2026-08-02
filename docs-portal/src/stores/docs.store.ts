import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MetadataEngine, DocMetadata } from '@/services/metadata-engine';

export interface PhaseItem {
  id: string;
  name: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED' | 'BLOCKED' | 'ARCHIVED' | 'BASELINE' | 'CURRENT' | 'GOAL';
  date?: string;
  summary?: string;
  objectives?: string[];
  deliverables?: string[];
  filesAdded?: string[];
  filesModified?: string[];
  testingResult?: string;
  buildResult?: string;
  coverage?: string;
  lessonsLearned?: string;
  risks?: string;
  futureWork?: string;
  reviewer?: string;
  approval?: string;
}

export interface WorkPackageItem {
  id: string;
  name: string;
  status: 'Completed' | 'Planned' | 'In Progress';
  description: string;
  icon: string;
}

export interface EngineeringValidationStats {
  publisherAudit: string;
  coverage: string;
  subscriberBaseline: string;
  productionSubscribers: number;
  architectureReadiness: string;
  businessFramework?: string;
  businessMigration?: string;
  legacyExecution?: string;
  businessExecution?: string;
  executionMode?: string;
  authority?: string;
  shadowCompare?: string;
  businessOnly?: string;
  legacyRemoval?: string;
}

export interface MilestoneItem {
  id: string;
  name: string;
  sprint: string;
  category: 'Foundation' | 'Architecture' | 'Documentation' | 'Development' | 'Platform';
  phaseGroup: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED' | 'BLOCKED' | 'ARCHIVED' | 'BASELINE' | 'CURRENT' | 'GOAL';
  completion: number;
  date: string;
  summary: string;
  deliverables: string[];
  owner: string;
  reviewStatus: string;
  notes: string;
  phases?: PhaseItem[];
  workPackages?: WorkPackageItem[];
  validationStats?: EngineeringValidationStats;
  progressBreakdown?: {
    foundation: number;
    architecture?: number;
    documentation?: number;
    subscriberMigration: number;
    businessFramework?: number;
    productionHardening?: number;
    releaseEngineering?: number;
    gaRelease?: number;
    legacyRemoval: number;
    overallStatus: string;
  };
}

export interface ADRItem {
  id: string;
  title: string;
  status: 'ACCEPTED' | 'PROPOSED' | 'DEPRECATED';
  sprint: string;
  date: string;
  context: string;
  decision: string;
}

export interface ReportItem {
  id: string;
  title: string;
  sprint: string;
  date: string;
  status: string;
  module: string;
  summary: string;
  link: string;
}

export const useDocsStore = defineStore('docs', () => {
  const isDarkMode = ref(true);
  const searchQuery = ref('');
  const isSearchOpen = ref(false);

  // Dynamic Metadata Engine Singleton
  const engine = MetadataEngine.getInstance();
  const rawDocuments = ref<DocMetadata[]>(engine.getAllDocuments());

  // Refresh metadata from disk/engine
  const refreshMetadata = () => {
    rawDocuments.value = engine.getAllDocuments();
  };

  // Portal Settings Preferences
  const portalSettings = ref({
    theme: 'dark',
    dashboardLayout: 'grid',
    defaultSprint: 'Sprint 5',
    animations: true,
    density: 'comfortable',
    autoSync: true
  });

  // Dynamic Reports Collection
  const reportsList = computed<ReportItem[]>(() => {
    const list: ReportItem[] = [];
    rawDocuments.value.forEach((doc, idx) => {
      if (doc.type === 'report' || doc.type === 'phase' || doc.type === 'milestone') {
        list.push({
          id: `REP-${String(idx + 1).padStart(3, '0')}`,
          title: doc.title,
          sprint: doc.sprint,
          date: doc.updatedDate,
          status: doc.status === 'COMPLETED' || doc.status === 'VERIFIED' || doc.status === 'APPROVED' ? 'VERIFIED (100%)' : doc.status,
          module: doc.filePath,
          summary: doc.summary,
          link: doc.filePath.includes('Phase-') ? `/sprint/${doc.milestoneId}/phase/${doc.phaseId}` : `/sprint/${doc.milestoneId}`
        });
      }
    });
    return list;
  });

  // Dynamic ADR Records
  const adrList = computed<ADRItem[]>(() => {
    const list: ADRItem[] = [
      {
        id: 'ADR-0001',
        title: 'Chrome MV3 Extension Architecture & Technology Stack',
        status: 'ACCEPTED',
        sprint: 'Sprint 1',
        date: '2026-07-30',
        context: 'Select modern framework for Chrome Extension MV3 developer companion.',
        decision: 'Selected Vue 3 Composition API, TypeScript, Vite, Pinia, and TailwindCSS.'
      },
      {
        id: 'ADR-0002',
        title: 'Browser Lifecycle & Enterprise Activity Telemetry Model',
        status: 'ACCEPTED',
        sprint: 'Sprint 2.1',
        date: '2026-07-31',
        context: 'Need standard telemetry event model across browser, background, storage, and IPC domains.',
        decision: 'Enriched ActivityEvent with sequence counter, SESSION ID, correlation ID, source, severity, and duration.'
      },
      {
        id: 'ADR-0003',
        title: 'Decoupled Hybrid Topic-Based Event Bus Architecture',
        status: 'ACCEPTED',
        sprint: 'Sprint 3A',
        date: '2026-07-31',
        context: 'Communication backbone required to decouple extension modules without hard dependencies.',
        decision: 'Adopted dot-notation hierarchical channel architecture supporting exact and wildcard matching (*, **).'
      },
      {
        id: 'ADR-0004',
        title: 'Production Integration Pipeline & Hardening Architecture',
        status: 'ACCEPTED',
        sprint: 'Sprint 4',
        date: '2026-08-01',
        context: 'Wrap production business handlers with zero-overhead feature-gated resilience and observability wrappers.',
        decision: 'Implemented IntegrationPipeline & IntegrationMiddleware with dynamic feature flags and zero-bypass fallback.'
      }
    ];
    return list;
  });

  // Dynamic Milestones Collection
  const milestones = ref<MilestoneItem[]>([
    // PHASE 1: FOUNDATION (COMPLETED - 100% READ ONLY - COLLAPSED)
    {
      id: 'M00',
      name: 'Project Vision & Strategy Scope',
      sprint: 'Strategy',
      category: 'Foundation',
      phaseGroup: 'Phase 1: Foundation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-30',
      summary: 'Defined core product vision, Vue 3 + TypeScript tech stack, and 12-sprint execution roadmap.',
      deliverables: ['Tech Stack Selection', 'Manifest V3 Design', '12-Sprint Execution Strategy'],
      owner: 'Lead Architect',
      reviewStatus: 'Approved',
      notes: 'Vision & Scope established'
    },
    {
      id: 'M01',
      name: 'Extension Foundation & Config Layer',
      sprint: 'Sprint 1',
      category: 'Foundation',
      phaseGroup: 'Phase 1: Foundation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-30',
      summary: 'Chrome Extension MV3 scaffolding, dual storage adapter, Options and Popup UI templates.',
      deliverables: ['Manifest V3 config', 'StorageAdapter', 'Popup/Options Vue UI', 'Workspace Type'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: 'Clean build verified'
    },
    {
      id: 'M02',
      name: 'Browser Lifecycle Engine & Activity Center',
      sprint: 'Sprint 2',
      category: 'Foundation',
      phaseGroup: 'Phase 1: Foundation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-30',
      summary: 'Browser lifecycle listeners (tabs, navigation, windows), Pinia store, Activity Center UI.',
      deliverables: ['BrowserLifecycleService', 'TabService', 'NavigationService', 'ActivityCenterPage.vue'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: 'Real-time IPC listener active'
    },
    {
      id: 'M03',
      name: 'Workspace Engine & Event Model Refinement',
      sprint: 'Sprint 2.1',
      category: 'Foundation',
      phaseGroup: 'Phase 1: Foundation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Captured all 24 lifecycle events, enriched ActivityEvent with sequence, session, correlation ID, Logger success mode.',
      deliverables: ['24 Lifecycle Events', 'Session & Sequence Counter', 'Diagnostics 6-Check Suite', 'Health Score Engine'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: '100% Audit Score'
    },

    // PHASE 2: ARCHITECTURE (COMPLETED - 100% READ ONLY - COLLAPSED)
    {
      id: 'M04',
      name: 'Enterprise Event Bus Architecture Design',
      sprint: 'Sprint 3A',
      category: 'Architecture',
      phaseGroup: 'Phase 2: Architecture',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Software Architecture Document (SAD) for high-performance Event Bus communication backbone.',
      deliverables: ['Event Bus SAD', 'Topic Taxonomy', 'Priority Queue Specs', 'DLQ Specs'],
      owner: 'Principal Architect',
      reviewStatus: 'Approved',
      notes: 'Design-only sprint'
    },
    {
      id: 'M05',
      name: 'Architecture Revision Addendum',
      sprint: 'Sprint 3A Rev',
      category: 'Architecture',
      phaseGroup: 'Phase 2: Architecture',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Event envelope versioning ("1.0"), V8 memory optimization strategy, Schema Registry & Validator positions.',
      deliverables: ['Envelope v1.0 design', 'V8 GC Strategy', 'Metrics Collector design', 'Replay Hook interface'],
      owner: 'Principal Architect',
      reviewStatus: 'Approved',
      notes: 'Architecture frozen'
    },

    // PHASE 3: DOCUMENTATION (COMPLETED - 100% READ ONLY - COLLAPSED)
    {
      id: 'M07',
      name: 'Engineering Documentation Foundation',
      sprint: 'Sprint D0',
      category: 'Documentation',
      phaseGroup: 'Phase 3: Documentation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Permanent repository documentation structure, master roadmap, milestone index, report templates.',
      deliverables: ['Master-Roadmap.md', 'Master-Milestone-Index.md', 'Report-Template.md', 'Milestone Placeholders'],
      owner: 'Lead Architect',
      reviewStatus: 'Approved',
      notes: 'Permanent docs framework'
    },
    {
      id: 'M08',
      name: 'Documentation Governance & Standards',
      sprint: 'Sprint D0.1',
      category: 'Documentation',
      phaseGroup: 'Phase 3: Documentation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Enterprise documentation governance, change log, version matrix, glossary, coding standards, contribution rules.',
      deliverables: ['CHANGELOG.md', 'VERSION.md', 'Glossary.md', 'Coding-Standards.md', 'CONTRIBUTING.md'],
      owner: 'Lead Architect',
      reviewStatus: 'Approved',
      notes: 'Metadata headers enforced'
    },
    {
      id: 'M09',
      name: 'AI Context Workflow & Active Context System',
      sprint: 'Sprint D0.2',
      category: 'Documentation',
      phaseGroup: 'Phase 3: Documentation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Active execution context tracking file (CONTEXT.md) and automated update workflows.',
      deliverables: ['CONTEXT.md', 'Automated Doc Workflow', 'Context Continuity Protocol'],
      owner: 'Lead Architect',
      reviewStatus: 'Approved',
      notes: 'Context tracking live'
    },
    {
      id: 'M10',
      name: 'Standalone Engineering Documentation Portal',
      sprint: 'Sprint D1',
      category: 'Documentation',
      phaseGroup: 'Phase 3: Documentation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Modern SaaS documentation dashboard visualization built with Vue 3, Vite, TailwindCSS, and Pinia.',
      deliverables: ['docs-portal App', 'Navbar & Sidebar', 'Search Modal', 'Markdown Renderer'],
      owner: 'Frontend Lead',
      reviewStatus: 'Approved',
      notes: 'Standalone portal live'
    },
    {
      id: 'M11',
      name: 'Portal Synchronization Engine & Dynamic Metadata',
      sprint: 'Sprint D1.5',
      category: 'Documentation',
      phaseGroup: 'Phase 3: Documentation',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Dynamic Metadata Synchronization Engine automatically discovering markdown metadata across all portal pages.',
      deliverables: ['MetadataEngine.ts', 'Dynamic Reports Sync', 'Zero-Manual Registry Architecture', 'Portal v1.0 Final'],
      owner: 'Frontend Lead',
      reviewStatus: 'Approved',
      notes: 'Portal v1.0 Final Reached'
    },

    // PHASE 4: BUSINESS FRAMEWORK (ARCHIVED - 100% READ ONLY - COLLAPSED)
    {
      id: 'M12',
      name: 'Middleware & Event Bus Core (Phase 2)',
      sprint: 'Sprint 3B.2',
      category: 'Development',
      phaseGroup: 'Phase 4: Business Framework',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Event Validator, Middleware Pipeline, Priority Dispatcher Queue, Schema Registry, Metrics Collector, DLQ.',
      deliverables: ['middleware-pipeline.ts', 'event-validator.ts', 'schema-registry.ts', 'priority-dispatcher.ts', 'metrics-collector.ts', 'dead-letter-queue.ts', 'error-handler.ts'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: '5/5 Spec Tests Passed'
    },
    {
      id: 'M13',
      name: 'Sprint 3B Phase 3: Event Bus Subscriber Layer',
      sprint: 'Sprint 3B.3',
      category: 'Development',
      phaseGroup: 'Phase 4: Business Framework',
      status: 'COMPLETED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Runtime Publisher Wiring (WP-1), Dual Publish (WP-2), Config Hardening (WP-2.1), and Stages 1-5 Subscriber Registry (WP-3).',
      deliverables: ['SubscriberRegistry.ts', 'AnalyticsSubscriber.ts', 'MetricsSubscriber.ts', 'WorkspaceSubscriber.ts', 'StorageSubscriber.ts', 'LifecycleSubscriber.ts'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: '15 Active Topic Handlers Registered Across Stages 1-5'
    },
    {
      id: 'M14',
      name: 'Sprint 3B Phase 4: Business Execution Framework',
      sprint: 'Sprint 3B.4',
      category: 'Development',
      phaseGroup: 'Phase 4: Business Framework',
      status: 'ARCHIVED',
      completion: 100,
      date: '2026-07-31',
      summary: 'Business Framework Migration Complete (13 Work Packages Finished). Business Execution Framework is the sole authoritative production engine.',
      deliverables: ['BusinessDispatcher.ts', 'WorkspaceBusinessHandler.ts', 'StorageBusinessHandler.ts', 'LifecycleBusinessHandler.ts', 'ShadowComparator.ts', 'ShadowValidationService.ts', 'business-cutover.spec.ts'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: '13 Work Packages Finished (100%)',
      progressBreakdown: {
        foundation: 100,
        subscriberMigration: 100,
        businessFramework: 100,
        legacyRemoval: 100,
        overallStatus: 'Phase 4 Archived (100%)'
      },
      validationStats: {
        publisherAudit: 'PASS (13 / 13)',
        coverage: '100% Runtime Topics',
        subscriberBaseline: 'PASS (15 Handlers)',
        productionSubscribers: 15,
        architectureReadiness: 'READY (Business Framework Production Engine)',
        businessFramework: 'PRODUCTION',
        businessMigration: 'COMPLETE',
        legacyExecution: 'DEPRECATED (Stub Only)',
        businessExecution: 'ACTIVE',
        executionMode: 'BUSINESS ONLY',
        authority: 'BUSINESS',
        shadowCompare: 'OPTIONAL',
        businessOnly: 'ENABLED',
        legacyRemoval: 'COMPLETE'
      },
      workPackages: [
        { id: 'WP-1', name: 'Runtime Publisher Wiring', status: 'Completed', description: 'Wire all 13 runtime publishers into EventBusFacade.', icon: '✅' },
        { id: 'WP-2', name: 'Dual Publish & Feature Flag', status: 'Completed', description: 'Introduce dual publishing and runtime feature flags.', icon: '✅' },
        { id: 'WP-2.1', name: 'Configuration Hardening', status: 'Completed', description: 'Synchronize persisted EventBus feature flags.', icon: '✅' },
        { id: 'WP-3', name: 'Subscriber Registry', status: 'Completed', description: 'Implemented Analytics, Metrics, Workspace, Storage, and Lifecycle subscribers.', icon: '✅' },
        { id: 'WP-4.1', name: 'Business Framework Core', status: 'Completed', description: 'Created BusinessDispatcher, BusinessRegistry, and retry engine.', icon: '✅' },
        { id: 'WP-4.2', name: 'Workspace Business Handler', status: 'Completed', description: 'Implemented WorkspaceBusinessHandler validating workspace.* topics.', icon: '✅' },
        { id: 'WP-4.3', name: 'Storage Business Handler', status: 'Completed', description: 'Implemented StorageBusinessHandler validating storage.* topics.', icon: '✅' },
        { id: 'WP-4.4', name: 'Lifecycle Business Handler', status: 'Completed', description: 'Implemented LifecycleBusinessHandler validating browser window topics.', icon: '✅' },
        { id: 'WP-4.5', name: 'Shadow Comparator Engine', status: 'Completed', description: 'Implemented ShadowComparator and ShadowMetrics.', icon: '✅' },
        { id: 'WP-4.5.5', name: 'Shadow Validation Campaign', status: 'Completed', description: 'Implemented ShadowValidationService generating health telemetry.', icon: '✅' },
        { id: 'WP-4.6', name: 'Business-Only Cutover', status: 'Completed', description: 'Business Framework enabled as authoritative production engine.', icon: '✅' },
        { id: 'WP-4.7.1', name: 'ActivityService Decoupling', status: 'Completed', description: 'Decoupled ActivityService.createEvent calls from all listeners.', icon: '✅' },
        { id: 'WP-4.7.2', name: 'Legacy Infrastructure Cleanup', status: 'Completed', description: 'Cleaned up legacy bridge wrappers and dead imports.', icon: '✅' }
      ]
    },

    // PHASE 5: PRODUCTION HARDENING (BASELINE v0.5.0 - 100% READ ONLY - COLLAPSED)
    {
      id: 'M15',
      name: 'WP-5.1: Performance Benchmark Framework',
      sprint: 'Sprint 4 (WP-5.1)',
      category: 'Platform',
      phaseGroup: 'Phase 5: Production Hardening',
      status: 'BASELINE',
      completion: 100,
      date: '2026-08-01',
      summary: 'Passive microsecond timing benchmarks, layer breakdown, memory profiling.',
      deliverables: ['BenchmarkService', 'BenchmarkMetricsCollector', 'benchmark.spec.ts'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: 'Passed 100%'
    },
    {
      id: 'M16',
      name: 'WP-5.2: Reliability & Fault Tolerance Framework',
      sprint: 'Sprint 4 (WP-5.2)',
      category: 'Platform',
      phaseGroup: 'Phase 5: Production Hardening',
      status: 'BASELINE',
      completion: 100,
      date: '2026-08-01',
      summary: 'RetryPolicyEngine, TimeoutGuard, FailureDetector, HealthMonitor, MTTR metrics.',
      deliverables: ['ReliabilityService', 'RetryPolicyEngine', 'TimeoutGuard', 'HealthMonitor'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: 'Passed 100%'
    },
    {
      id: 'M17',
      name: 'WP-5.3: Observability & Metrics Platform',
      sprint: 'Sprint 4 (WP-5.3)',
      category: 'Platform',
      phaseGroup: 'Phase 5: Production Hardening',
      status: 'BASELINE',
      completion: 100,
      date: '2026-08-01',
      summary: 'ObservabilityService, HealthDashboard 7-widget model, TelemetryService in-memory trends.',
      deliverables: ['ObservabilityService', 'HealthDashboard', 'TelemetryService', 'MetricsExportEngine'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: 'Passed 100%'
    },
    {
      id: 'M18',
      name: 'WP-5.4: Production Integration Layer & Runtime Wiring',
      sprint: 'Sprint 4 (WP-5.4)',
      category: 'Platform',
      phaseGroup: 'Phase 5: Production Hardening',
      status: 'BASELINE',
      completion: 100,
      date: '2026-08-02',
      summary: 'IntegrationPipeline, IntegrationMiddleware, runtime feature flags, zero-bypass fallback, BusinessDispatcher wiring.',
      deliverables: ['IntegrationPipeline', 'IntegrationMiddleware', 'BusinessDispatcher wiring'],
      owner: 'Core Team',
      reviewStatus: 'Approved',
      notes: 'v0.5.0 Baseline Complete'
    },

    // PHASE 6: RELEASE ENGINEERING (CURRENT - SPRINT 5 ACTIVE - EXPANDED BY DEFAULT)
    {
      id: 'M19',
      name: 'WP-6.1: Recovery & Resilience Hooks',
      sprint: 'Sprint 5 (WP-6.1)',
      category: 'Platform',
      phaseGroup: 'Phase 6: Release Engineering',
      status: 'CURRENT',
      completion: 0,
      date: 'In Progress',
      summary: 'Automated fallback recovery hooks and zero-downtime service worker restart resilience.',
      deliverables: ['Panic Shield Module', 'Recovery Hooks'],
      owner: 'Core Team',
      reviewStatus: 'In Review',
      notes: 'Active Sprint 5 Task'
    },
    {
      id: 'M20',
      name: 'WP-6.2: Production Build Certification & Signing',
      sprint: 'Sprint 5 (WP-6.2)',
      category: 'Platform',
      phaseGroup: 'Phase 6: Release Engineering',
      status: 'CURRENT',
      completion: 0,
      date: 'Pending',
      summary: 'Production build certification, automated release pipeline, and artifact signing.',
      deliverables: ['Release Certification', 'Signed Production Extension Zip'],
      owner: 'DevOps Team',
      reviewStatus: 'Pending',
      notes: 'Roadmap Sprint 5'
    },
    {
      id: 'M21',
      name: 'WP-6.3: CI/CD Build Matrix Automation',
      sprint: 'Sprint 5 (WP-6.3)',
      category: 'Platform',
      phaseGroup: 'Phase 6: Release Engineering',
      status: 'CURRENT',
      completion: 0,
      date: 'Pending',
      summary: 'Automated CI/CD build matrix, linting, and extension artifact packaging.',
      deliverables: ['CI/CD Pipeline Script', 'Build Matrix Config'],
      owner: 'DevOps Team',
      reviewStatus: 'Pending',
      notes: 'Roadmap Sprint 5'
    },
    {
      id: 'M22',
      name: 'WP-6.4: End-to-End Automated Regression Suite',
      sprint: 'Sprint 5 (WP-6.4)',
      category: 'Platform',
      phaseGroup: 'Phase 6: Release Engineering',
      status: 'CURRENT',
      completion: 0,
      date: 'Pending',
      summary: 'End-to-end integration tests, cross-browser compatibility verification, and regression tests.',
      deliverables: ['E2E Integration Spec', 'Regression Suite'],
      owner: 'QA Team',
      reviewStatus: 'Pending',
      notes: 'Roadmap Sprint 5'
    },
    {
      id: 'M23',
      name: 'WP-6.5: Release Packaging & Web Store Submission',
      sprint: 'Sprint 5 (WP-6.5)',
      category: 'Platform',
      phaseGroup: 'Phase 6: Release Engineering',
      status: 'CURRENT',
      completion: 0,
      date: 'Pending',
      summary: 'Production minification, source map isolation, and Web Store publishing submission.',
      deliverables: ['Signed Extension Zip', 'Chrome Web Store Listing'],
      owner: 'Release Team',
      reviewStatus: 'Pending',
      notes: 'Roadmap Sprint 5'
    },

    // PHASE 7: VERSION 1.0 RELEASE GA (GOAL - GOLD / PURPLE - COLLAPSED BY DEFAULT)
    {
      id: 'M24',
      name: 'Version 1.0 General Availability Release',
      sprint: 'Sprint 6 Final',
      category: 'Platform',
      phaseGroup: 'Phase 7: Version 1.0 Release (GA)',
      status: 'GOAL',
      completion: 0,
      date: 'Target',
      summary: 'General Availability release of SPPG Companion Extension v1.0.0.',
      deliverables: ['v1.0.0 General Availability Release'],
      owner: 'Lead Architect',
      reviewStatus: 'Pending',
      notes: 'Target Goal: Version 1.0 General Availability'
    }
  ]);

  // Executive Dashboard Project Metrics (Calculated Dynamically)
  const projectInfo = computed(() => {
    const totalDocs = rawDocuments.value.length;
    const reportDocs = reportsList.value.length;
    const completedMilestonesCount = milestones.value.filter(m => m.status === 'COMPLETED' || m.status === 'ARCHIVED' || m.status === 'BASELINE').length;

    return {
      projectName: 'SPPG Companion Platform (BGN-Extension)',
      version: 'v0.5.0',
      currentSprint: 'Sprint 5',
      currentMilestone: 'M19 (Release Engineering & CI/CD Pipeline)',
      currentPhaseGroup: 'Phase 6 – Release Engineering',
      currentModule: 'src/core/integration/integration.pipeline.ts',
      nextSprint: 'Sprint 6 (Storage Engine & Persistence Adapter)',
      architectureStatus: 'Complete',
      repositoryStatus: '🟢 Production Ready',
      currentBaseline: 'v0.5.0',
      repositoryHealth: 'Excellent',
      buildStatus: 'PASS',
      typeCheckStatus: 'PASS',
      testSuitesStatus: '11 / 11 PASS',
      overallCompletion: 80.0,
      totalMilestones: milestones.value.length,
      completedMilestones: completedMilestonesCount,
      remainingMilestones: milestones.value.length - completedMilestonesCount,
      healthScore: 100,
      adrCount: adrList.value.length,
      reportCount: reportDocs,
      testCoverage: '100% Core Pipeline, Benchmark, Reliability & Observability',

      progressSummary: {
        foundation: 100,
        architecture: 100,
        documentation: 100,
        businessFramework: 100,
        productionHardening: 100,
        releaseEngineering: 0,
        gaRelease: 0,
        overallProgress: 80
      },

      healthCard: {
        architecture: 'Complete',
        businessFramework: 'Complete',
        performanceFramework: 'Complete',
        reliabilityFramework: 'Complete',
        observabilityPlatform: 'Complete',
        integrationLayer: 'Complete',
        runtimeWiring: 'Complete',
        repositoryHealth: 'Excellent',
        technicalDebt: 'Low',
        build: 'PASS',
        typeCheck: 'PASS',
        tests: '11 / 11 PASS'
      },

      releaseTimeline: [
        { version: 'v0.1.0', label: 'Foundation', status: 'Completed' },
        { version: 'v0.2.0', label: 'EventBus', status: 'Completed' },
        { version: 'v0.3.0', label: 'Business Framework', status: 'Completed' },
        { version: 'v0.4.0', label: 'Migration', status: 'Completed' },
        { version: 'v0.5.0', label: 'Production Hardening', status: 'BASELINE' },
        { version: 'v0.6.0', label: 'Release Engineering', status: 'CURRENT' },
        { version: 'v0.7.0', label: 'Beta', status: 'PLANNED' },
        { version: 'v0.9.0', label: 'Release Candidate', status: 'PLANNED' },
        { version: 'v1.0.0', label: 'General Availability', status: 'GOAL' }
      ],
      
      buildMetrics: {
        status: 'PASSING',
        latestBuild: '20260802.1',
        avgBuildTime: '1.61s',
        successfulBuilds: '100%',
        failedBuilds: 0,
        warnings: 0,
        errors: 0
      },

      testMetrics: {
        totalTests: 11,
        passed: 11,
        failed: 0,
        skipped: 0,
        unitTests: 6,
        integrationTests: 5,
        coverage: '100% Core Pipeline & Hardening Suites'
      },

      codeMetrics: {
        totalSourceFiles: 42,
        vueComponents: 14,
        typeScriptFiles: 32,
        interfaces: 35,
        classes: 18,
        modules: 14,
        stores: 2,
        routes: 10
      },

      docsMetrics: {
        docsCoverage: '100%',
        markdownFiles: totalDocs,
        reportsCount: reportDocs,
        milestonesCount: 26,
        architectureDocsCount: 6,
        pagesCount: 10,
        lastUpdated: '2026-08-02'
      },

      healthMetrics: {
        architectureScore: 100,
        documentationScore: 100,
        buildScore: 100,
        testingScore: 100,
        coverageScore: 100,
        techDebtScore: 0,
        adrScore: 100,
        sprintScore: 100,
        overallHealth: 100
      }
    };
  });

  // Dynamic Search Index
  const searchResults = computed(() => {
    if (!searchQuery.value.trim()) return [];
    const query = searchQuery.value.toLowerCase();
    
    return rawDocuments.value.filter(d => 
      d.title.toLowerCase().includes(query) || 
      d.summary.toLowerCase().includes(query) || 
      d.sprint.toLowerCase().includes(query) ||
      d.id.toLowerCase().includes(query) ||
      d.content.toLowerCase().includes(query)
    );
  });

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  };

  return {
    isDarkMode,
    searchQuery,
    isSearchOpen,
    portalSettings,
    projectInfo,
    rawDocuments,
    milestones,
    adrList,
    reportsList,
    searchResults,
    refreshMetadata,
    toggleTheme
  };
});
