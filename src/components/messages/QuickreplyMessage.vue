<template>
  <ul class="quickreply-message" :class="{ replied: replySent }">
    <li
      v-for="(reply, idx) in quickreplies"
      :key="idx"
      class="quickreply-message__item"
      :class="{ selected: replySent && selected === idx }"
      @click="onSelect(reply, idx)"
    >
      {{ reply.title }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'QuickreplyMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'quickreply' &&
          message.data &&
          message.data.quick_replies &&
          message.data.quick_replies.length > 0
        );
      },
    },
  },
  computed: {
    quickreplies() {
      return this.message.data.quick_replies;
    },
    replySent() {
      return !!this.message.selected || this.message.selected === 0;
    },
    selected() {
      return this.message.selected;
    },
  },
  methods: {
    async onSelect(reply, idx) {
      if (!this.replySent) {
        const numMessages = this.$teneoApi.messageList.length;
        const messages = this.$teneoApi.messageList.slice(0, numMessages - 1);
        const quickreplyMessage = this.$teneoApi.messageList[numMessages - 1];

        const selectedQuickReply = { ...quickreplyMessage, selected: idx };

        this.$teneoApi.messageList = [...messages, selectedQuickReply];

        await this.$teneoApi.sendTeneoMessage(reply.postback);
      }
    },
  },
};
</script>

<style scoped>
.quickreply-message {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style: none;
  padding: 0;
}

.quickreply-message__item {
  border: 2px solid #4e8cff;
  border-radius: 6px;
  padding: 6px;
  color: #4e8cff;
  cursor: pointer;
}

.quickreply-message__item.selected,
.quickreply-message:not(.replied) .quickreply-message__item:hover {
  background: #4e8cff;
  color: #ffffff;
}

.quickreply-message.replied .quickreply-message__item {
  cursor: default;
}
</style>
