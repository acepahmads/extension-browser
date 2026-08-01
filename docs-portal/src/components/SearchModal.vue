<template>
  <div 
    v-if="docsStore.isSearchOpen"
    class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
    @click.self="docsStore.isSearchOpen = false"
  >
    <div class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <!-- Search Input Header -->
      <div class="p-4 border-b border-slate-800 flex items-center space-x-3">
        <svg class="w-5 h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="docsStore.searchQuery"
          type="text"
          placeholder="Search milestones, architecture, ADRs, or modules..."
          class="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 text-sm font-medium"
          autoFocus
        />
        <button 
          @click="docsStore.isSearchOpen = false"
          class="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-400 hover:text-slate-200"
        >
          ESC
        </button>
      </div>

      <!-- Search Results Body -->
      <div class="max-h-96 overflow-y-auto p-4 space-y-2">
        <div v-if="!docsStore.searchQuery.trim()" class="text-center py-8 text-slate-500 text-xs">
          Type to search across platform documentation & milestones...
        </div>

        <div v-else-if="docsStore.searchResults.length === 0" class="text-center py-8 text-slate-400 text-xs">
          No matching milestones or documents found for "<span class="text-blue-400">{{ docsStore.searchQuery }}</span>"
        </div>

        <div v-else class="space-y-2">
          <div 
            v-for="item in docsStore.searchResults" 
            :key="item.id"
            @click="selectResult(item)"
            class="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition flex items-center justify-between group"
          >
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {{ item.id }}
                </span>
                <span class="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition">
                  {{ item.title }}
                </span>
              </div>
              <p class="text-xs text-slate-400 line-clamp-1">{{ item.summary }}</p>
            </div>
            <span class="text-xs font-mono px-2.5 py-1 rounded-full border text-[11px]" :class="getStatusBadgeClass(item.status)">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocsStore } from '@/stores/docs.store';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';

const docsStore = useDocsStore();
const router = useRouter();

const selectResult = (item: any) => {
  docsStore.isSearchOpen = false;
  router.push('/milestones');
};

const getStatusBadgeClass = (status: string) => {
  if (status === 'COMPLETED') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (status === 'IN_PROGRESS') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-slate-800 text-slate-400 border-slate-700';
};

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    docsStore.isSearchOpen = !docsStore.isSearchOpen;
  }
  if (e.key === 'Escape') {
    docsStore.isSearchOpen = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
