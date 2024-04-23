class WebSpeechIntegration {
  constructor() {
    this.recognition = null;
  }

  // eslint-disable-next-line class-methods-use-this
  asrEnsureAvailable() {
    if (typeof WebSpeechIntegration.getSpeechRecognition() === 'undefined') {
      return false;
    }

    return true;
  }

  asrStartRecognition(handleFinalResult, handleCancel, handleIntermediateResult) {
    const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);
    const SpeechRecognition = WebSpeechIntegration.getSpeechRecognition();

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = !isMobile;
    this.recognition.addEventListener('result', (event) => {
      const transcriptString = event.results[event.results.length - 1][0].transcript;

      if (event.results[event.results.length - 1].isFinal) {
        handleFinalResult(transcriptString);
      } else {
        handleIntermediateResult(transcriptString);
      }
    });
    this.recognition.addEventListener('end', handleCancel);
    this.recognition.start();
  }

  asrCleanup() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  ttsReadText(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = lang;
    console.log({ utterance });
    window.speechSynthesis.speak(utterance);
  }

  // eslint-disable-next-line class-methods-use-this
  ttsStop() {
    window.speechSynthesis.cancel();
  }

  static getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }
}

export default WebSpeechIntegration;
