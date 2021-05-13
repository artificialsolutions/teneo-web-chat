console.log('Test Extensions Loaded')


var common_extensions =
    {
        twcMediaStream: null,
        twcMediaRecorder: null,
        msTokenTime: null,
        msToken: null,
        recordingInterval: null,
        recordingTime: null,
        ttsActive: null,
        twcAudio: null,


        init: function () {
            console.log('Init Common Extensions')
            if (window.TeneoWebChat) {
                TeneoWebChat.on('upload_button_clicked', this.onUploadButtonClicked);
                TeneoWebChat.on('asr_button_clicked', this.onAsrButtonClicked);
                TeneoWebChat.on('tts_button_clicked', this.onTtsButtonClicked);
                TeneoWebChat.on('new_message', this.onNewMessageReceived);

                [
                    'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/OpusMediaRecorder.umd.js',
                    'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/encoderWorker.umd.js'
                ].forEach(function (src) {
                    var script = document.createElement('script');
                    script.src = src;
                    document.head.appendChild(script);
                });

                setTimeout(function () {
                    window.MediaRecorder = window.OpusMediaRecorder
                }, 1000)

            } else {
                setTimeout(function () {
                    this.init()
                }, 100)
            }
        },
        getMsToken: function () {
            return new Promise(function (resolve) {
                common_extensions.msTokenTime = new Date();
                fetch("https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Ocp-Apim-Subscription-Key': '560645f6584b4ca2b755d56557d6dae8'
                    }
                }).then(function (tokenResponse) {
                    tokenResponse.text().then(function (tokenText) {
                        common_extensions.msToken = tokenText;
                        resolve();

                    });

                })
            })
        },
        onUploadButtonClicked: function () {
            // handle upload button functionality
            console.log("Upload button clicked!");
        },
        onAsrButtonClicked: function (asrBtn) {
            console.log("ASR button clicked!", asrBtn);

//If media stream and recorder exist, stop, remove them and process audio. If not, check whether the browser supports it and either create one or disable the button.
            TeneoWebChat.call('show_typing_indicator', {author: "user"});
            if (common_extensions.twcMediaStream && common_extensions.twcMediaRecorder) {
                offBeep.play();
                asrBtn.style.fill = 'initial'
                asrBtn.style.stroke = 'initial'
                var recordedChunks = [];
                common_extensions.twcMediaRecorder.ondataavailable = function (event) {
                    recordedChunks.push(event.data)
                    var twcMediaBlob = new Blob(recordedChunks)

                    //send to ASR service
                    new Promise(function (resolve) {

                        if (!common_extensions.msToken || (new Date() - common_extensions.msTokenTime >= 540000)) {
                            common_extensions.getMsToken().then(function () {
                                resolve();
                            });

                        } else {
                            resolve();
                        }
                    }).then(function () {
                        fetch("https://northeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?" + new URLSearchParams({
                            language: 'en-US'
                        }), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
                                'Authorization': 'Bearer ' + common_extensions.msToken
                            },
                            body: twcMediaBlob
                        }).then(function (audioResponse) {

                            audioResponse.json().then(function (asrJson) {

                                var asrString = asrJson.RecognitionStatus === 'Success' ? asrJson.DisplayText : 'Oops, try again'
                                TeneoWebChat.call('send_input', {"text": asrString})
                            });

                        })
                    })
                    common_extensions.twcMediaRecorder = null;
                    common_extensions.twcMediaStream.getTracks()
                        .forEach(function (track) {
                            track.stop();
                        });
                    window.twcMediaStream = null;


                }

                common_extensions.twcMediaRecorder.stop();
                window.clearInterval(common_extensions.recordingInterval);
                console.log("Interval cleared")

                TeneoWebChat.call('add_message', {
                    "type": "system",
                    "data": {
                        "text": "Got it. I'm sending your message now."
                    }
                })
                TeneoWebChat.call('hide_typing_indicator', {author: "user"});
            } else {
                onBeep.play();
                asrBtn.style.fill = 'red'
                asrBtn.style.stroke = 'pink'
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({audio: true}).then(function (stream) {
                        common_extensions.twcMediaStream = stream;
                        const workerOptions = {
                            OggOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/OggOpusEncoder.wasm',
                            WebMOpusEncoderWasmPath: 'https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/WebMOpusEncoder.wasm'
                        };
                        common_extensions.twcMediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/wav'}, workerOptions);
                        common_extensions.twcMediaRecorder.start();
                        common_extensions.recordingTime = 0
                        common_extensions.recordingInterval = setInterval(function () {
                            console.log(common_extensions.recordingTime);
                            common_extensions.recordingTime++;
                            if (common_extensions.recordingTime >= 15) {
                                console.log('Media recording has reached maximum length.');
                                asrBtn.click();
                            }
                        }, 1000)
                        TeneoWebChat.call('add_message', {
                            "type": "system",
                            "data": {
                                "text": "I'm listening. Click mic again to stop."
                            }
                        })
                    }).catch(function (err) {
                        console.log('The following getUserMedia error occurred: ' + err);
                    })
                } else {
                    console.log('ASR not supported on this browser.')
                    TeneoWebChat.call('add_message', {
                        "author": "bot",
                        "type": "system",
                        "data": {
                            "text": "Dictation not supported by browser"
                        }
                    })
                    TeneoWebChat.call('disable_asr_button');
                }
            }
        },
        onTtsButtonClicked: function (ttsBtn) {


            console.log("TTS button clicked!", ttsBtn);
            if (common_extensions.ttsActive) {
                ttsBtn.style.fill = 'initial'
                ttsBtn.style.stroke = 'initial'
                common_extensions.ttsActive = false

            } else {
                ttsBtn.style.fill = 'red'
                ttsBtn.style.stroke = 'pink'
                common_extensions.ttsActive = true
            }

        },
        onNewMessageReceived: async function (payload) {

            var msgData = payload.message.data;

            if (common_extensions.ttsActive && payload.message.author === 'bot') {

                var utteranceArray = [];
                var validKeys = ['type', 'alt', 'title', 'subtitle', 'text'];
                JSON.stringify(msgData, function (key, value) {
                    if (validKeys.includes(key)) {
                        utteranceArray.push(value);
                    }
                    return value;
                });

                var utteranceString = utteranceArray.join('.\n')
                TeneoWebChat.call('show_typing_indicator', {author: "bot"});
                if (!common_extensions.msToken || (new Date() - common_extensions.msTokenTime >= 540000)) {
                    await common_extensions.getMsToken();
                }


                fetch("https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/ssml+xml',
                        'Authorization': 'Bearer ' + common_extensions.msToken,
                        'X-Microsoft-OutputFormat': 'webm-24khz-16bit-mono-opus'
                    },
                    body: "<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-AriaNeural'>" +
                        utteranceString +
                        "</voice></speak>"
                }).then(function (audioReadableStream) {

                    var reader = audioReadableStream.body.getReader()
                    var chunks = []
                    reader.read().then(function processAudio(audioBody) {
                        if (audioBody.done) {
                            var blob = new Blob(chunks, {type: 'audio/webm'});
                            var url = window.URL.createObjectURL(blob);

                            let twcAudio = new Audio();
                            twcAudio.src = url;
                            twcAudio.type = "audio/webm";
                            TeneoWebChat.call('hide_typing_indicator', {author: "bot"});
                            twcAudio.play().then(function () {
                                window.URL.revokeObjectURL(url);
                            })

                        } else {
                            chunks.push(audioBody.value);
                            return reader.read().then(processAudio)
                        }

                    })
                })
            }

        }
    }










