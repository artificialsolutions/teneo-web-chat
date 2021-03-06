<template>
  <div id="teneo-web-chat" class="teneo-web-chat">
    <ChatWindow
        v-if="isChatOpen"
        id="twc-chat-window"
        :on-close="closeChat"
        :on-minimize="minimizeChat"
    />
    <LaunchButton v-if="!isChatOpen" :open="openChat" :is-open="isChatOpen" :is-minimized="isChatMinimized"/>
  </div>
</template>

<script>
import registerMessageComponents from './utils/register-message-components.js';
import ChatWindow from './components/ChatWindow.vue';
import LaunchButton from './components/LaunchButton.vue';
import { EventBus, events } from './utils/event-bus.js';
import handleExtension from './utils/handle-extension.js';
import basePayload from './utils/base-payload.js';
import {
  API_ON_OPEN_BUTTON_CLICK,
  API_ON_CLOSE_BUTTON_CLICK,
  API_ON_MINIMIZE_BUTTON_CLICK,
  API_ON_VISIBILITY_CHANGED,
  API_ON_RESET
} from './utils/api-function-names.js';
import {
  API_KEY_VISIBILITY,
  API_STATE_MAXIMIZED,
  API_STATE_MINIMIZED,
  DEFAULT_TITLE,
  SESSION_ID_STORAGE_KEY
} from './utils/constants.js';
import detectSafari from './utils/detect-safari.js';

registerMessageComponents();

// SAFARI IOS ADAPTATIONS
import detectIosSafari from './utils/detect-ios-safari';

const bodyScrollLock = require('body-scroll-lock');
const { disableBodyScroll } = bodyScrollLock;
const { enableBodyScroll } = bodyScrollLock;
const messageListId = '#twc-message-list';

// Detect safari (not just iOS) so we can clear session id from storage in closeSession
const isSafari = detectSafari();
const sessionKey = SESSION_ID_STORAGE_KEY;


export default {
  name: 'TeneoWebChat',
  components: {
    ChatWindow,
    LaunchButton,
  },
  data() {
    return {
      isChatOpen: false,
      isChatMinimized: false,
      isIosSafari: false
    };
  },
  mounted() {
    this.isIosSafari = detectIosSafari();

    // Set the name of the hidden property and the change event for visibility
    let hidden,
        visibilityChange;

    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }

    if (this.isIosSafari === true) {
      // Warn if the browser doesn't support addEventListener or the Page Visibility API
      if ((typeof document.addEventListener === 'undefined' || hidden === undefined)) {
        // Console.log("This application requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
      } else {
        // Handle page visibility change
        document.addEventListener(visibilityChange, this.handleBrowserMinimize, false);
      }
    }


    EventBus.$on(events.RESET_SESSION, () => {
      this.resetChat();
    });
    EventBus.$on(events.CLOSE_WINDOW, () => {
      this.closeChat();
    });
    EventBus.$on(events.END_SESSION, () => {
      this.closeSession();
    });

    EventBus.$on(events.CLEAR_HISTORY, () => {
      this.clearHistory();
    });

    EventBus.$on(events.MAXIMIZE_WINDOW, async () => {
      await this.maximize();
    });

    EventBus.$on(events.MINIMIZE_WINDOW, () => {
      this.minimize();
    });

    EventBus.$on(events.ADD_MESSAGE, async (message) => {
      this._onMessageReceived(message);
    });

    EventBus.$on(events.SEND_INPUT, (text, parameters, isSilent) => {
      this.sendBaseMessage(text, parameters, isSilent);
    });

    EventBus.$on(events.HIDE_TYPING_INDICATOR, (data) => {
      this.$teneoApi.hideTypingIndicator(data);
    });

    EventBus.$on(events.SHOW_TYPING_INDICATOR, (data) => {
      this.$teneoApi.showTypingIndicator(data);
    });

    EventBus.$emit(events.API_STATE_READY);
  },
  methods: {
    // Encapsulating dependency methods makes Testing easier
    async _onMessageReceived(message) {
            await this.$teneoApi._onMessageReceived(message);
    },
    sendBaseMessage(text, parameters, isSilent) {
      this.$teneoApi.sendBaseMessage(text, parameters, isSilent);
    },
    changeWindowState(chatWindowTargetState) {
      if (chatWindowTargetState === events.CLOSE_WINDOW) {
        this.resetChat();
      }
      if (chatWindowTargetState === events.MINIMIZE_WINDOW) {
        this.minimize();
      }
      if (chatWindowTargetState === events.MAXIMIZE_WINDOW) {
        this.maximize();
      }
    },
    async openChat() {
      // Add handledState to payload
      const payload = basePayload();

      // Check for extension
      await handleExtension(API_ON_OPEN_BUTTON_CLICK, payload);

      // Proceed if extension does not handle function itself
      if (!payload.handledState.handled === true) {
        this.changeWindowState(events.MAXIMIZE_WINDOW);
      }

    },
    async minimizeChat() {

      // Add handledState to payload
      const payload = basePayload();

      // Check for extension
      await handleExtension(API_ON_MINIMIZE_BUTTON_CLICK, payload);

      // Proceed if extension does not handle function itself
      if (!payload.handledState.handled === true) {
        this.changeWindowState(events.MINIMIZE_WINDOW);
      }
    },
    async closeChat() {
      const chatWindowTargetState = events.CLOSE_WINDOW;
      // Add handledState to payload
      const payload = basePayload();

      // Check for extension
      await handleExtension(API_ON_CLOSE_BUTTON_CLICK, payload);

      // Proceed if extension does not handle function itself
      if (!payload.handledState.handled === true) {
        this.changeWindowState(events.CLOSE_WINDOW);
      }
    },
    async minimize() {
      if (this.$store.getters.visibility == API_STATE_MAXIMIZED) {
        this.$store.commit('visibility', API_STATE_MINIMIZED);
        this.isChatOpen = false;
        this.isChatMinimized = true;

        if (this.isIosSafari) {
          const targetElement = document.querySelector(messageListId);

          enableBodyScroll(targetElement);
        }

        await this.apiOnVisibilityChange();
      }
    },
    async maximize() {
      if (this.$store.getters.visibility == API_STATE_MINIMIZED) {
        this.$store.commit('visibility', API_STATE_MAXIMIZED);
        this.isChatOpen = true;
        this.isChatMinimized = false;
        await this.apiOnVisibilityChange();

        if (this.isIosSafari) {
          const targetElement = document.querySelector(messageListId);

          disableBodyScroll(targetElement);
        }

      }
    },
    async resetChat() {
      // Add handledState to payload
      const payload = basePayload();

      // Check for extension
      await handleExtension(API_ON_RESET, payload);

      // Proceed if extension does not handle function itself
      if (!payload.handledState.handled === true) {
        this.minimize();
        this.closeSession();
        this.clearHistory();
        this.isChatMinimized = false;
        this.isChatClosed = true;
      }
    },
    clearHistory() {
      this.$teneoApi.clearHistory();
    },
    closeSession() {
      this.$teneoApi.closeSession();

      /*
       * When opened in Safari, we explicitly store the session id in the browser storage
       * it's a bit cleaner to delete it again when the engine session is closed
       */
      if (isSafari) {
        this.$store.getters.storage.removeItem(sessionKey);
      }
    },
    setWindowTitle(newTitle) {
      this.serviceName = newTitle;
    },
    async apiOnVisibilityChange() {
      const data = {};

      data[API_KEY_VISIBILITY] = this.$store.getters.visibility;
      await handleExtension(API_ON_VISIBILITY_CHANGED, data);
    },
    async handleBrowserMinimize() {
      // Console.log('handleBrowserMinimize: '+document.hidden)
      await this.minimize();
    }
  },
};
</script>

<style scoped>
.teneo-web-chat {
  --light-fg-color: #ffffff;
  --light-bg-color: #eceff1;
  --light-border-color: #c9c9c9;
  --dark-fg-color: #263238;
  --dark-bg-color: #7b7b7b;
  --primary-color: #4e8cff;
  --secondary-color: #6c757d;
  --danger-color: #dc3545;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --warning-fg-text-color: #d19d00;
  --info-color: #17a2b8;
  --expired-color: #a9a9a9;
  --text-link-color: #007bff;
  --user-input-bg-color: #f4f7f9;
  --user-input-fg-color: #565867;
  --spinner-color: var(--light-border-color);
  --sendicon-fg-color: var(--dark-fg-color);
  --uploadicon-fg-color: var(--dark-fg-color);
  --asricon-fg-color: var(--dark-fg-color);
  --ttsicon-fg-color: var(--dark-fg-color);
  --asricon-active-color: var(--danger-color);
  --ttsicon-active-color: var(--danger-color);
  --launch-button-bg-color: var(--primary-color);
  --launchicon-fg-color: var(--light-fg-color);
  --callout-fg-color: var(--user-input-fg-color);
  --callout-bg-color: var(--light-fg-color);
  --callout-close-button-fg-color: var(--secondary-color);
  --header-bg-color: var(--primary-color);
  --header-fg-color: var(--light-fg-color);
  --chat-window-bg-color: #ffffff;
  --bot-message-fg-color: var(--dark-fg-color);
  --bot-message-bg-color: var(--light-bg-color);
  --agent-message-fg-color: var(--light-fg-color);
  --agent-message-bg-color: #47b2fd;
  --user-message-fg-color: var(--light-fg-color);
  --user-message-bg-color: var(--primary-color);
  --bot-typing-indicator-fg-color: var(--secondary-color);
  --bot-typing-indicator-bg-color: var(--bot-message-bg-color);
  --agent-typing-indicator-fg-color: var(--agent-message-fg-color);
  --agent-typing-indicator-bg-color: var(--agent-message-bg-color);
  --user-typing-indicator-fg-color: var(--user-message-fg-color);
  --user-typing-indicator-bg-color: var(--user-message-bg-color);
  --buttons-title-color: var(--dark-fg-color);
  --button-fg-color: var(--light-fg-color);
  --button-bg-color: var(--primary-color);
  --card-bg-color: var(--light-fg-color);
  --card-link-color: var(--text-link-color);
  --link-button-fg-color: var(--text-link-color);
  --link-button-bg-color: var(--light-fg-color);
  --link-button-border-color: var(--light-border-color);
  --clickablelist-title-color: var(--dark-fg-color);
  --clickablelist-bg-color: var(--light-fg-color);
  --clickablelist-fg-color: var(--dark-fg-color);
  --clickablelist-selected-bg-color: var(--bot-message-bg-color);
  --clickablelist-selected-fg-color: var(--dark-fg-color);
  --quickreply-fg-color: var(--primary-color);
  --quickreply-bg-color: var(--light-fg-color);
  --quickreply-border-color: var(--primary-color);
  --quickreply-expired-color: var(--expired-color);
  --lightbox-overlay-color: rgba(0, 0, 0, 0.8);
  --lightbox-image-background-color: #ffffff;
  --modal-overlay-color: rgba(0, 0, 0, 0.5);
  --carousel-ctrl-panel-bg-color: var(--primary-color);
  --carousel-ctrl-panel-fg-color: var(--light-fg-color);
  --carousel-ctrl-panel-active-color: var(--secondary-color);
  --carousel-ctrl-panel-disabled-color: var(--expired-color);
  --link-preview-background-color: var(--light-bg-color);
  --link-preview-text-color: var(--dark-fg-color);
  --link-preview-image-background-color: var(--dark-bg-color);

  --primary-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;

}

@supports (-webkit-touch-callout: none) {
  /* CSS specific to iOS devices */
  .teneo-web-chat {
    font: -apple-system-body;
  }
}
</style>
