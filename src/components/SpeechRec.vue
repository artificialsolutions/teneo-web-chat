<template>
    <div>
      <button @click="startTranscription" :disabled="transcribing" v-html="recordIcon"/>            
     <button @click="pauseTranscription" :disabled="!transcribing || !recognition" v-html="pauseIcon"/>
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
        this.transcribing = true;
        this.$emit('transcribing', this.transcribing);
      },
      
      readTranscription(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      },

      pauseTranscription() {
        if (this.recognition) {
          this.recognition.stop();
          this.transcribing = false;
          this.readTranscription(this.lastResult);
          this.$emit('transcribing', this.transcribing);
          this.$emit('transcription', this.lastResult);

        }
      },      

      resultHandler(event) {
        this.lastResult = event.results[event.results.length - 1][0].transcript;
        this.$emit('transcription', this.lastResult);
      },
    },
    computed: {
      recordIcon() {
        return this.process && this.process.env ? this.process.env.ASR_RECORD_SYMBOL : '&#127897;';
      },
      pauseIcon() {
        return this.process && this.process.env ? this.process.env.ASR_PAUSE_SYMBOL : '&#9940;';
      },


    },
  };
  </script>
  
  <style scoped>
    .stop {
      background-color: red;
    }
  </style>
  