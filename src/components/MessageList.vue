<template>
  <div class="message-list" ref="scrollList">
    <Message
      v-for="(message, idx) in messageList"
      :message="message"
      :chatImageUrl="chatImageUrl(message.author)"
      :authorName="authorName(message.author)"
      :key="idx"
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
  methods: {
    _scrollDown() {
      this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight;
    },
    shouldScrollToBottom() {
      return (
        this.$refs.scrollList.scrollTop >
        this.$refs.scrollList.scrollHeight - 600
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
  mounted() {
    this._scrollDown();
  },
  updated() {
    if (this.shouldScrollToBottom()) {
      this.$nextTick(this._scrollDown);
    }
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
