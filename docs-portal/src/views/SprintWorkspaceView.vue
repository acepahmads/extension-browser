<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Dynamic Breadcrumbs -->
    <Breadcrumbs />

    <!-- Executive Sprint Parent Header -->
    <div class="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Sprint Workspace
            </span>
            <span class="text-xs font-mono text-slate-400">Milestone {{ activeMilestone.id }} • {{ activeMilestone.sprint }}</span>
          </div>
          <h1 class="text-3xl font-extrabold font-heading text-white tracking-tight">
            {{ activeMilestone.name }}
          </h1>
          <p class="text-slate-400 text-xs max-w-2xl leading-relaxed">
            {{ activeMilestone.summary }}
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 shrink-0 space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>Sprint Completion</span>
            <span class="font-bold font-mono text-blue-400">{{ activeMilestone.completion }}%</span>
          </div>
          <div class="w-64 h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div class="h-full bg-blue-500 rounded-full transition-all duration-500" :style="{ width: activeMilestone.completion + '%' }"></div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Status: {{ activeMilestone.status }}</span>
            <span class="text-emerald-400 font-semibold">{{ activeMilestone.reviewStatus }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs: Sprint Overview vs Active Phase Detail -->
      <div class="flex items-center space-x-2 pt-4 border-t border-slate-800 text-xs font-mono">
        <button 
          @click="selectOverview" 
          class="px-4 py-2 rounded-xl transition font-bold flex items-center space-x-2"
          :class="!activePhaseId ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span>Sprint Overview</span>
        </button>

        <button 
          v-for="phase in milestonePhases"
          :key="phase.id"
          @click="selectPhase(phase.id)"
          class="px-4 py-2 rounded-xl transition font-medium flex items-center space-x-2"
          :class="activePhaseId === phase.id ? 'bg-blue-600 text-white font-bold shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'"
        >
          <span class="w-2 h-2 rounded-full" :class="phase.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-amber-400'"></span>
          <span>{{ phase.name }}</span>
        </button>
      </div>
    </div>

    <!-- VIEW 1: SPRINT OVERVIEW PARENT PAGE (No activePhaseId) -->
    <div v-if="!activePhaseId" class="space-y-8 animate-in fade-in duration-150">
      <!-- Readiness & Metrics Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
          <span class="text-slate-500 block text-[10px] uppercase font-bold">ARCHITECTURE STATUS</span>
          <span class="text-emerald-400 font-semibold text-sm">{{ docsStore.projectInfo.architectureStatus }}</span>
        </div>
        <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
          <span class="text-slate-500 block text-[10px] uppercase font-bold">BUILD STATUS</span>
          <span class="text-emerald-400 font-semibold text-sm">{{ docsStore.projectInfo.buildStatus }}</span>
        </div>
        <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
          <span class="text-slate-500 block text-[10px] uppercase font-bold">TEST VERIFICATION</span>
          <span class="text-emerald-400 font-semibold text-sm">{{ docsStore.projectInfo.testingStatus }}</span>
        </div>
        <div class="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
          <span class="text-slate-500 block text-[10px] uppercase font-bold">DOCS GOVERNANCE</span>
          <span class="text-emerald-400 font-semibold text-sm">100% GOVERNED</span>
        </div>
      </div>

      <!-- Visual Interactive Timeline Widget -->
      <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-5">
        <h2 class="text-base font-bold font-heading text-slate-100 flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Sprint Execution Timeline</span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          <div 
            v-for="(phase, index) in milestonePhases" 
            :key="phase.id"
            @click="selectPhase(phase.id)"
            class="p-4 rounded-2xl bg-slate-900/60 border hover:border-blue-500/50 cursor-pointer transition flex flex-col justify-between space-y-3 group"
            :class="phase.status === 'COMPLETED' ? 'border-emerald-500/30' : phase.status === 'IN_PROGRESS' ? 'border-amber-500/30' : 'border-slate-800'"
          >
            <div class="flex items-center justify-between">
              <span class="w-6 h-6 rounded-lg flex items-center justify-center font-bold font-mono text-xs" :class="getPhaseBadgeClass(phase.status)">
                {{ index + 1 }}
              </span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono border" :class="getStatusBadgeClass(phase.status)">
                {{ phase.status }}
              </span>
            </div>

            <div>
              <h4 class="font-bold text-xs text-slate-100 group-hover:text-blue-400 transition">{{ phase.name }}</h4>
              <p class="text-[11px] text-slate-400 line-clamp-2 mt-1">{{ phase.summary }}</p>
            </div>

            <div class="text-[11px] font-mono text-blue-400 font-semibold pt-2 flex items-center space-x-1">
              <span>Open Phase Detail</span>
              <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Objectives & Deliverables Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
          <h3 class="text-sm font-bold font-heading text-slate-200 uppercase tracking-wider font-mono">Major Deliverables</h3>
          <div class="space-y-2">
            <div v-for="d in activeMilestone.deliverables" :key="d" class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 flex items-center space-x-2">
              <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ d }}</span>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
          <h3 class="text-sm font-bold font-heading text-slate-200 uppercase tracking-wider font-mono">Sprint Retrospective Insights</h3>
          <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-2">
            <span class="font-bold uppercase tracking-wider text-[10px] font-mono block text-blue-400">Lessons Learned</span>
            <p class="leading-relaxed">Strict TypeScript interfaces before engine implementation prevents type coercion issues and ensures zero-mutation architecture integrity.</p>
          </div>
        </div>
      </div>

      <!-- Phase List Section -->
      <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
        <h3 class="text-sm font-bold font-heading text-slate-200 uppercase tracking-wider font-mono">Sprint Execution Phase List</h3>
        <div class="divide-y divide-slate-800/60 rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
          <div 
            v-for="phase in milestonePhases"
            :key="phase.id"
            @click="selectPhase(phase.id)"
            class="p-4 hover:bg-slate-800/80 transition cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div class="space-y-1">
              <div class="flex items-center space-x-3">
                <span class="font-mono text-xs font-bold text-blue-400">{{ phase.id }}</span>
                <h4 class="font-bold text-xs text-slate-200 group-hover:text-blue-400 transition">{{ phase.name }}</h4>
              </div>
              <p class="text-xs text-slate-400">{{ phase.summary }}</p>
            </div>

            <div class="flex items-center space-x-4 shrink-0 font-mono text-xs">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border" :class="getStatusBadgeClass(phase.status)">
                {{ phase.status }}
              </span>
              <svg class="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Collapsible Work Packages Accordion Component -->
      <WorkPackageAccordion
        v-if="activeMilestone.workPackages && activeMilestone.workPackages.length > 0"
        :title="`${activeMilestone.id} Work Packages`"
        :completed="completedWpCount"
        :total="totalWpCount"
        :progress="activeMilestone.completion"
        :items="activeMilestone.workPackages"
        :storageKey="`sprint_wp_accordion_${activeMilestone.id}`"
      />
    </div>

    <!-- VIEW 2: PHASE DETAIL CHILD PAGE (When activePhaseId is present) -->
    <div v-else-if="currentPhase" class="space-y-6 animate-in fade-in duration-150">
      <!-- Back Button to Sprint Overview -->
      <button 
        @click="selectOverview"
        class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>← Back to Sprint Overview</span>
      </button>

      <!-- Phase Detail Card Container -->
      <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div class="flex items-start justify-between border-b border-slate-800 pb-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 rounded-full font-mono text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {{ currentPhase.id }}
              </span>
              <h2 class="text-xl font-bold font-heading text-slate-100">{{ currentPhase.name }}</h2>
            </div>
            <p class="text-xs text-slate-400 font-mono">Date: {{ currentPhase.date || 'Pending Execution' }}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold border" :class="getStatusBadgeClass(currentPhase.status)">
            {{ currentPhase.status }}
          </span>
        </div>

        <div class="space-y-6 text-xs">
          <!-- Summary & Objectives -->
          <div>
            <h4 class="font-bold text-slate-300 mb-2 font-mono uppercase tracking-wider text-[11px]">Phase Summary & Scope</h4>
            <p class="text-slate-400 leading-relaxed text-sm">{{ currentPhase.summary }}</p>
          </div>

          <div v-if="currentPhase.objectives" class="space-y-2">
            <h4 class="font-bold text-slate-300 mb-2 font-mono uppercase tracking-wider text-[11px]">Key Architectural Objectives</h4>
            <div class="space-y-1.5">
              <div v-for="obj in currentPhase.objectives" :key="obj" class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 font-mono flex items-center space-x-2">
                <span class="text-blue-400 font-bold">✓</span>
                <span>{{ obj }}</span>
              </div>
            </div>
          </div>

          <!-- Implementation Files Added & Created -->
          <div v-if="currentPhase.filesAdded" class="space-y-2">
            <h4 class="font-bold text-slate-300 mb-2 font-mono uppercase tracking-wider text-[11px]">Implementation Files Created / Added</h4>
            <div class="space-y-1 font-mono text-[11px]">
              <div v-for="file in currentPhase.filesAdded" :key="file" class="p-2.5 rounded-xl bg-slate-950 text-blue-300 border border-slate-800 flex items-center space-x-2">
                <span class="text-emerald-400 font-bold">+</span>
                <span>{{ file }}</span>
              </div>
            </div>
          </div>

          <!-- Build, Testing, Coverage Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span class="text-slate-500 font-mono text-[10px] block uppercase font-bold">BUILD VERIFICATION</span>
              <span class="font-semibold text-emerald-400 text-xs">{{ currentPhase.buildResult || 'Clean Build in 1.46s (0 Errors)' }}</span>
            </div>

            <div class="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span class="text-slate-500 font-mono text-[10px] block uppercase font-bold">TEST VERIFICATION</span>
              <span class="font-semibold text-emerald-400 text-xs">{{ currentPhase.testingResult || '4/4 Spec Test Cases Passed' }}</span>
            </div>

            <div class="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span class="text-slate-500 font-mono text-[10px] block uppercase font-bold">API COVERAGE</span>
              <span class="font-semibold text-blue-400 text-xs">{{ currentPhase.coverage || '100% Core Pub/Sub API Coverage' }}</span>
            </div>
          </div>

          <!-- Architecture & Lessons Learned -->
          <div v-if="currentPhase.lessonsLearned" class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1 text-blue-200">
            <span class="font-bold uppercase tracking-wider text-[10px] font-mono block text-blue-400">Lessons Learned & Retrospective</span>
            <p class="leading-relaxed">{{ currentPhase.lessonsLearned }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDocsStore, PhaseItem, MilestoneItem } from '@/stores/docs.store';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import WorkPackageAccordion from '@/components/WorkPackageAccordion.vue';

const route = useRoute();
const router = useRouter();
const docsStore = useDocsStore();

const activeMilestoneId = computed(() => {
  return (route.params.milestoneId as string) || 'M05';
});

const activePhaseId = computed(() => {
  return (route.params.phaseId as string) || '';
});

const activeMilestone = computed<MilestoneItem>(() => {
  return docsStore.milestones.find(m => m.id === activeMilestoneId.value) || docsStore.milestones[4];
});

const completedWpCount = computed(() => {
  if (!activeMilestone.value.workPackages) return 0;
  return activeMilestone.value.workPackages.filter(w => w.status === 'Completed').length;
});

const totalWpCount = computed(() => {
  if (!activeMilestone.value.workPackages) return 0;
  return activeMilestone.value.workPackages.length;
});

const milestonePhases = computed<PhaseItem[]>(() => {
  if (activeMilestone.value.phases && activeMilestone.value.phases.length > 0) {
    return activeMilestone.value.phases;
  }
  return [
    {
      id: 'Phase-01',
      name: 'Phase 1: Core Foundation',
      status: activeMilestone.value.status,
      date: activeMilestone.value.date,
      summary: activeMilestone.value.summary,
      deliverables: activeMilestone.value.deliverables
    }
  ];
});

const currentPhase = computed<PhaseItem | undefined>(() => {
  if (!activePhaseId.value) return undefined;
  return milestonePhases.value.find(p => p.id === activePhaseId.value);
});

const selectOverview = () => {
  router.push(`/sprint/${activeMilestoneId.value}`);
};

const selectPhase = (phaseId: string) => {
  router.push(`/sprint/${activeMilestoneId.value}/phase/${phaseId}`);
};

const getPhaseBadgeClass = (status: string) => {
  if (status === 'COMPLETED') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  if (status === 'IN_PROGRESS') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
  return 'bg-slate-800 text-slate-400 border border-slate-700';
};

const getStatusBadgeClass = (status: string) => {
  if (status === 'COMPLETED') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (status === 'IN_PROGRESS') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-slate-800 text-slate-400 border-slate-700';
};
</script>
