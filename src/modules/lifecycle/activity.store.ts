import { defineStore } from 'pinia';
import { ActivityEvent, ActivityFilterOptions } from './activity.types';
import { ActivityService } from './activity.service';
import { MessageBus } from '../../services/messageBus';
import { MessageType } from '../../types/messages';

export const useActivityStore = defineStore('activity', {
  state: () => ({
    events: [] as ActivityEvent[],
    recentEvents: [] as ActivityEvent[],
    totalEventsCount: 0,
    isListening: false
  }),

  actions: {
    async fetchEvents(options?: ActivityFilterOptions) {
      // 1. If in Extension environment, query via MessageBus
      try {
        const response = await MessageBus.send<ActivityFilterOptions, ActivityEvent[]>({
          type: MessageType.GET_ACTIVITIES,
          sender: 'POPUP',
          payload: options
        });

        if (response.success && Array.isArray(response.data)) {
          this.events = response.data;
          this.recentEvents = response.data.slice(0, 10);
          this.totalEventsCount = response.data.length;
          return;
        }
      } catch {
        // Local fallback
      }

      // Local service fallback
      if (options) {
        this.events = ActivityService.filterEvents(options);
      } else {
        this.events = ActivityService.getAllEvents();
      }
      this.recentEvents = ActivityService.getRecentEvents(10);
      this.totalEventsCount = this.events.length;
    },

    async clearAllEvents() {
      try {
        await MessageBus.send({
          type: MessageType.CLEAR_ACTIVITIES,
          sender: 'OPTIONS'
        });
      } catch {
        // Fallback
      }

      ActivityService.clearEvents();
      this.events = [];
      this.recentEvents = [];
      this.totalEventsCount = 0;
    },

    addEventRealtime(event: ActivityEvent) {
      this.events.unshift(event);
      if (this.events.length > 500) {
        this.events.pop();
      }
      this.recentEvents = this.events.slice(0, 10);
      this.totalEventsCount = this.events.length;
    },

    setupRealtimeListener() {
      if (this.isListening) return;
      this.isListening = true;

      MessageBus.listen((message) => {
        if (message.type === MessageType.ACTIVITY_EVENT_LOGGED && message.payload) {
          this.addEventRealtime(message.payload as ActivityEvent);
        }
      });
    }
  }
});
