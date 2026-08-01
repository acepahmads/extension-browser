<template>
  <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between py-6 px-4 shrink-0">
    <div class="space-y-6">
      <!-- Main Nav Section -->
      <div>
        <div class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Overview</div>
        <nav class="space-y-1">
          <router-link 
            to="/" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </router-link>

          <router-link 
            to="/workspace" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path.startsWith('/sprint') || $route.path === '/workspace' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Sprint Workspace</span>
          </router-link>

          <router-link 
            to="/roadmap" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/roadmap' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Roadmap</span>
          </router-link>

          <router-link 
            to="/milestones" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/milestones' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>Milestones Catalog</span>
          </router-link>
        </nav>
      </div>

      <!-- Governance & Architecture -->
      <div>
        <div class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Architecture & Docs</div>
        <nav class="space-y-1">
          <router-link 
            to="/architecture" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/architecture' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Architecture</span>
          </router-link>

          <router-link 
            to="/adr" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/adr' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>ADRs</span>
          </router-link>

          <router-link 
            to="/reports" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/reports' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Sprint Reports</span>
          </router-link>
        </nav>
      </div>

      <!-- Platform Releases -->
      <div>
        <div class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">System Releases</div>
        <nav class="space-y-1">
          <router-link 
            to="/analytics" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/analytics' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Executive Analytics</span>
          </router-link>

          <router-link 
            to="/changelog" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/changelog' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Change Log</span>
          </router-link>

          <router-link 
            to="/version" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/version' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Version Matrix</span>
          </router-link>

          <router-link 
            to="/settings" 
            class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition"
            :class="$route.path === '/settings' ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Active Execution Footprint Card -->
    <div class="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
      <div class="flex items-center justify-between text-slate-400 mb-1">
        <span>Completion Progress</span>
        <span class="font-mono text-blue-400 font-bold">42.1%</span>
      </div>
      <div class="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
        <div class="h-full bg-blue-500 rounded-full" style="width: 42.1%"></div>
      </div>
      <div class="text-[11px] text-slate-400 flex items-center justify-between">
        <span>Completed: 8/19</span>
        <span class="text-emerald-400">Stable Build</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const $route = useRoute();
</script>
