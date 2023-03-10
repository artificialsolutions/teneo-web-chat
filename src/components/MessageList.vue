<template>
  <div ref="scrollList" class="twc-message-list" aria-live="polite">
    <Message
      v-for="(message, idx) in messageList"
      :key="idx"
      :message="message"
    />
    <button id = "twc-scrollDownButton" @click="scrollDownDirectly"></button>
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
      const latestMessage = document.querySelector('.twc-message:last-child');

      if (latestMessage && typeof latestMessage.scrollIntoView === 'function') {
        latestMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      } else if (this.$refs.scrollList) {
        this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight;
      }
    },
    _scrollDownInstantly() {

      const latestMessage = document.querySelector('.twc-message:last-child');

      if (latestMessage && typeof latestMessage.scrollIntoView === 'function') {
        latestMessage.scrollIntoView({
          behavior: 'smooth',
          inline: "nearest",
          block: 'start',
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
    scrollDownDirectly() {
      const latestMessage = document.querySelector('.twc-message:last-child');

      if (latestMessage && typeof latestMessage.scrollIntoView === 'function') {
        latestMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      } else if (this.$refs.scrollList) {
        this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
  :root {
    --user-input-bg-color: #fff;
    --primary-color: #00f;
  }

  .twc-message-list {
    height: 80%;
    overflow: auto;
    padding: 20px 0;
  }

  .twc-message-list::-webkit-scrollbar {
    width: 5px;
  }

  .twc-message-list::-webkit-scrollbar-track {
    background: var(--user-input-bg-color); border-radius: 10px;
    margin: 2px 0;
  }

  .twc-message-list::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
  }

  .twc-message-list:last-child {
    scroll-margin-top: 10px;
  }

  #twc-scrollDownButton {
    display: block;
    position: absolute;
    right: 3%;
    bottom: 13%;
    width: 20px;
    height: 20px;
    border: none;
    background: var(--user-input-bg-color) url('/src/icons/double-down.jpg') no-repeat center center / 14px auto;
    border-radius: 50%;
    z-index: 2;
    cursor: default;
    opacity: 0.8;
    box-shadow: 0 2px 4px 0 rgba(85, 87, 85, 0.7);
  }

  #twc-scrollDownButton:hover {
    background-color: var(--primary-color);
    box-shadow: 0 4px 8px 0 rgba(85, 87, 85, 0.7);
  }
</style>
