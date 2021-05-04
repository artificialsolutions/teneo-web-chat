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
        const recognizer = new speechSDK.SpeechRecognizer(speechConfig, audioConfig);
        recognizer.recognizeOnceAsync(
            result => {
            resolve(result.text);
        },
            error =>{
                reject(error);
            })
    })


}

function processTextToAudio(authToken, region, locale, textToRead) {
    return new Promise((resolve, reject) => {
        const speechConfig = speechSDK.SpeechConfig.fromAuthorizationToken(authToken, region);
        speechConfig.speechRecognitionLanguage = locale;
        const audioConfig = speechSDK.AudioConfig.fromDefaultSpeakerOutput();
        const synthesizer = new speechSDK.SpeechSynthesizer(speechConfig, audioConfig);
        synthesizer.speakTextAsync(textToRead,
            result =>{
                resolve(result.audioData);
                synthesizer.close();
            },
            error =>{
                reject(error);
                synthesizer.close();
            });

    })
}

function generateText(messageData){
    let utteranceArray = [];
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

module.exports = {getMSToken, processTextToAudio, processAudioToText, generateText}