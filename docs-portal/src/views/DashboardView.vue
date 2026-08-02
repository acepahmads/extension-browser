<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Executive Hero Header -->
    <div class="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Enterprise Production Engineering Control
            </span>
            <!-- Small Repository Status Chips -->
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {{ docsStore.projectInfo.repositoryStatus }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Build {{ docsStore.projectInfo.buildStatus }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Type Check {{ docsStore.projectInfo.typeCheckStatus }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {{ docsStore.projectInfo.testSuitesStatus }}
            </span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight">
            {{ docsStore.projectInfo.projectName }}
          </h1>
          <p class="text-slate-400 text-sm max-w-2xl">
            Event-Driven Micro-Kernel Extension Architecture. Release Engineering Baseline ({{ docsStore.projectInfo.currentBaseline }}) Active. Phase 6 Completion: {{ docsStore.projectInfo.progressSummary.releaseEngineering }}%.
          </p>
        </div>

        <!-- Global Progress Gauge & Baseline Card -->
        <div class="flex flex-col sm:flex-row gap-4 shrink-0 font-mono text-xs">
          <!-- Baseline Card -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/30 space-y-2 min-w-[210px]">
            <div class="flex items-center justify-between text-slate-400">
              <span class="text-[10px] uppercase font-bold text-slate-300">CURRENT BASELINE</span>
              <span class="font-bold text-blue-400">{{ docsStore.projectInfo.currentBaseline }}</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div class="h-full bg-blue-500 rounded-full transition-all duration-500" style="width: 100%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>Phase 6 Progress</span>
              <span class="text-blue-400 font-bold">3 / 5 Done ({{ docsStore.projectInfo.progressSummary.releaseEngineering }}%)</span>
            </div>
          </div>

          <!-- Global Project Progress Gauge -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2 min-w-[210px]">
            <div class="flex items-center justify-between text-slate-400">
              <span class="text-[10px] uppercase font-bold text-slate-300">OVERALL PROGRESS</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.overallCompletion }}%</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500" :style="{ width: docsStore.projectInfo.overallCompletion + '%' }"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>Phases Active</span>
              <span class="text-emerald-400 font-bold">5 / 7 Phases</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. GLOBAL REPOSITORY SUMMARY PANEL (TOP DEDICATED CARD) -->
    <div class="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-xl space-y-4 font-mono text-xs">
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div class="flex items-center space-x-2">
          <span class="text-emerald-400 font-bold text-base">🟢</span>
          <span class="font-bold text-slate-100 text-sm">Global Repository Summary & Execution Control</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="px-2.5 py-0.5 rounded font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{{ docsStore.projectInfo.currentBaseline }} BASELINE</span>
          <span class="px-2.5 py-0.5 rounded font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">PHASE 6 CURRENT ({{ docsStore.projectInfo.progressSummary.releaseEngineering }}%)</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">STATUS</span>
          <span class="text-emerald-400 font-bold text-xs">{{ docsStore.projectInfo.repositoryStatus }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">BASELINE</span>
          <span class="text-blue-400 font-bold text-xs">{{ docsStore.projectInfo.currentBaseline }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">ARCHITECTURE</span>
          <span class="text-emerald-400 font-bold text-xs">{{ docsStore.projectInfo.architectureStatus }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">CURRENT SPRINT</span>
          <span class="text-amber-300 font-bold text-xs">{{ docsStore.projectInfo.currentSprint }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">CURRENT PHASE</span>
          <span class="text-amber-300 font-bold text-xs">Phase 6 ({{ docsStore.projectInfo.progressSummary.releaseEngineering }}%)</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">BUILD</span>
          <span class="text-emerald-400 font-bold text-xs">{{ docsStore.projectInfo.buildStatus }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">TYPE CHECK</span>
          <span class="text-emerald-400 font-bold text-xs">{{ docsStore.projectInfo.typeCheckStatus }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">TEST SUITES</span>
          <span class="text-emerald-400 font-bold text-xs">{{ docsStore.projectInfo.testSuitesStatus }}</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">HEALTH</span>
          <span class="text-emerald-400 font-bold text-xs">{{ docsStore.projectInfo.repositoryHealth }}</span>
        </div>
      </div>
    </div>

    <!-- 2. RELEASE TIMELINE WIDGET -->
    <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 font-mono text-xs">
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
          <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Product Version Release Timeline</span>
        </h3>
        <span class="text-[11px] text-slate-400">Baseline Tag: <strong class="text-blue-400">{{ docsStore.projectInfo.currentBaseline }}</strong></span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center text-[11px]">
        <div
          v-for="item in docsStore.projectInfo.releaseTimeline"
          :key="item.version"
          class="p-2.5 rounded-xl border space-y-0.5"
          :class="{
            'bg-emerald-500/10 border-emerald-500/20': item.status === 'Completed',
            'bg-teal-500/15 border-teal-500/30': item.status === 'ARCHIVED',
            'bg-blue-500/20 border-blue-500/40 ring-2 ring-blue-500/30': item.status === 'BASELINE',
            'bg-amber-500/20 border-amber-500/40 ring-2 ring-amber-500/30': item.status === 'CURRENT',
            'bg-slate-900/60 border-slate-800': item.status === 'PLANNED',
            'bg-yellow-500/10 border-yellow-500/20': item.status === 'GOAL'
          }"
        >
          <span
            class="font-bold block text-[10px]"
            :class="{
              'text-emerald-400': item.status === 'Completed',
              'text-teal-300': item.status === 'ARCHIVED',
              'text-blue-300': item.status === 'BASELINE',
              'text-amber-300': item.status === 'CURRENT',
              'text-slate-400': item.status === 'PLANNED',
              'text-yellow-400': item.status === 'GOAL'
            }"
          >{{ item.version }}</span>
          <span class="text-slate-300 font-semibold block text-[10px] truncate">{{ item.label }}</span>
          <span
            class="text-[9px] font-bold uppercase"
            :class="{
              'text-emerald-400/80': item.status === 'Completed',
              'text-teal-300': item.status === 'ARCHIVED',
              'text-blue-300': item.status === 'BASELINE',
              'text-amber-300': item.status === 'CURRENT',
              'text-slate-500': item.status === 'PLANNED',
              'text-yellow-400': item.status === 'GOAL'
            }"
          >{{ item.status }}</span>
        </div>
      </div>
    </div>

    <!-- 3. OVERALL PROJECT PROGRESS SUMMARY (GLOBAL WIDGET) -->
    <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 font-mono text-xs">
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Overall Project Progress Summary</span>
        </h3>
        <div class="flex items-center space-x-3">
          <span class="text-slate-400">Total Completion:</span>
          <span class="text-emerald-400 font-bold text-sm">{{ docsStore.projectInfo.overallCompletion }}%</span>
        </div>
      </div>

      <!-- Single Global Progress Bar -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-slate-300">
          <span>Global Product Roadmap Execution</span>
          <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.overallCompletion }}% Total</span>
        </div>
        <div class="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            class="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
            :style="{ width: docsStore.projectInfo.overallCompletion + '%' }"
          ></div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">FOUNDATION</span>
          <span class="text-emerald-400 font-bold">{{ docsStore.projectInfo.progressSummary.foundation }}%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">ARCHITECTURE</span>
          <span class="text-emerald-400 font-bold">{{ docsStore.projectInfo.progressSummary.architecture }}%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">DOCUMENTATION</span>
          <span class="text-emerald-400 font-bold">{{ docsStore.projectInfo.progressSummary.documentation }}%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-teal-500/30 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">BUSINESS FWK</span>
          <span class="text-teal-300 font-bold">{{ docsStore.projectInfo.progressSummary.businessFramework }}%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-blue-500/30 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">HARDENING</span>
          <span class="text-blue-300 font-bold">{{ docsStore.projectInfo.progressSummary.productionHardening }}%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-amber-500/30 text-center space-y-1 ring-1 ring-amber-500/20">
          <span class="text-slate-400 text-[10px] block font-bold">RELEASE ENG</span>
          <span class="text-amber-300 font-bold">{{ docsStore.projectInfo.progressSummary.releaseEngineering }}%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-yellow-500/20 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">VERSION 1.0</span>
          <span class="text-yellow-400 font-bold">{{ docsStore.projectInfo.progressSummary.gaRelease }}%</span>
        </div>
      </div>
    </div>

    <!-- 4. 7-PHASE HIERARCHY FLOW & MILESTONE SUMMARY WIDGETS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 7-Phase Hierarchy Flow Dynamic Component -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>7-Phase Product Hierarchy Breakdown</span>
          </h2>
          <router-link to="/roadmap" class="text-xs font-mono text-blue-400 hover:underline">Full Roadmap →</router-link>
        </div>

        <div class="space-y-2 text-xs font-mono">
          <div
            v-for="phase in docsStore.phases"
            :key="phase.id"
            class="p-3 rounded-xl bg-slate-900/60 border flex items-center justify-between"
            :class="{
              'border-slate-800': phase.id <= 3,
              'border-teal-500/30': phase.id === 4,
              'border-blue-500/40 bg-slate-900/80': phase.id === 5,
              'border-amber-500/40 bg-amber-500/10 ring-1 ring-amber-500/30': phase.id === 6,
              'border-yellow-500/30 bg-slate-900/40': phase.id === 7
            }"
          >
            <div class="flex items-center space-x-3">
              <span
                class="w-6 h-6 rounded-lg font-bold flex items-center justify-center text-[11px]"
                :class="{
                  'bg-emerald-500/20 text-emerald-400': phase.id <= 3,
                  'bg-teal-500/20 text-teal-300': phase.id === 4,
                  'bg-blue-500/20 text-blue-400': phase.id === 5,
                  'bg-amber-500/20 text-amber-300': phase.id === 6,
                  'bg-yellow-500/20 text-yellow-400': phase.id === 7
                }"
              >{{ phase.id }}</span>
              <div>
                <div class="flex items-center space-x-2">
                  <span
                    class="font-bold"
                    :class="{
                      'text-slate-200': phase.id <= 3,
                      'text-slate-100': phase.id === 4,
                      'text-blue-300': phase.id === 5,
                      'text-amber-300': phase.id === 6,
                      'text-yellow-300': phase.id === 7
                    }"
                  >{{ phase.name }}</span>
                  <span
                    v-if="phase.versionTag"
                    class="px-1.5 py-0.2 rounded text-[9px] font-bold"
                    :class="phase.id === 5 ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'"
                  >{{ phase.versionTag }}</span>
                </div>
                <span class="text-[10px] block font-mono" :class="phase.id === 6 ? 'text-amber-400' : 'text-slate-400'">{{ phase.desc }}</span>
              </div>
            </div>
            <span
              class="px-2.5 py-1 rounded-full text-[10px] font-bold border"
              :class="phase.badgeClass"
            >{{ phase.badge }}</span>
          </div>
        </div>
      </div>

      <!-- Milestone Summary & Sprint Control Panel -->
      <div class="space-y-4 flex flex-col justify-between">
        <!-- Milestone Summary Cards -->
        <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3 font-mono text-xs">
          <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Sprint Milestone Summary</span>
          </h3>

          <div class="space-y-2">
            <div
              v-for="sprint in docsStore.sprints"
              :key="sprint.name"
              class="p-2.5 rounded-xl border flex items-center justify-between"
              :class="sprint.active ? 'bg-amber-500/15 border-amber-500/30 ring-1 ring-amber-500/20' : 'bg-slate-900/60 border-slate-800'"
            >
              <span class="font-bold" :class="sprint.active ? 'text-amber-300' : 'text-slate-300'">{{ sprint.name }}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold border" :class="sprint.badgeClass">{{ sprint.status }}</span>
            </div>
          </div>
        </div>

        <!-- 5. ENGINEERING HEALTH CARD (DEDICATED PANEL) -->
        <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3 font-mono text-xs">
          <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Engineering Health Panel</span>
          </h3>

          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">ARCHITECTURE</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.architecture }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">BUSINESS FWK</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.businessFramework }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">PERFORMANCE</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.performanceFramework }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">RELIABILITY</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.reliabilityFramework }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">OBSERVABILITY</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.observabilityPlatform }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">INTEGRATION</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.integrationLayer }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">WIRING</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.runtimeWiring }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">HEALTH</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.repositoryHealth }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">TECH DEBT</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.technicalDebt }}</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">BUILD & TESTS</span>
              <span class="font-bold text-emerald-400">{{ docsStore.projectInfo.healthCard.build }} ({{ docsStore.projectInfo.testMetrics.passed }}/{{ docsStore.projectInfo.testMetrics.totalTests }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Evolution Roadmap Flow Timeline -->
    <div class="space-y-6">
      <WorkPackageAccordion
        title="Work Packages (Historical & Active)"
        :completed="docsStore.projectInfo.completedMilestones"
        :total="docsStore.projectInfo.totalMilestones"
        :progress="docsStore.projectInfo.overallCompletion"
        :items="sprintWorkPackages"
        storageKey="dashboard_wp_accordion_expanded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDocsStore } from '@/stores/docs.store';
import StatCard from '@/components/StatCard.vue';
import WorkPackageAccordion from '@/components/WorkPackageAccordion.vue';

const docsStore = useDocsStore();

const sprintWorkPackages = computed(() => {
  return docsStore.milestones.map(m => ({
    id: m.id,
    name: m.name,
    status: (m.status === 'COMPLETED' || m.status === 'ARCHIVED' || m.status === 'BASELINE' ? 'Completed' : 'Planned') as 'Completed' | 'Planned',
    description: m.summary,
    icon: m.status === 'COMPLETED' || m.status === 'ARCHIVED' || m.status === 'BASELINE' ? 'check-circle' : 'clock'
  }));
});
</script>
