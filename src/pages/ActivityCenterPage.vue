<template>
  <div class="space-y-5 max-w-6xl">
    <!-- Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-slate-100 flex items-center gap-2">
          Activity Center
          <span class="text-xs px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/30 font-mono">
            {{ totalEventsCount }} Events
          </span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Real-time Developer Console for Browser Lifecycle Events & Telemetry Stream
        </p>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <!-- Clear Activity -->
        <button
          @click="handleClearActivities"
          class="px-3 py-1.5 rounded bg-dark-surface hover:bg-dark-hover border border-dark-border text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
        >
          🗑️ Clear Activity
        </button>

        <!-- Export (Disabled) -->
        <button
          disabled
          class="px-3 py-1.5 rounded bg-dark-surface/50 border border-dark-border/40 text-xs text-slate-600 cursor-not-allowed flex items-center gap-1.5"
          title="Export HAR / JSON available in Sprint 3+"
        >
          📥 Export Logs (Sprint 3)
        </button>
      </div>
    </div>

    <!-- Filter Category Tabs -->
    <div class="flex border-b border-dark-border gap-1 overflow-x-auto text-xs font-medium">
      <button
        v-for="tab in filterTabs"
        :key="tab.id"
        @click="activeCategory = tab.id as ActivityFilterCategory"
        class="px-3 py-2 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5"
        :class="activeCategory === tab.id ? 'border-brand-500 text-brand-300 font-semibold bg-dark-card/60' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-dark-hover/40'"
      >
        <span>{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Search & Control Toolbar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-dark-surface border border-dark-border rounded-lg">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Filter events by Event Name, Title, URL, Workspace..."
        class="w-full sm:w-96 px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
      />

      <div class="flex items-center gap-3 text-xs text-slate-400 self-end sm:self-auto">
        <span class="font-mono">Showing {{ paginatedEvents.length }} of {{ filteredEvents.length }} items</span>
      </div>
    </div>

    <!-- Developer Console Activity Table -->
    <div class="border border-dark-border rounded-lg bg-dark-surface overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr class="bg-dark-card/90 border-b border-dark-border text-slate-400 text-[11px] uppercase tracking-wider">
              <th class="py-2.5 px-3">Time</th>
              <th class="py-2.5 px-3">Event</th>
              <th class="py-2.5 px-3">Workspace</th>
              <th class="py-2.5 px-3">Tab / Win</th>
              <th class="py-2.5 px-3">Status</th>
              <th class="py-2.5 px-3">Description</th>
              <th class="py-2.5 px-3">URL</th>
              <th class="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-border/60">
            <tr
              v-for="evt in paginatedEvents"
              :key="evt.id"
              class="hover:bg-dark-hover/60 transition-colors"
            >
              <!-- Time -->
              <td class="py-2 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                {{ formatTime(evt.timestamp) }}
              </td>

              <!-- Event -->
              <td class="py-2 px-3 text-slate-200 font-semibold whitespace-nowrap flex items-center gap-1.5">
                <span>{{ EVENT_ICONS[evt.eventType] || '📌' }}</span>
                <span>{{ evt.eventType }}</span>
              </td>

              <!-- Workspace -->
              <td class="py-2 px-3 whitespace-nowrap">
                <span
                  v-if="evt.workspaceName"
                  class="px-2 py-0.5 text-[10px] rounded bg-brand-950 text-brand-300 border border-brand-500/30"
                >
                  {{ evt.workspaceName }}
                </span>
                <span v-else class="text-slate-600 text-[10px]">—</span>
              </td>

              <!-- Tab / Window -->
              <td class="py-2 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                <span v-if="evt.tabId">Tab #{{ evt.tabId }}</span>
                <span v-if="evt.windowId" class="text-slate-500 ml-1">(Win #{{ evt.windowId }})</span>
                <span v-if="!evt.tabId && !evt.windowId" class="text-slate-600">—</span>
              </td>

              <!-- Status -->
              <td class="py-2 px-3 whitespace-nowrap">
                <span
                  class="px-1.5 py-0.5 text-[10px] rounded font-bold uppercase"
                  :class="getStatusBadgeClass(evt.status)"
                >
                  {{ evt.status }}
                </span>
              </td>

              <!-- Description -->
              <td class="py-2 px-3 text-slate-300 font-sans max-w-xs truncate" :title="evt.description">
                {{ evt.description }}
              </td>

              <!-- URL -->
              <td class="py-2 px-3 text-slate-400 truncate max-w-xs" :title="evt.url">
                {{ evt.url ? truncateUrl(evt.url, 30) : '—' }}
              </td>

              <!-- Action / Inspect Metadata -->
              <td class="py-2 px-3 text-right whitespace-nowrap">
                <button
                  @click="inspectEvent(evt)"
                  class="text-brand-400 hover:text-brand-300 underline text-[10px] font-sans"
                >
                  Inspect
                </button>
              </td>
            </tr>

            <tr v-if="filteredEvents.length === 0">
              <td colspan="8" class="py-8 text-center text-slate-500 font-sans">
                No activity events found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="totalPages > 1" class="p-3 bg-dark-card/60 border-t border-dark-border flex items-center justify-between text-xs">
        <span class="text-slate-400">Page {{ currentPage }} of {{ totalPages }}</span>
        <div class="flex items-center gap-1">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-2.5 py-1 rounded bg-dark-bg border border-dark-border text-slate-300 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-2.5 py-1 rounded bg-dark-bg border border-dark-border text-slate-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Event Metadata Inspector Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-dark-surface border border-dark-border rounded-lg max-w-lg w-full p-5 space-y-3 shadow-2xl">
        <div class="flex items-center justify-between border-b border-dark-border pb-2">
          <h3 class="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>{{ EVENT_ICONS[selectedEvent.eventType] || '📌' }}</span>
            <span>Event Metadata Inspector</span>
          </h3>
          <button @click="selectedEvent = null" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-2 text-xs font-mono">
          <div class="p-2.5 bg-dark-bg rounded border border-dark-border space-y-1.5">
            <div class="flex justify-between items-center border-b border-dark-border/40 pb-1">
              <span><span class="text-slate-500">Sequence #:</span> <span class="text-brand-300 font-bold">#{{ selectedEvent.sequence || 1 }}</span></span>
              <span><span class="text-slate-500">Severity:</span> <span class="text-emerald-400 font-bold">{{ selectedEvent.severity || selectedEvent.status }}</span></span>
            </div>
            <div><span class="text-slate-500">Session ID:</span> <span class="text-slate-200">{{ selectedEvent.sessionId || 'N/A' }}</span></div>
            <div><span class="text-slate-500">Correlation ID:</span> <span class="text-purple-300">{{ selectedEvent.correlationId || 'N/A' }}</span></div>
            <div><span class="text-slate-500">Source:</span> <span class="text-amber-300">{{ selectedEvent.source || 'Background' }}</span></div>
            <div><span class="text-slate-500">Duration:</span> <span class="text-emerald-300">{{ selectedEvent.duration !== null && selectedEvent.duration !== undefined ? selectedEvent.duration + ' ms' : 'null' }}</span></div>
            <div><span class="text-slate-500">Event ID:</span> {{ selectedEvent.id }}</div>
            <div><span class="text-slate-500">Event Type:</span> {{ selectedEvent.eventType }}</div>
            <div><span class="text-slate-500">Timestamp:</span> {{ new Date(selectedEvent.timestamp).toLocaleString() }}</div>
            <div><span class="text-slate-500">Workspace:</span> {{ selectedEvent.workspaceName || 'None' }}</div>
            <div><span class="text-slate-500">Tab ID:</span> {{ selectedEvent.tabId || 'N/A' }} | <span class="text-slate-500">Window ID:</span> {{ selectedEvent.windowId || 'N/A' }}</div>
            <div><span class="text-slate-500">URL:</span> {{ selectedEvent.url || 'N/A' }}</div>
          </div>

          <div>
            <span class="text-slate-400 block mb-1 font-sans">Raw Metadata JSON:</span>
            <pre class="p-3 bg-dark-bg border border-dark-border rounded text-[11px] text-brand-300 overflow-x-auto">{{ JSON.stringify(selectedEvent.metadata, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useActivityStore } from '../modules/lifecycle/activity.store';
import { storeToRefs } from 'pinia';
import { ActivityEvent, ActivityFilterCategory } from '../modules/lifecycle/activity.types';
import { EVENT_ICONS } from '../modules/lifecycle/activity.constants';
import { truncateUrl } from '../utils/url';

const activityStore = useActivityStore();
const { events, totalEventsCount } = storeToRefs(activityStore);

const activeCategory = ref<ActivityFilterCategory>('all');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 20;

const selectedEvent = ref<ActivityEvent | null>(null);

const filterTabs: { id: ActivityFilterCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Activity', icon: '📊' },
  { id: 'today', label: 'Today', icon: '📅' },
  { id: 'workspace', label: 'Workspace', icon: '🏛️' },
  { id: 'tab', label: 'Tabs', icon: '📑' },
  { id: 'navigation', label: 'Navigation', icon: '⛵' },
  { id: 'window', label: 'Windows', icon: '🪟' },
  { id: 'storage', label: 'Storage & System', icon: '💾' }
];

onMounted(() => {
  activityStore.fetchEvents();
  activityStore.setupRealtimeListener();
});

const filteredEvents = computed(() => {
  return events.value.filter((evt) => {
    // 1. Search filter
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q ||
      evt.title.toLowerCase().includes(q) ||
      evt.url.toLowerCase().includes(q) ||
      evt.eventType.toLowerCase().includes(q) ||
      evt.description.toLowerCase().includes(q) ||
      (evt.workspaceName && evt.workspaceName.toLowerCase().includes(q));

    // 2. Category filter
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    let matchesCategory = true;

    switch (activeCategory.value) {
      case 'today':
        matchesCategory = evt.timestamp >= startOfToday;
        break;
      case 'workspace':
        matchesCategory = evt.workspaceId !== null;
        break;
      case 'tab':
        matchesCategory = evt.eventType.includes('Tab');
        break;
      case 'navigation':
        matchesCategory = evt.eventType.includes('Navigation') || evt.eventType.includes('Page');
        break;
      case 'window':
        matchesCategory = evt.eventType.includes('Window');
        break;
      case 'storage':
        matchesCategory = evt.eventType.includes('Storage') || evt.eventType.includes('Settings');
        break;
    }

    return matchesSearch && matchesCategory;
  });
});

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / pageSize) || 1);

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredEvents.value.slice(start, start + pageSize);
});

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'SUCCESS':
      return 'bg-emerald-950 text-emerald-300 border border-emerald-500/30';
    case 'WARNING':
      return 'bg-amber-950 text-amber-300 border border-amber-500/30';
    case 'ERROR':
      return 'bg-rose-950 text-rose-300 border border-rose-500/30';
    default:
      return 'bg-slate-900 text-slate-400 border border-slate-700';
  }
}

function inspectEvent(evt: ActivityEvent) {
  selectedEvent.value = evt;
}

async function handleClearActivities() {
  if (confirm('Are you sure you want to clear all activity logs in memory?')) {
    await activityStore.clearAllEvents();
  }
}
</script>
