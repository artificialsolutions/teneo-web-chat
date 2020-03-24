<template>
  <div ref="scrollList" class="message-list">
    <Message
      v-for="(message, idx) in messageList"
      :key="idx"
      :message="message"
    />
  </div>
</template>
<script>
import Message from './Message.vue';

export default {
  components: {
    Message,
  },
  props: {
    messageList: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    // Additional scroll down after images etc have loaded
    setTimeout(this._scrollDown.bind(this), 700);

    // Scroll down to bottom
    this._scrollDown();
  },
  updated() {
    if (this.shouldScrollToBottom()) {
      this.$nextTick(this._scrollDown);
    }

    // Additional scroll down after images etc have loaded
    setTimeout(this._scrollDown.bind(this), 700);
  },
  methods: {
    _scrollDown() {
      const latestMessage = document.querySelector('.message:last-child');

      if (latestMessage && typeof latestMessage.scrollIntoView === 'function') {
        latestMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      } else {
        this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight;
      }
    },
    shouldScrollToBottom() {
      return (
        this.$refs.scrollList.scrollTop < this.$refs.scrollList.scrollHeight
      );
    },
  },
};
</script>
<style scoped>
.message-list {
  height: 80%;
  overflow-y: auto;
  background-size: 100%;
  padding: 20px 0px;
}
</style>
