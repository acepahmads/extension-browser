<template>
  <div class="space-y-6 max-w-5xl">
    <!-- Top Header & Actions Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold text-slate-100 flex items-center gap-2">
          Workspace Registry
          <span class="text-xs px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/30 font-mono">
            {{ filteredWorkspaces.length }} Registered
          </span>
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Enterprise Workspace Registry & Wildcard Match Pattern Management
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-3.5 py-2 rounded-md bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Workspace
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <div class="p-3.5 rounded-lg bg-dark-surface border border-dark-border grid grid-cols-1 sm:grid-cols-4 gap-3">
      <!-- Search Input -->
      <div class="sm:col-span-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Name, Application, URL or Tag..."
          class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
        />
      </div>

      <!-- Environment Filter -->
      <div>
        <select
          v-model="selectedEnv"
          class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
        >
          <option value="all">All Environments</option>
          <option value="development">Development</option>
          <option value="staging">Staging</option>
          <option value="uat">UAT</option>
          <option value="production">Production</option>
          <option value="demo">Demo</option>
          <option value="testing">Testing</option>
        </select>
      </div>

      <!-- Status Filter -->
      <div>
        <select
          v-model="selectedStatus"
          class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="enabled">Enabled Only</option>
          <option value="disabled">Disabled Only</option>
        </select>
      </div>
    </div>

    <!-- Workspace Cards Grid -->
    <div class="space-y-3">
      <div
        v-for="ws in filteredWorkspaces"
        :key="ws.id"
        class="p-4 rounded-lg bg-dark-surface border border-dark-border hover:border-brand-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
        :class="{ 'opacity-60 bg-dark-surface/50': !ws.enabled }"
      >
        <!-- Left Workspace Meta -->
        <div class="space-y-2 flex-1">
          <div class="flex items-center gap-3">
            <span class="text-2xl p-2 rounded-lg bg-dark-bg border border-dark-border">
              {{ ws.icon || '🏛️' }}
            </span>

            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-mono px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-slate-300 font-semibold">
                  {{ ws.application }}
                </span>
                <h3 class="text-sm font-semibold text-slate-100">{{ ws.name }}</h3>

                <!-- Environment Badge -->
                <span
                  class="px-2 py-0.5 text-[10px] font-medium font-mono rounded border uppercase"
                  :class="EnvironmentRegistry.getBadgeClass(ws.environment)"
                >
                  {{ ws.environment }}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1">{{ ws.description || 'No description provided' }}</p>
            </div>
          </div>

          <!-- Tags & Match Pattern Summary -->
          <div class="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
            <span class="font-mono text-slate-300 flex items-center gap-1">
              <span class="text-slate-500">Base:</span> {{ ws.baseUrl }}
            </span>

            <span class="font-mono text-brand-300 flex items-center gap-1 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/20">
              ⚡ {{ ws.matchPatterns.length }} Match {{ ws.matchPatterns.length === 1 ? 'Pattern' : 'Patterns' }}
            </span>

            <div class="flex items-center gap-1">
              <span v-for="tag in ws.tags" :key="tag" class="text-[10px] px-1.5 py-0.5 rounded bg-dark-card border border-dark-border text-slate-400">
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <!-- Toggle Switch -->
          <button
            @click="toggleEnabled(ws.id)"
            class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="ws.enabled ? 'bg-brand-600' : 'bg-slate-700'"
            :title="ws.enabled ? 'Disable Workspace' : 'Enable Workspace'"
          >
            <span
              class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="ws.enabled ? 'translate-x-4' : 'translate-x-0'"
            />
          </button>

          <!-- Detail & Manage Patterns Button -->
          <button
            @click="openDetailModal(ws)"
            class="px-3 py-1.5 rounded text-xs font-medium bg-brand-950/80 hover:bg-brand-900 text-brand-300 border border-brand-500/30 transition-all flex items-center gap-1"
          >
            ⚙️ Manage Details
          </button>

          <!-- Delete Button -->
          <button
            @click="confirmDelete(ws)"
            class="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition-colors"
            title="Delete Workspace"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="filteredWorkspaces.length === 0" class="p-8 text-center bg-dark-surface border border-dark-border rounded-lg text-slate-400">
        No workspaces matched your query.
      </div>
    </div>

    <!-- Workspace Detail & Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-dark-surface border border-dark-border rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl my-8">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-dark-border pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold">{{ activeWorkspaceForm.icon || '🏛️' }}</span>
            <h3 class="text-base font-semibold text-slate-100">
              {{ isEditing ? `Manage Workspace: ${activeWorkspaceForm.name}` : 'Create New Workspace' }}
            </h3>
          </div>
          <button @click="closeModal" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <!-- Sub Tabs Header -->
        <div class="flex border-b border-dark-border gap-2 text-xs font-medium">
          <button
            @click="activeSubTab = 'general'"
            class="px-3 py-1.5 border-b-2 transition-colors"
            :class="activeSubTab === 'general' ? 'border-brand-500 text-brand-300 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'"
          >
            General Settings
          </button>
          <button
            v-if="isEditing"
            @click="activeSubTab = 'patterns'"
            class="px-3 py-1.5 border-b-2 transition-colors flex items-center gap-1"
            :class="activeSubTab === 'patterns' ? 'border-brand-500 text-brand-300 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'"
          >
            Match Patterns ({{ activeWorkspaceForm.matchPatterns.length }})
          </button>
          <button
            @click="activeSubTab = 'tags'"
            class="px-3 py-1.5 border-b-2 transition-colors"
            :class="activeSubTab === 'tags' ? 'border-brand-500 text-brand-300 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'"
          >
            Tags
          </button>
          <button
            v-if="isEditing"
            @click="activeSubTab = 'info'"
            class="px-3 py-1.5 border-b-2 transition-colors"
            :class="activeSubTab === 'info' ? 'border-brand-500 text-brand-300 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'"
          >
            Information
          </button>
        </div>

        <!-- Sub Tab 1: General Settings -->
        <form v-if="activeSubTab === 'general'" @submit.prevent="saveWorkspace" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Application Identity *</label>
              <input
                v-model="activeWorkspaceForm.application"
                type="text"
                required
                placeholder="e.g. BGN Simulator, SIPGN"
                class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Workspace Name *</label>
              <input
                v-model="activeWorkspaceForm.name"
                type="text"
                required
                placeholder="e.g. Development, Production"
                class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <input
              v-model="activeWorkspaceForm.description"
              type="text"
              placeholder="e.g. BGN Portal Development Workspace"
              class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Environment *</label>
              <select
                v-model="activeWorkspaceForm.environment"
                class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="development">development</option>
                <option value="staging">staging</option>
                <option value="uat">uat</option>
                <option value="production">production</option>
                <option value="demo">demo</option>
                <option value="testing">testing</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Icon Symbol</label>
              <select
                v-model="activeWorkspaceForm.icon"
                class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="⚡">⚡ Lightning (Dev)</option>
                <option value="🏛️">🏛️ Portal / Govt (SIPGN)</option>
                <option value="💻">💻 Local Workstation</option>
                <option value="🌐">🌐 Web App</option>
                <option value="🚀">🚀 Production</option>
                <option value="🧪">🧪 Testing / Staging</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Base URL *</label>
            <input
              v-model="activeWorkspaceForm.baseUrl"
              type="text"
              required
              placeholder="e.g. http://localhost:5173"
              class="w-full px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 font-mono focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div class="flex items-center gap-2 pt-2">
            <input
              v-model="activeWorkspaceForm.enabled"
              type="checkbox"
              id="ws-enabled"
              class="rounded border-dark-border text-brand-600 focus:ring-brand-500"
            />
            <label for="ws-enabled" class="text-xs text-slate-300">Enable this Workspace</label>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-dark-border">
            <button
              type="button"
              @click="closeModal"
              class="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 bg-dark-card border border-dark-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 rounded text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20"
            >
              {{ isEditing ? 'Save Changes' : 'Create Workspace' }}
            </button>
          </div>
        </form>

        <!-- Sub Tab 2: Match Patterns Manager -->
        <div v-else-if="activeSubTab === 'patterns'" class="space-y-4">
          <!-- Add New Pattern Form -->
          <form @submit.prevent="handleCreatePattern" class="p-3 rounded bg-dark-bg border border-dark-border space-y-2">
            <span class="text-xs font-semibold text-slate-200 block">Add New Match Pattern</span>
            <div class="grid grid-cols-12 gap-2">
              <input
                v-model="newPatternForm.pattern"
                type="text"
                required
                placeholder="e.g. http://localhost:5173/*"
                class="col-span-8 px-2.5 py-1 text-xs bg-dark-surface border border-dark-border rounded text-brand-300 font-mono focus:border-brand-500 focus:outline-none"
              />
              <input
                v-model.number="newPatternForm.priority"
                type="number"
                required
                placeholder="Priority"
                title="Pattern Priority (higher number = higher precedence)"
                class="col-span-2 px-2 py-1 text-xs bg-dark-surface border border-dark-border rounded text-slate-100 font-mono focus:border-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                class="col-span-2 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded text-xs font-semibold"
              >
                + Add
              </button>
            </div>
            <span class="text-[10px] text-slate-500">Higher priority numbers are matched first by Workspace Resolver.</span>
          </form>

          <!-- Existing Match Patterns List -->
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="mp in activeWorkspaceForm.matchPatterns"
              :key="mp.id"
              class="p-2.5 rounded bg-dark-card border border-dark-border flex items-center justify-between gap-3 text-xs"
            >
              <div class="flex items-center gap-2 flex-1">
                <span class="font-mono text-brand-300 font-medium truncate">{{ mp.pattern }}</span>
                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border text-slate-400">
                  Priority: {{ mp.priority }}
                </span>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  @click="togglePatternEnabled(mp)"
                  class="px-2 py-0.5 text-[10px] rounded border"
                  :class="mp.enabled ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-500'"
                >
                  {{ mp.enabled ? 'Active' : 'Disabled' }}
                </button>
                <button
                  @click="handleDeletePattern(mp.id)"
                  class="text-rose-400 hover:text-rose-300 px-1"
                  title="Remove Pattern"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sub Tab 3: Tags Manager -->
        <div v-else-if="activeSubTab === 'tags'" class="space-y-3">
          <div class="flex items-center gap-2">
            <input
              v-model="newTagInput"
              type="text"
              placeholder="Enter new tag..."
              @keyup.enter="addTag"
              class="flex-1 px-3 py-1.5 text-xs bg-dark-bg border border-dark-border rounded text-slate-100 focus:border-brand-500 focus:outline-none"
            />
            <button
              @click="addTag"
              type="button"
              class="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded text-xs font-semibold"
            >
              Add Tag
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5 p-3 bg-dark-bg rounded border border-dark-border">
            <span
              v-for="tag in activeWorkspaceForm.tags"
              :key="tag"
              class="px-2.5 py-1 rounded bg-dark-card border border-dark-border text-xs text-slate-200 flex items-center gap-1.5"
            >
              #{{ tag }}
              <button @click="removeTag(tag)" class="text-slate-400 hover:text-rose-400">✕</button>
            </span>
            <span v-if="activeWorkspaceForm.tags.length === 0" class="text-xs text-slate-500">No tags added.</span>
          </div>
        </div>

        <!-- Sub Tab 4: Information -->
        <div v-else-if="activeSubTab === 'info'" class="p-4 bg-dark-bg rounded border border-dark-border space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <span class="text-slate-500 block">Workspace ID</span>
              <span class="font-mono text-slate-200 break-all">{{ editingId }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Schema Version</span>
              <span class="font-mono text-brand-300">{{ activeWorkspaceForm.version || '1.0.0' }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Created At</span>
              <span class="font-mono text-slate-300">{{ new Date(activeWorkspaceForm.createdAt || Date.now()).toLocaleString() }}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Last Updated</span>
              <span class="font-mono text-slate-300">{{ new Date(activeWorkspaceForm.updatedAt || Date.now()).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBrowserStore } from '../stores/browser';
import { storeToRefs } from 'pinia';
import { Workspace, MatchPattern } from '../config/interfaces';
import { EnvironmentType } from '../config/types';
import { EnvironmentRegistry } from '../config/environment.registry';

const browserStore = useBrowserStore();
const { workspacesList } = storeToRefs(browserStore);

const searchQuery = ref('');
const selectedEnv = ref<string>('all');
const selectedStatus = ref<string>('all');

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const activeSubTab = ref<'general' | 'patterns' | 'tags' | 'info'>('general');

const newTagInput = ref('');
const newPatternForm = ref({ pattern: '', priority: 10 });

const activeWorkspaceForm = ref<{
  application: string;
  name: string;
  description: string;
  environment: EnvironmentType;
  baseUrl: string;
  icon: string;
  color: string;
  enabled: boolean;
  tags: string[];
  matchPatterns: MatchPattern[];
  version?: string;
  createdAt?: number;
  updatedAt?: number;
}>({
  application: '',
  name: '',
  description: '',
  environment: 'development',
  baseUrl: '',
  icon: '⚡',
  color: '#3b82f6',
  enabled: true,
  tags: [],
  matchPatterns: []
});

onMounted(() => {
  browserStore.loadWorkspaces();
});

const filteredWorkspaces = computed(() => {
  return workspacesList.value.filter((ws) => {
    // 1. Text search query
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q ||
      ws.name.toLowerCase().includes(q) ||
      ws.application.toLowerCase().includes(q) ||
      ws.baseUrl.toLowerCase().includes(q) ||
      ws.tags.some((t) => t.toLowerCase().includes(q)) ||
      ws.matchPatterns.some((mp) => mp.pattern.toLowerCase().includes(q));

    // 2. Environment filter
    const matchesEnv = selectedEnv.value === 'all' || ws.environment === selectedEnv.value;

    // 3. Status filter
    const matchesStatus =
      selectedStatus.value === 'all' ||
      (selectedStatus.value === 'enabled' && ws.enabled) ||
      (selectedStatus.value === 'disabled' && !ws.enabled);

    return matchesSearch && matchesEnv && matchesStatus;
  });
});

function openCreateModal() {
  isEditing.value = false;
  editingId.value = null;
  activeSubTab.value = 'general';
  activeWorkspaceForm.value = {
    application: 'BGN Simulator',
    name: 'Development',
    description: 'Development environment workspace',
    environment: 'development',
    baseUrl: 'http://localhost:5173',
    icon: '⚡',
    color: '#3b82f6',
    enabled: true,
    tags: ['Development'],
    matchPatterns: [
      { id: 'mp_init_1', pattern: 'http://localhost:5173/*', enabled: true, priority: 10 }
    ]
  };
  showModal.value = true;
}

function openDetailModal(ws: Workspace) {
  isEditing.value = true;
  editingId.value = ws.id;
  activeSubTab.value = 'general';
  activeWorkspaceForm.value = {
    application: ws.application,
    name: ws.name,
    description: ws.description,
    environment: ws.environment,
    baseUrl: ws.baseUrl,
    icon: ws.icon || '🏛️',
    color: ws.color || '#3b82f6',
    enabled: ws.enabled,
    tags: [...ws.tags],
    matchPatterns: JSON.parse(JSON.stringify(ws.matchPatterns)),
    version: ws.version,
    createdAt: ws.createdAt,
    updatedAt: ws.updatedAt
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveWorkspace() {
  if (isEditing.value && editingId.value) {
    await browserStore.updateWorkspace(editingId.value, activeWorkspaceForm.value);
  } else {
    await browserStore.createWorkspace(activeWorkspaceForm.value);
  }
  closeModal();
}

async function toggleEnabled(id: string) {
  await browserStore.toggleWorkspaceEnabled(id);
}

async function confirmDelete(ws: Workspace) {
  if (confirm(`Are you sure you want to delete workspace "${ws.application} - ${ws.name}"?`)) {
    await browserStore.deleteWorkspace(ws.id);
  }
}

// Match Pattern Actions inside Modal
async function handleCreatePattern() {
  if (!newPatternForm.value.pattern) return;

  if (isEditing.value && editingId.value) {
    await browserStore.addMatchPattern(editingId.value, {
      pattern: newPatternForm.value.pattern,
      enabled: true,
      priority: newPatternForm.value.priority
    });
    const ws = await browserStore.workspacesList.find((w) => w.id === editingId.value);
    if (ws) activeWorkspaceForm.value.matchPatterns = JSON.parse(JSON.stringify(ws.matchPatterns));
  } else {
    activeWorkspaceForm.value.matchPatterns.push({
      id: `mp_temp_${Date.now()}`,
      pattern: newPatternForm.value.pattern,
      enabled: true,
      priority: newPatternForm.value.priority
    });
  }
  newPatternForm.value.pattern = '';
}

async function togglePatternEnabled(mp: MatchPattern) {
  mp.enabled = !mp.enabled;
  if (isEditing.value && editingId.value) {
    await browserStore.updateMatchPattern(editingId.value, mp.id, { enabled: mp.enabled });
  }
}

async function handleDeletePattern(patternId: string) {
  if (isEditing.value && editingId.value) {
    await browserStore.deleteMatchPattern(editingId.value, patternId);
    const ws = await browserStore.workspacesList.find((w) => w.id === editingId.value);
    if (ws) activeWorkspaceForm.value.matchPatterns = JSON.parse(JSON.stringify(ws.matchPatterns));
  } else {
    activeWorkspaceForm.value.matchPatterns = activeWorkspaceForm.value.matchPatterns.filter(
      (m) => m.id !== patternId
    );
  }
}

// Tag Management
function addTag() {
  const tag = newTagInput.value.trim();
  if (tag && !activeWorkspaceForm.value.tags.includes(tag)) {
    activeWorkspaceForm.value.tags.push(tag);
    newTagInput.value = '';
  }
}

function removeTag(tag: string) {
  activeWorkspaceForm.value.tags = activeWorkspaceForm.value.tags.filter((t) => t !== tag);
}
</script>
