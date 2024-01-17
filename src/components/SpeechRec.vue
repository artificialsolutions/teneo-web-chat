<template>
    <div>
      <button
        id="start"
        @click="startTranscription"
        :disabled="transcribing"
      >
        Start
      </button>
      <button
        id="pause"
        @click="pauseTranscription"
        :disabled="!transcribing || !recognition"
      >
        Pause
      </button>
      <div id="transcript-window">
        <!-- No need to display the transcription results in this component -->
      </div>
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
      },
      pauseTranscription() {
        if (this.recognition) {
          this.recognition.stop();
          this.transcribing = false;
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
  