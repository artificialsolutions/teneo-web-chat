<template>
  <div class="twc-message" :class="messageSourceClass">
    <component :is="messageType" :message="message" />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import messageComponentName from '../utils/message-component-name.js';

export default defineComponent({
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const messageType = computed(() => {
      if (this && messageComponentName(this.message.type) && this.components[messageComponentName(this.message.type)]) {
        return messageComponentName(this.message.type);
      }
    });
    const messageText = computed(() => this.message.data.text);
    const messageSourceClass = computed(() => {
      if (this) {
        switch (this.message.value.author) {
          case 'bot':
            return 'twc-bot';
          case 'user':
            return 'twc-user';
          case 'agent':
            return 'twc-agent';
          default:
            return '';
        }
      }

    });


return { messageType, messageText, messageSourceClass };
  }
});
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