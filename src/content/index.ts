import { MessageBus } from '../services/messageBus';
import { MessageType, TabInfoPayload } from '../types/messages';
import { extractHostname } from '../utils/url';
import { Logger } from '../services/logger';

const MODULE = 'ContentScript';

/**
 * Non-Intrusive Target Telemetry Observer
 */
function initContentScript(): void {
  Logger.info(MODULE, 'Content Script injected and active on target page');

  // Notify background worker of content script injection
  MessageBus.send({
    type: MessageType.CONTENT_SCRIPT_CONNECTED,
    sender: 'CONTENT_SCRIPT',
    payload: {
      url: window.location.href,
      hostname: extractHostname(window.location.href),
      title: document.title || 'Untitled Page',
      timestamp: Date.now()
    }
  }).catch(() => {});

  let lastUrl = window.location.href;

  function notifyUrlChange(): void {
    const currentUrl = window.location.href;
    const currentHostname = extractHostname(currentUrl);
    const currentTitle = document.title || 'Untitled Page';

    const payload: TabInfoPayload = {
      url: currentUrl,
      hostname: currentHostname,
      title: currentTitle,
      timestamp: Date.now()
    };

    Logger.debug(MODULE, `Detected URL/Route change: ${currentHostname} (${currentUrl})`);

    MessageBus.send({
      type: MessageType.TAB_URL_CHANGED,
      sender: 'CONTENT_SCRIPT',
      payload
    }).catch((err) => {
      Logger.debug(MODULE, 'Error sending URL change event to background worker', err);
    });
  }

  // 1. Send initial tab info on load
  notifyUrlChange();

  // 2. Observe SPA Route Changes (History API interception)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    notifyUrlChange();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    notifyUrlChange();
  };

  window.addEventListener('popstate', () => notifyUrlChange());
  window.addEventListener('hashchange', () => notifyUrlChange());

  // 3. Document Title Observer
  const titleObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl || document.title) {
      lastUrl = window.location.href;
      notifyUrlChange();
    }
  });

  const titleEl = document.querySelector('title');
  if (titleEl) {
    titleObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
  }
}

// Execute Content Script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}
