<template>
  <div>
    <button v-if="asrActive"
            @mousedown="startTranscription"
            @mouseup="stopASR"
            @touchstart.prevent="startTranscription"
            @touchend.prevent="stopASR"
            @mouseleave="handleMouseLeave"
            v-html="recordIcon"
            type="button"></button>
    <button v-if="ttsActive" @click="stopTTS" v-html="muteIcon" type="button"></button>
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
      if (this.recognition && this.transcribing) {
        this.recognition.stop();
        this.transcribing = false;
        if (this.ttsActive && this.lastResult) {
          this.readTranscription(this.lastResult);
        }
        this.$emit('transcriptionComplete', this.lastResult);
        this.$emit('transcribing', this.transcribing);
        this.$emit('transcription', this.lastResult);
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
      this.$emit('transcription', this.lastResult);
    },
  },
};
</script>

  
  <style scoped>
    .stop {
      background-color: red;
    }
  </style>
  