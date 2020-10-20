<template>
  <div class="twc-message" :class="messageSource">
      <component :is="messageType" :message="message" />
  </div>
</template>

<script>
import messageComponentName from '../utils/message-component-name.js';

export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    messageType() {
      // TODO: check if message type is valid?
      if (messageComponentName(this.message.type) && this.$options.components[messageComponentName(this.message.type)]) {
        return messageComponentName(this.message.type);
      }
    },
    messageText() {
      return this.message.data.text;
    },
    messageSource() {
      return this.message.author;
    },
  },
};
</script>

<style scoped>
.twc-message {
  width: 90%;
  min-width: 300px;
  margin: auto;
  padding-bottom: 10px;
  display: flex;
}

.twc-message.user {
  justify-content: flex-end;
}

.twc-message.bot {
  justify-content: flex-start;
}
</style>
