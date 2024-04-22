<template>
  <div class="button-container">
    <button
      v-if="asrActive"
      type="button"
      :class="asrButtonClass"
      @mousedown="startTranscription"
      @mouseup="stopASR"
      @touchstart.prevent="startTranscription"
      @touchend.prevent="stopASR"
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
  </div>
</template>

<script>
import { EventBus } from '../utils/event-bus.js';
import { mapState, mapGetters } from 'vuex';
import AsrIcon from '../icons/asr.vue';
import MuteIcon from '../icons/mute.vue';
import TtsIcon from '../icons/tts.vue';

export default {
  components: {
    AsrIcon,
    MuteIcon,
    TtsIcon
  },

  data() {
    return {
      transcribing: false,
      buttonPressed: false,
      recognition: null,
      alertMessage: this.$t('message.webspeech_not_supported'),
      lastResult: '',
      readIncomingMessages: true

    };
  },

  computed: {
    ...mapState(['asrRecordSymbol', 'ttsSymbol','ttsStopSymbol', 'asrRecordingSymbol']),
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
    EventBus.$emit('tts-state-change', this.readIncomingMessages);
  },

  methods: {
    startTranscription() {
      this.buttonPressed = true;

      // Before creating a new SpeechRecognition cleanup
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (typeof SpeechRecognition === "undefined") {
        alert(this.alertMessage);
        return;
      }
      if (!this.transcribing) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.recognition.interimResults = !isMobile;
        this.recognition.addEventListener('result', this.resultHandler);
        this.recognition.addEventListener('end', this.endHandler);
        this.recognition.start();
        this.transcribing = true;
        this.$emit('transcribing', this.transcribing);
      }
    },

    stopASR() {
      this.buttonPressed = false;
      if (this.recognition) {
        this.recognition.stop();
      }
      this.transcribing = false;
      this.$emit('transcribing', this.transcribing);
    },

    readTranscription(text) {
         const utterance = new SpeechSynthesisUtterance(text);

         window.speechSynthesis.speak(utterance);
         this.$forceUpdate();
    },

    handleMouseLeave() {
      if (this.transcribing) {
        this.stopASR();
      }
    },

    toggleTTS() {
      window.speechSynthesis.cancel();
       this.readIncomingMessages = !this.readIncomingMessages;
       EventBus.$emit('tts-state-change', this.readIncomingMessages);

    },

    resultHandler(event) {
      const transcriptString = event.results[event.results.length - 1][0].transcript;

      this.$emit('transcription', transcriptString);
      if (event.results[event.results.length - 1].isFinal) {
        this.$emit('transcriptionComplete', transcriptString);
      }
    },

    endHandler() {
      this.transcribing = false;
      this.$emit('transcribing', this.transcribing);
    }
  },
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

