import { ExtensionMessage, MessageResponse } from '../types';
import { Logger } from './logger';

export class MessageBus {
  private static MODULE = 'MessageBus';

  /**
   * Send typed message to Chrome extension runtime background worker or popup
   */
  public static async send<T = unknown, R = unknown>(message: ExtensionMessage<T>): Promise<MessageResponse<R>> {
    return new Promise((resolve) => {
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        Logger.warn(this.MODULE, 'Chrome runtime API unavailable');
        resolve({ success: false, error: 'Chrome runtime unavailable' });
        return;
      }

      chrome.runtime.sendMessage(message, (response: MessageResponse<R>) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          Logger.debug(this.MODULE, `Send message warning: ${lastError.message}`);
          resolve({ success: false, error: lastError.message });
        } else {
          resolve(response || { success: true });
        }
      });
    });
  }

  /**
   * Listen to incoming extension messages
   */
  public static listen<T = unknown>(
    handler: (
      message: ExtensionMessage<T>,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: MessageResponse) => void
    ) => boolean | void
  ): void {
    if (typeof chrome === 'undefined' || !chrome.runtime?.onMessage) {
      return;
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      try {
        return handler(message as ExtensionMessage<T>, sender, sendResponse);
      } catch (err) {
        Logger.error(this.MODULE, 'Error handling runtime message', err);
        sendResponse({ success: false, error: String(err) });
        return false;
      }
    });
  }
}
