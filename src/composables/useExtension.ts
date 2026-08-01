import { onMounted, onUnmounted } from 'vue';
import { useExtensionStore } from '../stores/extension';
import { storeToRefs } from 'pinia';

export function useExtension() {
  const store = useExtensionStore();
  const { version, configVersion, manifestVersion, appName, tagline, isDevMode, status, theme, currentTime } = storeToRefs(store);

  let timer: number | undefined;

  onMounted(() => {
    store.fetchStatus();
    timer = window.setInterval(() => {
      store.updateClock();
    }, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    version,
    configVersion,
    manifestVersion,
    appName,
    tagline,
    isDevMode,
    status,
    theme,
    currentTime,
    toggleDevMode: store.toggleDevMode,
    refreshStatus: store.fetchStatus
  };
}
