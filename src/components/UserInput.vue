<template>
  <div v-if="showUserInput">
    <form
        class="twc-user-input"
        :class="{ 'twc-active': inputActive, 'twc-disabled': inputDisabled }"
    >   
      <div v-if="shouldDisplaySpeechRec">
        <live-transcript ref="liveTranscriptRef" @transcribing="handleTranscribing" @transcription="handleTranscription" @transcriptionComplete="handleTranscriptionComplete"></live-transcript>        

      </div>
      <textarea
          id="twc-user-input-field"
          ref="userInput"
          v-debounce:250="userTyping"
          rows="1"
          class="twc-user-input__text"
          role="textbox"
          tabIndex="0"
          :aria-label="$t('message.input_area_userinput_field_aria_label')"
          :aria-placeholder="$t('message.input_area_userinput_field_placeholder')"
          :placeholder="$t('message.input_area_userinput_field_placeholder')"
          :debounce-events="['input']"
          :aria-disabled="inputDisabled"
          :disabled="inputDisabled ? true : false"
          @focus="setInputActive(true)"
          @blur="setInputActive(false)"
          @keydown="handleReturnKey"
          @input="autoTextareaHeight"
      ></textarea>
      <div v-if="showUploadButton" class="twc-user-input__button" :class="{ 'twc-disabled': uploadDisabled }">
        <button
            role="button"
            tabindex="0"
            ref="uploadButton"
            :aria-label="$t('message.input_area_upload_button_aria_label')"
            :title="$t('message.input_area_upload_button_title')"
            class="twc-user-input__upload-icon-wrapper"
            :aria-disabled="inputDisabled"
            :disabled="inputDisabled ? true : false"
            @click.prevent=""
            @focus="setInputActive(true)"
            @blur="setInputActive(false)"
            @click="uploadButtonClicked()"
        >
          <img
              v-if="uploadIconUrl"
              id="twc-user-input__upload-icon-img"
              class="twc-user-input__upload-icon"
              :src="uploadIconUrl"
              aria-hidden="true"
              alt=""
          />
          <UploadIcon
              v-else
              id="twc-user-input__upload-icon"
              class="twc-user-input__upload-icon"
              aria-hidden="true"
          />
        </button>
      </div>

      <div class="twc-user-input__button">
        <button
            role="button"
            tabindex="0"
            :aria-label="$t('message.input_area_send_button_aria_label')"
            :title="$t('message.input_area_send_button_title')"
            class="twc-user-input__send-icon-wrapper"
            :aria-disabled="inputDisabled"
            :disabled="inputDisabled ? true : false"
            @click.prevent=""
            @focus="setInputActive(true)"
            @blur="setInputActive(false)"
            @click="sendButtonClicked()"
        >
          <img
              v-if="sendIconUrl"
              id="twc-user-input__send-icon-img"
              class="twc-user-input__send-icon"
              :src="sendIconUrl"
              aria-hidden="true"
              alt=""
          />
          <SendIcon
              v-else
              id="twc-user-input__send-icon"
              class="twc-user-input__send-icon"
              aria-hidden="true"
          />
        </button>
      </div>
    </form>
    <a v-if="isMobile()" id="twc-focus-fix" href="#1" aria-hidden="true"></a>
  </div>
</template>


<script>
import Vue from 'vue';
import vueDebounce from 'vue-debounce';
import SendIcon from '../icons/send.vue';
import UploadIcon from '../icons/upload.vue';
import DOMPurify from 'isomorphic-dompurify';

import { PARTICIPANT_USER } from '../utils/constants.js';
import {
  API_ON_INPUT_SUBMITTED,
  API_ON_SEND_BUTTON_CLICK,
  API_ON_UPLOAD_BUTTON_CLICK,
  API_ON_USER_TYPING
} from '../utils/api-function-names.js';
import { EventBus, events } from '../utils/event-bus.js';
import handleExtension from '../utils/handle-extension.js';
import basePayload from '../utils/base-payload.js';
import detectMobile from '../utils/detect-mobile.js';
import { mapState } from 'vuex';
import { store } from "../store/store";
import LiveTranscript from './SpeechRec.vue'; 

Vue.use(vueDebounce);

export default {
  components: {
    SendIcon,
    UploadIcon,
    LiveTranscript
  },
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Please type here...',
    },
  },
  computed: {
    ...mapState(['sendIconUrl', 'showUploadButton', 'uploadIconUrl']),
    shouldDisplaySpeechRec() {         
      return this.asrActive || this.ttsActive;
     },
  },
  data() {
    return {
      inputActive: false,
      inputDisabled: false,
      uploadDisabled: false,
      showUserInput: true,
      asrActive: store.getters.asrActive,
      ttsActive: store.getters.ttsActive,
      readIncomingMessages:store.getters.ttsActive
    };
  },

  mounted() {
    
    EventBus.$on(events.UPLOAD_PANEL_OPENED, () => {
      this.showUserInput = false;      
    });


    EventBus.$on(events.UPLOAD_PANEL_CLOSED, () => {
      this.showUserInput = true;      
    });

    EventBus.$on(events.DISABLE_UPLOAD, () => {
      if (this.showUploadButton) {
        if (this.$refs.uploadButton) {
          this.$refs.uploadButton.setAttribute('disabled', 'true');
        }
        this.uploadDisabled = true;
      }
    });

    EventBus.$on(events.ENABLE_UPLOAD, () => {
      if (this.showUploadButton) {
        if (this.$refs.uploadButton) {
          this.$refs.uploadButton.removeAttribute('disabled');
        }
        this.uploadDisabled = false;
      }
    });    
    EventBus.$on(events.DISABLE_INPUT, () => {
      this.setInputActive(false);
      this.inputDisabled = true;

      if (document.getElementById('twc-user-input-field')) {
        document.getElementById('twc-user-input-field').blur();
      }
    });

    EventBus.$on(events.ENABLE_INPUT, () => {
      this.inputDisabled = false;
      this.setInputActive(true);

      if (document.getElementById('twc-user-input-field')) {
        document.getElementById('twc-user-input-field')
            .focus();
      }
    });

    EventBus.$on('tts-state-change', (readIncomingMessages) => {      
      this.readIncomingMessages = readIncomingMessages;    
    });
    
    EventBus.$on(events.BOT_MESSAGE_RECEIVED, (message) => {    
      if (this.ttsActive && this.readIncomingMessages) {         
        this.$refs.liveTranscriptRef.readTranscription(message.data.text);
      }
    });     
    
    // Detect changes and focus and emit event. This will be listened by ChatWindow to adapt to iOS Safari
    const userInput = document.getElementById('twc-user-input-field');

    if (userInput) {
      userInput.addEventListener('focus', (event) => {
        EventBus.$emit(events.USER_INPUT_FOCUS_CHANGED, true);
      });
      userInput.addEventListener('blur', (event) => {
        EventBus.$emit(events.USER_INPUT_FOCUS_CHANGED, false);
      });
    }

    // Give user input focus on on desktop
    if (!detectMobile()) {
      this.$refs.userInput.focus();
    } else {
      /*
       * If user gives input field focus without having first interacted with the chatwindow
       * the chat window will shrink down and the keyboard will overlap the chat window
       * this is solved by giving a non visible dummy element focus as soon as the chat window loads
       * it also prevents the keyboard from taking up too much space on other devices
       */
      const dummyFocusElement = document.getElementById('twc-focus-fix');
      dummyFocusElement.focus();
    }
  },

  beforeDestroy() {
    EventBus.$off(events.BOT_MESSAGE_RECEIVED);    
  },

  methods: {
    handleTranscriptionComplete(transcribedText) {   
      this.sendButtonClicked(transcribedText).then(() => {
        this.clearTextarea();
      });
  },
    handleTranscription(transcription) {
      const userInputField = document.getElementById('twc-user-input-field');
      userInputField.value = DOMPurify.sanitize(transcription);
    },
    handleTranscribing(value) {      
      this.transcribing = value
    },
    setInputActive(onoff) {
      this.inputActive = onoff;
      if (onoff === true) {
        EventBus.$emit(events.SCROLL_CHAT_DOWN);
      }
    },

    handleReturnKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this._submitText(event);
        event.preventDefault();
      }
    },

    userTyping() {
      // Check if userinput field still exists to prevent error in IE11
      if (document.getElementById('twc-user-input-field')) {
        // Create payload object
        const payload = {text: this.$refs.userInput.value};
        // Check if there is an extension that want to be notified about the user typing

        handleExtension(API_ON_USER_TYPING, payload);
      }
    },

    isMobile() {
      return detectMobile();
    },

    async sendButtonClicked(transcribedText = null) {
      const payload = basePayload();

      await handleExtension(API_ON_SEND_BUTTON_CLICK, payload);

      // Return if extension wants to handle submit itself
      if (payload.handledState.handled === true) {
        return;
      }
      // Call submit function

      await this._submitText();
    },

    async uploadButtonClicked() {
      await handleExtension(API_ON_UPLOAD_BUTTON_CLICK);
    },
      async _submitText() {
      // Create payload object
      const payload = basePayload();

      // Add user input to base payload
      payload.text = DOMPurify.sanitize(this.$refs.userInput.value);

      // Clear input field
      this.$refs.userInput.value = '';

      // Restore height of input box
      this.autoTextareaHeight();

      /*
       * Check if there is an extension that want to intercept the user input
       * but only if the user actually submitted something
       */
      if (payload.text && payload.text.trim().length > 0) {
        await handleExtension(API_ON_INPUT_SUBMITTED, payload);
      }

      // Return if extension wants to handle submit itself
      if (payload.handledState.handled === true) {
        return;
      }

      if (payload.text && payload.text.trim().length > 0) {
        this.onSubmit({
          author: PARTICIPANT_USER,
          type: 'text',
          data: {
            text: payload.text,
            parameters: payload.parameters || {},
          },
        });
      }
      this.$refs.userInput.value = '';

      // Don't give user input focus on mobile devices, keyboard blocks the view too much
      if (!detectMobile()) {
        this.$refs.userInput.focus();
      }
    },
 
    clearTextarea() {
      if (this.$refs.userInput) {
        this.$refs.userInput.value = ''; 
        this.autoTextareaHeight(); 
      }
    },
    autoTextareaHeight() {
      const userInput = document.getElementById('twc-user-input-field');
      userInput.style.height = '1px';
      userInput.style.height = `${userInput.scrollHeight}px`;
    },
  },
};
</script>

<style scoped>
  .twc-user-input {
    min-height: 56px;
    margin: 0px;
    position: relative;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    background-color: var(--user-input-bg-color, #f4f7f9);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    pointer-events: initial;
    padding: 0 5px;
  }

  /* See above, we use a dummy <a> tag to fix a keyboard focus issue on safari */
  /* This style makes the dummy tag invisible but we can still give it focus */
  #twc-focus-fix {
    outline: none;
    position: absolute;
    margin-left: -9999px;
  }

  .twc-user-input.twc-disabled {
    pointer-events: none;
  }

  .twc-user-input.twc-disabled .twc-user-input__text,
  .twc-user-input.twc-disabled .twc-user-input__button {
    filter: grayscale(100%);
    opacity: 0.4;
  }

  .twc-user-input__text {
    width: 100%;
    resize: none;
    border: none;
    outline: none;
    box-sizing: border-box;
    margin: 4px 4px 4px 4px;
    padding: 12px;
    font-size: 0.95em;
    font-weight: 400;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: var(--user-input-fg-color, #565867);
    background-color: transparent;
    -webkit-font-smoothing: antialiased;
    max-height: 200px;
    min-height: 56px;
    overflow: scroll;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    font-family: inherit;
  }

  .twc-user-input__text::placeholder {
    color: var(--secondary-color, #6c757d);
  }

  /* fix placeholder issue on Edge browsers */
  @supports (-ms-ime-align: auto) {
    [placeholder]:empty:focus::before {
      content: '';
      margin-top: 14px;
    }
  }

  /* fix placeholder issue on IE11 browsers */
  @media all and (-ms-high-contrast: none) {
    [placeholder]:empty:focus::before {
      content: '';
      margin-bottom: 0px;
    }

    [placeholder]:empty.twc-user-input__text::before {
      height: 0px;
    }
  }

  .twc-user-input__button {
    max-height: 200px;
    margin-left: 2px;
    margin-right: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

  .twc-user-input.twc-active {
    background-color: var(--light-fg-color, #ffffff);
    box-shadow: 0px -4px 15px 0px rgba(201, 201, 201, 0.3);
  }

  .twc-user-input__send-icon-wrapper {
    background: none;
    border: none;
    padding: 0px;
    color: var(--sendicon-fg-color, #263238);
    width: 24px;
    height: 44px;
    cursor: pointer;
  }


  .twc-user-input__upload-icon-wrapper {
    background: none;
    border: none;
    padding: 0;
    width: 24px;
    height: 44px;
    cursor: pointer;
    outline: none;
  }

  .twc-user-input__upload-icon-wrapper {
    color: var(--uploadicon-fg-color, #263238);
  }

  .twc-broken-service-icon::before {
    position: absolute;
    top: 25%;
    left: 0;
    content: '🚫';
    opacity: 0.4;
    font-size: 1.5em;
    line-height: 100%;
  }


  .twc-user-input__send-icon,
  .twc-user-input__upload-icon
  {
    height: 20px;
    width: 20px;
    align-self: center;
  }

  .twc-user-input__button.twc-disabled,
  .twc-user-input__button.twc-disabled button {
    cursor: default;
  }

  .twc-user-input__text::-webkit-scrollbar {
    width: 3px;
  }

  /* Track */
  .twc-user-input__text::-webkit-scrollbar-track {
    background: none; 
    border-radius: 10px;
    margin-top: 2px;
    margin-bottom: 2px;
    box-shadow: none;
  }
  
  /* Handle */
  .twc-user-input__text::-webkit-scrollbar-thumb {
    background: rgb(196, 196, 196); 
    border-radius: 10px;
    }

  /* Increase tap target on mobile */
  @media (max-width: 450px) {
    .twc-user-input__send-icon-wrapper,
    .twc-user-input__upload-icon-wrapper
    {
      width: 44px;
    }

  }
</style>