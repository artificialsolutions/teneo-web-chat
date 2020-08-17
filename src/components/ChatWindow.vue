<template>
  <div class="twc-chat-window" :class="isIosSafari() && 'twc-chat-window-ios-blue-fix'">
    <Header :on-close="onClose" :on-minimize="onMinimize"/>
    <MessageList :message-list="$teneoApi.messageList" />
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
      sendMessage(message) {
        this.spinnerIsLoading=true;
        this.$teneoApi.sendMessage(message);
      },
      isIosSafari() { //Upgrade to ifSafariMobile
        var ua = window.navigator.userAgent;
        var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        var webkit = !!ua.match(/WebKit/i);
        var iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i);
        console.log('is iOS Safari: '+iOSSafari);
        return iOSSafari;
        }
    }
    //*/
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
}

.twc-chat-window-ios-blue-fix {
  bottom: 0px;
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
