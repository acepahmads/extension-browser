<template>
  <header class="flex items-center justify-between px-4 py-3 bg-dark-surface border-b border-dark-border">
    <div class="flex items-center gap-3">
      <!-- High-tech Logo Icon -->
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/30">
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-sm font-semibold tracking-wide text-slate-100">SPPG Companion</h1>
          <span class="px-1.5 py-0.5 text-[10px] font-mono bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded">
            MV3
          </span>
        </div>
        <p class="text-[11px] text-slate-400 font-mono">Enterprise Companion v{{ version }}</p>
      </div>
    </div>

    <StatusBadge status="active" label="Ready" />
  </header>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue';

defineProps<{
  version: string;
}>();
</script>
