<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Executive Hero Header -->
    <div class="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Enterprise Production Engineering Control
            </span>
            <!-- Small Repository Status Chips -->
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              🟢 Production Ready
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Build PASS
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Type Check PASS
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              11 / 11 Tests
            </span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight">
            {{ docsStore.projectInfo.projectName }}
          </h1>
          <p class="text-slate-400 text-sm max-w-2xl">
            Event-Driven Micro-Kernel Extension Architecture. Sprint 4 Hardening Baseline (v0.5.0) Complete. Entering Sprint 5 – Phase 6 Release Engineering.
          </p>
        </div>

        <!-- Global Progress Gauge & Baseline Card -->
        <div class="flex flex-col sm:flex-row gap-4 shrink-0 font-mono text-xs">
          <!-- Baseline Card -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/30 space-y-2 min-w-[210px]">
            <div class="flex items-center justify-between text-slate-400">
              <span class="text-[10px] uppercase font-bold text-slate-300">CURRENT BASELINE</span>
              <span class="font-bold text-blue-400">v0.5.0</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div class="h-full bg-blue-500 rounded-full transition-all duration-500" style="width: 100%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>Hardening Complete</span>
              <span class="text-blue-400 font-bold">4 / 4 Done</span>
            </div>
          </div>

          <!-- Global Project Progress Gauge -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2 min-w-[210px]">
            <div class="flex items-center justify-between text-slate-400">
              <span class="text-[10px] uppercase font-bold text-slate-300">OVERALL PROGRESS</span>
              <span class="font-bold text-emerald-400">80%</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500" style="width: 80%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>Phases Complete</span>
              <span class="text-emerald-400 font-bold">5 / 7 Phases</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. GLOBAL REPOSITORY SUMMARY PANEL (TOP DEDICATED CARD) -->
    <div class="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-xl space-y-4 font-mono text-xs">
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div class="flex items-center space-x-2">
          <span class="text-emerald-400 font-bold text-base">🟢</span>
          <span class="font-bold text-slate-100 text-sm">Global Repository Summary & Execution Control</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="px-2.5 py-0.5 rounded font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">v0.5.0 BASELINE</span>
          <span class="px-2.5 py-0.5 rounded font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">PHASE 6 CURRENT</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">STATUS</span>
          <span class="text-emerald-400 font-bold text-xs">🟢 Production Ready</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">BASELINE</span>
          <span class="text-blue-400 font-bold text-xs">v0.5.0</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">ARCHITECTURE</span>
          <span class="text-emerald-400 font-bold text-xs">Complete</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">CURRENT SPRINT</span>
          <span class="text-amber-300 font-bold text-xs">Sprint 5</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">CURRENT PHASE</span>
          <span class="text-amber-300 font-bold text-xs">Phase 6 – Release Eng</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">BUILD</span>
          <span class="text-emerald-400 font-bold text-xs">PASS</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">TYPE CHECK</span>
          <span class="text-emerald-400 font-bold text-xs">PASS</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">TEST SUITES</span>
          <span class="text-emerald-400 font-bold text-xs">11 / 11 PASS</span>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <span class="text-slate-500 text-[9px] block uppercase font-bold">HEALTH</span>
          <span class="text-emerald-400 font-bold text-xs">Excellent</span>
        </div>
      </div>
    </div>

    <!-- 2. RELEASE TIMELINE WIDGET -->
    <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 font-mono text-xs">
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
          <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Product Version Release Timeline</span>
        </h3>
        <span class="text-[11px] text-slate-400">Baseline Tag: <strong class="text-blue-400">v0.5.0</strong></span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center text-[11px]">
        <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
          <span class="font-bold text-emerald-400 block text-[10px]">v0.1.0</span>
          <span class="text-slate-300 font-semibold block text-[10px] truncate">Foundation</span>
          <span class="text-[9px] text-emerald-400/80 font-bold">COMPLETED</span>
        </div>

        <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
          <span class="font-bold text-emerald-400 block text-[10px]">v0.2.0</span>
          <span class="text-slate-300 font-semibold block text-[10px] truncate">EventBus</span>
          <span class="text-[9px] text-emerald-400/80 font-bold">COMPLETED</span>
        </div>

        <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-0.5">
          <span class="font-bold text-emerald-400 block text-[10px]">v0.3.0</span>
          <span class="text-slate-300 font-semibold block text-[10px] truncate">Business Framework</span>
          <span class="text-[9px] text-emerald-400/80 font-bold">COMPLETED</span>
        </div>

        <div class="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 space-y-0.5">
          <span class="font-bold text-teal-300 block text-[10px]">v0.4.0</span>
          <span class="text-slate-300 font-semibold block text-[10px] truncate">Migration</span>
          <span class="text-[9px] text-teal-300 font-bold">ARCHIVED</span>
        </div>

        <div class="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 space-y-0.5 ring-2 ring-blue-500/30">
          <span class="font-bold text-blue-300 block text-[10px]">v0.5.0</span>
          <span class="text-slate-200 font-semibold block text-[10px] truncate">Hardening</span>
          <span class="text-[9px] text-blue-300 font-bold">BASELINE</span>
        </div>

        <div class="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 space-y-0.5 ring-2 ring-amber-500/30">
          <span class="font-bold text-amber-300 block text-[10px]">v0.6.0</span>
          <span class="text-slate-200 font-semibold block text-[10px] truncate">Release Eng</span>
          <span class="text-[9px] text-amber-300 font-bold">CURRENT</span>
        </div>

        <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
          <span class="font-bold text-slate-400 block text-[10px]">v0.7.0</span>
          <span class="text-slate-400 block text-[10px] truncate">Beta</span>
          <span class="text-[9px] text-slate-500 font-bold">PLANNED</span>
        </div>

        <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
          <span class="font-bold text-slate-400 block text-[10px]">v0.9.0</span>
          <span class="text-slate-400 block text-[10px] truncate">Release Candidate</span>
          <span class="text-[9px] text-slate-500 font-bold">PLANNED</span>
        </div>

        <div class="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 space-y-0.5">
          <span class="font-bold text-yellow-400 block text-[10px]">v1.0.0</span>
          <span class="text-yellow-300 font-semibold block text-[10px] truncate">GA Release</span>
          <span class="text-[9px] text-yellow-400 font-bold">GOAL</span>
        </div>
      </div>
    </div>

    <!-- 3. OVERALL PROJECT PROGRESS SUMMARY (GLOBAL WIDGET) -->
    <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 font-mono text-xs">
      <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 30a1 1 0 000 2h2a1 1 0 000-2h-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Overall Project Progress Summary</span>
        </h3>
        <div class="flex items-center space-x-3">
          <span class="text-slate-400">Total Completion:</span>
          <span class="text-emerald-400 font-bold text-sm">~80%</span>
        </div>
      </div>

      <!-- Single Global Progress Bar -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-slate-300">
          <span>Global Product Roadmap Execution</span>
          <span class="font-bold text-emerald-400">80% Total</span>
        </div>
        <div class="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div class="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500" style="width: 80%"></div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">FOUNDATION</span>
          <span class="text-emerald-400 font-bold">100%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">ARCHITECTURE</span>
          <span class="text-emerald-400 font-bold">100%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">DOCUMENTATION</span>
          <span class="text-emerald-400 font-bold">100%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-teal-500/30 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">BUSINESS FWK</span>
          <span class="text-teal-300 font-bold">100%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-blue-500/30 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">HARDENING</span>
          <span class="text-blue-300 font-bold">100%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-amber-500/30 text-center space-y-1 ring-1 ring-amber-500/20">
          <span class="text-slate-400 text-[10px] block font-bold">RELEASE ENG</span>
          <span class="text-amber-300 font-bold">0%</span>
        </div>
        <div class="p-2.5 rounded-xl bg-slate-900/70 border border-yellow-500/20 text-center space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold">VERSION 1.0</span>
          <span class="text-yellow-400 font-bold">0%</span>
        </div>
      </div>
    </div>

    <!-- 4. 7-PHASE HIERARCHY FLOW & MILESTONE SUMMARY WIDGETS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 7-Phase Hierarchy Flow -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>7-Phase Product Hierarchy Breakdown</span>
          </h2>
          <router-link to="/roadmap" class="text-xs font-mono text-blue-400 hover:underline">Full Roadmap →</router-link>
        </div>

        <div class="space-y-2 text-xs font-mono">
          <!-- Phase 1 (COMPLETED - GREEN - READ ONLY) -->
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">1</span>
              <div>
                <span class="font-bold text-slate-200">Phase 1: Foundation (M00 - M03)</span>
                <span class="text-[10px] text-slate-400 block font-mono">Core Extension Scaffolding & Lifecycle Engine</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">COMPLETED</span>
          </div>

          <!-- Phase 2 (COMPLETED - GREEN - READ ONLY) -->
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">2</span>
              <div>
                <span class="font-bold text-slate-200">Phase 2: Architecture (M04 - M05)</span>
                <span class="text-[10px] text-slate-400 block font-mono">Enterprise Event Bus Architecture & SAD</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">COMPLETED</span>
          </div>

          <!-- Phase 3 (COMPLETED - GREEN - READ ONLY) -->
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">3</span>
              <div>
                <span class="font-bold text-slate-200">Phase 3: Documentation (M06 - M11)</span>
                <span class="text-[10px] text-slate-400 block font-mono">Governance, Metadata Engine & Portal v1.0</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">COMPLETED</span>
          </div>

          <!-- Phase 4 (ARCHIVED - TEAL - READ ONLY) -->
          <div class="p-3 rounded-xl bg-slate-900/60 border border-teal-500/30 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-[11px]">4</span>
              <div>
                <span class="font-bold text-slate-100">Phase 4: Business Framework</span>
                <span class="text-[10px] text-teal-400 block font-mono">Business Framework Migration Complete (13 Work Packages Finished)</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">ARCHIVED</span>
          </div>

          <!-- Phase 5 (BASELINE v0.5.0 - BLUE - READ ONLY) -->
          <div class="p-3 rounded-xl bg-slate-900/80 border border-blue-500/40 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[11px]">5</span>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-bold text-blue-300">Phase 5: Production Hardening</span>
                  <span class="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 font-bold">v0.5.0</span>
                </div>
                <span class="text-[10px] text-blue-400/90 block font-mono">Production Hardening Complete (Benchmark, Reliability, Observability, Production Integration, Runtime Wiring)</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">BASELINE</span>
            </div>
          </div>

          <!-- Phase 6 (CURRENT - ORANGE - SPRINT 5 EDITABLE) -->
          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between ring-1 ring-amber-500/30">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px]">6</span>
              <div>
                <span class="font-bold text-amber-300">Phase 6: Release Engineering</span>
                <span class="text-[10px] text-amber-400 block font-mono">CI/CD Pipeline • Automated Testing • Release Packaging • Chrome Web Store Submission</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">CURRENT</span>
          </div>

          <!-- Phase 7 (GOAL - GOLD / PURPLE) -->
          <div class="p-3 rounded-xl bg-slate-900/40 border border-yellow-500/30 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-yellow-500/20 text-yellow-400 font-bold flex items-center justify-center text-[11px]">7</span>
              <div>
                <span class="font-bold text-yellow-300">Phase 7: Version 1.0 Release (GA)</span>
                <span class="text-[10px] text-yellow-400/80 block font-mono">Version 1.0 General Availability Goal</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">GOAL</span>
          </div>
        </div>
      </div>

      <!-- Milestone Summary & Sprint Control Panel -->
      <div class="space-y-4 flex flex-col justify-between">
        <!-- Milestone Summary Cards -->
        <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3 font-mono text-xs">
          <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Sprint Milestone Summary</span>
          </h3>

          <div class="space-y-2">
            <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span class="font-bold text-slate-300">Sprint 1</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span class="font-bold text-slate-300">Sprint 2</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <span class="font-bold text-slate-300">Sprint 3</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>
            </div>
            <div class="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <span class="font-bold text-blue-300">Sprint 4</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Baseline v0.5.0</span>
            </div>
            <div class="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between ring-1 ring-amber-500/20">
              <span class="font-bold text-amber-300">Sprint 5</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Current Development</span>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
              <span class="font-bold text-slate-400">Sprint 6</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Future</span>
            </div>
          </div>
        </div>

        <!-- 5. ENGINEERING HEALTH CARD (DEDICATED PANEL) -->
        <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3 font-mono text-xs">
          <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Engineering Health Panel</span>
          </h3>

          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">ARCHITECTURE</span>
              <span class="font-bold text-emerald-400">Complete</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">BUSINESS FWK</span>
              <span class="font-bold text-emerald-400">Complete</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">PERFORMANCE</span>
              <span class="font-bold text-emerald-400">Complete</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">RELIABILITY</span>
              <span class="font-bold text-emerald-400">Complete</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">OBSERVABILITY</span>
              <span class="font-bold text-emerald-400">Complete</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">INTEGRATION</span>
              <span class="font-bold text-emerald-400">Complete</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">WIRING</span>
              <span class="font-bold text-emerald-400">Complete</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">HEALTH</span>
              <span class="font-bold text-emerald-400">Excellent</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">TECH DEBT</span>
              <span class="font-bold text-emerald-400">Low</span>
            </div>
            <div class="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span class="text-slate-500 block text-[9px]">BUILD & TESTS</span>
              <span class="font-bold text-emerald-400">PASS (11/11)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Evolution Roadmap Flow Timeline -->
    <div class="space-y-6">
      <WorkPackageAccordion
        title="Work Packages (Historical & Active)"
        :completed="13"
        :total="13"
        :progress="100"
        :items="sprintWorkPackages"
        storageKey="dashboard_wp_accordion_expanded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDocsStore } from '@/stores/docs.store';
import StatCard from '@/components/StatCard.vue';
import WorkPackageAccordion from '@/components/WorkPackageAccordion.vue';

const docsStore = useDocsStore();

const sprintWorkPackages = computed(() => {
  const m14 = docsStore.milestones.find(m => m.id === 'M14');
  return m14?.workPackages || [];
});
</script>
