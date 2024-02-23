<template>
  <div class="button-container">
    <button v-if="asrActive"
            @mousedown="startTranscription"
            @mouseup="stopASR"
            @touchstart.prevent="startTranscription"
            @touchend.prevent="stopASR"
            @mouseleave="handleMouseLeave"
            type="button"
            class="asr-button custom-icon"> 
       <span v-if="!transcribing && asrRecordSymbol" v-html="asrRecordSymbol"></span>
      <span v-if="buttonPressed && !transcribing && ttsStopSymbol" v-html="ttsStopSymbol"></span>
      <AsrMuteIcon v-if="buttonPressed && transcribing" class="custom-icon" aria-hidden="true" />
      <AsrIcon v-else class="custom-icon" aria-hidden="true" />

      
    </button>
    <button v-if="ttsActive" 
            @click="stopTTS"     
            type="button" 
            class="tts-button custom-icon">
      <span v-if="ttsStopSymbol" v-html="ttsStopSymbol"></span>
      <ttsIcon v-else class="custom-icon" aria-hidden="true"/>
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AsrIcon from '../icons/asr.vue';
import AsrMuteIcon from '../icons/asr-mute.vue';
import ttsIcon from '../icons/tts.vue';

export default {
  components: {
    AsrIcon,
    AsrMuteIcon,
    ttsIcon
  },
  props: {
    userInputFieldId: String,
  },
  data() {
    return {
      transcribing: false,
      buttonPressed: false,
      recognition: null,
      alertMessage: this.$t('message.webspeech_not_supported'),
      lastResult: ''
    };
  },

  computed: {
    ...mapState(['asrRecordSymbol', 'ttsStopSymbol', 'asrPauseSymbol']),
    ...mapGetters({
      asrActive: 'asrActive',
      ttsActive: 'ttsActive'
    }),
    
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

    stopTTS() {
      window.speechSynthesis.cancel();
    },

    resultHandler(event) {
      //Transcript as String
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
  background-color: #f0f0f0; 
  border: none;
  border-radius: 4px;
  padding: 10px;
  margin: 5px 0; 
  width: 44px; 
  height: 44px; 
  outline: none;
}

.custom-icon {
  background: none;
  border: none;
  padding: 0px;
  color: var(--sendicon-fg-color, #263238);
  width: 20px;
  height: 20px;
  cursor: pointer;  
}

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

  