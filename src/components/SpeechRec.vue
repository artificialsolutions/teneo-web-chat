<template>
    <div>
      <button :key="transcribing" @click="toggleTranscription" v-html="recordIcon" />
      <button @click="stopTTS" v-html="muteIcon" />

    <!-- <button @click="pauseTranscription" :disabled="!transcribing || !recognition" v-html="pauseIcon"/> -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      userInputFieldId: String,
    },
    data() {
      return {
        transcribing: false,
        recognition: null,
        alertMessage: this.$t('message.webspeech_not_soported')
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
        this.$forceUpdate();

      },
      
      readTranscription(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        this.$forceUpdate();
      },

      pauseTranscription() {
        if (this.recognition) {
          this.recognition.stop();
          this.$set(this, 'transcribing', false);
          this.readTranscription(this.lastResult);
          this.$emit('transcribing', this.transcribing);
          this.$emit('transcription', this.lastResult);
          this.$forceUpdate();
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
      recordIcon() {
        const recordSymbol = this.process && this.process.env ? this.process.env.ASR_RECORD_SYMBOL : '&#127897;'; // Default record icon
        const stopSymbol = this.process && this.process.env ? this.process.env.ASR_STOP_SYMBOL : '&#9940;'; // Default stop icon   
        return this.transcribing ? stopSymbol : recordSymbol;
        return this.process && this.process.env ? this.process.env.ASR_RECORD_SYMBOL : '&#127897;';
      },


      pauseIcon() {
        return this.process && this.process.env ? this.process.env.ASR_PAUSE_SYMBOL : '&#9940;';
      },
      muteIcon() {
        return this.process && this.process.env ? this.process.env.ASR_PAUSE_SYMBOL : '&#128263;';
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
  