import { onMounted } from 'vue';
import { useBrowserStore } from '../stores/browser';
import { storeToRefs } from 'pinia';

export function useCurrentTab() {
  const store = useBrowserStore();
  const { browserName, currentTabId, currentUrl, currentDomain, currentTitle, activeWorkspace, activeMatchedPattern, workspacesList } = storeToRefs(store);

  onMounted(() => {
    store.loadActiveTab();
  });

  return {
    browserName,
    currentTabId,
    currentUrl,
    currentDomain,
    currentTitle,
    activeWorkspace,
    activeMatchedPattern,
    workspacesList,
    reloadTabInfo: store.loadActiveTab
  };
}
