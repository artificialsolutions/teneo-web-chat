<template>
  <div>
    <form
        class="twc-user-input"
        :class="{ 'twc-active': inputActive, 'twc-disabled': inputDisabled }"
    >
      <div v-if="showAsrButton" class="twc-user-input__button" :class="{ 'twc-disabled': asrDisabled }">
        <button
            role="button"
            tabindex="0"
            ref="asrButton"
            :aria-label="$t('message.input_area_asr_button_aria_label')"
            :title="$t('message.input_area_asr_button_title')"
            class="twc-user-input__asr-icon-wrapper"
            :class="{ 'twc-active': asrActive}"
            :aria-disabled="asrDisabled"
            :disabled="asrDisabled ? true : false"
            @click.prevent=""
            @click="asrButtonClicked($refs.asrButton)"
            data-used="false"
        >
          <img
              v-if="asrIconUrl"
              id="twc-user-input__asr-icon-img"
              class="twc-user-input__asr-icon"
              :src="asrIconUrl"
              aria-hidden="true"
              alt=""
          />
          <AsrIcon
              v-else
              id="twc-user-input__asr-icon"
              class="twc-user-input__asr-icon"
              aria-hidden="true"
          />
        </button>
      </div>
      <div v-if="showTtsButton" class="twc-user-input__button" :class="{ 'twc-disabled': ttsDisabled }">
        <button
            role="button"
            tabindex="0"
            ref="ttsButton"
            :aria-label="$t('message.input_area_tts_button_aria_label')"
            :title="$t('message.input_area_tts_button_title')"
            class="twc-user-input__tts-icon-wrapper"
            :class="{ 'twc-active': ttsActive}"
            :aria-disabled="ttsDisabled"
            :disabled="ttsDisabled ? true : false"
            @click.prevent=""
            @click="ttsButtonClicked($refs.ttsButton)"
        >
          <img
              v-if="ttsIconUrl"
              id="twc-user-input__tts-icon-img"
              class="twc-user-input__tts-icon"
              :src="ttsIconUrl"
              aria-hidden="true"
              alt=""
          />
          <TtsIcon
              v-else
              id="twc-user-input__tts-icon"
              class="twc-user-input__tts-icon"
              aria-hidden="true"
          />
        </button>
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
    <RecordingStartedBeep ref="recordingStartedBeep"/>
    <RecordingEndedBeep ref="recordingEndedBeep"/>
    <RecordingCancelledBeep ref="recordingCancelledBeep"/>
  </div>
</template>

<script>
import Vue from 'vue';
import vueDebounce from 'vue-debounce';
import SendIcon from '../icons/send.vue';
import UploadIcon from '../icons/upload.vue';
import AsrIcon from '../icons/asr.vue';
import TtsIcon from '../icons/tts.vue';
import RecordingStartedBeep from '../sounds/recordingStartedBeep.vue'
import RecordingEndedBeep from '../sounds/recordingEndedBeep.vue'
import RecordingCancelledBeep from '../sounds/recordingCancelledBeep.vue'
import {
  getMSToken,
  processAudioToText,
  processTextToAudio,
  generateText,
  stopAsrRecording,
  stopTTSAudio
} from '../utils/ms-asr-tts'
import {PARTICIPANT_USER} from '../utils/constants.js';
import {
  API_ON_ASR_BUTTON_CLICK,
  API_ON_INPUT_SUBMITTED,
  API_ON_SEND_BUTTON_CLICK,
  API_ON_TTS_BUTTON_CLICK,
  API_ON_UPLOAD_BUTTON_CLICK,
  API_ON_USER_TYPING
} from '../utils/api-function-names.js';
import {EventBus, events} from '../utils/event-bus.js';
import handleExtension from '../utils/handle-extension.js';
import basePayload from '../utils/base-payload.js';
import detectMobile from '../utils/detect-mobile.js';
import {mapState} from 'vuex';
import {store} from "../store/store";

Vue.use(vueDebounce);

export default {
  components: {
    SendIcon,
    UploadIcon,
    AsrIcon,
    TtsIcon,
    RecordingStartedBeep,
    RecordingEndedBeep,
    RecordingCancelledBeep
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
    ...mapState(['sendIconUrl', 'showUploadButton', 'uploadIconUrl', 'showAsrButton', 'asrIconUrl', 'showTtsButton', 'ttsIconUrl']),
  },
  data() {
    return {
      inputActive: false,
      inputDisabled: false,
      uploadDisabled: false,
      asrDisabled: false,
      ttsDisabled: false,
      asrActive: store.getters.asrActive,
      ttsActive: store.getters.ttsActive
    };
  },

  mounted() {
    EventBus.$on(events.MESSAGE_SENT, () => {
      if (this.$refs.userInput) {
        this.$refs.userInput.focus();
      }
    });

    EventBus.$on(events.BOT_MESSAGE_RECEIVED, async (messageData) => {
      if (this.ttsActive) {
        let utteranceString = generateText(messageData);
        let _this = this;
        this.msTokenCheck().then(() => {
          processTextToAudio(store.getters.msCognitiveToken, store.getters.msCognitiveRegion, store.getters.locale, utteranceString).then(function () {
            window.twcAudioPlayer.onAudioEnd = function () {
              if (_this.$refs.asrButton.dataset.used === "true") {
                _this.asrButtonClicked(_this.$refs.asrButton)
              }
            }
          })
        })
      }
    })

    EventBus.$on(events.DISABLE_UPLOAD, () => {
      if (this.showUploadButton) {
        if (this.$refs.uploadButton) {
          this.$refs.uploadButton.setAttribute('disabled', 'true');
        }
        this.setUploadDisabled(true);
      }
    });

    EventBus.$on(events.ENABLE_UPLOAD, () => {
      if (this.showUploadButton) {
        if (this.$refs.uploadButton) {
          this.$refs.uploadButton.removeAttribute('disabled');
        }
        this.setUploadDisabled(false);
      }
    });
    EventBus.$on(events.DISABLE_ASR, () => {
      if (this.showAsrButton) {
        if (this.$refs.asrButton) {
          this.$refs.asrButton.setAttribute('disabled', 'true');
        }
        this.setAsrDisabled(true);
      }
    });

    EventBus.$on(events.ENABLE_ASR, () => {
      if (this.showAsrButton) {
        if (this.$refs.asrButton) {
          this.$refs.asrButton.removeAttribute('disabled');
        }
        this.setAsrDisabled(false);
      }
    });

    EventBus.$on(events.ASR_ACTIVE, () => {
      if (this.showAsrButton && this.$refs.asrButton) {
        this.asrButtonClicked(this.$refs.asrButton)
      }
    });

    EventBus.$on(events.ASR_INACTIVE, () => {
      if (this.showAsrButton && this.$refs.asrButton) {
        this.setAsrActive(false);
        stopAsrRecording();
        this.$refs.recordingCancelledBeep.$el.play()
      }
    });


    EventBus.$on(events.DISABLE_TTS, () => {
      if (this.showTtsButton) {
        if (this.$refs.ttsButton) {
          this.$refs.ttsButton.setAttribute('disabled', 'true');
        }
        this.setTtsDisabled(true);
      }
    });

    EventBus.$on(events.ENABLE_TTS, () => {
      if (this.showTtsButton) {
        if (this.$refs.ttsButton) {
          this.$refs.ttsButton.removeAttribute('disabled');
        }
        this.setTtsDisabled(false);
      }
    });
    EventBus.$on(events.TTS_ACTIVE, () => {
      if (this.showTtsButton && this.$refs.ttsButton) {
        this.setTtsActive(true);
      }
    });

    EventBus.$on(events.TTS_INACTIVE, () => {
      if (this.showTtsButton && this.$refs.ttsButton) {
        this.setTtsActive(false);
        stopTTSAudio();
      }
    });
    EventBus.$on(events.DISABLE_INPUT, () => {
      this.setInputActive(false);
      this.setInputDisabled(true);

      if (document.getElementById('twc-user-input-field')) {
        document.getElementById('twc-user-input-field')
            .blur();
      }
    });

    EventBus.$on(events.ENABLE_INPUT, () => {
      this.setInputDisabled(false);
      this.setInputActive(true);

      if (document.getElementById('twc-user-input-field')) {
        document.getElementById('twc-user-input-field')
            .focus();
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
  methods: {
    setInputActive(onoff) {
      this.inputActive = onoff;
      if (onoff === true) {
        EventBus.$emit(events.SCROLL_CHAT_DOWN);
      }
    },

    setAsrActive(onoff) {

      this.asrActive = onoff;
    },
    setTtsActive(onoff) {
      this.ttsActive = onoff;
    },
    setInputDisabled(onoff) {
      this.inputDisabled = onoff;
    },
    setUploadDisabled(onoff) {
      this.uploadDisabled = onoff;
    }, setAsrDisabled(onoff) {
      this.asrDisabled = onoff;
    }, setTtsDisabled(onoff) {
      this.ttsDisabled = onoff;
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
    async sendButtonClicked() {
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
    msTokenCheck() {
      return new Promise(resolve => {
        let now = Date.now();
        if (now - store.getters.msCognitiveTokenTimeStamp >= 540000) {
          getMSToken(store.getters.msCognitiveRegion, store.getters.msCognitiveSubscriptionKey)
              .then((token) => {
                store.commit('msCognitiveToken', token);
                resolve();
              })
        } else {
          resolve();
        }
      })
    },
    async asrButtonClicked(e) {
      //Send system message with instructions on first click, mark button as used so it won't repeat
      let firstClick = false;
      if (e.dataset.used !== "true") {
        e.dataset.used = "true";
        firstClick = true;
        EventBus.$emit(events.ADD_MESSAGE, {
          'type': 'system',
          'data': {
            'text': this.$t('message.first_use_asr_system_message')
          }
        });
      }
      //Check if any extensions are set up to handle them. If not, use default functionality with Azure.
      let asrExtension = await handleExtension(API_ON_ASR_BUTTON_CLICK, e);
      if (!asrExtension) {
        if (this.asrActive && window.twcRecognizer) {
          this.setAsrActive(false);
          this.$refs.recordingCancelledBeep.$el.play()
          stopAsrRecording();
        } else {
          this.setAsrActive(true);

          new Promise(resolve => {

            if (firstClick) {
              window.twcAudioPlayer.onAudioEnd = function () {
                resolve();
              }
            }
            else{
              resolve()
            }
          }).then(()=>{
            this.$refs.recordingStartedBeep.$el.play();
            this.msTokenCheck().then(() => {
              processAudioToText(store.getters.msCognitiveToken, store.getters.msCognitiveRegion, store.getters.locale)
                  .then(async (processedText) => {
                    if (typeof processedText === 'string' && this.asrActive) {
                      this.$refs.userInput.value = processedText;
                      this.$refs.recordingEndedBeep.$el.play();
                      await this._submitText();
                    } else {
                      console.log('ASR recognition failed or cancelled')
                    }
                    this.setAsrActive(false);

                  })

            })
          })


        }
      }
    },
    async ttsButtonClicked(e) {
      let ttsExtension = await handleExtension(API_ON_TTS_BUTTON_CLICK, e);
      if (!ttsExtension) {
        this.setTtsActive(!this.ttsActive);
        if (!this.ttsActive && window.hasOwnProperty('twcAudioPlayer')) {
          stopTTSAudio();
        }
      }
    },
    async _submitText() {
      // Create payload object
      const payload = basePayload();

      // Add user input to base payload
      payload.text = this.$refs.userInput.value;

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
        const {text} = payload;

        let parameters = {};

        if (payload.parameters) {
          parameters = payload.parameters;
        }

        this.onSubmit({
          author: PARTICIPANT_USER,
          type: 'text',
          data: {
            text,
            parameters,
          },
        });
      }

      // Don't give user input focus on mobile devices, keyboard blocks the view too much
      if (!detectMobile()) {
        this.$refs.userInput.focus();
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
  min-height: 55px;
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
.twc-user-input.twc-disabled .twc-user-input__button,
.twc-user-input.twc-disabled .twc-user-input__send-icon,
.twc-user-input.twc-disabled .twc-user-input__upload-icon,
.twc-user-input.twc-disabled .twc-user-input__asr-icon,
.twc-user-input.twc-disabled .twc-user-input__tts-icon {
  filter: grayscale(100%);
  opacity: 0.4;
}

/* 
When the upload, asr or tts buttons are disabled and then the input box is disabled as well
We should not dim it twice, so we check: .twc-user-input:not(.twc-disabled)
*/
.twc-user-input:not(.twc-disabled) .twc-user-input__button.twc-disabled .twc-user-input__upload-icon-wrapper,
.twc-user-input:not(.twc-disabled) .twc-user-input__button.twc-disabled .twc-user-input__asr-icon-wrapper,
.twc-user-input:not(.twc-disabled) .twc-user-input__button.twc-disabled .twc-user-input__tts-icon-wrapper {
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
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--user-input-fg-color, #565867);
  background-color: transparent;
  -webkit-font-smoothing: antialiased;
  max-height: 200px;
  min-height: 44px;
  overflow: scroll;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
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


.twc-user-input__upload-icon-wrapper,
.twc-user-input__asr-icon-wrapper,
.twc-user-input__tts-icon-wrapper {
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

.twc-user-input__asr-icon-wrapper {
  color: var(--asricon-fg-color, #263238);
}

.twc-user-input__tts-icon-wrapper {
  color: var(--ttsicon-fg-color, #263238);
}


.twc-user-input__send-icon,
.twc-user-input__upload-icon,
.twc-user-input__asr-icon,
.twc-user-input__tts-icon {
  height: 20px;
  width: 20px;
  align-self: center;
}

.twc-user-input__asr-icon-wrapper.twc-active {
  fill: var(--asricon-active-color, darkred);
  stroke: var(--asricon-active-color, red);
  filter: grayscale(0);
  opacity: 100%;
}

.twc-user-input__tts-icon-wrapper.twc-active {
  fill: var(--ttsicon-active-color, darkred);
  stroke: var(--ttsicon-active-color, red);
  filter: grayscale(0);
  opacity: 100%;
}


.twc-user-input__button.twc-disabled,
.twc-user-input__button.twc-disabled button {
  cursor: default;
}

/* Increase tap target on mobile */
@media (max-width: 450px) {
  .twc-user-input__send-icon-wrapper,
  .twc-user-input__upload-icon-wrapper,
  .twc-user-input__asr-icon-wrapper,
  .twc-user-input__tts-icon-wrapper {
    width: 44px;
  }

}
</style>
