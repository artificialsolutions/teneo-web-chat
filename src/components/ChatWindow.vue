<template>
  <div class="chat-window">
    <Header :title="title" :imageUrl="titleImageUrl" :onClose="onClose" />
    <MessageList
      :messageList="$teneoApi.messageList"
      :participants="participants"
    />
    <UserInput :onSubmit="sendMessage" />
  </div>
</template>

<script>
import Header from './Header.vue';
import MessageList from './MessageList.vue';
import UserInput from './UserInput.vue';

export default {
  components: { Header, MessageList, UserInput },
  props: {
    onClose: {
      type: Function,
      required: true,
    },
    participants: {
      type: Array,
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
  box-shadow: 0px 7px 40px 2px rgba(148, 149, 150, 0.1);
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
