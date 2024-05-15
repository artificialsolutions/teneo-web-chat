import handleExtension from './handle-extension.js';
import { store } from '../store/store';
import basePayload from '../utils/base-payload.js';
import MsCognitiveSpeechIntegration from '../utils/cognitive-speech-api.js';
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
        const { msAsrSettings, msTtsSettings } = store.getters;

        if (msAsrSettings && msTtsSettings) {
            this.webSpeech = new MsCognitiveSpeechIntegration(msAsrSettings, msTtsSettings);
        } else {
            this.webSpeech = new WebSpeechIntegration();
        }

        const { webSpeech } = this;

        console.log({ webSpeech });
    }

    async asrEnsureAvailable() {
        const payload = {
            ...basePayload(),
            asrAvailable: false
        };

        await handleExtension(API_ON_ASR_ENSURE_AVAILABLE, payload);

        if (!payload.handledState.handled === true) {
            await this.webSpeech.asrEnsureAvailable(payload);
        }

        return payload.asrAvailable;
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
            this.webSpeech.asrStartRecognition(payload);
        }
    }

    async asrCleanup() {
        const payload = basePayload();

        await handleExtension(API_ON_ASR_CLEANUP, payload);

        if (!payload.handledState.handled === true) {
            this.webSpeech.asrCleanup(payload);
        }
    }

    async ttsEnsureAvailable() {
        const payload = {
            ...basePayload(),
            ttsAvailable: false
        };

        await handleExtension(API_ON_TTS_ENSURE_AVAILABLE, payload);

        if (!payload.handledState.handled === true) {
            await this.webSpeech.ttsEnsureAvailable(payload);
        }

        return payload.ttsAvailable;
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
                this.webSpeech.ttsReadText(payload);
            }
        });
    }

    async ttsStop() {
        const payload = basePayload();

        await handleExtension(API_ON_TTS_STOP, payload);

        if (!payload.handledState.handled === true) {
            this.webSpeech.ttsStop(payload);
        }
    }
}

export default AsrTtsApi;
