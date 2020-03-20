<template>
  <div class="buttons" :class="{ expired: replySent || isExpired}">
    <h5 class="buttons-title" v-if="buttonsTitle">{{ buttonsTitle }}</h5>
    <div>
      <a
        role="button"
        v-for="(button, idx) in buttonitems"
        :key="idx"
        class="btn"
        :class="{ selected: replySent && selected === idx, 'primary': button.style == 'primary', 'secondary': button.style == 'secondary', 'success': button.style == 'success', 'danger': button.style == 'danger', 'warning': button.style == 'warning', 'info': button.style == 'info'}"
        @click="onSelect(button, idx)"
      >{{ button.title }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonsMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'buttons' &&
          message.data &&
          message.data.button_items &&
          message.data.button_items.length > 0
        );
      },
    },
  },
  computed: {
    buttonsTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    buttonitems() {
      return this.message.data.button_items;
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
    async onSelect(button, idx) {
      if (this.replySent || this.isExpired) {
        return;
      }

      const numMessages = this.$teneoApi.messageList.length;
      const messages = this.$teneoApi.messageList.slice(0, numMessages - 1);
      const quickreplyMessage = this.$teneoApi.messageList[numMessages - 1];

      const selectedQuickReply = { ...quickreplyMessage, selected: idx };

      this.$teneoApi.messageList = [...messages, selectedQuickReply];

      await this.$teneoApi.sendSilentMessage(button.postback);
    },
  },
};
</script>

<style scoped>
.buttons {
  margin: -3px;
}
</style>
<style>
.btn {
  border: 1px solid var(--user-message-bg-color);
  background: var(--user-message-bg-color);
  color: var(--user-message-fg-color);
  cursor: pointer;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.375rem 0.75rem;
  font-size: 0.9rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  min-width: 70px;
  display: inline-block;
  margin: 3px;
  text-decoration: none;
}

.btn.selected,
.btn:not(.expired) .btn:hover {
  color: var(--user-message-bg-color);
  background: var(--user-message-fg-color);
}

.buttons.selected,
.buttons:not(.expired) .btn:hover {
  color: var(--user-message-bg-color);
  background: var(--user-message-fg-color);
}

.buttons.expired .btn {
  cursor: default;
  color: var(--expired-color);
  background: var(--user-message-fg-color);
  border: 1px solid var(--expired-color);
}

.buttons.expired .btn.selected {
  cursor: default;
  color: var(--user-message-fg-color);
  background: var(--expired-color);
  border: 1px solid var(--expired-color);
}

.buttons h5 {
  text-align: center;
  font-family: inherit;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 0.6rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--bot-message-fg-color);
}

.buttons.expired h5 {
  color: var(--expired-color);
}

/* a.btn:first-child {
  margin-left: 0px !important;
}

a.btn:last-child {
  margin-right: 0px !important;
} */

.btn.secondary {
  background: var(--secondary-color);
  border-color: var(--secondary-color);
}

.buttons:not(.expired) .btn.secondary:hover {
  color: var(--secondary-color) !important;
}

.btn.success {
  background: var(--success-color);
  border-color: var(--success-color);
}

.buttons:not(.expired) .btn.success:hover {
  color: var(--success-color) !important;
}

.btn.warning {
  background: var(--warning-color);
  border-color: var(--warning-color);
  color: var(--dark-fg-color);
}

.buttons:not(.expired) .btn.warning:hover {
  color: var(--warning-color) !important;
}

.btn.danger {
  background: var(--danger-color);
  border-color: var(--danger-color);
}

.buttons:not(.expired) .btn.danger:hover {
  color: var(--danger-color) !important;
}

.btn.info {
  background: var(--info-color);
  border-color: var(--info-color);
}

.buttons:not(.expired) .btn.info:hover {
  color: var(--info-color) !important;
}

</style>
