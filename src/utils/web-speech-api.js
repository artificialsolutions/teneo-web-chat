import { store } from '../store/store';

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

  asrStartRecognition(lang, handleFinalResult, handleCancel, handleIntermediateResult) {
    const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);
    const SpeechRecognition = WebSpeechIntegration.getSpeechRecognition();

    this.recognition = new SpeechRecognition();
    this.recognition.lang = lang;
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
  ttsEnsureAvailable() {
    if (typeof WebSpeechIntegration.getSpeechSynthesis() === 'undefined') {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  ttsReadText(text, ttsLang) {
    const { locale: langPref, voice: voicePref } = store.getters;
    const lang = langPref || ttsLang;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = lang;
    utterance.voice = WebSpeechIntegration.findBestVoice(lang, voicePref);

    WebSpeechIntegration.getSpeechSynthesis().speak(utterance);
  }

  static findBestVoice(lang, voicePref) {
    const voicesByLanguage = WebSpeechIntegration.getSpeechSynthesis()
    .getVoices()
    .filter((v) => v.lang === lang);

    if (!voicesByLanguage.length) {
      throw new Error(`No voice found for language: ${lang}`);
    }

    const voice =
      voicesByLanguage.find((v) => v.name.startsWith(voicePref)) ??
      voicesByLanguage.find((v) => v.name.includes(voicePref)) ??
      voicesByLanguage.find((v) => !v.localService) ??
      voicesByLanguage[0];

    console.log({ lang, voicePref, voice, voicesByLanguage });

    return voice;
  }

  // eslint-disable-next-line class-methods-use-this
  ttsStop() {
    WebSpeechIntegration.getSpeechSynthesis().cancel();
  }

  static getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  static getSpeechSynthesis() {
    return window.speechSynthesis;
  }
}

export default WebSpeechIntegration;
