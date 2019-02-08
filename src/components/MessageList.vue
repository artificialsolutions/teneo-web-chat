<template>
  <div ref="scrollList" class="message-list">
    <Message
      v-for="(message, idx) in messageList"
      :key="idx"
      :message="message"
      :chat-image-url="chatImageUrl(message.author)"
      :author-name="authorName(message.author)"
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
    participants: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    // Wait for images to load
    setTimeout(this._scrollDown.bind(this), 400);
  },
  updated() {
    if (this.shouldScrollToBottom()) {
      this.$nextTick(this._scrollDown);
    }
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
    profile(author) {
      const profile = this.participants.find(
        (participant) => author.toLowerCase() === participant.id.toLowerCase()
      );

      return (
        profile || {
          imageUrl: '',
          name: 'Unknown profile',
        }
      );
    },
    chatImageUrl(author) {
      return this.profile(author).imageUrl;
    },
    authorName(author) {
      return this.profile(author).name;
    },
  },
};
</script>
<style scoped>
.message-list {
  height: 80%;
  overflow-y: auto;
  background-size: 100%;
  padding: 40px 0px;
}
</style>
