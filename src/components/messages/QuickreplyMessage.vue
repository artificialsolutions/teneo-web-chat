<template>
  <div class="quickreply-message" :class="{ expired: replySent || isExpired }">
    <div>
    <a
      v-for="(reply, idx) in quickreplies"
      :key="idx"
      role="button"
      class="quickreply-message__item"
      :class="{ selected: replySent && selected === idx, 'primary': reply.style == 'primary', 'secondary': reply.style == 'secondary', 'success': reply.style == 'success', 'danger': reply.style == 'danger', 'warning': reply.style == 'warning', 'info': reply.style == 'info'}"
      @click="onSelect(reply, idx)"
    >{{ reply.title }}</a>
    </div>
  </div>
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
    isExpired() {
      const { messageList } = this.$teneoApi;
      const latestMessage = messageList[messageList.length - 1];

      return latestMessage && latestMessage !== this.message;
    },
  },
  methods: {
    async onSelect(reply, idx) {
      if (this.replySent || this.isExpired) {
        return;
      }

      const numMessages = this.$teneoApi.messageList.length;
      const messages = this.$teneoApi.messageList.slice(0, numMessages - 1);
      const quickreplyMessage = this.$teneoApi.messageList[numMessages - 1];

      const selectedQuickReply = { ...quickreplyMessage, selected: idx };

      this.$teneoApi.messageList = [...messages, selectedQuickReply];

      await this.$teneoApi.sendSilentMessage(reply.postback);
    },
  },
};
</script>

<style>
.quickreply-message {
  width: 100%;
  margin-right: 40px;
  display: inline-block;
  text-align: center;
}

.quickreply-message__item {
  border: 1px solid var(--quickreply-border-color);
  border-radius: 16px;
  padding: 8px 14px 8px 14px;
  color: var(--quickreply-fg-color);
  cursor: pointer;
  font-size: 0.8rem;
  display: inline-block;
  margin: 3px;
}

.quickreply-message__item.selected,
.quickreply-message:not(.expired) .quickreply-message__item:hover {
  background: var(--quickreply-bg-color);
  color: var(--quickreply-fg-color);
}

.quickreply-message__item.selected,
.quickreply-message:not(.expired) .quickreply-message__item:hover {
  background: var(--quickreply-fg-color);
  color: var(--quickreply-bg-color);
}

.quickreply-message.expired .quickreply-message__item:not(.selected) {
  cursor: default;
  color: var(--quickreply-expired-color);
  border-color: var(--quickreply-expired-color);
}

.quickreply-message.expired .quickreply-message__item.selected {
  cursor: default;
  background: var(--quickreply-expired-color);
  color: var(--quickreply-bg-color);
  border-color: var(--quickreply-expired-color);
}

.quickreply-message__item.secondary {
  color: var(--secondary-color);
  border-color: var(--secondary-color);
}

.quickreply-message:not(.expired) .quickreply-message__item.secondary:hover {
  color: var(--quickreply-bg-color) !important;
  background: var(--secondary-color);
}

.quickreply-message__item.success {
  color: var(--success-color);
  border-color: var(--success-color);
}

.quickreply-message:not(.expired) .quickreply-message__item.success:hover {
  color: var(--quickreply-bg-color) !important;
  background: var(--success-color);
}

.quickreply-message__item.warning {
  border-color: var(--warning-color);
  color: #e0a800;
}

.quickreply-message:not(.expired) .quickreply-message__item.warning:hover {
  color: var(--dark-fg-color);
  background: var(--warning-color);
}

.quickreply-message__item.danger {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.quickreply-message:not(.expired) .quickreply-message__item.danger:hover {
  color: var(--quickreply-bg-color);
  background: var(--danger-color);
}

.quickreply-message__item.info {
  color: var(--info-color);
  border-color: var(--info-color);
}

.quickreply-message:not(.expired) .quickreply-message__item.info:hover {
  color: var(--quickreply-bg-color);
  background: var(--info-color);
}

</style>
