<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header with Breadcrumbs & Executive Metrics -->
    <div>
      <Breadcrumbs />
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-2">
        <div>
          <div class="flex items-center space-x-3 mb-1">
            <span class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
              Enterprise Delivery Roadmap {{ docsStore.projectInfo.version }}
            </span>
            <span class="text-xs font-mono text-slate-400">Baseline {{ docsStore.projectInfo.currentBaseline }} • {{ docsStore.projectInfo.repositoryStatus }}</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">Enterprise Project Roadmap</h1>
          <p class="text-slate-400 text-xs mt-1">Single-screen 7-phase hierarchy visualization. Displays completed history, baseline {{ docsStore.projectInfo.currentBaseline }}, and General Availability release.</p>
        </div>

        <div class="flex items-center space-x-3 shrink-0">
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono flex items-center space-x-4">
            <div>
              <span class="text-slate-500 block text-[10px]">BASELINE TAG</span>
              <span class="text-purple-300 font-bold font-mono">{{ docsStore.projectInfo.currentBaseline }}</span>
            </div>
            <div class="h-6 w-px bg-slate-700"></div>
            <div>
              <span class="text-slate-500 block text-[10px]">CURRENT PHASE</span>
              <span class="text-emerald-400 font-bold font-mono">{{ docsStore.projectInfo.currentPhaseGroup }}</span>
            </div>
            <div class="h-6 w-px bg-slate-700"></div>
            <div>
              <span class="text-slate-500 block text-[10px]">OVERALL PROGRESS</span>
              <span class="text-emerald-400 font-bold font-mono">{{ docsStore.projectInfo.overallCompletion }}%</span>
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
          v-for="phase in docsStore.phases" 
          :key="phase.id"
          @click="togglePhase(phase.groupKey)"
          class="p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition hover:bg-slate-800/80 space-y-1"
          :class="getPhaseHeaderClass(phase.id)"
        >
          <div class="space-y-0.5">
            <span class="font-bold text-[9px] uppercase block">Phase {{ phase.id }}</span>
            <span class="font-semibold text-slate-200 text-[11px] block leading-tight truncate">{{ getPhaseShortTitle(phase.name) }}</span>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[10px]">
            <span class="font-bold px-1.5 py-0.2 rounded text-[9px]" :class="phase.badgeClass">
              {{ phase.badge }}
            </span>
            <span class="font-bold font-mono text-slate-300">
              {{ phase.completedMilestones }}/{{ phase.totalMilestones }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Release Version Timeline Widget -->
    <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-xs space-y-3">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Product Version Release Timeline</span>
        <span class="text-[10px] text-emerald-400 font-bold uppercase">{{ docsStore.projectInfo.repositoryStatus }}</span>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-[11px]">
        <template v-for="(item, idx) in docsStore.versionTimeline" :key="item.version">
          <span class="px-2.5 py-1 rounded-lg border font-bold" :class="item.badgeClass">
            {{ item.version }} {{ item.label }}
          </span>
          <span v-if="idx < docsStore.versionTimeline.length - 1" class="text-slate-600">→</span>
        </template>
      </div>
    </div>

    <!-- 7 Collapsible Phase Cards -->
    <div class="space-y-6">
      <div 
        v-for="phase in docsStore.phases" 
        :key="phase.id"
        class="rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg overflow-hidden transition"
      >
        <!-- Collapsible Phase Card Header -->
        <div 
          @click="togglePhase(phase.groupKey)"
          class="p-4 bg-slate-800/80 hover:bg-slate-800 border-b border-slate-700/60 flex items-center justify-between cursor-pointer transition select-none"
        >
          <div class="flex items-center space-x-3">
            <div class="w-7 h-7 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold font-mono text-xs shrink-0">
              0{{ phase.id }}
            </div>
            <div>
              <div class="flex items-center space-x-3">
                <h2 class="text-base font-bold font-heading text-slate-100">{{ phase.name }}</h2>
                <span class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border" :class="phase.badgeClass">
                  {{ phase.badge }}
                </span>
                <span v-if="phase.versionTag" class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {{ phase.versionTag }}
                </span>
                <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-700">
                  {{ phase.completedMilestones }} of {{ phase.totalMilestones }} Completed
                </span>
              </div>
              <span class="text-xs font-mono text-slate-400">{{ phase.desc }}</span>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span>Phase Completion:</span>
              <span class="font-bold text-emerald-400">{{ phase.progress }}%</span>
            </div>
            <svg 
              class="w-5 h-5 text-slate-400 transition-transform duration-200"
              :class="{ 'transform rotate-180': !collapsedPhases[phase.groupKey] }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Single-Row Milestone List Body -->
        <div v-show="!collapsedPhases[phase.groupKey]" class="divide-y divide-slate-800/60">
          <!-- SPECIAL EXPANDED VIEW FOR PHASE 4: HISTORICAL ARCHIVE -->
          <div v-if="phase.id === 4" class="p-6 bg-slate-950/40 space-y-6">
            <div class="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-slate-900 to-slate-900 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div class="flex items-center space-x-3">
                <span class="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm shrink-0">🏛️</span>
                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-bold text-slate-100 text-sm">Business Framework Migration</h3>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">ARCHIVED</span>
                  </div>
                  <p class="text-slate-400 text-xs mt-0.5">Business Framework Migration Complete (13 Work Packages Finished).</p>
                </div>
              </div>
            </div>

            <WorkPackageAccordion
              title="Work Packages (Historical Archive)"
              :completed="13"
              :total="13"
              :progress="100"
              :items="phase4WorkPackages"
              storageKey="phase4_wp_accordion_expanded"
            />
          </div>

          <!-- SPECIAL EXPANDED VIEW FOR PHASE 5: HARDENING BASELINE -->
          <div v-else-if="phase.id === 5" class="p-6 bg-slate-950/40 space-y-6">
            <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 via-slate-900 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div class="flex items-center space-x-3">
                <span class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">🛡️</span>
                <div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-bold text-slate-100 text-sm">Production Hardening Suite</h3>
                    <span class="px-2.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">BASELINE v0.5.0</span>
                  </div>
                  <p class="text-slate-400 text-xs mt-0.5">Production Hardening Complete — Benchmark, Reliability, Observability & Integration Layer (4 / 4 Work Packages Completed).</p>
                </div>
              </div>

              <!-- Small Status Chips -->
              <div class="flex flex-wrap items-center gap-2 shrink-0 text-[10px]">
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Production Ready</span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Build PASS</span>
                <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Type Check PASS</span>
                <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">11 / 11 Tests</span>
              </div>
            </div>

            <!-- Milestone Rows for Phase 5 -->
            <div class="divide-y divide-slate-800/60">
              <div 
                v-for="item in getMilestonesByPhase(phase.groupKey)" 
                :key="item.id"
                @click="openMilestone(item)"
                class="px-5 py-3 hover:bg-slate-800/80 transition cursor-pointer flex items-center justify-between gap-4 group text-xs font-mono"
              >
                <div class="flex items-center space-x-3 min-w-0 flex-1">
                  <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    {{ item.id }}
                  </span>
                  <span class="text-slate-400 shrink-0 hidden md:inline-block w-28">
                    {{ item.sprint }}
                  </span>
                  <span class="font-semibold text-slate-200 group-hover:text-blue-400 transition truncate">
                    {{ item.name }}
                  </span>
                </div>

                <div class="flex items-center space-x-4 shrink-0 font-mono text-xs">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {{ item.status }}
                  </span>
                  <svg class="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- STANDARD MILESTONE LIST BODY FOR OTHER PHASES -->
          <template v-else v-for="item in getMilestonesByPhase(phase.groupKey)" :key="item.id">
            <div 
              @click="openMilestone(item)"
              class="px-5 py-3 hover:bg-slate-800/80 transition cursor-pointer flex items-center justify-between gap-4 group text-xs font-mono"
            >
              <div class="flex items-center space-x-3 min-w-0 flex-1">
                <span class="shrink-0">
                  <svg v-if="item.status === 'COMPLETED' || item.status === 'BASELINE'" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="item.status === 'CURRENT'" class="w-4 h-4 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
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

              <div class="flex items-center space-x-4 shrink-0 font-mono text-xs">
                <div class="hidden sm:flex items-center space-x-2">
                  <div class="w-20 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    <div class="h-full bg-emerald-500 rounded-full" :style="{ width: item.completion + '%' }"></div>
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

const defaultCollapsedState: Record<string, boolean> = {
  'Phase 1: Foundation': true,
  'Phase 2: Architecture': true,
  'Phase 3: Documentation': true,
  'Phase 4: Business Framework': true,
  'Phase 5: Production Hardening': true,
  'Phase 6: Release Engineering': true,
  'Phase 7: Version 1.0 Release (GA)': false
};

const phase4WorkPackages = computed<WorkPackageItem[]>(() => {
  const m14 = docsStore.milestones.find(m => m.id === 'M14');
  if (m14?.workPackages) return m14.workPackages;
  return [];
});

onMounted(() => {
  try {
    const saved = localStorage.getItem('roadmap_expanded_phases_v4');
    if (saved !== null) {
      collapsedPhases.value = { ...defaultCollapsedState, ...JSON.parse(saved) };
    } else {
      collapsedPhases.value = { ...defaultCollapsedState };
    }
  } catch (err) {
    collapsedPhases.value = { ...defaultCollapsedState };
  }
});

const togglePhase = (phaseName: string) => {
  collapsedPhases.value[phaseName] = !collapsedPhases.value[phaseName];
  try {
    localStorage.setItem('roadmap_expanded_phases_v4', JSON.stringify(collapsedPhases.value));
  } catch (err) {
    // Ignore storage errors
  }
};

const isAllExpanded = computed(() => {
  return docsStore.phases.every(phase => !collapsedPhases.value[phase.groupKey]);
});

const toggleAllPhases = () => {
  const nextState = isAllExpanded.value;
  docsStore.phases.forEach(phase => {
    collapsedPhases.value[phase.groupKey] = nextState;
  });
  try {
    localStorage.setItem('roadmap_expanded_phases_v4', JSON.stringify(collapsedPhases.value));
  } catch (err) {
    // Ignore storage errors
  }
};

const getMilestonesByPhase = (phaseName: string) => {
  return docsStore.milestones.filter(m => m.phaseGroup === phaseName);
};

const getPhaseShortTitle = (phaseName: string) => {
  return phaseName.split(': ')[1] || phaseName;
};

const getPhaseHeaderClass = (num: number) => {
  if (num <= 3) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
  if (num === 4) return 'bg-teal-500/15 border-teal-500/30 text-teal-300';
  if (num === 5) return 'bg-blue-500/15 border-blue-500/30 text-blue-300';
  if (num === 6) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
  return 'bg-purple-500/20 border-purple-500/30 text-purple-300 ring-1 ring-purple-500/40';
};

const getStatusBadgeClass = (status: string) => {
  if (status === 'COMPLETED') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (status === 'BASELINE') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (status === 'ARCHIVED') return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
  if (status === 'CURRENT') return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
  if (status === 'GOAL' || status === 'GA') return 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold';
  return 'bg-slate-800 text-slate-400 border-slate-700';
};

const openMilestone = (item: MilestoneItem) => {
  router.push(`/sprint/${item.id}`);
};
</script>
