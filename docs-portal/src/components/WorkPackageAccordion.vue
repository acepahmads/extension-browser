<template>
  <div class="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300">
    <!-- Accordion Card Header -->
    <div
      role="button"
      tabindex="0"
      :aria-expanded="isExpanded"
      :aria-controls="accordionId"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
      class="p-6 bg-slate-800/60 hover:bg-slate-800/90 cursor-pointer transition select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      <div class="flex items-center space-x-4">
        <!-- Animated Chevron Indicator -->
        <div class="w-9 h-9 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-blue-400 group-hover:text-white group-hover:border-blue-500/40 transition shrink-0">
          <svg
            class="w-5 h-5 transition-transform duration-300 ease-in-out"
            :class="{ 'rotate-180': isExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div class="space-y-1">
          <div class="flex items-center space-x-3">
            <h3 class="text-base font-bold font-heading text-slate-100 group-hover:text-blue-400 transition">
              {{ title }}
            </h3>
            <span class="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {{ completedCount }} / {{ totalCount }} Completed
            </span>
          </div>
          <p class="text-xs text-slate-400 font-mono">
            {{ isExpanded ? 'Click to collapse work package list' : 'Click to expand work package cards' }}
          </p>
        </div>
      </div>

      <!-- Completion Badge & Mini Progress Bar -->
      <div class="flex items-center space-x-4 shrink-0 font-mono">
        <div class="hidden sm:flex flex-col items-end space-y-1">
          <div class="flex items-center space-x-2 text-xs">
            <span class="text-slate-400">Progress:</span>
            <span class="font-bold text-emerald-400">{{ calculatedProgress }}%</span>
          </div>
          <div class="w-32 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
              :style="{ width: calculatedProgress + '%' }"
            ></div>
          </div>
        </div>

        <span
          class="px-3 py-1 rounded-xl text-xs font-bold font-mono border transition"
          :class="calculatedProgress === 100 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'"
        >
          {{ calculatedProgress === 100 ? '100% COMPLETE' : `${calculatedProgress}% IN PROGRESS` }}
        </span>
      </div>
    </div>

    <!-- Expandable Content Panel -->
    <div
      :id="accordionId"
      v-show="isExpanded"
      class="border-t border-slate-800/80 p-6 bg-slate-950/40 animate-in fade-in duration-300"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="wp in items"
          :key="wp.id"
          class="p-4 rounded-2xl bg-slate-900/80 border hover:border-blue-500/50 transition space-y-3 flex flex-col justify-between group shadow-md"
          :class="wp.status === 'Completed' ? 'border-slate-800/80' : wp.status === 'In Progress' ? 'border-amber-500/30' : 'border-slate-800/40'"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center space-x-2.5">
              <span class="text-lg">{{ wp.icon || '✅' }}</span>
              <div>
                <span class="font-mono text-xs font-bold text-blue-400 block">{{ wp.id }}</span>
                <h4 class="font-bold text-xs text-slate-200 group-hover:text-blue-300 transition">{{ wp.name }}</h4>
              </div>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0"
              :class="getStatusClass(wp.status)"
            >
              {{ wp.status }}
            </span>
          </div>

          <p class="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
            {{ wp.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

export interface WorkPackageItem {
  id: string;
  name: string;
  status: 'Completed' | 'Planned' | 'In Progress';
  description: string;
  icon?: string;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    completed?: number;
    total?: number;
    progress?: number;
    items: WorkPackageItem[];
    defaultExpanded?: boolean;
    storageKey?: string;
  }>(),
  {
    title: 'Work Packages',
    defaultExpanded: false,
    storageKey: 'wp_accordion_expanded'
  }
);

const accordionId = `wp-accordion-${Math.random().toString(36).substr(2, 9)}`;
const isExpanded = ref(props.defaultExpanded);

onMounted(() => {
  try {
    const saved = localStorage.getItem(props.storageKey);
    if (saved !== null) {
      isExpanded.value = JSON.parse(saved);
    }
  } catch (err) {
    // Ignore storage parse issues
  }
});

const toggle = () => {
  isExpanded.value = !isExpanded.value;
  try {
    localStorage.setItem(props.storageKey, JSON.stringify(isExpanded.value));
  } catch (err) {
    // Ignore storage issues
  }
};

const completedCount = computed(() => {
  if (props.completed !== undefined) return props.completed;
  return props.items.filter(i => i.status === 'Completed').length;
});

const totalCount = computed(() => {
  if (props.total !== undefined) return props.total;
  return props.items.length;
});

const calculatedProgress = computed(() => {
  if (props.progress !== undefined) return props.progress;
  if (totalCount.value === 0) return 100;
  return Math.round((completedCount.value / totalCount.value) * 100);
});

const getStatusClass = (status: string) => {
  if (status === 'Completed') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (status === 'In Progress') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-slate-800 text-slate-400 border-slate-700';
};
</script>
