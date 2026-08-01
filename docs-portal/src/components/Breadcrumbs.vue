<template>
  <nav class="flex items-center space-x-2 text-xs text-slate-400 mb-6 font-mono overflow-x-auto py-1">
    <router-link to="/" class="hover:text-blue-400 transition flex items-center space-x-1 shrink-0">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>Dashboard</span>
    </router-link>

    <template v-for="(crumb, index) in crumbs" :key="index">
      <span class="text-slate-600 shrink-0">&gt;</span>
      <router-link 
        v-if="crumb.link && index < crumbs.length - 1" 
        :to="crumb.link"
        class="hover:text-blue-400 transition shrink-0"
      >
        {{ crumb.name }}
      </router-link>
      <span v-else class="text-slate-200 font-semibold shrink-0">{{ crumb.name }}</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const crumbs = computed(() => {
  const path = route.path;
  const list = [];

  if (path.includes('/phase/')) {
    list.push({ name: 'Roadmap', link: '/roadmap' });
    const milestoneId = route.params.milestoneId || 'M05';
    list.push({ name: `Sprint Workspace (${milestoneId})`, link: `/sprint/${milestoneId}` });
    const phaseId = route.params.phaseId || 'Phase-01';
    list.push({ name: `Phase Detail (${phaseId})`, link: '' });
  } else if (path.startsWith('/sprint')) {
    list.push({ name: 'Roadmap', link: '/roadmap' });
    const milestoneId = route.params.milestoneId || 'M05';
    list.push({ name: `Sprint Workspace (${milestoneId})`, link: '' });
  } else if (path === '/roadmap') {
    list.push({ name: 'Roadmap', link: '' });
  } else if (path === '/milestones') {
    list.push({ name: 'Milestones Catalog', link: '' });
  } else if (path === '/analytics') {
    list.push({ name: 'Executive Analytics', link: '' });
  } else if (path === '/architecture') {
    list.push({ name: 'System Architecture', link: '' });
  } else if (path === '/adr') {
    list.push({ name: 'Architecture Decisions (ADR)', link: '' });
  } else if (path === '/reports') {
    list.push({ name: 'Sprint Reports', link: '' });
  } else if (path === '/changelog') {
    list.push({ name: 'Change Log', link: '' });
  } else if (path === '/version') {
    list.push({ name: 'Version Matrix', link: '' });
  } else if (path === '/settings') {
    list.push({ name: 'Settings', link: '' });
  }

  return list;
});
</script>
