<template>
  <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition shadow-lg relative overflow-hidden group">
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">{{ label }}</span>
      <div class="w-8 h-8 rounded-xl bg-slate-700/50 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
        <slot name="icon"></slot>
      </div>
    </div>
    <div class="text-2xl font-bold font-heading text-slate-100 mb-1">{{ value }}</div>
    <p class="text-xs text-slate-400 flex items-center space-x-1.5">
      <span v-if="badge" class="px-2 py-0.5 rounded font-mono text-[10px] font-bold" :class="badgeClass">{{ badge }}</span>
      <span>{{ description }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value: string | number;
  description: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'neutral';
}>();

const badgeClass = computed(() => {
  if (props.badgeType === 'success') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (props.badgeType === 'warning') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  if (props.badgeType === 'info') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
  return 'bg-slate-700 text-slate-300';
});
</script>
