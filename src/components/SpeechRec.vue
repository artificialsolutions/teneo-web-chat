<template>
    <div>
      <button v-if= asrActive :key="transcribing" @click="toggleTranscription" v-html="recordIcon" />
      <button v-if= ttsActive @click="stopTTS" v-html="muteIcon" type="button"/>

    </div>
  </template>
  
  <script>
    import { store } from "../store/store";
    import { mapState } from 'vuex';

    export default {
      props: {
        userInputFieldId: String,
      },

      data() {
        return {
          transcribing: false,
          recognition: null,
          alertMessage: this.$t('message.webspeech_not_soported'),
          asrActive: store.getters.asrActive,
          ttsActive: store.getters.ttsActive,
          lastResult:''
        };
      },

      methods: {

        toggleTranscription() {
              if (this.transcribing) {
                  this.pauseTranscription();
              } else {
                  this.startTranscription();
              }
          },

        startTranscription() {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (typeof SpeechRecognition === "undefined") {
            alert(this.alertMessage);
            return;
          }
    
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.addEventListener('result', (event) => this.resultHandler(event));
          this.recognition.start();                
          this.$set(this, 'transcribing', true);
          this.$emit('transcribing', this.transcribing);

        },
        
        readTranscription(text) {
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        },

        pauseTranscription() {
          if (this.recognition) {
            this.recognition.stop();
            this.$set(this, 'transcribing', false);
            if (this.ttsActive){
              this.readTranscription(this.lastResult);            
            }
            this.$emit('transcribing', this.transcribing);
            this.$emit('transcription', this.lastResult);
          }
        },      
      
        stopTTS() {
          window.speechSynthesis.cancel();
          console.log("TTS stopped");
        },
        
        resultHandler(event) {
          this.lastResult = event.results[event.results.length - 1][0].transcript;
          this.$emit('transcription', this.lastResult);
        },  
      },

      computed: {
        ...mapState(['asrRecordSymbol', 'ttsStopSymbol','asrPauseSymbol']),
        recordIcon() {
          const recordSymbol = this.asrRecordSymbol || '&#127897;'; 
          const stopSymbol = this.asrPauseSymbol || '&#9940;'; 
          return this.transcribing ? stopSymbol : recordSymbol;
        },

        pauseIcon() {
          return this.asrPauseSymbol || '&#9940;';
        },

        muteIcon() {          
          return this.ttsStopSymbol || '&#128263;';
        },

      },
      watch: {
      transcribing(newValue) {
          console.log("Transcribing state changed to:", newValue);  
      }
    },
    };
  </script>
  
  <style scoped>
    .stop {
      background-color: red;
    }
  </style>
  