import * as speechSDK from "microsoft-cognitiveservices-speech-sdk";


function getMSToken(region, key) {

    return new Promise(function (resolve) {

        fetch('https://' + region + '.api.cognitive.microsoft.com/sts/v1.0/issuetoken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': key
            }
        }).then(function (tokenResponse) {
            tokenResponse.text().then(function (tokenText) {
                resolve(tokenText);
            });

        })
    })

}

function processAudioToText(authToken, region, locale) {
    return new Promise((resolve, reject) => {
        const speechConfig = speechSDK.SpeechConfig.fromAuthorizationToken(authToken, region);
        speechConfig.speechRecognitionLanguage = locale;
        const audioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
        window.TeneoWebChat.tmp.twcRecognizer = new speechSDK.SpeechRecognizer(speechConfig, audioConfig);
        window.TeneoWebChat.tmp.twcRecognizer.recognizeOnceAsync(
            result => {
                if (result.text && !result.errorDetails) {
                    resolve(result.text);
                } else {
                    reject(result.errorDetails);

                }
                delete window.TeneoWebChat.tmp.twcRecognizer
            },
            error => {
                reject(error);
                delete window.TeneoWebChat.tmp.twcRecognizer
            })
    })


}

function stopAsrRecording() {
    if (window.TeneoWebChat.tmp.twcRecognizer) {
        //window.TeneoWebChat.tmp.twcRecognizer.stopContinuousRecognitionAsync()
        window.TeneoWebChat.tmp.twcRecognizer.dispose(true);
        delete window.TeneoWebChat.tmp.twcRecognizer;
    }
}

function stopTTSAudio() {
    if (window.TeneoWebChat.tmp.twcAudioPlayer) {
        window.TeneoWebChat.tmp.twcAudioPlayer.pause();
        delete window.TeneoWebChat.tmp.twcAudioPlayer;
    }
}

function processTextToAudio(authToken, region, locale, textToRead, voice) {
    return new Promise((resolve, reject) => {
        const speechConfig = speechSDK.SpeechConfig.fromAuthorizationToken(authToken, region);
        speechConfig.speechSynthesisLanguage = locale;
        if (voice) {
            speechConfig.speechSynthesisVoiceName = voice;
        }
        window.TeneoWebChat.tmp.twcAudioPlayer = new speechSDK.SpeakerAudioDestination();
        const audioConfig = speechSDK.AudioConfig.fromSpeakerOutput(window.TeneoWebChat.tmp.twcAudioPlayer);
        const synthesizer = new speechSDK.SpeechSynthesizer(speechConfig, audioConfig);

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
    let validKeys = ['type', 'alt', 'title', 'subtitle', 'text'];
    JSON.stringify(messageData, function (key, value) {
        if (validKeys.includes(key)) {
            let cleanText = new DOMParser().parseFromString(value, 'text/html').body.textContent || "";
            utteranceArray.push(cleanText);
        }
        return value;
    });

    return utteranceArray.join('.\n')
}

module.exports = {getMSToken, processTextToAudio, processAudioToText, generateText, stopAsrRecording, stopTTSAudio}