<template>
  <div class="flex border-b border-dark-border bg-dark-surface/40 px-2 pt-1 gap-1">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="$emit('select', tab.id)"
      class="px-3 py-1.5 text-xs font-medium rounded-t-md border-b-2 transition-all flex items-center gap-1.5"
      :class="[
        activeTab === tab.id
          ? 'border-brand-500 text-brand-300 bg-dark-card/80'
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-dark-hover/40'
      ]"
    >
      <span>{{ tab.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface TabItem {
  id: string;
  label: string;
}

defineProps<{
  tabs: TabItem[];
  activeTab: string;
}>();

defineEmits<{
  (e: 'select', tabId: string): void;
}>();
</script>
