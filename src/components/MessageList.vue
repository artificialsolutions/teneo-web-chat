<template>
  <div ref="scrollList" class="twc-message-list">
    <Message
      v-for="(message, idx) in messageList"
      :key="idx"
      :message="message"
    />
  </div>
</template>
<script>
import Message from './Message.vue';
import { EventBus,events } from '../utils/event-bus';

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
  mounted () {
      setTimeout(this._scrollDownInstantly.bind(this), 80);
      //Setup a downwards scroller
      EventBus.$on(events.SCROLL_CHAT_DOWN, () => {
        setTimeout(() => { this._scrollDown()}, 40);
      });
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
      } else if (this.$refs.scrollList) {
        this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight;
      }
    },
    _scrollDownInstantly() {
      const latestMessage = document.querySelector('.message:last-child');

      if (latestMessage && typeof latestMessage.scrollIntoView === 'function') {
        latestMessage.scrollIntoView({
          behavior: 'auto',
          inline: "nearest",
          block: 'end',
        });
      } else if (this.$refs.scrollList) {
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
.twc-message-list {
  height: 80%;
  overflow-y: auto;
  background-size: 100%;
  padding: 20px 0px;
}
</style>


