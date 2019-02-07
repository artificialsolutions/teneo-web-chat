<template>
  <div class="message">
    <div class="message__wrapper" :class="messageSource">
      <div class="message__content">
        <component :is="messageType" :message="message" />
      </div>
    </div>
  </div>
</template>

<script>
import messageComponentName from '../utils/message-component-name.js';

export default {
  data() {
    return {};
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    chatImageUrl: {
      type: String,
    },
    authorName: {
      type: String,
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

.message__content {
  padding: 6px 18px;
  border-radius: 6px;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
}

.message__wrapper.user .message__content {
  background: #4e8cff;
  color: #ffffff;
  max-width: calc(100% - 120px);
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

.message__wrapper.bot .message__content {
  color: #263238;
  background-color: #f4f7f9;
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}
</style>
