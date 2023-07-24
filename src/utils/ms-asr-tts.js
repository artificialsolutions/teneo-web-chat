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


const getSpeechConfig = m => {
    if (m.hostURL) {
        const sc = SpeechConfig.fromHost(m.hostURL, m.subscriptionKey);
        if (m.token) sc.authorizationToken = m.token;
        return sc;
    }
    if (m.endpointURL) {
        const sc = SpeechConfig.fromEndpoint(m.endpointURL, m.subscriptionKey);
        if (m.token) sc.authorizationToken = m.token;
        return sc;
    }
    return m.token ? SpeechConfig.fromAuthorizationToken(m.token, m.region)
        : m.subscriptionKey ? SpeechConfig.fromSubscription(m.subscriptionKey, m.region) : null;
};


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
                if (result && result.text && !result.errorDetails && !result.privErrorDetails) resolve(result.text);
                else {
                    if (result != null && typeof result === 'object') reject('ASR result: ' + JSON.stringify(result));
                    else reject('ASR result: ' + result);
                }
                delete window.twcTmp.twcRecognizer;
            },
            error => {
                reject('ASR error: ' + error);
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
        window.twcTmp.twcAudioPlayer.close();
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
        if (m.onAudioEnd) window.twcTmp.twcAudioPlayer.onAudioEnd = m.onAudioEnd;
        const audioConfig = AudioConfig.fromSpeakerOutput(window.twcTmp.twcAudioPlayer);
        const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

        /*
        //TODO
        try{
            alert('SpeakerAudioDestination: ' + JSON.stringify(window.twcTmp.twcAudioPlayer));
        } catch (err) {
            alert('SpeakerAudioDestination: ' + Object.entries(window.twcTmp.twcAudioPlayer));
        }
        try{
            alert('AudioConfig: ' + JSON.stringify(audioConfig));
        } catch (err) {
            alert('AudioConfig: ' + Object.entries(audioConfig));
        }
        //TODO
        try{
            alert('SpeechSynthesizer: ' + JSON.stringify(synthesizer));
        } catch (err) {
            alert('SpeechSynthesizer: ' + Object.entries(synthesizer));
        }
        */

        synthesizer.speakTextAsync(m.textToRead,
            result => {
                //TODO
                //alert('synthesizer result: ' + JSON.stringify(result));

                if (result.audioData && !result.errorDetails && !result.privErrorDetails) resolve(result);
                else {
                    if (result != null && typeof result === 'object') reject('TTS result: ' + JSON.stringify(result));
                    else reject('ASR result: ' + result);
                }
                //synthesizer.close();
                //window.twcTmp.twcAudioPlayer.close();
                //delete window.twcTmp.twcAudioPlayer;
                //stopTTSAudio();
            },
            error => {
                alert('synthesizer error: ' + JSON.stringify(error));
                reject('TTS error: ' + error);
                synthesizer.close();
                window.twcTmp.twcAudioPlayer.close();
                //delete window.twcTmp.twcAudioPlayer;
                //stopTTSAudio();
            }
        );
    });
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
