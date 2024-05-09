import handleExtension from './handle-extension.js';
import basePayload from '../utils/base-payload.js';
import WebSpeechIntegration from '../utils/web-speech-api.js';
import {
  API_ON_ASR_ENSURE_AVAILABLE,
  API_ON_ASR_START_RECOGNITION,
  API_ON_ASR_CLEANUP,
  API_ON_TTS_ENSURE_AVAILABLE,
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

    async asrStartRecognition(locale, handleFinalResult, handleCancel, handleIntermediateResult) {
        const payload = {
            ...basePayload(),
            locale,
            handleFinalResult,
            handleCancel,
            handleIntermediateResult
        };

        await handleExtension(API_ON_ASR_START_RECOGNITION, payload);

        if (!payload.handledState.handled === true) {
            this.webSpeech.asrStartRecognition(locale, handleFinalResult, handleCancel, handleIntermediateResult);
        }
    }

    async asrCleanup() {
        const payload = basePayload();

        await handleExtension(API_ON_ASR_CLEANUP, payload);

        if (!payload.handledState.handled === true) {
            this.webSpeech.asrCleanup();
        }
    }

    async ttsEnsureAvailable() {
        const payload = {
            ...basePayload(),
            ttsAvailable: false
        };

        await handleExtension(API_ON_TTS_ENSURE_AVAILABLE, payload);

        if (payload.handledState.handled === true) {
          return payload.ttsAvailable;
        }

        return this.webSpeech.ttsEnsureAvailable();
    }

    ttsReadText(text, locale, voice) {
        return new Promise((resolve,) => {
            const ttsComplete = () => resolve();
            const payload = {
                ...basePayload(),
                text,
                locale,
                voice,
                ttsComplete
            };

            handleExtension(API_ON_TTS_READ_TEXT, payload);

            if (!payload.handledState.handled === true) {
                this.webSpeech.ttsReadText(text, locale, voice, ttsComplete);
            }
        });
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
