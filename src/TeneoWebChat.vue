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
import { PARTICIPANT_USER, PARTICIPANT_BOT } from './utils/constants.js';
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
          name: 'Me',
          imageUrl:
            'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4',
        },
        {
          id: PARTICIPANT_BOT,
          name: this.serviceName,
          imageUrl:
            'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4',
        },
      ],
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
      this.isChatOpen = false;
    },
  },
};
</script>

<style scoped>
.teneo-web-chat {
  width: 100%;
  height: 100%;
  padding: 10px;
  font-family: Helvetica, Arial;
}

pre {
  text-align: center;
}

h1 {
  text-align: center;
}

.teneo-web-chat__arrow {
  transform: rotate(45deg);
  font-size: 10em;
}
</style>
