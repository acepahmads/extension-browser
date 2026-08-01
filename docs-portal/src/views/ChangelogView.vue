<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div>
      <h1 class="text-2xl lg:text-3xl font-extrabold font-heading text-slate-100">System Change Log</h1>
      <p class="text-slate-400 text-xs mt-1">Semantic versioning release history tracking features, changes, and documentation additions.</p>
    </div>

    <!-- Releases List -->
    <div class="space-y-8">
      <div 
        v-for="rel in releaseHistory" 
        :key="rel.version"
        class="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-4 shadow-lg"
      >
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold font-mono text-sm shadow">
              v{{ rel.version }}
            </span>
            <span class="text-sm font-semibold text-slate-200">{{ rel.milestone }}</span>
          </div>
          <span class="text-xs font-mono text-slate-400">{{ rel.date }}</span>
        </div>

        <div class="space-y-3 text-xs">
          <div v-if="rel.added.length > 0" class="space-y-1.5">
            <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              Added
            </span>
            <ul class="list-disc list-inside text-slate-300 space-y-1 pl-2">
              <li v-for="item in rel.added" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div v-if="rel.changed && rel.changed.length > 0" class="space-y-1.5 pt-2">
            <span class="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
              Changed
            </span>
            <ul class="list-disc list-inside text-slate-300 space-y-1 pl-2">
              <li v-for="item in rel.changed" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const releaseHistory = [
  {
    version: '1.0.0',
    milestone: 'Milestone M06 & D0.1 Governance',
    date: '2026-07-31',
    added: [
      'BusEventEnvelope<T> schema featuring version "1.0", sequence, sessionId, correlationId, source, severity, and payload.',
      'EventCategory enum supporting 10 domain namespaces.',
      'Singleton EventBusCore engine providing publish(), subscribe(), once(), unsubscribe(), broadcast(), and wildcard pattern matching.',
      'Automated unit verification test suite event-bus.spec.ts.',
      'Enterprise documentation governance system (CHANGELOG, VERSION, Glossary, Coding Standards, CONTRIBUTING, CONTEXT).'
    ],
    changed: []
  },
  {
    version: '0.5.0',
    milestone: 'Milestone M05: Sprint 3A Revision Addendum',
    date: '2026-07-31',
    added: [
      'Event envelope versioning requirement (version "1.0").',
      'Schema Registry design and EventValidator pipeline component position.',
      'Event Bus Metrics Collector specification tracking published, consumed, failed, retried, dropped, queueDepth, and latency.',
      'IReplayHook extension point definition for Sprint 10 Replay Engine.'
    ],
    changed: [
      'Removed Object Pooling recommendation in favor of V8 Generational Garbage Collection optimization.',
      'Deferred Circuit Breaker orchestration to Sprint 12 (Backend Synchronization).'
    ]
  },
  {
    version: '0.3.0',
    milestone: 'Milestone M03: Sprint 2.1 Engine Completion',
    date: '2026-07-31',
    added: [
      'Captured all 24 mandatory browser lifecycle events.',
      'Enriched ActivityEvent model with sequence, sessionId, correlationId, source, severity, and duration (ms).',
      'Logger.success() level and Production Silent Mode.',
      'Diagnostics Center 6-component suite and Health Score (0-100%) indicator.'
    ],
    changed: []
  }
];
</script>
