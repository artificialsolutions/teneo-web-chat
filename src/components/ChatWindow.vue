<template>
    <div :class="chatWindowStyles()">
    <Header :on-close="onClose" :on-minimize="onMinimize"/>
    <MessageList id="message-list-id" :message-list="$teneoApi.messageList" />
    <div v-if="spinnerIsLoading" class="twc-spinner">
      <div class="twc-bounce1"></div>
      <div class="twc-bounce2"></div>
      <div class="twc-bounce3"></div>
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
import { API_CALL_SEND_INPUT } from '../utils/constants';
import detectIosSafari from '../utils/detect-ios-safari';

export default {
  components: { Header, MessageList, UserInput },
  props: {
    onClose: {
      type: Function,
      required: true,
    },
    onMinimize: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      spinnerIsLoading: false,
      chatWindowBaseStyle: "twc-chat-window",
      keyboardUp: false,
      isIosSafari: false
    };
  },
  beforeMount() {
    this.isIosSafari = detectIosSafari();
    if(this.isIosSafari === true){
      EventBus.$on(events.USER_INPUT_FOCUS_CHANGED, (onoff) => {
        this.keyboardUp = onoff
      });
    }
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
      sendMessage(message) {
        this.spinnerIsLoading=true;
        this.$teneoApi.sendMessage(message);
      },
      chatWindowStyles() {
        if(this.isIosSafari){
          return this.chatWindowBaseStyle.concat((this.keyboardUp ? " ios-keyboard-shown" : " ios-keyboard-hidden"))
         }
         else{
           return this.chatWindowBaseStyle;
         }
      }
    }
    
};
</script>

<style scoped>
.twc-chat-window {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  width: 370px;
  height: calc(100% - 120px);
  max-height: 590px;
  min-height: 250px;
  position: fixed;
  right: 25px;
  bottom: 25px;
  box-sizing: border-box;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  background: var(--chat-window-bg-color, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.3s ease-in-out;
  border-radius: 10px;
  overscroll-behavior: contain
}

@media (max-width: 450px) {
  .twc-chat-window {
    width: 100%;
    height: 100%;
    max-height: 100%;
    right: 0px;
    bottom: 0px;
    border-radius: 0px;
  }
}

.ios-keyboard-shown {
  transition: none;
  height: calc(66% - 60px);
}
.ios-keyboard-hidden {
  transition: 0.5s ease-in-out;
  height: 100%;
}

.twc-spinner {
  margin: 18px auto 0;
  width: 70px;
  text-align: center;
}

.twc-spinner > div {
  width: 9px;
  height: 9px;
  background-color: #aaa;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: twc-sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: twc-sk-bouncedelay 1.4s infinite ease-in-out both;
}

.twc-spinner .twc-bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.twc-spinner .twc-bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes twc-sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes twc-sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>
