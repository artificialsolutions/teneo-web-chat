<template>
  <div class="text-message" :class="messageSource">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-if="isBot" class="text-message__text" v-html="messageText"></p>
    <p v-else class="text-message__text">{{ messageText }}</p>
  </div>
</template>

<script>
import { PARTICIPANT_BOT } from '../../utils/constants.js';

export default {
  name: 'TextMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'text' &&
          message.data &&
          message.data.text
        );
      },
    },
  },
  computed: {
    messageText() {
      return this.message.data.text;
    },
    messageSource() {
      return this.message.author;
    },
    isBot() {
      return this.message.author === PARTICIPANT_BOT;
    },
  },
};
</script>

<style scoped>
.text-message {
  padding: 6px 18px;
  border-radius: 10px;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
}

.text-message__text {
  margin-top: 0.4em;
  margin-bottom: 0.4em;
  font-weight: 400;
}

.text-message.user {
  background: var(--user-message-bg-color);
  color: var(--user-message-fg-color);
  max-width: calc(100% - 120px);
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

.text-message.bot {
  color: var(--bot-message-fg-color);
  background-color: var(--bot-message-bg-color);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}
</style>
