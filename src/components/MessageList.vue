<template>
  <div ref="scrollList" class="twc-message-list" aria-live="polite">
    <button id="twc-scrollDownButton" v-show="showScrollDownButton" @click="scrollDownDirectly"></button>
    <Message
      v-for="(message, idx) in messageList"
      :key="idx"
      :message="message"
    />
  </div>
</template>

<script>
import Message from './Message.vue';
import { EventBus, events } from '../utils/event-bus';
import {mapState} from 'vuex';

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
  data() {
    return {
      mutationObserver: null
    };
  },
  mounted() {
    // Used MutationObserver to detect changes in the messageList or new messages are added
    this.mutationObserver = new MutationObserver(this.handleMutation);

    // Start observing changes in the scrollList
    this.mutationObserver.observe(this.$refs.scrollList, {
      childList: true,
      subtree: true,
    });

    // Scroll to the last message when component is mounted
    this.$nextTick(this.scrollDown);
    // Add event listener for when the message contains images.
    this.$refs.scrollList.addEventListener('load', this.handleImageLoad, true);

  },
  beforeDestroy() {
    // Stop observing changes and disconnect MutationObserver
    this.mutationObserver.disconnect();
    // Remove event listener when component is destroyed
    this.$refs.scrollList.removeEventListener('load', this.handleImageLoad, true);
  },
  computed: {
    ...mapState(['showScrollDownButton'])
  },
  methods: {
    scrollDown() {
      const scrollList = this.$refs.scrollList;

      if (!scrollList) {
        return;
      }

      this.$nextTick(() => {
        const latestMessage = scrollList.querySelector('.twc-message:last-child');

        if (latestMessage && typeof latestMessage.scrollIntoView === 'function') {
          latestMessage.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        } else {
          scrollList.scrollTop = scrollList.scrollHeight;
        }
      });
    },
    handleMutation() {
      this.$nextTick(this.scrollDown);
    },
    scrollDownDirectly() {
      this.scrollDown();
    },
    handleImageLoad() {
      // Will trigger scroll down when image is loaded.
      this.$nextTick(this.scrollDown);
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
    background: var(--user-input-bg-color);
    border-radius: 10px;
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
