<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Executive Hero Header -->
    <div class="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Enterprise Production Engineering Control
            </span>
            <span class="text-xs font-mono text-slate-400">Target Environment: Chrome MV3 Production Ready</span>
          </div>
          <h1 class="text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight">
            {{ docsStore.projectInfo.projectName }}
          </h1>
          <p class="text-slate-400 text-sm max-w-2xl">
            Event-Driven Micro-Kernel Extension Architecture. Business Framework Migration 100% Complete & Production Active.
          </p>
        </div>

        <!-- Dual Progress Gauges: Current Phase vs Overall Product Roadmap -->
        <div class="flex flex-col sm:flex-row gap-4 shrink-0 font-mono text-xs">
          <!-- Current Phase Gauge -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2 min-w-[210px]">
            <div class="flex items-center justify-between text-slate-400">
              <span class="text-[10px] uppercase font-bold text-slate-300">CURRENT PHASE (MIGRATION)</span>
              <span class="font-bold text-emerald-400">100%</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div class="h-full bg-emerald-400 rounded-full transition-all duration-500" style="width: 100%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>Phase 4 Completed</span>
              <span class="text-emerald-400 font-bold">4 / 4 Done</span>
            </div>
          </div>

          <!-- Overall Product Roadmap Gauge -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/30 space-y-2 min-w-[210px]">
            <div class="flex items-center justify-between text-slate-400">
              <span class="text-[10px] uppercase font-bold text-slate-300">OVERALL PRODUCT ROADMAP</span>
              <span class="font-bold text-blue-400">{{ docsStore.projectInfo.overallCompletion }}%</span>
            </div>
            <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500" :style="{ width: docsStore.projectInfo.overallCompletion + '%' }"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span>Milestones Completed</span>
              <span class="text-blue-400 font-bold">{{ docsStore.projectInfo.completedMilestones }} / {{ docsStore.projectInfo.totalMilestones }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. Executive Status Cards (4 Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: Architecture -->
      <StatCard 
        label="Architecture" 
        value="COMPLETE" 
        description="Business Framework Migration Finished"
        badge="FINISHED"
        badgeType="success"
      >
        <template #icon>
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </template>
      </StatCard>

      <!-- Card 2: Production -->
      <StatCard 
        label="Production" 
        value="IN PROGRESS" 
        description="Production Hardening (Sprint 4)"
        badge="CURRENT PHASE"
        badgeType="info"
      >
        <template #icon>
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </template>
      </StatCard>

      <!-- Card 3: Release -->
      <StatCard 
        label="Release" 
        value="PLANNED" 
        description="Version 1.0 General Availability"
        badge="TARGET v1.0"
        badgeType="warning"
      >
        <template #icon>
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </template>
      </StatCard>

      <!-- Card 4: Repository -->
      <StatCard 
        label="Repository" 
        value="HEALTHY" 
        description="0 Circular Deps • 0 Dead Code • 100% Type Safe"
        badge="100% TYPE-SAFE"
        badgeType="success"
      >
        <template #icon>
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- 2 & 3. 7-Phase Hierarchy Breakdown & Sprint Control Widget -->
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
          <!-- Phase 1 -->
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

          <!-- Phase 2 -->
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

          <!-- Phase 3 -->
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">3</span>
              <div>
                <span class="font-bold text-slate-200">Phase 3: Documentation (M06 - M10)</span>
                <span class="text-[10px] text-slate-400 block font-mono">Governance, Metadata Engine & Portal v1.0</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">COMPLETED</span>
          </div>

          <!-- Phase 4 (100% Completed, 13/13 Work Packages) -->
          <div class="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">4</span>
              <div>
                <span class="font-bold text-slate-100">Phase 4: Business Framework</span>
                <span class="text-[10px] text-emerald-400 block font-mono">100% Completed (13 / 13 Work Packages Finished)</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">ARCHIVED</span>
          </div>

          <!-- Phase 5 (Current / In Progress) -->
          <div class="p-3 rounded-xl bg-slate-900/80 border border-blue-500/40 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[11px]">5</span>
              <div>
                <span class="font-bold text-blue-300">Phase 5: Production Hardening</span>
                <span class="text-[10px] text-slate-400 block font-mono">WP-5.1 Benchmark • WP-5.2 Reliability • WP-5.3 Observability • WP-5.4 Security • WP-5.5 Recovery • WP-5.6 Certification</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">CURRENT</span>
          </div>

          <!-- Phase 6 -->
          <div class="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-[11px]">6</span>
              <div>
                <span class="font-bold text-slate-300">Phase 6: Release Engineering</span>
                <span class="text-[10px] text-slate-400 block font-mono">CI/CD Pipeline, Automated Testing, Release Packaging, Web Store Submission & Versioning</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">PLANNED</span>
          </div>

          <!-- Phase 7 -->
          <div class="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[11px]">7</span>
              <div>
                <span class="font-bold text-amber-300">Phase 7: Version 1.0 Release (GA)</span>
                <span class="text-[10px] text-amber-400/80 block font-mono">General Availability Release</span>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">TARGET</span>
          </div>
        </div>
      </div>

      <!-- 6 & 10. Sprint Control & Repository Health Cards -->
      <div class="space-y-4 flex flex-col justify-between">
        <!-- Sprint Status Card -->
        <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
          <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Sprint Control Status</span>
          </h3>

          <div class="space-y-2 text-xs font-mono">
            <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span class="font-bold text-emerald-300">Sprint 3B (WP-1 - WP-4)</span>
                <span class="block text-[10px] text-emerald-400/80">Business Framework Migration</span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">COMPLETED</span>
            </div>

            <div class="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <div>
                <span class="font-bold text-blue-300">Sprint 4 (WP-5)</span>
                <span class="block text-[10px] text-blue-400/80">Production Hardening</span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">READY TO START</span>
            </div>
          </div>
        </div>

        <!-- 10. Repository Health Card -->
        <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3">
          <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Repository Health Matrix</span>
          </h3>

          <div class="space-y-1.5 text-xs font-mono">
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
              <span class="text-slate-400">Business Framework:</span>
              <span class="font-bold text-emerald-400">Production</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
              <span class="text-slate-400">Execution Mode:</span>
              <span class="font-bold text-blue-400">Business Only</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
              <span class="text-slate-400">Legacy Runtime:</span>
              <span class="font-bold text-amber-400">Deprecated Stub</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
              <span class="text-slate-400">Repository Health:</span>
              <span class="font-bold text-emerald-400">Excellent</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
              <span class="text-slate-400">Technical Debt:</span>
              <span class="font-bold text-emerald-400">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. Expanded Engineering Validation Grid (9 Metrics) -->
    <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
      <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Production Readiness & Engineering Validation</span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 text-xs font-mono">
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">PUBLISHER AUDIT</span>
          <span class="text-emerald-400 font-bold">PASS (13 / 13)</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">TOPIC COVERAGE</span>
          <span class="text-emerald-400 font-bold">100% Runtime Topics</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">SUBSCRIBER BASELINE</span>
          <span class="text-emerald-400 font-bold">PASS (15 Handlers)</span>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">ARCHITECTURE READINESS</span>
          <span class="text-emerald-400 font-bold">READY (Business Engine)</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">PERFORMANCE</span>
          <span class="text-blue-400 font-bold">Pending (WP-5.1)</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">RELIABILITY</span>
          <span class="text-blue-400 font-bold">Pending (WP-5.2)</span>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">OBSERVABILITY</span>
          <span class="text-blue-400 font-bold">Pending (WP-5.3)</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">SECURITY & COMPLIANCE</span>
          <span class="text-blue-400 font-bold">Pending (WP-5.4)</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span class="text-slate-400 text-[10px] block font-bold uppercase">CERTIFICATION</span>
          <span class="text-blue-400 font-bold">Pending (WP-5.6)</span>
        </div>
      </div>
    </div>

    <!-- 7 & 11. Work Packages Accordion & Evolution Roadmap Flow -->
    <div class="space-y-6">
      <!-- 11. Product Evolution Roadmap Flow -->
      <div class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4">
        <h3 class="text-sm font-bold font-heading text-slate-100 flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>Production Evolution Roadmap Timeline</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <!-- Step 1: Business Framework -->
          <div class="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-emerald-400 font-bold">STAGE 1</span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">COMPLETED</span>
            </div>
            <div>
              <h4 class="font-bold text-slate-100">Business Framework</h4>
              <p class="text-[11px] text-slate-400">Sole Production Execution Engine</p>
            </div>
          </div>

          <!-- Step 2: Production Hardening -->
          <div class="p-4 rounded-xl bg-slate-900/80 border border-blue-500/40 flex flex-col justify-between space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-blue-400 font-bold">STAGE 2</span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">CURRENT</span>
            </div>
            <div>
              <h4 class="font-bold text-blue-300">Production Hardening</h4>
              <p class="text-[11px] text-slate-400">Benchmark, Reliability & Observability</p>
            </div>
          </div>

          <!-- Step 3: Release Engineering -->
          <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-slate-400 font-bold">STAGE 3</span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">PLANNED</span>
            </div>
            <div>
              <h4 class="font-bold text-slate-300">Release Engineering</h4>
              <p class="text-[11px] text-slate-400">Audit, Certification & Build Signing</p>
            </div>
          </div>

          <!-- Step 4: Version 1.0 Target -->
          <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-slate-400 font-bold">STAGE 4</span>
              <span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">TARGET</span>
            </div>
            <div>
              <h4 class="font-bold text-slate-300">Version 1.0</h4>
              <p class="text-[11px] text-slate-400">General Availability Release</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Collapsible Work Packages Accordion Component -->
      <WorkPackageAccordion
        title="Work Packages"
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
