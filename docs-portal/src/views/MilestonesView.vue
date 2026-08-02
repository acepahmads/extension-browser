<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header with Breadcrumbs -->
    <div>
      <Breadcrumbs />
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-2">
        <div>
          <div class="flex items-center space-x-3 mb-1">
            <span class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
              GitLab / Jira Backlog Catalog {{ docsStore.projectInfo.version }}
            </span>
            <span class="text-xs font-mono text-slate-400">Baseline {{ docsStore.projectInfo.currentBaseline }} • {{ docsStore.projectInfo.repositoryStatus }}</span>
          </div>
          <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">Milestones Catalog</h1>
          <p class="text-slate-400 text-xs mt-1">Enterprise backlog matrix detailing platform sprint execution records.</p>
        </div>

        <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono flex items-center space-x-4 shrink-0">
          <div>
            <span class="text-slate-500 block text-[10px]">TOTAL MILESTONES</span>
            <span class="text-blue-400 font-bold font-mono">{{ docsStore.milestones.length }} Registered</span>
          </div>
          <div class="h-6 w-px bg-slate-700"></div>
          <div>
            <span class="text-slate-500 block text-[10px]">COMPLETED</span>
            <span class="text-emerald-400 font-bold font-mono">{{ docsStore.projectInfo.completedMilestones }} / {{ docsStore.projectInfo.totalMilestones }}</span>
          </div>
          <div class="h-6 w-px bg-slate-700"></div>
          <div>
            <span class="text-slate-500 block text-[10px]">PROGRESS</span>
            <span class="text-emerald-400 font-bold font-mono">{{ docsStore.projectInfo.overallCompletion }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search, Filter & Sort Control Toolbar -->
    <div class="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <!-- Instant Search Box -->
        <div class="relative flex-1">
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search by ID, Sprint, Title, or Category..."
            class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <!-- Sort Selector -->
        <div class="flex items-center space-x-2 text-xs font-mono shrink-0">
          <span class="text-slate-400">Sort By:</span>
          <select 
            v-model="sortBy"
            class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="id">Milestone ID</option>
            <option value="sprint">Sprint Name</option>
            <option value="progress">Completion %</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      <!-- Quick Filter Pills -->
      <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-xs font-mono">
        <span class="text-slate-500 text-[11px] mr-1">Filter:</span>
        <button 
          v-for="filter in filterOptions" 
          :key="filter"
          @click="activeFilter = filter"
          class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition"
          :class="activeFilter === filter ? 'bg-blue-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- Category Grouped Compact Milestone Lists -->
    <div class="space-y-6">
      <div 
        v-for="category in activeCategories"
        :key="category"
        class="rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg overflow-hidden transition"
      >
        <!-- Category Group Header -->
        <div 
          @click="toggleCategory(category)"
          class="p-4 bg-slate-800/80 hover:bg-slate-800 border-b border-slate-700/60 flex items-center justify-between cursor-pointer transition select-none"
        >
          <div class="flex items-center space-x-3">
            <span class="w-2.5 h-2.5 rounded-full" :class="getCategoryDotClass(category)"></span>
            <h2 class="text-base font-bold font-heading text-slate-100">{{ category }} Category</h2>
            <span class="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-700">
              {{ getMilestonesByCategory(category).length }} Milestones
            </span>
          </div>

          <div class="flex items-center space-x-3">
            <svg 
              class="w-5 h-5 text-slate-400 transition-transform duration-200"
              :class="{ 'transform rotate-180': collapsedCategories[category] }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Compact Single-Row Milestone List Body -->
        <div v-show="!collapsedCategories[category]" class="divide-y divide-slate-800/60">
          <div 
            v-for="item in getMilestonesByCategory(category)" 
            :key="item.id"
            @click="openSprintWorkspace(item.id)"
            class="px-5 py-3 hover:bg-slate-800/80 transition cursor-pointer flex items-center justify-between gap-4 group text-xs"
          >
            <!-- Left: Status Icon & ID & Sprint & Title -->
            <div class="flex items-center space-x-3 min-w-0 flex-1">
              <!-- Status Icon -->
              <span class="shrink-0">
                <svg v-if="item.status === 'COMPLETED' || item.status === 'BASELINE'" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else-if="item.status === 'CURRENT' || item.status === 'IN_PROGRESS'" class="w-4 h-4 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else-if="item.status === 'BLOCKED'" class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg v-else class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke-width="2" />
                </svg>
              </span>

              <!-- Milestone ID Badge -->
              <span class="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                {{ item.id }}
              </span>

              <!-- Sprint Tag -->
              <span class="font-mono text-[11px] text-slate-400 shrink-0 hidden md:inline-block w-28">
                {{ item.sprint }}
              </span>

              <!-- Title -->
              <span class="font-semibold text-slate-200 group-hover:text-blue-400 transition truncate">
                {{ item.name }}
              </span>
            </div>

            <!-- Right: Category Tag, Progress, Status Badge & Chevron -->
            <div class="flex items-center space-x-4 shrink-0 font-mono text-xs">
              <!-- Category Badge -->
              <span class="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-800 hidden sm:inline-block">
                {{ item.category }}
              </span>

              <!-- Mini Progress Bar -->
              <div class="hidden sm:flex items-center space-x-2">
                <div class="w-16 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                  <div class="h-full bg-emerald-500 rounded-full" :style="{ width: item.completion + '%' }"></div>
                </div>
                <span class="font-bold w-10 text-right text-slate-300">{{ item.completion }}%</span>
              </div>

              <!-- Status Badge -->
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border" :class="getStatusBadgeClass(item.status)">
                {{ item.status }}
              </span>

              <!-- Arrow Indicator -->
              <svg class="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDocsStore, MilestoneItem } from '@/stores/docs.store';
import { useRouter } from 'vue-router';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const docsStore = useDocsStore();
const router = useRouter();

const searchQuery = ref('');
const activeFilter = ref('ALL');
const sortBy = ref('id');
const collapsedCategories = ref<Record<string, boolean>>({});

const filterOptions = computed(() => [
  'ALL',
  'COMPLETED',
  'BASELINE',
  'ARCHIVED',
  ...docsStore.milestoneCategories
]);

const toggleCategory = (cat: string) => {
  collapsedCategories.value[cat] = !collapsedCategories.value[cat];
};

const filteredMilestones = computed(() => {
  let list = [...docsStore.milestones];

  // Filter Search Query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(m => 
      m.id.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.sprint.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }

  // Filter Category or Status
  if (activeFilter.value !== 'ALL') {
    if (['COMPLETED', 'IN_PROGRESS', 'PLANNED', 'BLOCKED', 'ARCHIVED', 'BASELINE', 'GOAL'].includes(activeFilter.value)) {
      list = list.filter(m => m.status === activeFilter.value);
    } else {
      list = list.filter(m => m.category === activeFilter.value);
    }
  }

  // Sort List
  list.sort((a, b) => {
    if (sortBy.value === 'id') return a.id.localeCompare(b.id);
    if (sortBy.value === 'sprint') return a.sprint.localeCompare(b.sprint);
    if (sortBy.value === 'progress') return b.completion - a.completion;
    if (sortBy.value === 'category') return a.category.localeCompare(b.category);
    return 0;
  });

  return list;
});

const activeCategories = computed(() => {
  const set = new Set(filteredMilestones.value.map(m => m.category));
  return docsStore.milestoneCategories.filter(c => set.has(c));
});

const getMilestonesByCategory = (category: string) => {
  return filteredMilestones.value.filter(m => m.category === category);
};

const getCategoryDotClass = (cat: string) => {
  if (cat === 'Foundation') return 'bg-emerald-400';
  if (cat === 'Architecture') return 'bg-blue-400';
  if (cat === 'Documentation') return 'bg-purple-400';
  if (cat === 'Development') return 'bg-teal-400';
  return 'bg-indigo-400';
};

const getStatusBadgeClass = (status: string) => {
  if (status === 'COMPLETED') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (status === 'BASELINE') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  if (status === 'ARCHIVED') return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
  if (status === 'IN_PROGRESS' || status === 'CURRENT') return 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
  if (status === 'BLOCKED') return 'bg-red-500/10 text-red-400 border-red-500/20';
  if (status === 'GOAL' || status === 'GA') return 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold';
  return 'bg-slate-800 text-slate-400 border-slate-700';
};

const openSprintWorkspace = (milestoneId: string) => {
  router.push(`/sprint/${milestoneId}`);
};
</script>
