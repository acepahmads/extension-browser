<template>
  <div class="p-3 rounded-lg bg-dark-card/60 border border-dark-border/60 hover:border-brand-500/40 transition-all duration-200">
    <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
      <span>{{ label }}</span>
      <span v-if="icon" class="text-brand-400 font-mono text-[11px]">{{ icon }}</span>
    </div>
    <div class="text-sm font-semibold text-slate-100 font-mono truncate" :title="value">
      {{ value }}
    </div>
    <div v-if="subtext" class="text-[10px] text-slate-500 mt-1 truncate">
      {{ subtext }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  subtext?: string;
  icon?: string;
}>();
</script>
