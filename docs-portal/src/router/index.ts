import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import RoadmapView from '@/views/RoadmapView.vue';
import MilestonesView from '@/views/MilestonesView.vue';
import ReportsView from '@/views/ReportsView.vue';
import ArchitectureView from '@/views/ArchitectureView.vue';
import AdrView from '@/views/AdrView.vue';
import ChangelogView from '@/views/ChangelogView.vue';
import VersionView from '@/views/VersionView.vue';

import SprintWorkspaceView from '@/views/SprintWorkspaceView.vue';
import ExecutiveAnalyticsView from '@/views/ExecutiveAnalyticsView.vue';
import SettingsView from '@/views/SettingsView.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: DashboardView },
  { path: '/analytics', name: 'ExecutiveAnalytics', component: ExecutiveAnalyticsView },
  { path: '/workspace', redirect: '/sprint/M05' },
  { path: '/sprint/:milestoneId', name: 'SprintWorkspace', component: SprintWorkspaceView },
  { path: '/sprint/:milestoneId/phase/:phaseId', name: 'PhaseDetail', component: SprintWorkspaceView },
  { path: '/roadmap', name: 'Roadmap', component: RoadmapView },
  { path: '/milestones', name: 'Milestones', component: MilestonesView },
  { path: '/reports', name: 'Reports', component: ReportsView },
  { path: '/architecture', name: 'Architecture', component: ArchitectureView },
  { path: '/adr', name: 'ADR', component: AdrView },
  { path: '/changelog', name: 'Changelog', component: ChangelogView },
  { path: '/version', name: 'Version', component: VersionView },
  { path: '/settings', name: 'Settings', component: SettingsView },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
