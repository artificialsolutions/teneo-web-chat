<template>
  <div class="text-message" :class="messageSource">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-if="isBot" class="text-message__text" v-html="sanitizedHtmlText"></p>
    <p v-else class="text-message__text">{{ messageText }}</p>
  </div>
</template>

<script>
import { PARTICIPANT_BOT } from '../../utils/constants.js';
import sanitizeHtml from '../../utils/sanitize-html.js';

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
    sanitizedHtmlText() {
      return sanitizeHtml(this.message.data.text);
    },
  },
};
</script>

<style>
.text-message {
  padding: 6px 18px;
  border-radius: 10px;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
}
.text-message.bot {
  color: var(--bot-message-fg-color, #263238);
  background-color: var(--bot-message-bg-color, #eceff1);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.text-message__text {
  margin-top: 0.4em;
  margin-bottom: 0.4em;
  font-weight: 400;
}

.text-message.user {
  background: var(--user-message-bg-color, #4e8cff);
  color: var(--user-message-fg-color, #ffffff);
  max-width: calc(100% - 120px);
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

.text-message a {
  color: var(--text-link-color, #007bff);
  text-decoration: none;
}

.text-message a:hover {
  text-decoration: underline;
}
</style>
