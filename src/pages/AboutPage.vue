<template>
  <div class="space-y-6 max-w-3xl">
    <div>
      <h2 class="text-lg font-semibold text-slate-100 mb-1">About SPPG Browser Extension</h2>
      <p class="text-xs text-slate-400">Enterprise Developer Tools platform for web applications</p>
    </div>

    <!-- Specifications Grid -->
    <div class="p-4 rounded-lg bg-dark-surface border border-dark-border space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-xs text-slate-400">Extension Version</div>
          <div class="text-sm font-semibold text-brand-300 font-mono mt-0.5">v{{ version }}</div>
        </div>

        <div>
          <div class="text-xs text-slate-400">Manifest Specification</div>
          <div class="text-sm font-semibold text-slate-200 font-mono mt-0.5">Version {{ manifestVersion }} (MV3)</div>
        </div>

        <div>
          <div class="text-xs text-slate-400">Framework Core</div>
          <div class="text-sm font-semibold text-emerald-400 font-mono mt-0.5">Vue 3 + Vite + TypeScript</div>
        </div>

        <div>
          <div class="text-xs text-slate-400">State Management</div>
          <div class="text-sm font-semibold text-amber-400 font-mono mt-0.5">Pinia Engine</div>
        </div>
      </div>

      <hr class="border-dark-border" />

      <div>
        <div class="text-xs font-semibold text-slate-300 mb-2">Target Enterprise Platform Capabilities:</div>
        <ul class="grid grid-cols-2 gap-2 text-xs text-slate-400">
          <li class="flex items-center gap-1.5"><span class="text-brand-400">✓</span> Browser Lifecycle</li>
          <li class="flex items-center gap-1.5"><span class="text-slate-600">•</span> Network Interceptor (Sprint 2+)</li>
          <li class="flex items-center gap-1.5"><span class="text-slate-600">•</span> Discovery Engine (Sprint 2+)</li>
          <li class="flex items-center gap-1.5"><span class="text-slate-600">•</span> DOM Analyzer</li>
          <li class="flex items-center gap-1.5"><span class="text-slate-600">•</span> JSON Analyzer</li>
          <li class="flex items-center gap-1.5"><span class="text-slate-600">•</span> Mapping Engine</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExtension } from '../composables/useExtension';

const { version, manifestVersion } = useExtension();
</script>
