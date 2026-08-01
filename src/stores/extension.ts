import { defineStore } from 'pinia';
import { MessageBus } from '../services/messageBus';
import { MessageType, ExtensionStatusPayload } from '../types/messages';
import { ConfigurationService } from '../config';
import { formatCurrentTime } from '../utils/time';

export const useExtensionStore = defineStore('extension', {
  state: () => ({
    version: ConfigurationService.VERSION,
    configVersion: ConfigurationService.VERSION,
    manifestVersion: 3,
    appName: ConfigurationService.APP_NAME,
    tagline: ConfigurationService.APP_TAGLINE,
    isDevMode: true,
    status: 'Operational' as 'Operational' | 'Connecting' | 'Offline',
    theme: 'dark' as 'dark' | 'light',
    currentTime: formatCurrentTime(),
    lastUpdated: Date.now()
  }),

  actions: {
    updateClock() {
      this.currentTime = formatCurrentTime();
    },

    async fetchStatus() {
      try {
        const response = await MessageBus.send<null, ExtensionStatusPayload>({
          type: MessageType.GET_EXTENSION_STATUS,
          sender: 'POPUP'
        });

        if (response.success && response.data) {
          this.version = response.data.version;
          this.configVersion = response.data.configVersion || ConfigurationService.VERSION;
          this.manifestVersion = response.data.manifestVersion;
          this.isDevMode = response.data.isDevMode;
          this.status = 'Operational';
        }
      } catch {
        this.status = 'Offline';
      }
    },

    async toggleDevMode() {
      this.isDevMode = !this.isDevMode;
      await MessageBus.send({
        type: MessageType.TOGGLE_DEV_MODE,
        sender: 'POPUP',
        payload: { isDevMode: this.isDevMode }
      });
    }
  }
});
