<template>
  <div class="teneo-web-chat">
    <ChatWindow
      v-if="isChatOpen"
      :on-close="closeChat"
      :title-image-url="titleImageUrl"
      :title="serviceName"
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
      titleImageUrl:
        'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      isChatOpen: false,
    };
  },
  methods: {
    openChat() {
      this.isChatOpen = true;
    },
    closeChat() {
      this.isChatOpen = false
      if(this.closeTieSessionOnExit === "true" ){
          this.$teneoApi.closeSession()
      }
    },
  },
};
</script>

<style scoped>
.teneo-web-chat {
  --light-fg-color: #ffffff;
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
  --bot-message-fg-color: var(--dark-fg-color);
  --bot-message-bg-color: #eceff1;
  --user-message-bg-color: var(--primary-color);
  --user-message-fg-color: var(--light-fg-color);
  --header-bg-color: var(--user-message-bg-color);
  --quickreply-fg-color: var(--user-message-bg-color);
  --quickreply-bg-color: var(--light-fg-color);
  --quickreply-border-color: var(--user-message-bg-color);
  --quickreply-expired-color: var(--expired-color);
  --card-border-color: #ccc;
  --card-bg-color: var(--light-fg-color);
  --card-link-color: var(--text-link-color);
  --clickablelist-bg-color: var(--light-fg-color);
  --clickablelist-fg-color: var(--dark-fg-color);
  --clickablelist-selected-bg-color: var(--bot-message-bg-color);
  --clickablelist-selected-fg-color: var(--dark-fg-color);

  width: 100%;
  height: 100%;
  padding: 10px;
  font-family: Helvetica, Arial;
}
</style>
