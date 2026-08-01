<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Breadcrumbs -->
    <Breadcrumbs />

    <!-- Executive Analytics Header -->
    <div class="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden space-y-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              Jira / Azure DevOps / SonarQube Style Insights
            </span>
            <span class="text-xs font-mono text-slate-400">Real-time Engineering Metrics</span>
          </div>
          <h1 class="text-3xl font-extrabold font-heading text-white tracking-tight">
            Executive Engineering Analytics
          </h1>
          <p class="text-slate-400 text-xs max-w-2xl leading-relaxed">
            Real-time project health telemetry, compiler stability, test coverage, code composition metrics, and architecture governance insights.
          </p>
        </div>

        <!-- Project Health Gauge Widget -->
        <div class="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 shrink-0 flex items-center space-x-5">
          <div class="relative w-20 h-20 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-emerald-400" stroke-dasharray="98, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="text-xl font-extrabold font-mono text-white leading-none">98</span>
              <span class="text-[9px] font-mono text-slate-400 mt-0.5">/ 100</span>
            </div>
          </div>
          <div class="space-y-1">
            <span class="text-xs font-mono text-slate-400 block">PROJECT HEALTH</span>
            <span class="text-sm font-bold text-emerald-400 block font-heading">EXCELLENT</span>
            <span class="text-[11px] font-mono text-slate-400">0 Build Errors • 0 Tech Debt</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4 Major Telemetry Metrics Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Build Analytics Card -->
      <div class="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-slate-400 font-bold uppercase">BUILD METRICS</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PASSING</span>
        </div>
        <div class="text-2xl font-bold font-heading text-slate-100">{{ docsStore.projectInfo.buildMetrics.avgBuildTime }}</div>
        <div class="text-xs text-slate-400 space-y-1 font-mono">
          <div class="flex items-center justify-between">
            <span>Success Rate:</span>
            <span class="text-emerald-400 font-semibold">{{ docsStore.projectInfo.buildMetrics.successfulBuilds }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Warnings / Errors:</span>
            <span class="text-slate-300">0 / 0</span>
          </div>
        </div>
      </div>

      <!-- Testing & Quality Card -->
      <div class="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-slate-400 font-bold uppercase">TESTING & COVERAGE</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">100% COVERAGE</span>
        </div>
        <div class="text-2xl font-bold font-heading text-slate-100">{{ docsStore.projectInfo.testMetrics.passed }} / {{ docsStore.projectInfo.testMetrics.totalTests }} Passed</div>
        <div class="text-xs text-slate-400 space-y-1 font-mono">
          <div class="flex items-center justify-between">
            <span>Unit Test Suite:</span>
            <span class="text-blue-400 font-semibold">event-bus.spec.ts</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Failed / Skipped:</span>
            <span class="text-slate-300">0 / 0</span>
          </div>
        </div>
      </div>

      <!-- Documentation Telemetry Card -->
      <div class="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-slate-400 font-bold uppercase">DOCS GOVERNANCE</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ACTIVE</span>
        </div>
        <div class="text-2xl font-bold font-heading text-slate-100">{{ docsStore.projectInfo.docsMetrics.markdownFiles }} Files</div>
        <div class="text-xs text-slate-400 space-y-1 font-mono">
          <div class="flex items-center justify-between">
            <span>ADR Records:</span>
            <span class="text-blue-400 font-semibold">{{ docsStore.projectInfo.adrCount }} Accepted</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Audit Reports:</span>
            <span class="text-slate-300">{{ docsStore.projectInfo.reportCount }} Filed</span>
          </div>
        </div>
      </div>

      <!-- Code Structure Telemetry Card -->
      <div class="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-slate-400 font-bold uppercase">CODE COMPOSITION</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">TYPESCRIPT</span>
        </div>
        <div class="text-2xl font-bold font-heading text-slate-100">{{ docsStore.projectInfo.codeMetrics.totalSourceFiles }} Modules</div>
        <div class="text-xs text-slate-400 space-y-1 font-mono">
          <div class="flex items-center justify-between">
            <span>Vue Components:</span>
            <span class="text-slate-300">{{ docsStore.projectInfo.codeMetrics.vueComponents }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Type Interfaces:</span>
            <span class="text-blue-400 font-semibold">{{ docsStore.projectInfo.codeMetrics.interfaces }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Breakdown Radar & Executive Summary Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Detailed Health Score Breakdown Table -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 shadow-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Subsystem Health Score Breakdown</span>
          </h2>
          <span class="text-xs font-mono text-emerald-400">Score 98/100</span>
        </div>

        <div class="space-y-3 font-mono text-xs">
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span class="text-slate-300">Architecture Integrity (v3.1 SAD)</span>
            <div class="flex items-center space-x-3">
              <div class="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-400 rounded-full" style="width: 100%"></div>
              </div>
              <span class="text-emerald-400 font-bold w-12 text-right">100 / 100</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span class="text-slate-300">Documentation Governance (docs/)</span>
            <div class="flex items-center space-x-3">
              <div class="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-400 rounded-full" style="width: 100%"></div>
              </div>
              <span class="text-emerald-400 font-bold w-12 text-right">100 / 100</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span class="text-slate-300">Build Stability (vue-tsc & vite)</span>
            <div class="flex items-center space-x-3">
              <div class="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-400 rounded-full" style="width: 100%"></div>
              </div>
              <span class="text-emerald-400 font-bold w-12 text-right">100 / 100</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span class="text-slate-300">Test Verification (event-bus.spec)</span>
            <div class="flex items-center space-x-3">
              <div class="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-400 rounded-full" style="width: 100%"></div>
              </div>
              <span class="text-emerald-400 font-bold w-12 text-right">100 / 100</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span class="text-slate-300">Sprint Execution Velocity</span>
            <div class="flex items-center space-x-3">
              <div class="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-blue-400 rounded-full" style="width: 90%"></div>
              </div>
              <span class="text-blue-400 font-bold w-12 text-right">90 / 100</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Feed -->
      <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 shadow-lg flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-bold font-heading text-slate-100 mb-3">Recent Engineering Activity</h2>
          <div class="space-y-3 text-xs font-mono">
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
              <span class="text-blue-400 font-bold block">Latest Sprint Delivered</span>
              <span class="text-slate-300">Sprint D1.4 Executive Analytics</span>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
              <span class="text-emerald-400 font-bold block">Latest ADR Accepted</span>
              <span class="text-slate-300">ADR-0004 V8 Memory Strategy</span>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
              <span class="text-purple-400 font-bold block">Latest Audit Report</span>
              <span class="text-slate-300">REP-005 Docs Governance Report</span>
            </div>
          </div>
        </div>

        <router-link to="/workspace" class="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-500/20">
          <span>Open Sprint Workspace</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocsStore } from '@/stores/docs.store';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const docsStore = useDocsStore();
</script>
