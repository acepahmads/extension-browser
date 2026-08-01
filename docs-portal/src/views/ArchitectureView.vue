<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">Software Architecture</h1>
      <p class="text-slate-400 text-xs mt-1">Platform component topology and micro-kernel modular architecture.</p>
    </div>

    <!-- Architecture Modules Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="mod in archModules" 
        :key="mod.name"
        class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 hover:border-blue-500/40 transition shadow-lg flex flex-col justify-between"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
            <span class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border" :class="mod.badgeClass">
              {{ mod.status }}
            </span>
          </div>

          <h3 class="text-lg font-bold font-heading text-slate-100">{{ mod.name }}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">{{ mod.description }}</p>
        </div>

        <div class="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Sprint: {{ mod.sprint }}</span>
          <span class="text-blue-400 font-semibold">{{ mod.version }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const archModules = [
  {
    name: 'Browser Lifecycle Engine',
    sprint: 'Sprint 2 / 2.1',
    status: 'ACTIVE & VERIFIED',
    version: 'v2.1',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Captures 24 lifecycle events across tabs, navigation, windows, and extension runtime with sequence counters & session tracking.'
  },
  {
    name: 'Workspace Engine & Resolver',
    sprint: 'Sprint 2.1',
    status: 'ACTIVE & VERIFIED',
    version: 'v2.1',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Matches active browser tabs to target enterprise application domain configurations and contextual workspace rules.'
  },
  {
    name: 'Enterprise Event Bus',
    sprint: 'Sprint 3A / 3B',
    status: 'PHASE 1 COMPLETE',
    version: 'v1.0 (Phase 1)',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Decoupled communication backbone with Envelope v1.0, dot-notation wildcard topic resolution, and Pub/Sub API.'
  },
  {
    name: 'Network Interceptor Engine',
    sprint: 'Sprint 4',
    status: 'PLANNED',
    version: 'Sprint 4 Scope',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
    description: 'Non-intrusive XHR & Fetch request/response interceptor streaming HTTP telemetry events to the Event Bus.'
  },
  {
    name: 'Storage Engine & Persistence',
    sprint: 'Sprint 5',
    status: 'PLANNED',
    version: 'Sprint 5 Scope',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
    description: 'High-capacity persistent event storage adapter built on IndexedDB with historical log query capabilities.'
  },
  {
    name: 'Replay Engine',
    sprint: 'Sprint 10',
    status: 'PLANNED',
    version: 'Sprint 10 Scope',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
    description: 'Traffic recorder and HAR replay engine tapping into the Event Bus via IReplayHook for session replay.'
  },
  {
    name: 'AI Analyzer Engine',
    sprint: 'Sprint 11',
    status: 'PLANNED',
    version: 'Sprint 11 Scope',
    badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
    description: 'AI telemetry tap monitoring event streams for security anomalies, performance bottlenecks, and friction points.'
  }
];
</script>
