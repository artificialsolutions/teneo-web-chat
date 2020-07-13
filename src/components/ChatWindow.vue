<template>
  <div class="chat-window">
    <Header :title="title" :image-url="imageUrl" :on-close="onClose" />
    <MessageList :message-list="$teneoApi.messageList" />
    <div v-if="spinnerIsLoading" class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <UserInput :on-submit="sendMessage" />
  </div>
</template>

<script>
import Vue from 'vue';
import Header from './Header.vue';
import MessageList from './MessageList.vue';
import UserInput from './UserInput.vue';
import { EventBus, events } from '../utils/event-bus.js';
import { API_FUNCTION_CALL_SEND_INPUT } from '../utils/constants';
const tmpVue = new Vue();

export default {
  components: { Header, MessageList, UserInput },
  props: {
    onClose: {
      type: Function,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      spinnerIsLoading: false,
    };
  },
  mounted() {
    EventBus.$on(events.ENGINE_REPLIED, () => {
      this.spinnerIsLoading = false;
    });
    EventBus.$on(events.START_SPINNER, () => {
      this.spinnerIsLoading = true;
    });
    // Send an empty init message to trigger a welcoming message from Teneo
    if (this.$teneoApi.messageList.length === 0) {
      this.$teneoApi.sendSilentMessage('');
    }

  },
  methods: {
      async sendMessage(message) {
        // console.log("Chatwindow.vue sendMessage: ", message)
        //Run user-defined 'input_submitted' method, if available
        if(tmpVue.$extensionMethods.get(API_FUNCTION_CALL_SEND_INPUT)){
          var sendMessageFunction = tmpVue.$extensionMethods.get(API_FUNCTION_CALL_SEND_INPUT);
          var newMessage = await sendMessageFunction(message)
          if (newMessage) {
            this.sendMessageBase(newMessage);
          }
        }
        else{
          this.sendMessageBase(message);
        }
      },
      sendMessageBase(message) {
        this.spinnerIsLoading=true;
        this.$teneoApi.sendMessage(message);
      },
  },
};
</script>

<style scoped>
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

.spinner {
  margin: 18px auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 9px;
  height: 9px;
  background-color: #aaa;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>
