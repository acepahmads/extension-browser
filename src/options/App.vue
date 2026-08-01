<template>
  <div class="min-h-screen flex flex-col bg-dark-bg text-slate-100 font-sans">
    <!-- Top Header -->
    <header class="h-14 bg-dark-surface border-b border-dark-border px-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/30">
          <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 class="text-sm font-semibold text-slate-100">SPPG Companion Control Center</h1>
          <p class="text-[11px] text-slate-400">Browser Lifecycle Engine & Activity Center</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-mono text-slate-400">Config v{{ configVersion }}</span>
        <span class="px-2 py-0.5 text-xs font-mono bg-brand-950 text-brand-300 border border-brand-500/30 rounded">
          Sprint 2 Lifecycle
        </span>
      </div>
    </header>

    <!-- Content Split Layout -->
    <div class="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-8">
      <!-- Left Navigation Sidebar -->
      <aside class="w-56 shrink-0 space-y-1">
        <button
          @click="activePage = 'activity'"
          class="w-full px-3.5 py-2 rounded-md text-xs font-medium flex items-center gap-2.5 transition-all"
          :class="activePage === 'activity' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-dark-surface'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Activity Center
        </button>

        <button
          @click="activePage = 'workspaces'"
          class="w-full px-3.5 py-2 rounded-md text-xs font-medium flex items-center gap-2.5 transition-all"
          :class="activePage === 'workspaces' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-dark-surface'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Workspace Registry
        </button>

        <button
          @click="activePage = 'testcenter'"
          class="w-full px-3.5 py-2 rounded-md text-xs font-medium flex items-center gap-2.5 transition-all"
          :class="activePage === 'testcenter' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-dark-surface'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Developer Tools
        </button>

        <button
          @click="activePage = 'general'"
          class="w-full px-3.5 py-2 rounded-md text-xs font-medium flex items-center gap-2.5 transition-all"
          :class="activePage === 'general' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-dark-surface'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          General Settings
        </button>

        <button
          @click="activePage = 'about'"
          class="w-full px-3.5 py-2 rounded-md text-xs font-medium flex items-center gap-2.5 transition-all"
          :class="activePage === 'about' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-dark-surface'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About & Architecture
        </button>
      </aside>

      <!-- Main Options Content View -->
      <main class="flex-1">
        <ActivityCenterPage v-if="activePage === 'activity'" />
        <WorkspaceRegistryPage v-else-if="activePage === 'workspaces'" />
        <TestCenterPage v-else-if="activePage === 'testcenter'" />
        <GeneralSettings v-else-if="activePage === 'general'" />
        <AboutPage v-else-if="activePage === 'about'" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ActivityCenterPage from '../pages/ActivityCenterPage.vue';
import WorkspaceRegistryPage from '../pages/WorkspaceRegistryPage.vue';
import TestCenterPage from '../pages/TestCenterPage.vue';
import GeneralSettings from '../pages/GeneralSettings.vue';
import AboutPage from '../pages/AboutPage.vue';
import { MessageBus } from '../services/messageBus';
import { MessageType } from '../types/messages';

const configVersion = ref('1.0.0');
const activePage = ref<'activity' | 'workspaces' | 'testcenter' | 'general' | 'about'>('activity');

function handleUnload() {
  MessageBus.send({ type: MessageType.OPTIONS_CLOSED, sender: 'OPTIONS' }).catch(() => {});
}

onMounted(() => {
  MessageBus.send({ type: MessageType.OPTIONS_OPENED, sender: 'OPTIONS' }).catch(() => {});
  window.addEventListener('beforeunload', handleUnload);
});

onUnmounted(() => {
  handleUnload();
  window.removeEventListener('beforeunload', handleUnload);
});
</script>
