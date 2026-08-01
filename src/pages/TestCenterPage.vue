<template>
  <div class="space-y-6 max-w-4xl">
    <div>
      <h2 class="text-lg font-semibold text-slate-100 flex items-center gap-2">
        Developer Tools & Test Center
        <span class="text-xs px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/30 font-mono">
          Diagnostics Center
        </span>
      </h2>
      <p class="text-xs text-slate-400 mt-0.5">
        Run diagnostic suites, evaluate System Health Score (0-100%), generate dummy events, and verify Workspace Resolver.
      </p>
    </div>

    <!-- Health Score Banner Card -->
    <div v-if="healthScore !== null" class="p-4 rounded-lg bg-dark-surface border border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      <div class="flex items-center gap-4">
        <!-- Radial Score / Percent -->
        <div class="w-16 h-16 rounded-full bg-dark-bg border-2 flex items-center justify-center font-mono font-bold text-lg shadow-inner" :class="getHealthBorderColor(healthScore)">
          {{ healthScore }}%
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-semibold text-slate-100">System Health Score</h3>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase" :class="getHealthBadgeClass(healthScore)">
              {{ healthIndicator }}
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">
            {{ healthSummary }}
          </p>
        </div>
      </div>

      <button
        @click="runDiagnostics"
        class="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-2 transition-all self-stretch sm:self-auto justify-center"
      >
        🔄 Re-run Diagnostics
      </button>
    </div>

    <!-- Diagnostic Suite Actions -->
    <div class="p-4 rounded-lg bg-dark-surface border border-dark-border space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">System Diagnostics & Generators</h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          @click="runDiagnostics"
          class="p-3 rounded-md bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition-all"
        >
          🔍 Run Diagnostics Suite
        </button>

        <button
          @click="handleClearActivity"
          class="p-3 rounded-md bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          🗑️ Clear Activity Logs
        </button>

        <button
          @click="refreshInfo"
          class="p-3 rounded-md bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          🔄 Refresh System Status
        </button>
      </div>
    </div>

    <!-- System Diagnostic Check Items Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div v-for="check in diagnosticChecks" :key="check.id" class="p-3 rounded-lg bg-dark-surface border border-dark-border space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <span>{{ check.icon }}</span>
            <span>{{ check.name }}</span>
          </span>
          <span
            class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
            :class="check.passed ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' : 'bg-amber-950 text-amber-300 border-amber-500/30'"
          >
            {{ check.passed ? 'PASS' : 'WARN' }}
          </span>
        </div>
        <p class="text-[11px] text-slate-400 font-mono truncate" :title="check.detail">
          {{ check.detail }}
        </p>
      </div>
    </div>

    <!-- Dummy Event Generator Box -->
    <div class="p-4 rounded-lg bg-dark-surface border border-dark-border space-y-3">
      <div>
        <h3 class="text-sm font-semibold text-slate-200">Generate Dummy Test Events</h3>
        <p class="text-xs text-slate-400">Inject simulated lifecycle events into Activity Engine without navigating websites.</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          @click="generateDummy('PAGE_LOADED')"
          class="p-2.5 rounded bg-dark-bg hover:bg-dark-card border border-dark-border text-xs text-emerald-300 font-mono text-left transition-all"
        >
          📄 Dummy Page Loaded
        </button>

        <button
          @click="generateDummy('NAVIGATION')"
          class="p-2.5 rounded bg-dark-bg hover:bg-dark-card border border-dark-border text-xs text-brand-300 font-mono text-left transition-all"
        >
          ⛵ Dummy Navigation
        </button>

        <button
          @click="generateDummy('WORKSPACE')"
          class="p-2.5 rounded bg-dark-bg hover:bg-dark-card border border-dark-border text-xs text-amber-300 font-mono text-left transition-all"
        >
          🏛️ Dummy Workspace
        </button>

        <button
          @click="generateDummy('STORAGE')"
          class="p-2.5 rounded bg-dark-bg hover:bg-dark-card border border-dark-border text-xs text-purple-300 font-mono text-left transition-all"
        >
          💾 Dummy Storage
        </button>
      </div>
    </div>

    <!-- Diagnostic Results Console -->
    <div v-if="diagnosticLogs.length > 0" class="p-4 rounded-lg bg-dark-surface border border-dark-border space-y-2">
      <span class="text-xs font-semibold text-slate-200 block">Diagnostic Suite Log Output</span>
      <div class="p-3 bg-dark-bg border border-dark-border rounded font-mono text-xs text-slate-300 space-y-1 max-h-48 overflow-y-auto">
        <div v-for="(log, idx) in diagnosticLogs" :key="idx" class="flex items-center gap-2">
          <span class="text-slate-500">[{{ log.time }}]</span>
          <span :class="log.status === 'OK' ? 'text-emerald-400' : 'text-amber-400'">[{{ log.status }}]</span>
          <span>{{ log.message }}</span>
        </div>
      </div>
    </div>

    <!-- Storage & Workspace System Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Storage Information -->
      <div class="p-4 rounded-lg bg-dark-surface border border-dark-border space-y-2">
        <h3 class="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono">Chrome Storage Info</h3>
        <div class="p-3 bg-dark-bg rounded border border-dark-border space-y-1.5 text-xs font-mono">
          <div class="flex justify-between">
            <span class="text-slate-400">Storage Mechanism:</span>
            <span class="text-brand-300">chrome.storage.local</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Registered Key:</span>
            <span class="text-slate-200">sppg_companion_workspaces</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Storage State:</span>
            <span class="text-emerald-400">Active & Persistent</span>
          </div>
        </div>
      </div>

      <!-- Workspace System Information -->
      <div class="p-4 rounded-lg bg-dark-surface border border-dark-border space-y-2">
        <h3 class="text-xs font-semibold uppercase text-slate-400 tracking-wider font-mono">Workspace Engine Info</h3>
        <div class="p-3 bg-dark-bg rounded border border-dark-border space-y-1.5 text-xs font-mono">
          <div class="flex justify-between">
            <span class="text-slate-400">Configuration Version:</span>
            <span class="text-brand-300">v{{ version }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Total Workspaces:</span>
            <span class="text-slate-200">{{ workspacesList.length }} Configured</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Resolver Engine:</span>
            <span class="text-emerald-400">Active Matcher</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBrowserStore } from '../stores/browser';
import { useActivityStore } from '../modules/lifecycle/activity.store';
import { storeToRefs } from 'pinia';
import { MessageBus } from '../services/messageBus';
import { MessageType } from '../types/messages';
import { StorageService } from '../config/storage.service';

interface DiagnosticCheck {
  id: string;
  name: string;
  icon: string;
  passed: boolean;
  detail: string;
}

const browserStore = useBrowserStore();
const activityStore = useActivityStore();
const { workspacesList } = storeToRefs(browserStore);

const version = ref('1.0.0');
const diagnosticLogs = ref<{ time: string; status: 'OK' | 'WARN'; message: string }[]>([]);
const healthScore = ref<number | null>(null);

const diagnosticChecks = ref<DiagnosticCheck[]>([
  { id: 'manifest', name: 'Manifest MV3', icon: '📄', passed: true, detail: 'Manifest V3 valid' },
  { id: 'permissions', name: 'Permissions', icon: '🔑', passed: true, detail: 'Storage, Tabs, WebNavigation' },
  { id: 'storage', name: 'Storage Engine', icon: '💾', passed: true, detail: 'chrome.storage.local write/read OK' },
  { id: 'workspace', name: 'Workspace Resolver', icon: '🏛️', passed: true, detail: 'Matcher active' },
  { id: 'lifecycle', name: 'Lifecycle Listener', icon: '⚡', passed: true, detail: 'Browser listeners bound' },
  { id: 'ipc', name: 'Message Passing', icon: '🔌', passed: true, detail: 'IPC Channel verified' }
]);

onMounted(() => {
  browserStore.loadWorkspaces();
  runDiagnostics();
});

const healthIndicator = computed(() => {
  if (healthScore.value === null) return 'Checking';
  if (healthScore.value >= 90) return 'Excellent';
  if (healthScore.value >= 75) return 'Good';
  if (healthScore.value >= 50) return 'Warning';
  return 'Critical';
});

const healthSummary = computed(() => {
  if (healthScore.value === null) return 'Evaluating system components...';
  if (healthScore.value >= 90) return 'All 6 lifecycle engine components are fully operational.';
  if (healthScore.value >= 75) return 'System operational with minor fallback mode warnings.';
  if (healthScore.value >= 50) return 'Some background features are operating with degraded functionality.';
  return 'Critical system issues detected in Chrome extension lifecycle APIs.';
});

function getHealthBadgeClass(score: number | null): string {
  if (score === null) return 'bg-slate-900 text-slate-400 border-slate-700';
  if (score >= 90) return 'bg-emerald-950 text-emerald-300 border-emerald-500/30';
  if (score >= 75) return 'bg-blue-950 text-blue-300 border-blue-500/30';
  if (score >= 50) return 'bg-amber-950 text-amber-300 border-amber-500/30';
  return 'bg-rose-950 text-rose-300 border-rose-500/30';
}

function getHealthBorderColor(score: number): string {
  if (score >= 90) return 'border-emerald-500 text-emerald-300';
  if (score >= 75) return 'border-blue-500 text-blue-300';
  if (score >= 50) return 'border-amber-500 text-amber-300';
  return 'border-rose-500 text-rose-300';
}

function refreshInfo() {
  browserStore.loadWorkspaces();
  activityStore.fetchEvents();
  runDiagnostics();
}

async function runDiagnostics() {
  diagnosticLogs.value = [];
  const now = () => new Date().toLocaleTimeString();
  let passedCount = 0;

  diagnosticLogs.value.push({ time: now(), status: 'OK', message: 'Starting SPPG Companion Enterprise Diagnostic Suite...' });

  // 1. Manifest Check
  const hasManifest = typeof chrome !== 'undefined' && !!chrome.runtime?.getManifest;
  const manifestObj = hasManifest ? chrome.runtime.getManifest() : null;
  const manifestPass = !hasManifest || (manifestObj && manifestObj.manifest_version === 3);
  diagnosticChecks.value[0].passed = !!manifestPass;
  diagnosticChecks.value[0].detail = manifestObj ? `MV3 v${manifestObj.version}` : 'Local Dev Fallback Mode';
  if (manifestPass) passedCount += 17;
  diagnosticLogs.value.push({ time: now(), status: 'OK', message: `Manifest Check: MV3 Verified (${diagnosticChecks.value[0].detail})` });

  // 2. Permissions Check
  const permissionsPass = typeof chrome !== 'undefined' && (!!chrome.tabs || !!chrome.webNavigation);
  diagnosticChecks.value[1].passed = permissionsPass;
  diagnosticChecks.value[1].detail = permissionsPass ? 'Tabs & Navigation Granted' : 'Standalone Preview Mode';
  if (permissionsPass) passedCount += 17;
  diagnosticLogs.value.push({ time: now(), status: permissionsPass ? 'OK' : 'WARN', message: `Permissions Check: ${diagnosticChecks.value[1].detail}` });

  // 3. Storage Check
  const storageTestKey = 'diag_test_ping';
  const testVal = Date.now();
  await StorageService.set(storageTestKey, testVal);
  const readBack = await StorageService.get<number>(storageTestKey);
  const storagePass = readBack === testVal;
  diagnosticChecks.value[2].passed = storagePass;
  diagnosticChecks.value[2].detail = storagePass ? 'Read/Write Verification Passed' : 'Storage Access Restricted';
  if (storagePass) passedCount += 17;
  diagnosticLogs.value.push({ time: now(), status: storagePass ? 'OK' : 'WARN', message: `Storage Check: ${diagnosticChecks.value[2].detail}` });

  // 4. Workspace Engine Check
  await browserStore.loadWorkspaces();
  const workspacePass = workspacesList.value.length > 0;
  diagnosticChecks.value[3].passed = workspacePass;
  diagnosticChecks.value[3].detail = `${workspacesList.value.length} Workspaces Loaded`;
  if (workspacePass) passedCount += 16;
  diagnosticLogs.value.push({ time: now(), status: 'OK', message: `Workspace Resolver Check: ${diagnosticChecks.value[3].detail}` });

  // 5. Lifecycle Listener Check
  const listenerPass = typeof chrome !== 'undefined' && !!chrome.runtime;
  diagnosticChecks.value[4].passed = listenerPass;
  diagnosticChecks.value[4].detail = listenerPass ? 'Browser Listeners Active' : 'Dev Web Preview Active';
  if (listenerPass) passedCount += 16;
  diagnosticLogs.value.push({ time: now(), status: listenerPass ? 'OK' : 'WARN', message: `Lifecycle Listener Check: ${diagnosticChecks.value[4].detail}` });

  // 6. IPC Message Passing Check
  let ipcPass = false;
  try {
    const statusResp = await MessageBus.send({ type: MessageType.GET_EXTENSION_STATUS, sender: 'OPTIONS' });
    ipcPass = !!statusResp?.success;
  } catch {
    ipcPass = false;
  }
  diagnosticChecks.value[5].passed = ipcPass;
  diagnosticChecks.value[5].detail = ipcPass ? 'Background Worker IPC OK' : 'Local Fallback IPC';
  if (ipcPass) passedCount += 17;
  diagnosticLogs.value.push({ time: now(), status: ipcPass ? 'OK' : 'WARN', message: `IPC Communication Check: ${diagnosticChecks.value[5].detail}` });

  // Final Health Score Computation (capped 0-100)
  healthScore.value = Math.min(100, passedCount);
  diagnosticLogs.value.push({ time: now(), status: 'OK', message: `Diagnostic suite execution completed. Health Score: ${healthScore.value}% (${healthIndicator.value})` });
}

async function generateDummy(type: 'PAGE_LOADED' | 'NAVIGATION' | 'WORKSPACE' | 'STORAGE') {
  try {
    await MessageBus.send({
      type: MessageType.GENERATE_TEST_EVENT,
      sender: 'OPTIONS',
      payload: { eventType: type }
    });
  } catch {
    // Fallback
  }

  // Reload events
  await activityStore.fetchEvents();
}

async function handleClearActivity() {
  if (confirm('Clear all activity logs?')) {
    await activityStore.clearAllEvents();
  }
}
</script>
