<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header with Breadcrumbs & Executive Metrics -->
    <div>
      <Breadcrumbs />
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-2">
        <div>
          <div class="flex items-center space-x-3 mb-1">
            <span class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              Enterprise Delivery Roadmap v2.1
            </span>
            <span class="text-xs font-mono text-slate-400">High Density Product Hierarchy</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">Enterprise Project Roadmap</h1>
          <p class="text-slate-400 text-xs mt-1">Single-screen 7-phase hierarchy visualization. Displays completed history, current focus, and upcoming targets.</p>
        </div>

        <div class="flex items-center space-x-3 shrink-0">
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono flex items-center space-x-4">
            <div>
              <span class="text-slate-500 block text-[10px]">COMPLETED MILESTONES</span>
              <span class="text-emerald-400 font-bold">{{ docsStore.projectInfo.completedMilestones }} / {{ docsStore.projectInfo.totalMilestones }}</span>
            </div>
            <div class="h-6 w-px bg-slate-700"></div>
            <div>
              <span class="text-slate-500 block text-[10px]">OVERALL PRODUCT ROADMAP</span>
              <span class="text-blue-400 font-bold">{{ docsStore.projectInfo.overallCompletion }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hierarchy Summary Strip -->
    <div class="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xs font-bold font-heading text-slate-300 uppercase tracking-wider font-mono">7-Phase Hierarchy Flow</h2>
        <button 
          @click="toggleAllPhases"
          class="text-[11px] font-mono text-blue-400 hover:underline flex items-center space-x-1"
        >
          <span>{{ isAllExpanded ? 'Collapse All Phases' : 'Expand All Phases' }}</span>
        </button>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-7 gap-2 text-xs font-mono">
        <div 
          v-for="(phaseName, index) in phaseGroups" 
          :key="phaseName"
          @click="togglePhase(phaseName)"
          class="p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition hover:bg-slate-800/80 space-y-1"
          :class="getPhaseHeaderClass(index + 1)"
        >
          <div class="space-y-0.5">
            <span class="font-bold text-[9px] uppercase block">Phase {{ index + 1 }}</span>
            <span class="font-semibold text-slate-200 text-[11px] block leading-tight truncate">{{ getPhaseShortTitle(phaseName) }}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[10px]">
            <span class="font-bold px-1.5 py-0.2 rounded" :class="getPhaseBadgeClass(index + 1)">
              {{ getPhaseBadgeText(index + 1) }}
            </span>
            <span class="font-bold font-mono text-slate-300">
              {{ getCompletedCount(phaseName) }}/{{ getPhaseCount(phaseName) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 7 Collapsible Phase Cards -->
    <div class="space-y-6">
      <div 
        v-for="(phaseName, index) in phaseGroups" 
        :key="phaseName"
        class="rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg overflow-hidden transition"
      >
        <!-- Collapsible Phase Card Header -->
        <div 
          @click="togglePhase(phaseName)"
          class="p-4 bg-slate-800/80 hover:bg-slate-800 border-b border-slate-700/60 flex items-center justify-between cursor-pointer transition select-none"
        >
          <div class="flex items-center space-x-3">
            <div class="w-7 h-7 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold font-mono text-xs shrink-0">
              0{{ index + 1 }}
            </div>
            <div>
              <div class="flex items-center space-x-3">
                <h2 class="text-base font-bold font-heading text-slate-100">{{ phaseName }}</h2>
                <span class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border" :class="getPhaseBadgeClass(index + 1)">
                  {{ getPhaseBadgeText(index + 1) }}
                </span>
                <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-700">
                  {{ getCompletedCount(phaseName) }} of {{ getPhaseCount(phaseName) }} Completed
                </span>
              </div>
              <span class="text-xs font-mono text-slate-400">{{ getPhaseDescription(index + 1) }}</span>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span>Phase Completion:</span>
              <span class="font-bold text-emerald-400">{{ getPhaseCompletionPercentage(phaseName) }}%</span>
            </div>
            <svg 
              class="w-5 h-5 text-slate-400 transition-transform duration-200"
              :class="{ 'transform rotate-180': !collapsedPhases[phaseName] }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Single-Row Milestone List Body -->
        <div v-show="!collapsedPhases[phaseName]" class="divide-y divide-slate-800/60">
          <!-- SPECIAL EXPANDED VIEW FOR PHASE 4: HISTORICAL ENGINEERING ARCHIVE -->
          <div v-if="phaseName.includes('Phase 4')" class="p-6 bg-slate-950/40 space-y-6">
            <!-- Read-Only Historical Status Banner -->
            <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div class="flex items-center space-x-3">
                <span class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">🏛️</span>
                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-bold text-slate-100 text-sm">Business Framework Migration</h3>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">COMPLETED & ARCHIVED</span>
                  </div>
                  <p class="text-slate-400 text-xs mt-0.5">Read-only historical engineering record. All 13 Sprint 3B Work Packages completed and verified.</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 shrink-0 text-[11px]">
                <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                  <span class="text-slate-500 block text-[9px]">EXECUTION ENGINE</span>
                  <span class="text-emerald-400 font-bold">BUSINESS ONLY</span>
                </div>
                <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                  <span class="text-slate-500 block text-[9px]">REPOSITORY</span>
                  <span class="text-emerald-400 font-bold">CLEAN</span>
                </div>
                <div class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                  <span class="text-slate-500 block text-[9px]">PROGRAM STATUS</span>
                  <span class="text-emerald-400 font-bold">100% COMPLETE</span>
                </div>
              </div>
            </div>

            <!-- Historical Sprint Sub-Milestones -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Historical Sprint Milestones</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-blue-400 font-bold text-[11px]">Sprint 3B.2</span>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">COMPLETED</span>
                  </div>
                  <h5 class="font-bold text-slate-200">Middleware & Event Bus Core</h5>
                  <p class="text-[11px] text-slate-400 leading-normal">Event Validator, Priority Dispatcher Queue, Schema Registry, Metrics Collector & DLQ.</p>
                </div>

                <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-blue-400 font-bold text-[11px]">Sprint 3B.3</span>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">COMPLETED</span>
                  </div>
                  <h5 class="font-bold text-slate-200">Subscriber Layer</h5>
                  <p class="text-[11px] text-slate-400 leading-normal">Runtime Publisher Wiring, Dual Publish, Configuration Hardening & Subscriber Registry.</p>
                </div>

                <div class="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-blue-400 font-bold text-[11px]">Sprint 3B.4</span>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">COMPLETED</span>
                  </div>
                  <h5 class="font-bold text-slate-200">Business Framework</h5>
                  <p class="text-[11px] text-slate-400 leading-normal">Business Dispatcher, Handlers, Shadow Mode, Cutover & Legacy Cleanup.</p>
                </div>
              </div>
            </div>

            <!-- Embedded Work Packages Accordion Component (Collapsed by default) -->
            <WorkPackageAccordion
              title="Work Packages (Historical Archive)"
              :completed="13"
              :total="13"
              :progress="100"
              :items="phase4WorkPackages"
              storageKey="phase4_wp_accordion_expanded"
            />

            <!-- Restored Historical Engineering Validation Panel -->
            <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono">
              <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Historical Engineering Validation Evidence</span>
              </h4>

              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span class="text-slate-500 text-[10px] block font-bold">PUBLISHER AUDIT</span>
                  <span class="text-emerald-400 font-bold">PASS (13 / 13)</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span class="text-slate-500 text-[10px] block font-bold">TOPIC COVERAGE</span>
                  <span class="text-emerald-400 font-bold">100% Topics</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span class="text-slate-500 text-[10px] block font-bold">SUBSCRIBER BASELINE</span>
                  <span class="text-emerald-400 font-bold">PASS (15 Handlers)</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span class="text-slate-500 text-[10px] block font-bold">BUSINESS FRAMEWORK</span>
                  <span class="text-emerald-400 font-bold">PRODUCTION</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span class="text-slate-500 text-[10px] block font-bold">REPOSITORY HEALTH</span>
                  <span class="text-emerald-400 font-bold">EXCELLENT</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span class="text-slate-500 text-[10px] block font-bold">READINESS</span>
                  <span class="text-emerald-400 font-bold">READY (WP-5 NEXT)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- STANDARD MILESTONE LIST BODY FOR OTHER PHASES -->
          <template v-else v-for="item in getMilestonesByPhase(phaseName)" :key="item.id">
            <div 
              @click="openMilestone(item)"
              class="px-5 py-3 hover:bg-slate-800/80 transition cursor-pointer flex items-center justify-between gap-4 group text-xs"
            >
              <!-- Left: Status Icon & ID & Name -->
              <div class="flex items-center space-x-3 min-w-0 flex-1">
                <span class="shrink-0">
                  <svg v-if="item.status === 'COMPLETED'" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="item.status === 'IN_PROGRESS'" class="w-4 h-4 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke-width="2" />
                  </svg>
                </span>

                <span class="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                  {{ item.id }}
                </span>

                <span class="font-mono text-[11px] text-slate-400 shrink-0 hidden md:inline-block w-28">
                  {{ item.sprint }}
                </span>

                <span class="font-semibold text-slate-200 group-hover:text-blue-400 transition truncate">
                  {{ item.name }}
                </span>
              </div>

              <!-- Right: Mini Progress Bar, Completion %, Badge & Chevron -->
              <div class="flex items-center space-x-4 shrink-0 font-mono text-xs">
                <div class="hidden sm:flex items-center space-x-2">
                  <div class="w-20 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: item.completion + '%' }"></div>
                  </div>
                  <span class="font-bold w-10 text-right text-slate-300">{{ item.completion }}%</span>
                </div>

                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border" :class="getStatusBadgeClass(item.status)">
                  {{ item.status }}
                </span>

                <svg class="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDocsStore, MilestoneItem, WorkPackageItem } from '@/stores/docs.store';
import { useRouter } from 'vue-router';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import WorkPackageAccordion from '@/components/WorkPackageAccordion.vue';

const docsStore = useDocsStore();
const router = useRouter();

const collapsedPhases = ref<Record<string, boolean>>({});

const phaseGroups = [
  'Phase 1: Foundation',
  'Phase 2: Architecture',
  'Phase 3: Documentation',
  'Phase 4: Business Framework',
  'Phase 5: Production Hardening',
  'Phase 6: Release Engineering',
  'Phase 7: Version 1.0 Release (GA)'
];

const phase4WorkPackages = computed<WorkPackageItem[]>(() => {
  const m14 = docsStore.milestones.find(m => m.id === 'M14');
  if (m14?.workPackages) return m14.workPackages;
  return [
    { id: 'WP-1', name: 'Runtime Publisher Wiring', status: 'Completed', description: 'Wire all 13 runtime publishers into EventBusFacade.', icon: '✅' },
    { id: 'WP-2', name: 'Dual Publish', status: 'Completed', description: 'Introduce dual publishing and runtime feature flags.', icon: '✅' },
    { id: 'WP-2.1', name: 'Configuration Hardening', status: 'Completed', description: 'Synchronize persisted EventBus feature flags.', icon: '✅' },
    { id: 'WP-3', name: 'Subscriber Registry', status: 'Completed', description: 'Implemented Analytics, Metrics, Workspace, Storage, and Lifecycle subscribers.', icon: '✅' },
    { id: 'WP-4.1', name: 'Business Framework Core', status: 'Completed', description: 'Created BusinessDispatcher, BusinessRegistry, and retry engine.', icon: '✅' },
    { id: 'WP-4.2', name: 'Workspace Handler', status: 'Completed', description: 'Implemented WorkspaceBusinessHandler validating workspace.* topics.', icon: '✅' },
    { id: 'WP-4.3', name: 'Storage Handler', status: 'Completed', description: 'Implemented StorageBusinessHandler validating storage.* topics.', icon: '✅' },
    { id: 'WP-4.4', name: 'Lifecycle Handler', status: 'Completed', description: 'Implemented LifecycleBusinessHandler validating browser window/tab topics.', icon: '✅' },
    { id: 'WP-4.5', name: 'Shadow Comparator', status: 'Completed', description: 'Implemented ShadowComparator and ShadowMetrics.', icon: '✅' },
    { id: 'WP-4.5.5', name: 'Shadow Validation', status: 'Completed', description: 'Implemented ShadowValidationService generating health telemetry.', icon: '✅' },
    { id: 'WP-4.6', name: 'Business Cutover', status: 'Completed', description: 'Business Framework enabled as authoritative execution engine.', icon: '✅' },
    { id: 'WP-4.7.1', name: 'ActivityService Runtime Decoupling', status: 'Completed', description: 'Decoupled ActivityService.createEvent calls from all listeners.', icon: '✅' },
    { id: 'WP-4.7.2', name: 'Legacy Infrastructure Cleanup', status: 'Completed', description: 'Cleaned up legacy bridge wrappers and dead imports.', icon: '✅' }
  ];
});

onMounted(() => {
  try {
    const saved = localStorage.getItem('roadmap_expanded_phases');
    if (saved !== null) {
      collapsedPhases.value = JSON.parse(saved);
    }
  } catch (err) {
    // Ignore storage errors
  }
});

const togglePhase = (phaseName: string) => {
  collapsedPhases.value[phaseName] = !collapsedPhases.value[phaseName];
  try {
    localStorage.setItem('roadmap_expanded_phases', JSON.stringify(collapsedPhases.value));
  } catch (err) {
    // Ignore storage errors
  }
};

const isAllExpanded = computed(() => {
  return phaseGroups.every(name => !collapsedPhases.value[name]);
});

const toggleAllPhases = () => {
  const nextState = isAllExpanded.value;
  phaseGroups.forEach(name => {
    collapsedPhases.value[name] = nextState;
  });
  try {
    localStorage.setItem('roadmap_expanded_phases', JSON.stringify(collapsedPhases.value));
  } catch (err) {
    // Ignore storage errors
  }
};

const getMilestonesByPhase = (phaseName: string) => {
  return docsStore.milestones.filter(m => m.phaseGroup === phaseName);
};

const getPhaseCount = (phaseName: string) => {
  if (phaseName.includes('Phase 4')) return 13;
  return getMilestonesByPhase(phaseName).length;
};

const getCompletedCount = (phaseName: string) => {
  if (phaseName.includes('Phase 4')) return 13;
  return getMilestonesByPhase(phaseName).filter(m => m.status === 'COMPLETED').length;
};

const getPhaseCompletionPercentage = (phaseName: string) => {
  if (phaseName.includes('Phase 4')) return 100;
  const total = getPhaseCount(phaseName);
  if (total === 0) return 0;
  const completed = getCompletedCount(phaseName);
  return Math.round((completed / total) * 100);
};

const getPhaseShortTitle = (phaseName: string) => {
  return phaseName.split(': ')[1] || phaseName;
};

const getPhaseHeaderClass = (num: number) => {
  if (num <= 3) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
  if (num === 4) return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
  if (num === 5) return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
  if (num === 6) return 'bg-slate-800 border-slate-700 text-slate-400';
  return 'bg-amber-500/10 border-amber-500/20 text-amber-300';
};

const getPhaseBadgeClass = (num: number) => {
  if (num <= 3) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (num === 4) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  if (num === 5) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (num === 6) return 'bg-slate-800 text-slate-400 border-slate-700';
  return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
};

const getPhaseBadgeText = (num: number) => {
  if (num <= 3) return 'COMPLETED';
  if (num === 4) return 'ARCHIVED';
  if (num === 5) return 'CURRENT';
  if (num === 6) return 'PLANNED';
  return 'TARGET';
};

const getPhaseDescription = (num: number) => {
  if (num === 1) return 'Core Extension MV3 Scaffolding, Storage Adapter & Browser Lifecycle Engine';
  if (num === 2) return 'Enterprise Event Bus Architecture Design, SAD & Revision Addendum';
  if (num === 3) return 'Documentation Repository, Governance, Active Context System & Portal v1.0';
  if (num === 4) return 'Business Execution Framework Migration Complete (13 Work Packages Finished)';
  if (num === 5) return 'Performance Benchmark, Reliability, Observability & Security Compliance Audit';
  if (num === 6) return 'CI/CD Pipeline, Automated Testing, Release Packaging & Web Store Submission';
  return 'General Availability Release (v1.0.0 GA)';
};

const getStatusBadgeClass = (status: string) => {
  if (status === 'COMPLETED') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (status === 'IN_PROGRESS') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (status === 'BLOCKED') return 'bg-red-500/10 text-red-400 border-red-500/20';
  return 'bg-slate-800 text-slate-400 border-slate-700';
};

const openMilestone = (item: MilestoneItem) => {
  router.push(`/sprint/${item.id}`);
};
</script>
