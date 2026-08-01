<template>
  <header class="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          SP
        </div>
        <div>
          <h1 class="font-heading font-bold text-slate-100 text-lg leading-tight">SPPG Companion</h1>
          <span class="text-xs font-mono text-blue-400">Documentation Portal</span>
        </div>
      </div>

      <div class="hidden md:flex items-center space-x-2 pl-6 border-l border-slate-800">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          v1.0.0 Stable
        </span>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Sprint D0.1
        </span>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Search Trigger -->
      <button 
        @click="docsStore.isSearchOpen = true"
        class="hidden sm:flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all text-xs"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search documentation...</span>
        <kbd class="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-[10px] font-mono text-slate-400">Ctrl K</kbd>
      </button>

      <!-- Theme Toggle -->
      <button 
        @click="docsStore.toggleTheme" 
        class="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        title="Toggle Light/Dark Theme"
      >
        <svg v-if="docsStore.isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDocsStore } from '@/stores/docs.store';

const docsStore = useDocsStore();
</script>
