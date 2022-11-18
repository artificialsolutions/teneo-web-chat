<template>
  <div class="twc-message" :class="messageSourceClass">
    <component :is="messageType" :message="message"/>
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
      if (messageComponentName(this.message.type) && this.$options.components[messageComponentName(this.message.type)]) {
        return messageComponentName(this.message.type);
      }
    },
    messageText() {
      if (this.message.author === "user") {
        const s= this.message.data.text
        if(s) this.message.data.text=s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      }

      return this.message.data.text;
    },
    messageSourceClass() {
      if (this.message.author === "bot") {
        return "twc-bot"
      } else if (this.message.author === "user") {
        return "twc-user"
      } else if (this.message.author === "agent") {
        return "twc-agent"
      } else {
        return ""
      }
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

.twc-message.twc-user {
  justify-content: flex-end;
}

.twc-message.twc-bot {
  justify-content: flex-start;
}
</style>
