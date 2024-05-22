import {
    AudioConfig,
    SpeechRecognizer,
    ResultReason,
    CancellationDetails,
    CancellationReason,
    SpeakerAudioDestination,
    SpeechSynthesizer,
    SpeechConfig
} from 'microsoft-cognitiveservices-speech-sdk';

class MsCognitiveSpeechIntegration {

    constructor(asrConfig, ttsConfig) {
        if (asrConfig) {
            this.initializeAsr(asrConfig);
        }
        if (ttsConfig) {
            this.initializeTts(ttsConfig);
        }
    }

    initializeAsr(asrConfig) {
        this.asrConfig = asrConfig;

        /*
         * If rebuilding as an extension - these are the functions to use
         * EventBus.$on(API_ON_ASR_ENSURE_AVAILABLE, (payload) => this.asrEnsureAvailable(payload));
         * EventBus.$on(API_ON_ASR_START_RECOGNITION, (payload) => this.asrStartRecognition(payload));
         * EventBus.$on(API_ON_ASR_CLEANUP, (payload) => this.asrCleanup(payload));
         */
    }

    initializeTts(ttsConfig) {
        this.ttsConfig = ttsConfig;

        /*
         * If rebuilding as an extension - these are the functions to use
         * EventBus.$on(API_ON_TTS_ENSURE_AVAILABLE, (payload) => this.ttsEnsureAvailable(payload));
         * EventBus.$on(API_ON_TTS_READ_TEXT, (payload) => this.ttsReadText(payload));
         * EventBus.$on(API_ON_TTS_STOP, (payload) => this.ttsStop(payload));
         */
    }

    static getURLOrThrow(urlString, propertyName) {
        if (!urlString) {
            return;
        }
        try {
            return new URL(urlString);
        } catch (error) {
            throw new Error(`Invalid Url in config. ${propertyName}: ${urlString}`, error);
        }
    }

    async asrEnsureAvailable(payload) {
        try {
            this.asrConfig = await MsCognitiveSpeechIntegration.ensureValidToken(this.asrConfig);

            payload.asrAvailable = true;
        } catch (error) {
            console.error(error);
            payload.asrAvailable = false;
        }
        payload.handledState.handled = true;
    }

    asrStartRecognition(payload) {
        payload.handledState.handled = true;

        const { locale, handleFinalResult, handleCancel, handleIntermediateResult } = payload;
        const { asrConfig } = this;
        const asr = {
            ...asrConfig,
            locale,
            handleFinalResult,
            handleCancel,
            handleIntermediateResult
        };

        this.processAsr(asr);
    }

    asrCleanup(payload) {
        payload.handledState.handled = true;
        this.stopAsrRecording();
    }

    async ttsEnsureAvailable(payload) {
        payload.handledState.handled = true;

        try {
            this.ttsConfig = await MsCognitiveSpeechIntegration.ensureValidToken(this.ttsConfig);

            payload.ttsAvailable = true;
        } catch (error) {
            console.error(error);
            payload.ttsAvailable = false;
        }
    }

    ttsReadText(payload) {
        payload.handledState.handled = true;

        const { text, locale, voice, ttsComplete } = payload;
        const { ttsConfig } = this;
        const tts = {
            ...ttsConfig,
            text,
            locale,
            voice,
            ttsComplete,
        };

        this.processTts(tts);
    }

    ttsStop(payload) {
        payload.handledState.handled = true;
        this.stopTTSAudio();
    }

    configureSpeechConfigForAsr(speechConfig, asr) {
        const { token, locale } = asr;

        if (!locale) {
            throw new Error('Locale required for ASR.');
        }
        if (!(new Intl.Locale(locale).region && new Intl.Locale(locale).language)) {
            throw new Error(`Locale for ASR must specify language AND region: ${locale}`);
        }

        speechConfig.speechRecognitionLanguage = locale;
        if (token) {
            speechConfig.authorizationToken = token;
        }
    }

    processAsr(asr) {
        const speechConfig = MsCognitiveSpeechIntegration.buildSpeechConfig(asr);
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        const { handleFinalResult, handleCancel } = asr;

        this.configureSpeechConfigForAsr(speechConfig, asr);
        console.log({ audioConfig, speechConfig });

        this.asrRecogniser = new SpeechRecognizer(speechConfig, audioConfig);

        this.asrRecogniser.recognizeOnceAsync((result) => {
            MsCognitiveSpeechIntegration.handleAsrResult(result, handleFinalResult, handleCancel);
        });
    }

    static handleAsrResult(result, handleFinalResult, handleCancel) {
        if (result.reason === ResultReason.RecognizedSpeech) {
            handleFinalResult(result.text);
        } else if (result.reason === ResultReason.NoMatch) {
            handleCancel();
        } else if (result.reason === ResultReason.Canceled) {
            const cancellation = CancellationDetails.fromResult(result);

            if (cancellation.reason === CancellationReason.EndOfStream) {
                handleCancel();
            } else if (cancellation.reason === CancellationReason.Error) {
                console.error(`Error [${cancellation.ErrorCode}]: ${cancellation.errorDetails}.`, { cancellation });
                handleCancel();
            }
        }
    }

    stopAsrRecording() {
        if (this.asrRecogniser) {
            this.asrRecogniser.close();
            this.asrRecogniser.dispose(true);
            delete this.asrRecogniser;
        }
    }

    static validateLocale(locale) {
        if (!locale) {
            throw new Error('Locale required for TTS.');
        }
        if (!(new Intl.Locale(locale).region && new Intl.Locale(locale).language)) {
            throw new Error(`Locale for TTS must specify language AND region: ${locale}`);
        }
    }

    configureSpeechConfigForTts(speechConfig, tts) {
        const { token } = this.ttsConfig;
        const { locale, voice } = tts;

        MsCognitiveSpeechIntegration.validateLocale(locale);
        speechConfig.speechSynthesisLanguage = locale;

        if (voice) {
            speechConfig.speechSynthesisVoiceName = voice;
        }
        if (token) {
            speechConfig.authorizationToken = token;
        }
    }

    doSynthesis(tts, speechConfig) {
        const audioConfig = AudioConfig.fromSpeakerOutput(this.twcAudioPlayer);
        const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

        return new Promise((resolve,) => {
            synthesizer.speakTextAsync(tts.text, (result) => {
                if (result.audioData && !result.errorDetails) {
                    resolve(result);
                } else {
                    throw new Error(result.errorDetails);
                }
                synthesizer.close();
            });
        });
    }

    async processTts(tts) {
        const speechConfig = MsCognitiveSpeechIntegration.buildSpeechConfig(tts);

        this.configureSpeechConfigForTts(speechConfig, tts);

        this.twcAudioPlayer = new SpeakerAudioDestination();

        const ttsExecution = new Promise((resolve,) => {
            this.twcAudioPlayer.onAudioEnd = (x) => {
                resolve(x);
            };
        });
        const synthResult = await this.doSynthesis(tts, speechConfig);

        await ttsExecution;

        tts.ttsComplete();

        return synthResult;
    }

    stopTTSAudio() {
        if (this.twcAudioPlayer) {
            this.twcAudioPlayer.pause();
            delete this.twcAudioPlayer;
        }
    }

    static buildSpeechConfig(config) {
        if (config.hostURL && config.subscriptionKey) {
            return SpeechConfig.fromHost(config.hostURL, config.subscriptionKey);
        }
        if (config.endpointURL && config.subscriptionKey) {
            return SpeechConfig.fromEndpoint(config.endpointURL, config.subscriptionKey);
        }
        if (config.token && config.region) {
            return SpeechConfig.fromAuthorizationToken(config.token, config.region);
        }
        if (config.subscriptionKey && config.region) {
            return SpeechConfig.fromSubscription(config.subscriptionKey, config.region);
        }

        throw new Error('Neither hostURL, endpointURL, token nor subscriptionKey is specified for processAudioToText()');
    }

    static async ensureValidToken(config) {
        if (config.useSubscriptionOnly) {
            return config;
        }

        const newConfig = config;

        if (!config.token || (Date.now() - config.tokenTimestamp < 540000)) {
            const token = await MsCognitiveSpeechIntegration.getTokenFromMS(config);

            newConfig.tokenTimestamp = Date.now();
            newConfig.token = token;
        }

        return newConfig;
    }

    static getTokenFromMS(tokenRequestData) {
        if (tokenRequestData.tokenUrl) {
            return MsCognitiveSpeechIntegration.getMSTokenFromCustomUrl(tokenRequestData.tokenUrl, tokenRequestData.subscriptionKey);
        }
        if (tokenRequestData.region) {
            return MsCognitiveSpeechIntegration.getMSTokenFromRegion(tokenRequestData.region, tokenRequestData.subscriptionKey);
        }
        throw new Error('Unable to get authentication token. Url or Region must be configured');
    }

    static getMSTokenFromCustomUrl(url, key) {
        const ac = new AbortController();
        const timeoutId = setTimeout(() => ac.abort(), 3000);

        return fetch(url, {
            signal: ac.signal,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': key
            }
        })
        .finally(() => {
            clearTimeout(timeoutId);
        })
        .then((tokenResponse) => {
            if (tokenResponse.ok) {
                return tokenResponse.text();
            }
            throw new Error(tokenResponse.statusText);
        });
    }

    static getMSTokenFromRegion(region, key) {
        return MsCognitiveSpeechIntegration.getMSTokenFromCustomUrl(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`, key);
    }
}

export default MsCognitiveSpeechIntegration;
