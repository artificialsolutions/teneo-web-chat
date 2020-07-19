<template>
<div class="wrap" :class="messageSource">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="dateline" :class="messageSource" v-if="dateline" v-html="dateline"></p>
    <div class="text-message" :class="messageSource">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="isBot" class="text-message__text" v-html="sanitizedHtmlText"></p>
      <p v-else class="text-message__text">{{ messageText }}</p>
    </div>
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
    dateline() {
      if (this.message.data.dateline) {
        return sanitizeHtml(this.message.data.dateline)
      }
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
.wrap.user {
  max-width: calc(100% - 120px);
}
.dateline {
  font-weight: 400;
  font-size: 0.7em;
  padding: 0;
  margin-bottom: 0.25rem;
  margin-top: 0rem;
  width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;
  color: var(--secondary-color, #6c757d);
}
.dateline.user {
  text-align: right;
}
.text-message {
  padding: 6px 18px;
  border-radius: 10px;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  -webkit-font-smoothing: subpixel-antialiased;
}
.text-message.bot {
  color: var(--bot-message-fg-color, #263238);
  background-color: var(--bot-message-bg-color, #eceff1);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.text-message.agent {
  color: var(--agent-message-fg-color, #263238);
  background-color: var(--agent-message-bg-color, #e4f1e4);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.text-message.user {
  background: var(--user-message-bg-color, #4e8cff);
  color: var(--user-message-fg-color, #ffffff);
  /* max-width: calc(100% - 120px); */
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

.text-message__text {
  margin-top: 0.4em;
  margin-bottom: 0.4em;
  font-weight: 400;
}

.text-message a {
  color: var(--text-link-color, #007bff);
  text-decoration: none;
}

.text-message a:hover {
  text-decoration: underline;
}
</style>
