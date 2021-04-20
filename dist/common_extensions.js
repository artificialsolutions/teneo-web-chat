console.log('Test Extensions Loaded')

function bufferToWave(abuffer, len) {
    var numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0,
        pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {             // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // write 16-bit sample
            pos += 2;
        }
        offset++                                     // next source sample
    }

    // create Blob
    return new Blob([buffer], {type: "audio/wav"});

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
}

var common_extensions =
    {
        twcMediaStream: null, twcMediaRecorder: null, msTokenTime: null, msToken: null, recordingInterval: null,
        recordingTime: null, ttsActive: null,


        setListeners: function () {
            console.log('Set Listeners called')
            if (window.TeneoWebChat) {
                TeneoWebChat.on('upload_button_clicked', this.onUploadButtonClicked)
                TeneoWebChat.on('asr_button_clicked', this.onAsrButtonClicked)
                TeneoWebChat.on('tts_button_clicked', this.onTtsButtonClicked)
                TeneoWebChat.on('new_message', this.onNewMessageRecieved)

            } else {
                setTimeout(function () {
                    this.setListeners()
                }, 100)
            }
        },
        onUploadButtonClicked: function () {
            // handle upload button functionality
            console.log("Upload button clicked!");
        },
        onAsrButtonClicked: function (asrBtn) {
            console.log("ASR button clicked!", asrBtn);

//If media stream and recorder exist, stop, remove them and process audio. If not, check whether the browser supports it and either create one or disable the button.

            if (common_extensions.twcMediaStream && common_extensions.twcMediaRecorder) {
                asrBtn.style.fill = 'initial'
                asrBtn.style.stroke = 'initial'
                var recordedChunks = [];
                common_extensions.twcMediaRecorder.ondataavailable = function (event) {
                    recordedChunks.push(event.data)
                    var twcMediaBlob = new Blob(recordedChunks)

                    var url = URL.createObjectURL(twcMediaBlob);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    a.href = url;
                    a.download = "fromBlob.webm";
                    a.click();
                    window.URL.revokeObjectURL(url);


                    var audioCtx = new (AudioContext || webkitAudioContext)();
                    twcMediaBlob.arrayBuffer().then(function (arrayBuffer) {
                        audioCtx.decodeAudioData(arrayBuffer).then(function (audioBuffer) {
                            // Process Audio
                            var offlineAudioCtx = new OfflineAudioContext({
                                numberOfChannels: 2,
                                length: 44100 * audioBuffer.duration,
                                sampleRate: 44100,
                            });

                            // Audio Buffer Source
                            var soundSource = offlineAudioCtx.createBufferSource();
                            soundSource.buffer = audioBuffer;

                            // Create Compressor Node
                            var compressor = offlineAudioCtx.createDynamicsCompressor();

                            compressor.threshold.setValueAtTime(-20, offlineAudioCtx.currentTime);
                            compressor.knee.setValueAtTime(30, offlineAudioCtx.currentTime);
                            compressor.ratio.setValueAtTime(5, offlineAudioCtx.currentTime);
                            compressor.attack.setValueAtTime(.05, offlineAudioCtx.currentTime);
                            compressor.release.setValueAtTime(.25, offlineAudioCtx.currentTime);

                            // Connect nodes to destination
                            soundSource.connect(compressor);
                            compressor.connect(offlineAudioCtx.destination);

                            offlineAudioCtx.startRendering().then(function (renderedBuffer) {

                                var wavFile = bufferToWave(renderedBuffer, offlineAudioCtx.length)

                                var new_file = URL.createObjectURL(wavFile);

                                // Make it downloadable

                                var download_link = document.createElement("a");

                                download_link.href = new_file;
                                download_link.target = '_BLANK';
                                download_link.download = 'afterWav.wav'
document.body.append(download_link)
                                download_link.click();

                                //send to ASR service
                                new Promise(function (resolve, reject) {
                                    if (!common_extensions.msToken || (new Date() - common_extensions.msTokenTime >= 540000)) {
                                        common_extensions.msTokenTime = new Date();
                                        fetch("https://northeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken", {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Content-length': '0',
                                                'Ocp-Apim-Subscription-Key': '560645f6584b4ca2b755d56557d6dae8'
                                            }
                                        }).then(function (tokenResponse) {
                                            tokenResponse.text().then(function (tokenText) {
                                                common_extensions.msToken = tokenText;
                                                resolve();
                                            });

                                        })
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
                                        body: wavFile
                                    }).then(function (audioResponse) {

                                        audioResponse.text().then(function (asrString) {
                                            TeneoWebChat.call('send_input', {"text": asrString})
                                        });

                                    })
                                })
                                common_extensions.twcMediaRecorder = null;
                                common_extensions.twcMediaStream.getTracks() // get all tracks from the MediaStream
                                    .forEach(function (track) {
                                        track.stop();
                                    });
                                window.twcMediaStream = null;
                            })
                        })
                    })
                }

                common_extensions.twcMediaRecorder.stop();
                window.clearInterval(common_extensions.recordingInterval);
                console.log("Interval cleared")

                TeneoWebChat.call('add_message', {
                    "type": "system",
                    "data": {
                        "text": "Recording stopped. Sending message."
                    }
                })
            } else {
                asrBtn.style.fill = 'red'
                asrBtn.style.stroke = 'pink'
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({audio: true}).then(function (stream) {
                        common_extensions.twcMediaStream = stream;
                        common_extensions.twcMediaRecorder = new MediaRecorder(stream);
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
                                "text": "Recording started. Click again to Stop."
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
                this.ttsActive = true
            }

        },
        onNewMessageRecieved: function (payload) {

            var msgData = payload.message.data;

            if (this.ttsActive && payload.message.author !== 'user') {
                var utteranceArray = [];
                var validKeys = ['type', 'alt', 'title', 'subtitle', 'text'];
                JSON.stringify(msgData, function (key, value) {
                    if (validKeys.includes(key)) {
                        utteranceArray.push(value);
                    }
                    return value;
                });

                var utteranceString = utteranceArray.join('.\n')
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(utteranceString))
            }

        }
    }












