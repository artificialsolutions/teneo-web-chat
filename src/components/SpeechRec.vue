<template>
    <div class="button-container">
    <button v-if="asrActive"
            @mousedown="startTranscription"
            @mouseup="stopASR"
            @touchstart.prevent="startTranscription"
            @touchend.prevent="stopASR"
            @mouseleave="handleMouseLeave"
            v-html="recordIcon"
            type="button"
            class="asr-button custom-icon"
            ></button>
    <button v-if="ttsActive" 
    @click="stopTTS" 
    v-html="muteIcon" 
    type="button" 
    class="tts-button custom-icon"
    ></button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    userInputFieldId: String,
  },

  data() {
    return {
      transcribing: false,
      recognition: null,
      alertMessage: this.$t('message.webspeech_not_soported'),
      lastResult: ''
    };
  },

  computed: {
    ...mapState(['asrRecordSymbol', 'ttsStopSymbol', 'asrPauseSymbol']),
    ...mapGetters({
      asrActive: 'asrActive',
      ttsActive: 'ttsActive'
    }),
    recordIcon() {
      const recordSymbol = this.asrRecordSymbol || '&#127897;';
      const stopSymbol = this.asrPauseSymbol || '&#9940;';
      return this.transcribing ? stopSymbol : recordSymbol;
    },
    muteIcon() {
      return this.ttsStopSymbol || '&#128263;';
    },
  },

  methods: {
    startTranscription() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (typeof SpeechRecognition === "undefined") {
        alert(this.alertMessage);
        return;
      }
      if (!this.transcribing) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.addEventListener('result', this.resultHandler);
        this.recognition.start();
        this.transcribing = true;
        this.$emit('transcribing', this.transcribing);
      }
    },

    stopASR() {
      if (this.recognition) {
        this.recognition.stop();
      }
      this.transcribing = false;
      this.$emit('transcribing', this.transcribing);
      if (!this.lastResult) {        
        this.$emit('transcriptionComplete', this.lastResult);
      }
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

    stopTTS() {
      window.speechSynthesis.cancel();
    },

    resultHandler(event) {
      this.lastResult = event.results[event.results.length - 1][0].transcript;
      if (event.results[event.results.length - 1].isFinal) {
        this.transcribing = false;
        this.$emit('transcribing', this.transcribing);
        this.$emit('transcriptionComplete', this.lastResult);
        
      }
      this.$emit('transcription', this.lastResult);
    },  
  },
};
</script>

  
<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: space-around; 
  height: 100%; 
  padding: 2.5px 0;
}

.asr-button, .tts-button {
  flex: 0 0 auto; 
  display: flex;
  flex-direction: row; 
  justify-content: center;
  align-items: center; 
  cursor: pointer;
  background: none;
  border: none;
  padding: 10px;
  margin: 5px 0; 
  width: 44px; 
  height: 44px; 
  outline: none;
}

.custom-icon {  
  height: 20px;
  width: 20px;
}

/* Increase tap target on mobile for better accessibility */
@media (max-width: 450px) {
  .asr-button, .tts-button {
    width: 44px;
    height: 44px; 
    padding: 15px;
    margin: 10px 0;
  }
}

.asr-button:hover, .tts-button:hover {
  background-color: var(--hover-bg-color, #eceff1);
}
</style>
  