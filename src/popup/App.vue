<template>
  <div class="flex flex-col h-full bg-dark-bg text-slate-100 font-sans selection:bg-brand-500">
    <!-- Header Component -->
    <HeaderBar :version="version" />

    <!-- Top Mode Tab Bar (Workspace vs Activity Panel) -->
    <div class="flex border-b border-dark-border bg-dark-surface px-2 pt-1 gap-1 text-xs">
      <button
        @click="popupTab = 'workspace'"
        class="px-3 py-1.5 font-medium rounded-t border-b-2 transition-all flex items-center gap-1.5"
        :class="popupTab === 'workspace' ? 'border-brand-500 text-brand-300 bg-dark-card' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <span>🏛️ Active Workspace</span>
      </button>
      <button
        @click="popupTab = 'activity'"
        class="px-3 py-1.5 font-medium rounded-t border-b-2 transition-all flex items-center gap-1.5"
        :class="popupTab === 'activity' ? 'border-brand-500 text-brand-300 bg-dark-card' : 'border-transparent text-slate-400 hover:text-slate-200'"
      >
        <span>⚡ Activity ({{ recentEvents.length }})</span>
      </button>
    </div>

    <!-- Main Content Body -->
    <main class="flex-1 p-3 overflow-y-auto space-y-3">
      <!-- TAB 1: WORKSPACE & TELEMETRY -->
      <div v-if="popupTab === 'workspace'" class="space-y-3">
        <!-- Active Workspace Banner -->
        <div 
          class="p-3 rounded-lg border transition-all duration-200"
          :class="activeWorkspace ? 'bg-brand-950/50 border-brand-500/50 text-brand-200' : 'bg-dark-surface border-dark-border text-slate-400'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-xl p-1 rounded bg-dark-bg/80 border border-dark-border">
                {{ activeWorkspace ? activeWorkspace.icon : '🌐' }}
              </span>
              <div>
                <div class="text-xs font-semibold tracking-wide flex items-center gap-1.5">
                  <span class="font-mono text-slate-300 font-semibold">{{ activeWorkspace ? activeWorkspace.application : 'Unresolved App' }}</span>
                  <span v-if="activeWorkspace" class="text-slate-400 font-normal">/ {{ activeWorkspace.name }}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                  {{ activeWorkspace ? activeWorkspace.baseUrl : 'Generic Web Telemetry' }}
                </div>
              </div>
            </div>

            <!-- Environment Badge -->
            <span 
              class="text-[10px] font-mono font-medium px-2 py-0.5 rounded border uppercase"
              :class="activeWorkspace ? EnvironmentRegistry.getBadgeClass(activeWorkspace.environment) : 'bg-slate-900 border-slate-700 text-slate-400'"
            >
              {{ activeWorkspace ? activeWorkspace.environment : 'Generic' }}
            </span>
          </div>

          <!-- Matched Pattern & Connection Subtext -->
          <div class="mt-2.5 pt-2 border-t border-dark-border/40 flex items-center justify-between text-[10px]">
            <span class="flex items-center gap-1.5">
              <span 
                class="w-2 h-2 rounded-full" 
                :class="activeWorkspace ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-slate-500'"
              ></span>
              <span class="text-slate-300 truncate max-w-[170px]" :title="activeMatchedPattern?.pattern">
                {{ activeMatchedPattern ? 'Pattern: ' + activeMatchedPattern.pattern : 'No Workspace Matched' }}
              </span>
            </span>

            <span class="font-mono text-slate-400">Config v{{ configVersion }}</span>
          </div>
        </div>

        <!-- Telemetry Cards Grid -->
        <div class="grid grid-cols-2 gap-2">
          <MetricCard 
            label="Browser Engine" 
            :value="browserName" 
            subtext="MV3 Service Worker"
            icon="🌐"
          />
          <MetricCard 
            label="System Clock" 
            :value="currentTime" 
            subtext="Real-time Sync"
            icon="⏱️"
          />
        </div>

        <!-- Active Tab Details Box -->
        <div class="p-3 rounded-lg bg-dark-surface border border-dark-border space-y-2">
          <div class="flex items-center justify-between text-xs border-b border-dark-border pb-1.5">
            <span class="font-medium text-slate-300 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Active Page
            </span>
            <span class="text-[10px] font-mono text-brand-300 bg-brand-950/80 px-1.5 py-0.5 rounded border border-brand-500/20">
              {{ currentDomain }}
            </span>
          </div>

          <div class="space-y-1">
            <div class="text-xs font-medium text-slate-100 truncate" :title="currentTitle">
              {{ currentTitle }}
            </div>
            <div class="text-[11px] font-mono text-slate-400 bg-dark-bg p-1.5 rounded border border-dark-border/80 break-all select-all flex items-center justify-between group">
              <span class="truncate">{{ truncatedCurrentUrl }}</span>
              <button 
                @click="copyUrl" 
                class="ml-1 text-[10px] text-brand-400 hover:text-brand-300 font-sans px-1 rounded bg-brand-950 border border-brand-500/30"
                title="Copy URL"
              >
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Developer Mode Control Bar -->
        <div class="p-3 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-between">
          <div>
            <div class="text-xs font-medium text-slate-200">Developer Mode</div>
            <div class="text-[10px] text-slate-400">Enable advanced telemetry & logging</div>
          </div>

          <button 
            @click="toggleDevMode"
            class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="isDevMode ? 'bg-brand-600' : 'bg-slate-700'"
          >
            <span 
              class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="isDevMode ? 'translate-x-4' : 'translate-x-0'"
            />
          </button>
        </div>
      </div>

      <!-- TAB 2: LIVE ACTIVITY STREAM (Top 10 Recent Events) -->
      <div v-else-if="popupTab === 'activity'" class="space-y-3">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>Top 10 Recent Browser Events</span>
          <button @click="openActivityCenter" class="text-brand-400 hover:text-brand-300 underline text-[11px]">
            View All Activity Center ↗
          </button>
        </div>

        <div class="space-y-2 max-h-[340px] overflow-y-auto">
          <div
            v-for="evt in recentEvents"
            :key="evt.id"
            class="p-2.5 rounded-lg bg-dark-surface border border-dark-border space-y-1 text-xs transition-colors hover:border-brand-500/30"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 font-semibold text-slate-200">
                <span>{{ EVENT_ICONS[evt.eventType] || '📌' }}</span>
                <span>{{ evt.eventType }}</span>
              </div>
              <span class="text-[10px] font-mono text-slate-400">
                {{ formatTime(evt.timestamp) }}
              </span>
            </div>

            <p class="text-[11px] text-slate-300 truncate" :title="evt.description">
              {{ evt.description }}
            </p>

            <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-dark-border/40">
              <span v-if="evt.workspaceName" class="text-brand-300 font-mono truncate max-w-[160px]">
                {{ evt.workspaceName }}
              </span>
              <span v-else class="text-slate-500">Global System</span>

              <span class="font-mono text-slate-400 truncate max-w-[120px]" :title="evt.url">
                {{ evt.url ? truncateUrl(evt.url, 20) : 'Internal' }}
              </span>
            </div>
          </div>

          <div v-if="recentEvents.length === 0" class="p-6 text-center text-xs text-slate-500 bg-dark-surface rounded-lg border border-dark-border">
            No activity logged yet.
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Controls -->
    <footer class="p-3 bg-dark-surface border-t border-dark-border flex items-center gap-2">
      <button 
        @click="openDevConsole"
        class="flex-1 py-1.5 px-3 rounded-md bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/20 transition-all"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Dev Console
      </button>

      <button 
        @click="openOptionsPage"
        class="py-1.5 px-3 rounded-md bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        title="Open Settings"
      >
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Workspaces
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import HeaderBar from '../components/HeaderBar.vue';
import MetricCard from '../components/MetricCard.vue';
import { useExtension } from '../composables/useExtension';
import { useCurrentTab } from '../composables/useCurrentTab';
import { truncateUrl } from '../utils/url';
import { storeToRefs } from 'pinia';
import { useBrowserStore } from '../stores/browser';
import { useActivityStore } from '../modules/lifecycle/activity.store';
import { EnvironmentRegistry } from '../config/environment.registry';
import { EVENT_ICONS } from '../modules/lifecycle/activity.constants';

import { MessageBus } from '../services/messageBus';
import { MessageType } from '../types/messages';

const { version, configVersion, currentTime, isDevMode, toggleDevMode } = useExtension();
const { browserName, currentUrl, currentDomain, currentTitle } = useCurrentTab();

const browserStore = useBrowserStore();
const activityStore = useActivityStore();
const { activeWorkspace, activeMatchedPattern } = storeToRefs(browserStore);
const { recentEvents } = storeToRefs(activityStore);

const popupTab = ref<'workspace' | 'activity'>('workspace');
const copied = ref(false);

const truncatedCurrentUrl = computed(() => truncateUrl(currentUrl.value, 40));

onMounted(() => {
  MessageBus.send({ type: MessageType.POPUP_CONNECTED, sender: 'POPUP' }).catch(() => {});
  activityStore.fetchEvents();
  activityStore.setupRealtimeListener();
});

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function copyUrl() {
  navigator.clipboard.writeText(currentUrl.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 1500);
}

function openOptionsPage() {
  if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open('/src/options/index.html', '_blank');
  }
}

function openActivityCenter() {
  openOptionsPage();
}

function openDevConsole() {
  openOptionsPage();
}
</script>
