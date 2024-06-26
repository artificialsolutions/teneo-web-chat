class WebSpeechIntegration {
  constructor() {
    this.recognition = null;
  }

  // eslint-disable-next-line class-methods-use-this
  asrEnsureAvailable(payload) {
    payload.handledState.handled = true;
    try {
      payload.asrAvailable = (typeof WebSpeechIntegration.getSpeechRecognition() !== 'undefined');
    } catch (error) {
      console.error(error);
      payload.asrAvailable = false;
    }
  }

  asrStartRecognition(payload) {
    payload.handledState.handled = true;

    const { locale, handleFinalResult, handleCancel, handleIntermediateResult } = payload;

    this.processAsr(locale, handleFinalResult, handleCancel, handleIntermediateResult);
  }

  asrCleanup(payload) {
      payload.handledState.handled = true;
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }
  }

  // eslint-disable-next-line class-methods-use-this
  ttsEnsureAvailable(payload) {
    payload.handledState.handled = true;

    try {
      payload.ttsAvailable = (typeof WebSpeechIntegration.getSpeechSynthesis() !== 'undefined');
    } catch (error) {
      console.error(error);
      payload.ttsAvailable = false;
    }
  }

  ttsReadText(payload) {
      payload.handledState.handled = true;

      const { text, locale, voice, ttsComplete } = payload;

      this.processTts(text, locale, voice, ttsComplete);
  }

  // eslint-disable-next-line class-methods-use-this
  ttsStop(payload) {
      payload.handledState.handled = true;
      WebSpeechIntegration.getSpeechSynthesis().cancel();
  }

  initRecognition(lang) {
    const SpeechRecognition = WebSpeechIntegration.getSpeechRecognition();
    const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);

    const recognition = new SpeechRecognition();

    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = !isMobile;

    return recognition;
  }

  processAsr(lang, handleFinalResult, handleCancel, handleIntermediateResult) {
    this.recognition = this.initRecognition(lang);

    const controller = new AbortController();
    const { signal } = controller;

    this.recognition.addEventListener('result', (event) => {
      const transcriptString = event.results[event.results.length - 1][0].transcript;

      if (event.results[event.results.length - 1].isFinal) {
        // We have completed - so an 'end' is no longer a cancel
        controller.abort();
        handleFinalResult(transcriptString);
      } else {
        handleIntermediateResult(transcriptString);
      }
    });
    this.recognition.addEventListener('end', handleCancel, { signal });
    this.recognition.start();
  }

  // eslint-disable-next-line class-methods-use-this
  processTts(text, locale, voice, ttsComplete) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = locale;
    utterance.voice = WebSpeechIntegration.findBestVoice(locale, voice);
    if (ttsComplete) {
      utterance.onend = () => ttsComplete();
    }

    WebSpeechIntegration.getSpeechSynthesis().speak(utterance);
  }

  static findBestVoice(locale, voicePref) {
    const voicesByLanguage = WebSpeechIntegration.getSpeechSynthesis()
    .getVoices()
    .filter((v) => v.lang === locale);

    if (!voicesByLanguage.length) {
      throw new Error(`No voice found for language: ${locale}`);
    }

    const voice =
      voicesByLanguage.find((v) => v.name.startsWith(voicePref)) ??
      voicesByLanguage.find((v) => v.name.includes(voicePref)) ??
      voicesByLanguage.find((v) => !v.localService) ??
      voicesByLanguage[0];

    return voice;
  }

  static getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  static getSpeechSynthesis() {
    return window.speechSynthesis;
  }
}

export default WebSpeechIntegration;
