import handleExtension from './handle-extension.js';
import basePayload from '../utils/base-payload.js';
import WebSpeechIntegration from '../utils/web-speech-api.js';
import {
  API_ON_ASR_ENSURE_AVAILABLE,
  API_ON_ASR_START_RECOGNITION,
  API_ON_ASR_CLEANUP,
  API_ON_TTS_READ_TEXT,
  API_ON_TTS_STOP
} from '../utils/api-function-names.js';

class AsrTtsApi {
    constructor() {
      this.webSpeech = new WebSpeechIntegration();
    }

    async asrEnsureAvailable() {
        const payload = {
            ...basePayload(),
            asrAvailable: false
        };

        await handleExtension(API_ON_ASR_ENSURE_AVAILABLE, payload);

        if (payload.handledState.handled === true) {
          return payload.asrAvailable;
        }

        return this.webSpeech.asrEnsureAvailable();
    }

    async asrStartRecognition(handleFinalResult, handleCancel, handleIntermediateResult) {
        const payload = {
            ...basePayload(),
            handleFinalResult,
            handleCancel,
            handleIntermediateResult
        };

        await handleExtension(API_ON_ASR_START_RECOGNITION, payload);

        if (!payload.handledState.handled === true) {
            this.webSpeech.asrStartRecognition(handleFinalResult, handleCancel, handleIntermediateResult);
        }
    }

    async asrCleanup() {
        const payload = basePayload();

        await handleExtension(API_ON_ASR_CLEANUP, payload);

        if (!payload.handledState.handled === true) {
            this.webSpeech.asrCleanup();
        }
    }

    async ttsReadText(text, lang) {
        const payload = {
            ...basePayload(),
            text,
            lang
        };

        await handleExtension(API_ON_TTS_READ_TEXT, payload);

        if (!payload.handledState.handled === true) {
            this.webSpeech.ttsReadText(text, lang);
        }
    }

    async ttsStop() {
        const payload = basePayload();

        await handleExtension(API_ON_TTS_STOP, payload);

        if (!payload.handledState.handled === true) {
            this.webSpeech.ttsStop();
        }
    }
}

export default AsrTtsApi;
