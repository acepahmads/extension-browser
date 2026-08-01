<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">Architecture Decision Records (ADR)</h1>
      <p class="text-slate-400 text-xs mt-1">Immutable register of major architectural choices, trade-offs, and governance policies.</p>
    </div>

    <!-- ADR Cards Grid -->
    <div class="space-y-6">
      <div 
        v-for="adr in docsStore.adrList" 
        :key="adr.id"
        class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 hover:border-blue-500/40 transition shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {{ adr.id }}
            </span>
            <h3 class="text-lg font-bold font-heading text-slate-100">{{ adr.title }}</h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {{ adr.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span class="text-slate-500 font-mono text-[10px] block font-bold uppercase tracking-wider">Context</span>
            <p class="text-slate-300 leading-relaxed">{{ adr.context }}</p>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span class="text-slate-500 font-mono text-[10px] block font-bold uppercase tracking-wider">Decision</span>
            <p class="text-slate-300 leading-relaxed">{{ adr.decision }}</p>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Sprint: {{ adr.sprint }}</span>
          <span>Date Logged: {{ adr.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocsStore } from '@/stores/docs.store';

const docsStore = useDocsStore();
</script>
