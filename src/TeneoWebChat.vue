<template>
  <div class="teneo-web-chat">
    <ChatWindow
      v-if="isChatOpen"
      :messageList="messageList"
      :onClose="closeChat"
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :title="serviceName"
      :sendMessage="sendMessage"
    />
    <LaunchButton
      :open="openChat"
      :close="closeChat"
      :isOpen="isChatOpen"
      :newMessageCount="newMessageCount"
    />
  </div>
</template>

<script>
import { PARTICIPANT_USER, PARTICIPANT_BOT } from './utils/constants.js';
import parseTeneoResponse from './utils/parse-teneo-response.js';
import registerMessageComponents from './utils/register-message-components.js';
import ChatWindow from './components/ChatWindow.vue';
import LaunchButton from './components/LaunchButton.vue';

registerMessageComponents();

export default {
  name: 'app',
  components: {
    ChatWindow,
    LaunchButton,
  },
  props: {
    serviceName: {
      type: String,
      required: true,
    },
    teneoApi: {
      type: Object,
      required: true,
      validator: (value) =>
        value && value.sendInput && typeof value.sendInput === 'function',
    },
    messageListCache: {
      type: Object,
      required: true,
      validator: (value) =>
        value &&
        typeof value.get === 'function' &&
        typeof value.update === 'function',
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
      messageList: this.messageListCache.get(),
      newMessageCount: 0,
      isChatOpen: false,
    };
  },
  methods: {
    async sendMessage(message) {
      this.messageList = [...this.messageList, message];
      this.messageListCache.update(this.messageList);

      const response = await this.teneoApi.sendInput(null, {
        text: message.data.text,
      });

      const messages = parseTeneoResponse(response);

      messages.forEach((message) => {
        this.onMessageReceived(message);
      });
    },

    onMessageReceived(message) {
      if (!message) {
        return;
      }

      this.messageList = [...this.messageList, message];
      this.messageListCache.update(this.messageList);

      this.newMessagesCount = this.isChatOpen
        ? this.newMessagesCount
        : this.newMessagesCount + 1;
    },

    openChat() {
      this.isChatOpen = true;
      this.newMessagesCount = 0;
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
