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
.twc-message-list {
  height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
  background-size: 100%;
  padding: 20px 0px;
}

/* width */
.twc-message-list::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.twc-message-list::-webkit-scrollbar-track {
  background: var(--user-input-bg-color); 
  border-radius: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
  box-shadow: none;
}
 
/* Handle */
.twc-message-list::-webkit-scrollbar-thumb {
  background: var(--primary-color) !important; 
  border-radius: 10px;
  box-shadow: none;

}

/* Handle on hover */
.twc-message-list::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color); 
}

.twc-message-list:last-child{
  scroll-margin-top: 10px;
}

#twc-scrollDownButton {
    display: block;
    position: absolute;
    right: 3%;
    bottom: 13%;
    background-color: var(--user-input-bg-color);
    opacity: 0.8;
    box-shadow: 0 2px 4px 0 rgba(85, 87, 85, 0.7);
    padding: 0;
    width: 32px;
    height: 32px;
    border: none;
    background-size: 14px auto;
    border-radius: 50%;
    z-index: 2;
}

#twc-scrollDownButton:hover {
    background-color: var(--primary-color);
    box-shadow: 0 4px 8px 0 rgba(85, 87, 85, 0.7);
    cursor: pointer;
}

#twc-scrollDownButton:hover:before {
    border: 3px solid white;
    border-width: 0px 0 2px 2px;
}


#twc-scrollDownButton:before {
    position: absolute;
    top: calc(50% - 9px);
    left: calc(50% - 6.5px);
    transform: rotate(-45deg);
    display: block;
    width: 10px;
    height: 10px;
    content: "";
    border: 1px solid var(--primary-color);
    border-width: 0px 0 2px 2px;
}
</style>


