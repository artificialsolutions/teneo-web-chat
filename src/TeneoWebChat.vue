<template>
  <div class="teneo-web-chat">
    <ChatWindow
      v-if="isChatOpen"
      :on-close="closeChat"
      :participants="participants"
      :title-image-url="titleImageUrl"
      :title="serviceName"
    />
    <LaunchButton :open="openChat" :close="closeChat" :is-open="isChatOpen" />
  </div>
</template>

<script>
import { PARTICIPANT_USER, PARTICIPANT_BOT, TITLE_IMAGE_URL } from './utils/constants.js';
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
  },
  data() {
    return {
      participants: [
        {
          id: PARTICIPANT_USER,
        },
        {
          id: PARTICIPANT_BOT,
        },
      ],
      titleImageUrl: TITLE_IMAGE_URL,
      isChatOpen: false,
    };
  },
  methods: {
    openChat() {
      this.isChatOpen = true;
    },
    closeChat() {
      this.isChatOpen = false;
    },
  },
};
</script>

<style scoped>
.teneo-web-chat {
  --light-fg-color: #ffffff;
  --dark-fg-color: #263238;
  --user-input-bg-color: #f4f7f9;
  --bot-message-fg-color: var(--dark-fg-color);
  --bot-message-bg-color: #eceff1;
  --user-message-bg-color: #4e8cff;
  --user-message-fg-color: var(--light-fg-color);
  --header-bg-color: var(--user-message-bg-color);

  width: 100%;
  height: 100%;
  padding: 10px;
  font-family: Helvetica, Arial;
}
</style>
