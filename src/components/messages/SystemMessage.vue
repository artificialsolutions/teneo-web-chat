<template>
  <div class="twc-system-message">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="twc-system-message__text" v-html="sanitizedHtmlText"></p>
  </div>
</template>

<script>
import sanitizeHtml from '../../utils/sanitize-html.js';

export default {
  name: 'SystemMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'system' &&
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
    sanitizedHtmlText() {
      return sanitizeHtml(this.message.data.text);
    },
  },
};
</script>

<style>
.twc-system-message {
  font-weight: 400;
  font-size: 0.9em;
  line-height: 1.4;
  width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;
  color: var(--secondary-color, #6c757d);
  text-align: center !important;
}

.twc-system-message__text {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
} 

.twc-system-message a {
  color: var(--text-link-color, #007bff);
  text-decoration: none;
}

.twc-system-message a:hover {
  text-decoration: underline;
}
</style>
