import {
    AudioConfig,
    SpeakerAudioDestination,
    SpeechConfig,
    SpeechRecognizer,
    SpeechSynthesizer
} from "microsoft-cognitiveservices-speech-sdk";


function getMSTokenFromCustomUrl(url, key) {
    const ac = new AbortController(), timeoutId = setTimeout(() => ac.abort(), 3000);
    return fetch(url, {
        signal: ac.signal,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': key
        }
    }).finally(() => {
        clearTimeout(timeoutId);
    }).then(tokenResponse => {
        if (tokenResponse.ok) return tokenResponse.text();
        throw new Error(tokenResponse.statusText);
    });
}


function getMSTokenFromRegion(region, key) {
    return getMSTokenFromCustomUrl('https://' + region + '.api.cognitive.microsoft.com/sts/v1.0/issuetoken', key);
}

/*
function processAudioToText(authToken, region, locale) {
    return new Promise((resolve, reject) => {
        const speechConfig = SpeechConfig.fromAuthorizationToken(authToken, region);
        speechConfig.speechRecognitionLanguage = locale.replaceAll('_', '-');
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        window.twcTmp.twcRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
        window.twcTmp.twcRecognizer.recognizeOnceAsync(
            result => {
                if (result.text && !result.errorDetails) {
                    resolve(result.text);
                } else {
                    reject(result.errorDetails);

                }
                delete window.twcTmp.twcRecognizer
            },
            error => {
                reject(error);
                delete window.twcTmp.twcRecognizer
            })
    })
}
*/


const getSpeechConfig = m => m.hostURL ? SpeechConfig.fromHost(m.hostURL, m.subscriptionKey)
    : m.endpointURL ? SpeechConfig.fromEndpoint(m.endpointURL, m.subscriptionKey)
    : m.token ? SpeechConfig.fromAuthorizationToken(m.token, m.region)
    : m.subscriptionKey ? SpeechConfig.fromSubscription(m.subscriptionKey, m.region) : null;


function processAudioToText(m) {
    //authToken, region, locale
    return new Promise((resolve, reject) => {
        const speechConfig = getSpeechConfig(m);
        if (speechConfig == null) {
            reject('Neither hostURL, endpointURL, token nor subscriptionKey is specified for processAudioToText()');
            return;
        }
        speechConfig.speechRecognitionLanguage = m.locale;
        //speechConfig.speechRecognitionLanguage = locale.replaceAll('_', '-');;
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        window.twcTmp.twcRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
        window.twcTmp.twcRecognizer.recognizeOnceAsync(
            result => {
                if (result.text && !result.errorDetails) resolve(result.text);
                else reject(result.errorDetails);
                delete window.twcTmp.twcRecognizer;
            },
            error => {
                reject(error);
                delete window.twcTmp.twcRecognizer;
            }
        );
    });
}


function stopAsrRecording() {
    if (window.twcTmp.twcRecognizer) {
        //window.twcTmp.twcRecognizer.stopContinuousRecognitionAsync()
        window.twcTmp.twcRecognizer.dispose(true);
        delete window.twcTmp.twcRecognizer;
    }
}

function stopTTSAudio() {
    if (window.twcTmp.twcAudioPlayer) {
        window.twcTmp.twcAudioPlayer.pause();
        delete window.twcTmp.twcAudioPlayer;
    }
}


function processTextToAudio(m) {
    // authToken, region, locale, textToRead, voice
    return new Promise((resolve, reject) => {
        const speechConfig = getSpeechConfig(m);
        if (speechConfig == null) {
            reject('Neither hostURL, endpointURL, token nor subscriptionKey is specified for processTextToAudio()');
            return;
        }
        speechConfig.speechSynthesisLanguage = m.locale;
        //speechConfig.speechSynthesisLanguage = locale.replaceAll('_', '-');
        if (m.voice) speechConfig.speechSynthesisVoiceName = m.voice;
        window.twcTmp.twcAudioPlayer = new SpeakerAudioDestination();
        const audioConfig = AudioConfig.fromSpeakerOutput(window.twcTmp.twcAudioPlayer);
        const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

        synthesizer.speakTextAsync(m.textToRead,
            result => {
                if (result.audioData && !result.errorDetails) resolve(result);
                else reject(result.errorDetails)
                synthesizer.close();
            },
            error => {
                reject(error);
                synthesizer.close();
            }
        );
    });
}


function _processTextToAudio(authToken, region, locale, textToRead, voice) {
    return new Promise((resolve, reject) => {
        const speechConfig = SpeechConfig.fromAuthorizationToken(authToken, region);
        speechConfig.speechSynthesisLanguage = locale.replaceAll('_', '-');
        if (voice) {
            speechConfig.speechSynthesisVoiceName = voice;
        }
        window.twcTmp.twcAudioPlayer = new SpeakerAudioDestination();
        const audioConfig = AudioConfig.fromSpeakerOutput(window.twcTmp.twcAudioPlayer);
        const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

        synthesizer.speakTextAsync(textToRead,
            result => {
            if(result.audioData && !result.errorDetails) {
                resolve(result);
            }
            else{
                reject(result.errorDetails)
            }
                synthesizer.close();
            },
            error => {
                reject(error);
                synthesizer.close();
            });
    })
}


function generateText(messageData) {
    let utteranceArray = [];
    // These include the Table elements, uncomment to have table fields read out -> let validKeys = ['type', 'alt', 'title', 'subtitle', 'text', 'headers','body', 'footers'];
    let validKeys = ['alt', 'title', 'subtitle', 'text'];
    JSON.stringify(messageData, function (key, value) {
        if (validKeys.includes(key)) {
            let cleanText = new DOMParser().parseFromString(value, 'text/html').body.textContent || "";
            utteranceArray.push(cleanText);
        }
        return value;
    });

    return utteranceArray.join('.\n')
}

module.exports = {
    getMSTokenFromRegion,
    getMSTokenFromCustomUrl,
    processTextToAudio,
    processAudioToText,
    generateText,
    stopAsrRecording,
    stopTTSAudio
};
