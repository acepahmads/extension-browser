<template>
  <div class="space-y-8 max-w-5xl mx-auto pb-12">
    <!-- Breadcrumbs -->
    <Breadcrumbs />

    <!-- Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">Portal Configuration & Settings</h1>
      <p class="text-slate-400 text-xs mt-1">Configure workspace density, theme mode, dashboard layout, and documentation preferences.</p>
    </div>

    <!-- Settings Card -->
    <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-6">
      <!-- Theme Selection -->
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div>
          <h3 class="text-sm font-bold text-slate-200">Color Theme Mode</h3>
          <p class="text-xs text-slate-400">Toggle between Dark and Light mode themes.</p>
        </div>
        <button 
          @click="docsStore.toggleTheme"
          class="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center space-x-2"
        >
          <span>{{ docsStore.isDarkMode ? '🌙 Dark Mode Active' : '☀️ Light Mode Active' }}</span>
        </button>
      </div>

      <!-- Dashboard Layout -->
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div>
          <h3 class="text-sm font-bold text-slate-200">Dashboard Layout Density</h3>
          <p class="text-xs text-slate-400">Choose card density and spacing.</p>
        </div>
        <select class="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none">
          <option value="comfortable">Comfortable Grid</option>
          <option value="compact">Compact List</option>
        </select>
      </div>

      <!-- Default Sprint Target -->
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div>
          <h3 class="text-sm font-bold text-slate-200">Default Workspace Sprint</h3>
          <p class="text-xs text-slate-400">Select default active sprint focus.</p>
        </div>
        <select class="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none">
          <option value="Sprint 3B">Sprint 3B (Event Bus Implementation)</option>
          <option value="Sprint 4">Sprint 4 (Network Interceptor)</option>
          <option value="Sprint D1.4">Sprint D1.4 (Executive Analytics)</option>
        </select>
      </div>

      <!-- UI Animations -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-200">UI Micro-Animations</h3>
          <p class="text-xs text-slate-400">Enable fluid CSS transitions and modal animations.</p>
        </div>
        <span class="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ENABLED
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocsStore } from '@/stores/docs.store';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const docsStore = useDocsStore();
</script>
