<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">Platform Version Matrix</h1>
      <p class="text-slate-400 text-xs mt-1">Official build metrics, semantic version strings, and browser compatibility thresholds.</p>
    </div>

    <!-- Metrics Matrix Grid -->
    <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-6">
      <h2 class="text-lg font-bold font-heading text-slate-100 border-b border-slate-700/60 pb-3">Active Release Specifications</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div 
          v-for="item in versionMetrics" 
          :key="item.key"
          class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
        >
          <span class="text-slate-400 font-mono">{{ item.key }}</span>
          <span class="font-bold font-mono text-blue-400">{{ item.val }}</span>
        </div>
      </div>
    </div>

    <!-- Browser Support Matrix -->
    <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-4">
      <h2 class="text-lg font-bold font-heading text-slate-100 border-b border-slate-700/60 pb-3">Target Environment & Browser Support</h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-slate-200 font-bold">
            <span>Google Chrome</span>
            <span class="text-emerald-400">Supported</span>
          </div>
          <p class="text-slate-400 text-[11px]">Minimum Version: Chrome 116+ (Manifest V3 Service Workers & webNavigation API)</p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-slate-200 font-bold">
            <span>Microsoft Edge</span>
            <span class="text-emerald-400">Supported</span>
          </div>
          <p class="text-slate-400 text-[11px]">Minimum Version: Edge 116+ (Chromium MV3 Engine)</p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-slate-200 font-bold">
            <span>Brave Browser</span>
            <span class="text-emerald-400">Supported</span>
          </div>
          <p class="text-slate-400 text-[11px]">Minimum Version: Chromium 116+ Core</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const versionMetrics = [
  { key: 'Platform Version', val: '1.0.0' },
  { key: 'Current Sprint', val: 'Sprint D0.1 (Documentation Governance & Standards)' },
  { key: 'Current Milestone', val: 'M05.2 (Sprint D0.1)' },
  { key: 'Current Build Stamp', val: '20260731.2' },
  { key: 'Release Channel', val: 'Development / Alpha Track' },
  { key: 'Semantic Version', val: '1.0.0 (MAJOR.MINOR.PATCH)' },
  { key: 'Architecture Version', val: 'v3.1 (Event-Driven Bus SAD)' },
  { key: 'Documentation Version', val: 'v2.0 (Enterprise Governance)' }
];
</script>
