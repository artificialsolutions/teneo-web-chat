<template>
  <div class="message">
    <div class="message__wrapper" :class="messageSource">
      <component :is="messageType" :message="message" />
    </div>
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
      return messageComponentName(this.message.type);
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
.message {
  width: 300px;
  margin: auto;
  padding-bottom: 10px;
  display: flex;
}

.message__wrapper {
  width: 100%;
  display: flex;
}

.message__wrapper.user {
  justify-content: flex-end;
}

.message__wrapper.bot {
  justify-content: flex-start;
}
</style>
