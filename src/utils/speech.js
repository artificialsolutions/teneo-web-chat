import Vue from 'vue';

// scripts for ASR and TTS
var enableTTS = true;
var lang = "en-GB";
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var timeoutVar;

export const Speech = {

    speakMessage: function(message) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            var msg = new SpeechSynthesisUtterance(message);
            msg.lang = lang;
            // only speak when window has focus
            window.speechSynthesis.speak(msg);
            if (document.hasFocus()) {
                
            }
            
            msg.onend = function(e) {
            
              console.log('Finished in ' + event.elapsedTime + ' seconds.');
              if (openMicAfterTTS) {
                  appStartASR();
              }
            };
            
        }
    },

    speakOnApp: function(message) {
        // Android
        try {
            //message = message.replace(/<\/?[^>]+(>|$)/g, "");
            console.log("TTS Message: " + message)
            Android.speak('<speak>' + message + '</speak>');
        } catch (Exception) {
            // ignore
        }
        
        // iOS
        try {
            webkit.messageHandlers.speak.postMessage(message);
        } catch (Exception) {
            // ignore
        }
    }
  };



if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
	console.log('No Speech Recognition');
} else {
	//var recognition = new webkitSpeechRecognition();
    var recognition = null;
    try {
        recognition = new SpeechRecognition();
    } catch (Exception) {
        console.log('Not on firefox')
    }
    try {
        recognition = new webkitSpeechRecognition();	
    } catch (Exception) {
        console.log('Not on chrome')
    }
    //var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition || null;
    //var recognition = new SpeechRecognition();	
	recognition.continuous = false;
	recognition.interimResults = true;
	recognition.maxAlternatives = 0;
	
	recognition.onstart = function() {
		console.log(lang);
		console.log('recognition.onstart');
		if ('speechSynthesis' in window) {
			window.speechSynthesis.cancel();
		}
		recognizing = true;
        startMicAnimation();
		
	};

	recognition.onerror = function(event) {
		console.log('recognition.onerror: ' + event.error);
		clearTimeout(timeoutVar);
		if (event.error == 'no-speech') {
			stopMicAnimation();
            Materialize.toast('Speech recognition not supported', 3000, 'rounded');
            console.log('speech error: speech not supported')
			ignore_onend = true;
		}
		if (event.error == 'audio-capture') {
			stopMicAnimation();
            console.log('speech error: mic not available')
            Materialize.toast('Microphone unavailable', 3000, 'rounded');
			ignore_onend = true;
		}
		if (event.error == 'not-allowed') {
			stopMicAnimation();
            console.log('speech error: not allowed')
            Materialize.toast('Access to speech recognition denied', 3000, 'rounded');
			ignore_onend = true;
		}
	};

	recognition.onend = function() {
		console.log('recognition.onend');
		clearTimeout(timeoutVar);
		recognizing = false;
		if (ignore_onend) {
			return;
		}
		stopMicAnimation();
        
		if (!final_transcript) {
			$('#final_span').val($('#dynamic_transcript').html())
		}
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
			var range = document.createRange();
			range.selectNode(document.getElementById('final_span'));
			window.getSelection().addRange(range);
			console.log('Range value: [' + range + ']');
			if (range != '') {
				$('#userinput').val(range);
				console.log('Submitting form');
				$('#textEntryForm').submit();
				final_span.innerHTML = '';
			}
		}
	};

	recognition.onresult = function(event) {
		clearTimeout(timeoutVar);
		var interim_transcript = '';
		if (typeof(event.results) == 'undefined') {
			console.log('recognition.onresult event.results undefined');
			recognition.onend = null;
			recognition.stop();
			return;
		}
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}
        
		final_span.innerHTML = capitalize(final_transcript);
        //$('#dynamic_transcript').html(interim_transcript);
        processPartialVoiceInput(interim_transcript)
		timeoutVar=setTimeout(function(){
			console.log('timeout, aborting recognition');
			recognizing = false;
			recognition.abort();
		},1500);
	};

}

function startMicAnimation () {
    console.log("startMicAnimation");
    $("#micbutton_anim").addClass("pulse");
    $("#micbutton_anim").removeClass("red");
    $("#micbutton_anim").addClass("purple");
    $("#TextEntryBox").hide();
}

function stopMicAnimation () {
    console.log("stopMicAnimation");
    $("#micbutton_anim").removeClass("pulse");
    $("#micbutton_anim").removeClass("purple");
    $("#micbutton_anim").addClass("red");
}

var first_char = /\S/;
function capitalize(s) {
	return s.replace(first_char, function(m) { return m.toUpperCase(); });
}





