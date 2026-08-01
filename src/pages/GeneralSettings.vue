<template>
  <div class="space-y-6 max-w-3xl">
    <div>
      <h2 class="text-lg font-semibold text-slate-100 mb-1">General Settings</h2>
      <p class="text-xs text-slate-400">Configure extension behavior and developer preferences.</p>
    </div>

    <!-- Developer Mode Setting -->
    <div class="p-4 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-between">
      <div>
        <div class="text-sm font-medium text-slate-200">Developer Mode</div>
        <div class="text-xs text-slate-400 mt-0.5">Enable verbose logging and advanced inspection features</div>
      </div>
      <button 
        @click="toggleDevMode"
        class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
        :class="isDevMode ? 'bg-brand-600' : 'bg-slate-700'"
      >
        <span 
          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          :class="isDevMode ? 'translate-x-5' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- Theme Selection -->
    <div class="p-4 rounded-lg bg-dark-surface border border-dark-border space-y-3">
      <div>
        <div class="text-sm font-medium text-slate-200">Interface Theme</div>
        <div class="text-xs text-slate-400 mt-0.5">Select your preferred color scheme for DevTools</div>
      </div>

      <div class="grid grid-cols-3 gap-3 pt-1">
        <div 
          class="p-3 rounded-md border text-center cursor-pointer transition-all"
          :class="theme === 'dark' ? 'border-brand-500 bg-brand-950/30 text-brand-300 font-semibold' : 'border-dark-border bg-dark-card/40 text-slate-400 hover:text-slate-200'"
        >
          <div class="w-full h-8 rounded bg-dark-bg border border-dark-border mb-2 flex items-center justify-center text-xs">
            🌙 Dark
          </div>
          <span class="text-xs">Enterprise Dark</span>
        </div>

        <div 
          class="p-3 rounded-md border text-center opacity-50 cursor-not-allowed border-dark-border bg-dark-card/20 text-slate-500"
        >
          <div class="w-full h-8 rounded bg-slate-200 text-slate-800 mb-2 flex items-center justify-center text-xs">
            ☀️ Light
          </div>
          <span class="text-xs">Light (Coming Soon)</span>
        </div>

        <div 
          class="p-3 rounded-md border text-center opacity-50 cursor-not-allowed border-dark-border bg-dark-card/20 text-slate-500"
        >
          <div class="w-full h-8 rounded bg-gradient-to-r from-dark-bg to-slate-300 mb-2 flex items-center justify-center text-xs text-white">
            ⚙️ System
          </div>
          <span class="text-xs">System Default</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExtension } from '../composables/useExtension';

const { isDevMode, toggleDevMode, theme } = useExtension();
</script>
