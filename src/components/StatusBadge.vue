<template>
  <div 
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors"
    :class="statusClasses"
  >
    <span class="w-2 h-2 rounded-full animate-pulse" :class="dotClasses"></span>
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    status?: 'active' | 'success' | 'warning' | 'error' | 'idle';
    label?: string;
  }>(),
  {
    status: 'active',
    label: 'Active'
  }
);

const statusClasses = computed(() => {
  switch (props.status) {
    case 'active':
    case 'success':
      return 'bg-brand-950/60 border-brand-500/30 text-brand-300';
    case 'warning':
      return 'bg-amber-950/60 border-amber-500/30 text-amber-300';
    case 'error':
      return 'bg-rose-950/60 border-rose-500/30 text-rose-300';
    default:
      return 'bg-slate-900 border-slate-700 text-slate-400';
  }
});

const dotClasses = computed(() => {
  switch (props.status) {
    case 'active':
    case 'success':
      return 'bg-brand-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]';
    case 'warning':
      return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
    case 'error':
      return 'bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]';
    default:
      return 'bg-slate-500';
  }
});
</script>
