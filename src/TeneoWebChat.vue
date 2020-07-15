<template>
  <div class="teneo-web-chat">
    <ChatWindow
      v-if="isChatOpen"
      :on-close="closeChat"
      :title="serviceName ? serviceName : 'Teneo Web Chat'"
      :image-url="imageUrl"
    />
    <LaunchButton :open="openChat" :close="closeChat" :is-open="isChatOpen" />
  </div>
</template>

<script>
import registerMessageComponents from './utils/register-message-components.js';
import ChatWindow from './components/ChatWindow.vue';
import LaunchButton from './components/LaunchButton.vue';
import { EventBus, events } from './utils/event-bus.js';
import handleExtension from './utils/handle-extension.js';
import { API_ON_OPEN_BUTTON_CLICK, API_ON_CLOSE_BUTTON_CLICK } from './utils/constants.js';
registerMessageComponents();

export default {
  name: 'TeneoWebChat',
  components: {
    ChatWindow,
    LaunchButton,
  },
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    closeTieSessionOnExit: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      isChatOpen: false,
      serviceName: 'Teneo Web Chat',
    };
  },
  mounted() {
      EventBus.$on(events.RESET_SESSION, () => {
        this.minimize()
        this.clearHistory()
        this.closeSession()
      });

      EventBus.$on(events.END_SESSION, () => {
        this.closeSession()
      });

      EventBus.$on(events.CLEAR_HISTORY, () => {
        this.clearHistory()
      });

      EventBus.$on(events.MAXIMIZE_WINDOW, () => {
        this.maximize();
      });

      EventBus.$on(events.MINIMIZE_WINDOW, () => {
        this.minimize();
      });

      EventBus.$on(events.ADD_MESSAGE, (message) => {
        this.$teneoApi._onMessageReceived(message);
      });

      EventBus.$on(events.SEND_INPUT, (text,parameters,isSilent) => {
        this.$teneoApi.sendBaseMessage(text,parameters,isSilent);
      });

      EventBus.$on(events.SET_WINDOW_TITLE, (newTitle) => {
        this.setWindowTitle(newTitle);
      });

      EventBus.$emit(events.API_STATE_READY);

    },
  methods: {
    async openChat() {  //same as maximize

      var chatWindowTargetState = "maximize";
      chatWindowTargetState = await handleExtension(API_ON_OPEN_BUTTON_CLICK, chatWindowTargetState);
      if (chatWindowTargetState === "maximize") {
        this.maximize();
      } else {
        this.minimize();
      }
    },
    minimize(){
      this.isChatOpen = false
      //Update 'state' and , call 'onVisibilityChanged (if available)'
      EventBus.$emit(events.API_STATE_MINIMIZED);
    },
    maximize(){
      this.isChatOpen = true
      //Update 'state' and , call 'onVisibilityChanged (if available)'
      EventBus.$emit(events.API_STATE_MAXIMIZED);
    },
    clearHistory() {
      this.$teneoApi.clearHistory()
    },
    closeSession() {
      this.$teneoApi.closeSession()
    },
    async closeChat() { //minimizes and (possibly) resets the chat

      var chatWindowTargetState = "minimize"
      chatWindowTargetState = await handleExtension(API_ON_CLOSE_BUTTON_CLICK, chatWindowTargetState);
      if (chatWindowTargetState === "minimize") {
        this.minimize()
        if(this.closeTieSessionOnExit === "true" || this.closeTieSessionOnExit === "yes" ){
          this.closeSession()
          this.clearHistory()
        }
      } else {
        this.maximize()
      }
    },
    setWindowTitle(newTitle) { 
      this.serviceName = newTitle
    },
  },
};
</script>

<style scoped>
.teneo-web-chat {
  --light-fg-color: #ffffff;
  --light-bg-color: #eceff1;
  --light-border-color: #c9c9c9;
  --dark-fg-color: #263238;
  --primary-color: #4e8cff;
  --secondary-color: #6c757d;
  --danger-color: #dc3545;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --expired-color: #a9a9a9;
  --text-link-color: #007bff;
  --user-input-bg-color: #f4f7f9;
  --sendicon-fg-color: var(--dark-fg-color);
  --launchicon-bg-color: var(--light-fg-color);
  --launchicon-bg-color: var(--primary-color);
  --header-bg-color: var(--primary-color);
  --header-fg-color: var(--light-fg-color);
  --bot-message-fg-color: var(--dark-fg-color);
  --bot-message-bg-color: var(--light-bg-color);
  --user-message-bg-color: var(--primary-color);
  --user-message-fg-color: var(--light-fg-color);
  --buttons-title-color: var(--dark-fg-color);
  --button-fg-color: var(--light-fg-color);
  --button-bg-color: var(--primary-color);
  --card-bg-color: var(--light-fg-color);
  --card-link-color: var(--text-link-color);
  --clickablelist-title-color: var(--dark-fg-color);
  --clickablelist-bg-color: var(--light-fg-color);
  --clickablelist-fg-color: var(--dark-fg-color);
  --clickablelist-selected-bg-color: var(--bot-message-bg-color);
  --clickablelist-selected-fg-color: var(--dark-fg-color);
  --quickreply-fg-color: var(--primary-color);
  --quickreply-bg-color: var(--light-fg-color);
  --quickreply-border-color: var(--primary-color);
  --quickreply-expired-color: var(--expired-color);

  width: 100%;
  height: 100%;
  padding: 10px;
  font-family: Helvetica, Arial;
}
</style>
