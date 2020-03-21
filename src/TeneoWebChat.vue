<template>
  <div class="teneo-web-chat">
    <ChatWindow
      v-if="isChatOpen"
      :on-close="closeChat"
      :title="serviceName"
      :image-url="imageUrl"
    />
    <LaunchButton :open="openChat" :close="closeChat" :is-open="isChatOpen" />
  </div>
</template>

<script>
import registerMessageComponents from './utils/register-message-components.js';
import ChatWindow from './components/ChatWindow.vue';
import LaunchButton from './components/LaunchButton.vue';

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
    serviceName: {
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
    };
  },
  methods: {
    openChat() {
      this.isChatOpen = true;
    },
    closeChat() {
      this.isChatOpen = false
      if(this.closeTieSessionOnExit === "true" || this.closeTieSessionOnExit === "yes" ){
          this.$teneoApi.closeSession()
      }
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
