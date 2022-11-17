<template>
  <div ref="chatWindowId" :class="chatWindowStyles()" role="group" :aria-label="$t('message.chat_window_group_aria_label')">
    <Header :on-close="onClose" :on-minimize="onMinimize" />
    <MessageList id="twc-message-list" :message-list="$teneoApi.messageList" />
    <div v-if="spinnerIsLoading" class="twc-spinner" role="progressbar" aria-valuemin="0" :aria-valuetext="$t('message.chat_window_spinner_aria_valuetext')" aria-valuemax="100">
      <div class="twc-bounce1" aria-hidden="true"></div>
      <div class="twc-bounce2" aria-hidden="true"></div>
      <div class="twc-bounce3" aria-hidden="true"></div>
    </div>
    <UserInput :on-submit="sendMessage" />
    <UploadPreviewPanel />

    <div v-if="isImageZoomed" href="#" class="twc-lightbox" @click="zoomOut">
      <span class="twc-lightbox-image-wrapper" @click="zoomOut">
        <a id="twc-lightbox-close" href="#" tabindex="0" title="Click to close" @click="zoomOut">
          <img :src="this.zoomedImageUrl" class="twc-lightbox-image" alt="This is my image" @click="zoomOut">
        </a>
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Header from './Header.vue';
import MessageList from './MessageList.vue';
import UserInput from './UserInput.vue';
import UploadPreviewPanel from './UploadPreviewPanel.vue';
import { EventBus, events } from '../utils/event-bus.js';
import { API_CALL_SEND_INPUT } from '../utils/constants';
import detectIosSafari from '../utils/detect-ios-safari';

export default {
  components: {
    UploadPreviewPanel, 
    Header, MessageList, UserInput 
  },
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
      zoomedImageUrl: '',
      isImageZoomed: false,
      spinnerIsLoading: false,
      chatWindowBaseStyle: 'twc-chat-window',
      keyboardUp: false,
      isIosSafari: false,
      lastScrollY: 0
    };
  },
  beforeMount() {
    this.isIosSafari = detectIosSafari();
    if (this.isIosSafari === true) {
      EventBus.$on(events.USER_INPUT_FOCUS_CHANGED, (onoff) => {
        //TODO setTimeout
        //setTimeout(() => {
          if (!(this.lastScrollY === window.scrollY)) {
            this.keyboardUp = onoff;
          } else {
              this.keyboardUp = true; // Reactive variable, will update style
          }
          this.lastScrollY = window.scrollY;
        //}, 1000);
      })
    }
  },
  mounted() {
    EventBus.$on(events.ENGINE_REPLIED, (e) => {
      this.spinnerIsLoading = false;
    });
    EventBus.$on(events.START_SPINNER, () => {
      this.spinnerIsLoading = true;
    });
    EventBus.$on(events.ZOOM_IMAGE, (zoomedImageUrl) => {
      // We may also need to get the alt text
      this.zoomedImageUrl = zoomedImageUrl;
      this.isImageZoomed = true;

      setTimeout(() => {
 document.getElementById('twc-lightbox-close').focus();
}, 50);
    });
    // Send an empty init message to trigger a welcoming message from Teneo
    if (this.$teneoApi.messageList.length === 0) {
      this.$teneoApi.sendSilentMessage('');
    }
  },
  methods: {
      zoomOut(event) {
        event.preventDefault(); // Prevent anchor from being appended to url

        /*
         *  TODO: handle extension
         * await handleExtension(API_ON_CLOSE_LIGHTBOX, payload);
         */

        // Close zoomed image
        if (event.target === event.currentTarget) {
          this.isImageZoomed = false;
        }
      },
      sendMessage(message) {
        this.spinnerIsLoading = true;
        this.$teneoApi.sendMessage(message);
      },
      chatWindowStyles() {
        if (this.isIosSafari) {
          return this.chatWindowBaseStyle.concat((this.keyboardUp ? ' twc-ios-keyboard-shown' : ' twc-ios-keyboard-hidden'));
         }

           return this.chatWindowBaseStyle;

      }
    }

};
</script>

<style scoped>
.twc-chat-window {
  font-family: var(--primary-font, 'Helvetica Neue', Helvetica, Arial, sans-serif);
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
  overscroll-behavior: contain;
  -webkit-animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  z-index: 2699; /* Sit on top, but right below modal messages */
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

.twc-ios-keyboard-shown {
  transition: 0.3s ease-in-out !important;
  height: calc(66% - 62px) !important;
  border: 5px solid green;
  top: calc(34% + 63px) !important;
  position: fixed !important;
}
.twc-ios-keyboard-hidden {
  transition: 0.2s ease-in-out !important;
  height: 100% !important;
  border: 5px solid red;
  top: 0px !important;
  position: fixed !important;
}

.twc-spinner {
  margin: 18px auto 0;
  width: 70px;
  text-align: center;
}

.twc-spinner > div {
  width: 9px;
  height: 9px;
  background-color: var(--spinner-color, #c9c9c9);

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

.twc-lightbox {
  display: block;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--lightbox-overlay-color, rgba(0, 0, 0, 0.8));
  -webkit-animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

.twc-lightbox-image-wrapper {
    width: 100%;
    height: 100%;
}

.twc-lightbox-image {
    max-width: 90vw;
    max-height: 90vh;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--lightbox-image-background-color, #ffffff);
    -webkit-animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
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

<style>
@-webkit-keyframes twc-fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes twc-fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
