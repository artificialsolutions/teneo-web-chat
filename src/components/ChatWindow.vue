<template>
  <div class="chat-window">
    <Header :title="title" :image-url="titleImageUrl" :on-close="onClose" />
    <MessageList :message-list="$teneoApi.messageList" />
    <UserInput :on-submit="sendMessage" />
  </div>
</template>

<script>
import Header from './Header.vue';
import MessageList from './MessageList.vue';
import UserInput from './UserInput.vue';
import { PARTICIPANT_USER } from '../utils/constants.js';

export default {
  components: { Header, MessageList, UserInput },
  props: {
    onClose: {
      type: Function,
      required: true,
    },
    titleImageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  mounted() {
    // Send an empty init message to trigger a welcoming message from Teneo
    if (this.$teneoApi.messageList.length === 0) {
      this.$teneoApi.sendSilentMessage('');
    }
  },
  methods: {
    sendMessage(message) {
      this.$teneoApi.sendMessage(message);
    },
  },
};
</script>

<style scope>
.chat-window {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  width: 370px;
  height: calc(100% - 120px);
  max-height: 590px;
  position: fixed;
  right: 25px;
  bottom: 100px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.3s ease-in-out;
  border-radius: 10px;
}

@media (max-width: 450px) {
  .chat-window {
    width: 100%;
    height: 100%;
    max-height: 100%;
    right: 0px;
    bottom: 0px;
    border-radius: 0px;
  }
}
</style>
