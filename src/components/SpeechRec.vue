<template>
    <div>
      <button @click="startTranscription" :disabled="transcribing">
      &#127897;
    </button>
    <button @click="pauseTranscription" :disabled="!transcribing || !recognition">
      &#9940;
    </button>
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
      };
    },
    methods: {
      startTranscription() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (typeof SpeechRecognition === "undefined") {
          alert("This browser doesn't support the SpeechRecognition API. Try Google Chrome, Microsoft Edge, or another supported browser.");
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
      pauseTranscription() {
        if (this.recognition) {
          this.recognition.stop();
          this.transcribing = false;
          this.$emit('transcribing', this.transcribing);
        }
      },
      resultHandler(event) {
        const lastResult = event.results[event.results.length - 1][0].transcript;
        this.$emit('transcription', lastResult);
      },
    },
  };
  </script>
  
  <style scoped>
    .stop {
      background-color: red;
    }
  </style>
  