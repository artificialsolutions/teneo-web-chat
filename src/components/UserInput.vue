<template>
  <div v-if="showUserInput">
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
            :class="{ 'twc-active': asrActive,  'twc-broken-service-icon': asrBroken}"
            :aria-disabled="asrDisabled"
            :disabled="asrDisabled ? true : false"
            @click.prevent=""
            @click="asrButtonClicked($refs.asrButton)"
            data-used="false"
            data-cancelled="false"
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
            :class="{ 'twc-active': ttsActive, 'twc-broken-service-icon': ttsBroken}"
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
import DOMPurify from 'isomorphic-dompurify';

import {
  getMSTokenFromRegion,
  getMSTokenFromCustomUrl,
  processAudioToText,
  processTextToAudio,
  generateText,
  stopAsrRecording,
  stopTTSAudio
} from '../utils/ms-asr-tts'
import {PARTICIPANT_USER} from '../utils/constants.js';
import {API_GET_CHAT_HISTORY} from '../utils/api-function-names';
import {BUBBLE_DELAY} from '../utils/constants';
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


const isProvidedWithInput = m => {
    if (m) {
        var x = m.type;
        if (x && (x === 'buttons' || x === 'clickablelist' || x === 'quickreply' || x === 'form')) return true;
        if (Array.isArray(m)) {
            x = m.length;
            while (--x >= 0) {
                if (isProvidedWithInput(m[x])) return true;
            }
        } else if ('object' === typeof m) {
            for (x in m) {
                if (m.hasOwnProperty(x) && (x === 'postback' || x === 'parameters' || isProvidedWithInput(m[x]))) return true;
            }
        }
    }
    return false;
},


isLikelyCtaMessage = m => m && m.author !== PARTICIPANT_USER && m.type !== 'system' && m.type !== 'text' && isProvidedWithInput(m),


addSystemMessage = s => {
  var h = window.TeneoWebChat.get(API_GET_CHAT_HISTORY);
  h = h[h.length - 1];

  EventBus.$emit(events.ADD_MESSAGE, {
    'type': 'system',
    'data': {
      'text': s
    },
    'placeInQueue': 1,
    'queueLength': 1
  });
  if (isLikelyCtaMessage(h)) {
      // Repeat the last message if it contains CTAs
      h = Object.assign({}, h);
      h._skipTts = true;
      setTimeout(() => EventBus.$emit(events.ADD_MESSAGE, h), BUBBLE_DELAY);
  }
};


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
      asrBroken: false,
      ttsBroken: false,
      asrActive: store.getters.asrActive,
      ttsActive: store.getters.ttsActive,
      ttsCumulativeText: '',
      isCancellation: false,
      showUserInput: true
    };
  },

  mounted() {
    EventBus.$on(events.STOP_ASR_TTS, () => {
      this.stopAsr();
      this.stopTts();
    });

    /*
    EventBus.$on(events.UPLOAD_PANEL_OPENED, () => {
      this.showUserInput = false;      
    });
    EventBus.$on(events.UPLOAD_PANEL_CLOSED, () => {
      this.showUserInput = true;
    });


    EventBus.$on(events.MESSAGE_SENT, () => {
      if (this.$refs.userInput) {
        this.$refs.userInput.focus();
      }
    });
    */

    EventBus.$on(events.BOT_MESSAGE_RECEIVED, async (message) => {
      if (!this.ttsActive || message._skipTts) return;
      stopTTSAudio();
      if (!message.placeInQueue || message.placeInQueue === 1) {
        this.ttsCumulativeText = generateText(message.data);
      } else {
        this.ttsCumulativeText += '\n' + generateText(message.data);
      }
      if (message.placeInQueue === message.queueLength) {
        const cumulativeText = this.ttsCumulativeText;
        this.ttsCumulativeText = '';
        this.msAuthCheck(false).then(m => {
          m.locale = store.getters.locale;
          m.voice = store.getters.msVoice;
          m.textToRead = cumulativeText;
          processTextToAudio(m).catch(e => {
            console.error('Error converting text to audio', e);
            this.ttsDisabled = true;
            this.ttsBroken = true;
          });
        }).catch(e => {
          console.error('Error getting authentication token for TTS', e);
          this.ttsDisabled = true;
          this.ttsBroken = true;
        })
      }
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

    EventBus.$on(events.DISABLE_ASR, () => {
      if (this.showAsrButton) {
        if (this.$refs.asrButton) {
          this.$refs.asrButton.setAttribute('disabled', 'true');
        }
        this.asrDisabled = true;
      }
    });

    EventBus.$on(events.ENABLE_ASR, () => {
      if (this.showAsrButton) {
        if (this.$refs.asrButton) {
          this.$refs.asrButton.removeAttribute('disabled');
        }
        this.asrDisabled = false;
      }
    });

    EventBus.$on(events.ASR_ACTIVE, () => {
      if (this.showAsrButton && this.$refs.asrButton) {
        this.asrButtonClicked(this.$refs.asrButton)
      }
    });

    EventBus.$on(events.ASR_INACTIVE, () => {
      if (this.showAsrButton && this.$refs.asrButton) {
        this.asrActive = false;
        stopAsrRecording();
        this.$refs.recordingCancelledBeep.$el.play()
      }
    });

    EventBus.$on(events.DISABLE_TTS, () => {
      if (this.showTtsButton) {
        if (this.$refs.ttsButton) {
          this.$refs.ttsButton.setAttribute('disabled', 'true');
        }
        this.ttsDisabled = true;
        this.ttsCumulativeText = '';
      }
    });

    EventBus.$on(events.ENABLE_TTS, () => {
      if (this.showTtsButton) {
        if (this.$refs.ttsButton) {
          this.$refs.ttsButton.removeAttribute('disabled');
        }
        this.ttsDisabled = false;
      }
    });

    EventBus.$on(events.TTS_ACTIVE, () => {
      if (this.showTtsButton && this.$refs.ttsButton) {
        this.ttsActive = true;
      }
    });

    EventBus.$on(events.TTS_INACTIVE, () => {
      if (this.showTtsButton && this.$refs.ttsButton) this.stopTts();
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
    EventBus.$off(events.STOP_ASR_TTS);
  },

  methods: {
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


    msAuthCheck(bAsr) {
      const m = {};
      var bSpecific, x = bAsr ? store.getters.msCognitiveAsrSubscriptionKey : store.getters.msCognitiveTtsSubscriptionKey;
      if (x) bSpecific = true;
      else x = store.getters.msCognitiveSubscriptionKey;
      if (x != null) m.subscriptionKey = x;

      x = bAsr ? store.getters.msCognitiveAsrRegion : store.getters.msCognitiveTtsRegion;
      if (x) bSpecific = true;
      else x = store.getters.msCognitiveRegion;
      if (x) m.region = x;

      x = bAsr ? store.getters.msCognitiveAsrSubscriptionOnly : store.getters.msCognitiveTtsSubscriptionOnly;
      if (x === undefined) x = store.getters.msCognitiveSubscriptionOnly;
      if (x) {
        return m.subscriptionKey ? Promise.resolve(m) : Promise.reject('Missing subscription key for direct subscription');
      }

      x = bAsr ? store.getters.msCognitiveAsrEndpoint : store.getters.msCognitiveTtsEndpoint;
      if (x) bSpecific = true;
      else x = store.getters.msCognitiveEndpoint;
      if (x) {
        try {
          m.endpointURL = new URL(x);
        } catch(err) {
          return Promise.reject('Bad cognitive endpoint [' + x + ']');
        }
      }

      x = bAsr ? store.getters.msCognitiveAsrHost : store.getters.msCognitiveTtsHost;
      if (x) bSpecific = true;
      else x = store.getters.msCognitiveHost;
      if (x) {
        try {
          m.hostURL = new URL(x);
        } catch(err) {
          return Promise.reject('Bad cognitive host [' + x + ']');
        }
      }

      if (bAsr) {
        x = store.getters.msCognitiveAsrToken;
        if (x) {
          if (Date.now() - store.getters.msCognitiveAsrTokenTimeStamp < 540000) m.token = x;
          else store.commit('msCognitiveAsrToken', '');
        }
      } else {
        x = store.getters.msCognitiveTtsToken;
        if (x) {
          if (Date.now() - store.getters.msCognitiveTtsTokenTimeStamp < 540000) m.token = x;
          else store.commit('msCognitiveTtsToken', '');
        }
      }
      // Here, x means a specific token exists
      if (x) bSpecific = true;
      else if (store.getters.msCognitiveToken) {
        if (Date.now() - store.getters.msCognitiveTokenTimeStamp < 540000) {
          // No specific token exists, but a general token does, and it is still valid
          m.token = store.getters.msCognitiveToken;
        } else {
          store.commit('msCognitiveToken', '');
        }
      }
      // Here, !m.token means no token or token expired

      if (!m.token) {
        if (bAsr) {
          x = store.getters.msCognitiveAsrCustomAuthTokenUrl;
          if (x) x = getMSTokenFromCustomUrl(x, m.subscriptionKey);
          else {
            x = store.getters.msCognitiveAsrRegion;
            if (x) x = getMSTokenFromRegion(x, m.subscriptionKey);
          }
        } else {
          x = store.getters.msCognitiveTtsCustomAuthTokenUrl;
          if (x) x = getMSTokenFromCustomUrl(x, m.subscriptionKey);
          else {
            x = store.getters.msCognitiveTtsRegion;
            if (x) x = getMSTokenFromRegion(x, m.subscriptionKey);
          }
        }
        // Here, !x means no specific token was used
        if (x) bSpecific = true;
        else {
          x = store.getters.msCognitiveCustomAuthTokenUrl;
          if (x) x = getMSTokenFromCustomUrl(x, m.subscriptionKey);
          else {
            x = store.getters.msCognitiveRegion;
            if (x) x = getMSTokenFromRegion(x, m.subscriptionKey);
          }
        }
        if (x) {
          // A token is used
          return x.then(token => {
            store.commit(bSpecific ? (bAsr ? 'msCognitiveAsrToken' : 'msCognitiveTtsToken') : 'msCognitiveToken', token);
            m.token = token;
            return m;
          });
        }
      }
      return Promise.resolve(m);
    },


    stopAsr() {
      this.asrActive = false;
      stopAsrRecording();
    },


    async asrButtonClicked(e) {
      // Check if any extensions are set up to handle them.
      // If not, use default functionality with Azure.
      if (await handleExtension(API_ON_ASR_BUTTON_CLICK, e)) return;

      if (!window.isSecureContext) {
        console.log('Insecure Context, use of ASR requires an SSL-enabled location.');
        if (window.location.protocol !== 'https:') {
          console.log('Page is on HTTPS, but the certificate is not accepted. You may need to change certificates or force your browser to accept the context as secure.')
        }
        this.asrDisabled = true;
        return;
      }

      if (this.asrActive) {
        // Listening mode is on, so here it is toggled to off and the recording is stopped
        e.dataset.cancelled = "true";
        this.$refs.recordingCancelledBeep.$el.play();
        this.stopAsr();
        return;
      }

      // Send system message with instructions on first click,
      // mark button as used so it won't repeat
      var firstClick;
      if (e.dataset.used !== "true") {
        e.dataset.used = "true";
        firstClick = true;

        addSystemMessage(this.$t('message.first_use_asr_system_message'));
      }
      this.asrActive = true;

      new Promise(resolve => {
        if (firstClick) {
          setTimeout(() => {
            if (this.ttsActive && window.twcTmp.twcAudioPlayer) {
              // Let first the 'message.first_use_asr_system_message'
              // announcement play to th end
              window.twcTmp.twcAudioPlayer.onAudioEnd = resolve;
            } else {
              resolve();
            }
          }, 200);
        } else {
          resolve();
        }
      }).then(() => {
        if (!this.asrActive) return;
        this.$refs.recordingStartedBeep.$el.play();
        this.msAuthCheck(true).then(m => {
          if (!this.asrActive) return;
          m.locale = store.getters.locale;
          processAudioToText(m).then(async (processedText) => {
            if (!this.asrActive) return;
            this.asrActive = false;
            if (typeof processedText === 'string') {
              this.$refs.userInput.value = processedText;
              this.$refs.recordingEndedBeep.$el.play();
              await this._submitText();
            } else {
              console.warn('ASR recognition failed');
              addSystemMessage('Automatic speech recognition error 1');
            }
          }, e => {
            if (!this.asrActive) return;
            this.asrActive = false;
            this.asrBroken = true;
            this.asrDisabled = true;
            console.warn('Error processing audio to text', e);
            addSystemMessage('Automatic speech recognition error 2');
          });
        }).catch(e => {
          console.error('Error getting authentication token for ASR', e);
          addSystemMessage('Automatic speech recognition error 3');
          this.asrActive = false;
          this.asrDisabled = true;
          this.asrBroken = true;
        });
      });
    },

    stopTts() {
      this.ttsActive = false;
      this.ttsCumulativeText = '';
      stopTTSAudio();
    },

    async ttsButtonClicked(e) {
      if (await handleExtension(API_ON_TTS_BUTTON_CLICK, e)) return;
      if (this.ttsActive) this.stopTts();
      else this.ttsActive = true;
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

.twc-broken-service-icon::before {
  position: absolute;
  top: 25%;
  left: 0;
  content: '🚫';
  opacity: 0.4;
  font-size: 1.5em;
  line-height: 100%;
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
  .twc-user-input__upload-icon-wrapper,
  .twc-user-input__asr-icon-wrapper,
  .twc-user-input__tts-icon-wrapper {
    width: 44px;
  }

}
</style>