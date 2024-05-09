<template>
  <div class="button-container">
    <button
      v-if="asrActive"
      type="button"
      :class="asrButtonClass"
      @mousedown="asrStartRecognition"
      @mouseup="asrStop"
      @touchstart.prevent="asrStartRecognition"
      @touchend.prevent="asrStop"
      @mouseleave="handleMouseLeave"
    >
      <span v-if="asrRecordingSymbol && buttonPressed ">{{ asrRecordingSymbol }}</span>
      <span v-else-if="asrRecordSymbol && !buttonPressed && !transcribing">{{ asrRecordSymbol }}</span>
      <AsrIcon v-else aria-hidden="true" />
    </button>
    <button
      v-if="ttsActive"
      type="button"
      :class="ttsButtonClass"
      @click="toggleTTS"
    >
      <span v-if="ttsSymbol && readIncomingMessages">{{ ttsSymbol }}</span>
      <span v-else-if="ttsStopSymbol && !readIncomingMessages">{{ ttsStopSymbol }}</span>
      <MuteIcon v-else-if="!ttsStopSymbol && !readIncomingMessages" aria-hidden="true" />
      <TtsIcon v-else aria-hidden="true" />
    </button>
    <RecordingStartedBeep ref="recordingStartedBeep" />
    <RecordingEndedBeep ref="recordingEndedBeep" />
    <RecordingCancelledBeep ref="recordingCancelledBeep" />
  </div>
</template>

<script>
import { EventBus, events } from '../utils/event-bus.js';
import { mapState, mapGetters } from 'vuex';
import AsrIcon from '../icons/asr.vue';
import MuteIcon from '../icons/mute.vue';
import TtsIcon from '../icons/tts.vue';
import RecordingStartedBeep from '../sounds/recordingStartedBeep.vue';
import RecordingEndedBeep from '../sounds/recordingEndedBeep.vue';
import RecordingCancelledBeep from '../sounds/recordingCancelledBeep.vue';
import { store } from '../store/store';
import AsrTtsApi from '../utils/asr-tts-api.js';

export default {
  components: {
    AsrIcon,
    MuteIcon,
    TtsIcon,
    RecordingStartedBeep,
    RecordingEndedBeep,
    RecordingCancelledBeep
  },

  data() {
    return {
      transcribing: false,
      buttonPressed: false,
      lastResult: '',
      readIncomingMessages: true,
      asrTtsApi: new AsrTtsApi(),
      ttsTextQueue: [],
      ttsInProcess: false,
    };
  },

  computed: {
    ...mapState(['asrRecordSymbol', 'ttsSymbol', 'ttsStopSymbol', 'asrRecordingSymbol']),
    ...mapGetters({
      asrActive: 'asrActive',
      ttsActive: 'ttsActive'
    }),
    asrButtonClass() {
      return {
        'asr-button': true,
        'custom-icon': true,
        'recording': this.buttonPressed,
        'asr-idle': !this.buttonPressed
      };
    },
    ttsButtonClass() {
      return {
        'tts-button': true,
        'custom-icon': true,
        'tts-enabled': this.readIncomingMessages,
        'tts-disabled': !this.readIncomingMessages
      };
    }

  },

  mounted() {
    EventBus.$on(events.BOT_MESSAGE_RECEIVED, (message) => {
      if (this.ttsActive && this.readIncomingMessages) {
        const { data } = message;
        const { lang } = document.documentElement;
        const { locale, voice } = store.getters;

        // Here we piece back together the messages that were split in parse-teneo-response
        const ttsMessage = {
          text: this.extractTextValuesRecurse(data),
          lang: locale || lang,
          voice,
        };

        this.ttsTextQueue.push(ttsMessage);
        this.ttsProcessQueue();
      }
    });

    EventBus.$on(events.MESSAGE_SENT, () => {
      this.ttsStop();
    });

    EventBus.$on(events.STOP_ASR_TTS, () => {
      this.asrStop();
      this.ttsStop();
    });
  },

  beforeDestroy() {
    EventBus.$off(events.BOT_MESSAGE_RECEIVED);
    EventBus.$off(events.STOP_ASR_TTS);
  },

  methods: {
    async ttsProcessQueue() {
      if (!this.ttsInProcess) {
        let nextMessage = null;

        this.ttsInProcess = true;

        while (typeof (nextMessage = this.ttsTextQueue.shift()) !== 'undefined') {
          // eslint-disable-next-line no-await-in-loop
          await this.ttsReadText(nextMessage.text, nextMessage.lang, nextMessage.voice);
        }
        this.ttsInProcess = false;
      }
    },

    async asrStartRecognition() {
      const asrAvailable = await this.asrTtsApi.asrEnsureAvailable();

      if (!asrAvailable) {
        console.error('ASR Not Available');

        return;
      }

      this.ttsStop();
      this.asrTtsApi.asrCleanup();

      this.buttonPressed = true;
      this.$refs.recordingStartedBeep.$el.play();

      this.startTranscribing();
    },

    startTranscribing() {
      if (!this.transcribing) {
        const { lang } = document.documentElement;

        this.asrTtsApi.asrStartRecognition(lang, this.asrHandleFinalResult, this.asrHandleCancel, this.asrHandleIntermediateResult);
        this.transcribing = true;
        this.$emit('transcribing', this.transcribing);
      }
    },

    asrHandleCancel() {
      this.transcribing = false;
      this.$emit('transcribing', this.transcribing);
      this.$refs.recordingCancelledBeep.$el.play();
      this.buttonPressed = false;
    },

    asrHandleFinalResult(transcribedText) {
      this.$emit('transcriptionComplete', transcribedText);

      this.transcribing = false;
      this.$emit('transcribing', this.transcribing);
      this.$refs.recordingEndedBeep.$el.play();
      this.buttonPressed = false;
    },

    asrHandleIntermediateResult(transcribedText) {
      this.$emit('transcription', transcribedText);
    },

    async asrStop() {
      await this.asrTtsApi.asrCleanup();

      this.buttonPressed = false;
      if (this.transcribing) {
        this.transcribing = false;
        this.$emit('transcribing', this.transcribing);
      }
    },

    async ttsReadText(text, lang, voice) {
      const ttsAvailable = await this.asrTtsApi.ttsEnsureAvailable();

      if (!ttsAvailable) {
        console.error('TTS Not Available');

        return;
      }

      await this.asrTtsApi.ttsReadText(text, lang, voice);
      this.$forceUpdate();
    },

    async ttsStop() {
      this.ttsInProcess = false;
      this.ttsTextQueue = [];
      await this.asrTtsApi.ttsStop();
    },

    handleMouseLeave() {
      if (this.transcribing) {
        this.asrStop();
      }
    },

    toggleTTS() {
      this.ttsStop();
      this.readIncomingMessages = !this.readIncomingMessages;
    },

    extractTextValues(messageData) {

      /*
       * This array defines the values which should be considered text
       * and therefore which values should be read by TTS
       * It also defines the ORDER (left to right) in which they will
       * be read if more than one exists in a message
       */
      const validValues = ['title', 'subtitle', 'text', 'alt'];

      return validValues
        .filter((value) => Object.prototype.hasOwnProperty.call(messageData, value))
        .map((value) => this.cleanHTMLFromText(messageData[value]));
    },

    extractTextValuesRecurse(messageData) {
      const textValues = this.extractTextValues(messageData);

      const subValues = Object.values(messageData)
        .filter((value) => Array.isArray(value) && value.length > 0)
        .flatMap((array) => array.flatMap((entry) => this.extractTextValuesRecurse(entry)));

      return textValues.concat(subValues);
    },

    cleanHTMLFromText(text) {
      return new DOMParser().parseFromString(text, 'text/html').body.textContent || '';
    },
  }
};
</script>


<style scoped>
.button-container {
  max-height: 200px;
  margin-left: 2px;
  margin-right: 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.asr-button, .tts-button {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 10px;
  margin: 5px 0;
  width: 44px;
  height: 44px;
  outline: none;
  color: var(--sendicon-fg-color,#263238);
}

.custom-icon {
  background: none;
  border: none;
  padding: 2px;
  padding-top: 15px;
  padding-bottom: 10px;
  width: 24px;
  height: 44px;
  cursor: pointer;
}

.custom-icon.asr-idle
.custom-icon.tts-enabled
 {
  color: var(--sendicon-fg-color,#263238);
}

@media (max-width: 450px) {
  .asr-button, .tts-button {
    width: 44px;
    height: 44px;
    padding: 15px;
    margin: 10px 0;
  }
}
.custom-icon.tts-disabled
 {
  color: var(--expired-color,#263238);
}

.custom-icon.recording
{
  color: var(--recording-color,#FF0000);
}
</style>
