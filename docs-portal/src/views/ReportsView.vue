<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">Sprint Reports Directory</h1>
        <p class="text-slate-400 text-xs mt-1">Audit verification reports, architecture design documents, and sprint completion records.</p>
      </div>

      <!-- Filter Controls -->
      <div class="flex items-center space-x-3">
        <input 
          v-model="searchFilter"
          type="text" 
          placeholder="Filter reports..."
          class="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="rep in filteredReports" 
        :key="rep.id"
        class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3 hover:border-blue-500/40 transition shadow-lg flex flex-col justify-between"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {{ rep.id }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {{ rep.status }}
            </span>
          </div>

          <h3 class="text-base font-bold font-heading text-slate-100">{{ rep.title }}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">{{ rep.summary }}</p>
        </div>

        <div class="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono">
          <span class="text-slate-500">{{ rep.sprint }} • {{ rep.date }}</span>
          <span class="text-blue-400 font-semibold">{{ rep.module }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDocsStore } from '@/stores/docs.store';

const docsStore = useDocsStore();
const searchFilter = ref('');

const filteredReports = computed(() => {
  if (!searchFilter.value.trim()) return docsStore.reportsList;
  const q = searchFilter.value.toLowerCase();
  return docsStore.reportsList.filter(r => 
    r.title.toLowerCase().includes(q) || 
    r.summary.toLowerCase().includes(q) || 
    r.module.toLowerCase().includes(q)
  );
});
</script>
