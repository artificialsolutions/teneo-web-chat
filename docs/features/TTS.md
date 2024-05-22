# TTS/ASR Feature

Teneo Web Chat (TWC) incorporates a visual element enabling users to utilize their microphone for transcribing interactions with the chatbot (ASR) and speakers to read the responses back to them (TTS).

## Configuration

To enable ASR and / or TTS simply "turn them on" by setting the appropriate props when initializing TWC:

| prop        | value                |
| ----------- | -------------------- |
| `asrActive` | `true` activates ASR |
| `ttsActive` | `true` activates TTS |

When enabled 2 buttons are displayed in the input box:

+   microphone to trigger ASR (hold to talk)
+   speaker (or muted speaker) to toggle TTS

### Voice / Locale

| prop        | value                |
| ----------- | -------------------- |
| `locale`    | 2-part locale, eg: `es-ES` - this will be used to set the locale of the ASR and TTS |
| `voice`     | TTS voice to use - see separate sections for how this value is used |

### Web Speech API

By default ASR and TTS is handled in TWC using the [Web SpeechAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) which is provided by the browser. This is a standardised approach which requires no additional configuration or external services (and therefore service costs) - however different browsers have differing levels of support and the language support depends on the end user browser configuration.

For Web Speech API the **`voice`** prop is used in the following way:

+   Get all available voices for locale (from end user browser config)
    +   If no voices available: Error and stop TTS
+   If `voice` property set search available voices by each of these criteria in turn (use first match):
    1.  Voice name _beginning with_ `voice` prop value
        +   eg. `voice: en-US-Jenny` matches: **en-US-Jenny**Neural
    2.  Voice name _containing_ `voice` prop value
        +   eg. `voice: Jenny` matches: en-US-**Jenny**Neural
    3.  First voice where `localService` is falsey
        +   `localService: false` defines that the TTS is a remote service - and it likely therefore to be higher quality
        +   for example on Edge on a windows machine - the remote service TTS voices are in fact a subset of the MS Cognitive Speech TTS voices
    4.  First voice in list

### Microsoft Cognitive Speech API

It is possible to configure the details of a Microsoft Cognitive Speech (MCS) subscription and then TWC will use this service for ASR and TTS instead of Web Speech API. This allows more control over the languages available as any language available in the subscription is supported, regardless of the end user browser configuration.

Minimal additional configuration required to enable MCS:

| prop                          | value                |
| ----------------------------- | -------------------- |
| `msCognitiveSubscriptionKey`  | subscription key - available in "keys and endpoints" in the azure portal |
| `msCognitiveRegion`           | subscription region - available in "keys and endpoints" in the azure portal - this is the region code (eg. `northeurope`) **not** the descriptive 'Location' (eg. 'North Europe') |
| `msCognitiveSubscriptionOnly` | when `true` TWC will simply use the key and region for access. any other value (including not present) TWC will negotiate a token first and use this for ASR / TTS interactions |

For MCS the **voice** specified must be a full match of the required `SpeechSynthesisVoiceName`. This can be found from the [Speech Studio - Voice Gallery (Azure AI)](https://speech.microsoft.com/portal/voicegallery) - in the Sample Code of the chosen voice. If no voice is specified then the default voice is used as per MCS functionality

#### Migration Information

If migrating from TWC 3.7.7 and using a more complex MCS configuration, support for all the previously defined additional `msCognitive...` properties has been migrated to the new functionality and should work seamlessly. The exception being: `msVoice` which is now simply `voice`

#### Content Security Policy (CSP)

The TWC integration with MCS obviously requires TWC to call out to microsoft services to perform the ASR and TTS - therefore if a CSP is configured, then the CSP will be required to allow these endpoints.

For example a simple install as described above with a 'North Europe' subscription will need to add the following to the `connect-src` policy:

```csp
wss://northeurope.tts.speech.microsoft.com wss://northeurope.stt.speech.microsoft.com
```

## Custom ASR / TTS Integration

It would be possible to build an integration to a different ASR / TTS service using the new events added in this release:

| event        | payload                |
| ------------ | --------------------- |
| API_ON_ASR_ENSURE_AVAILABLE | Perform any setup and indicate whether ASR is available. Called on each attempt before starting ASR recognition |
| API_ON_ASR_START_RECOGNITION | Start the ASR process, receives handlers callbacks to notify TWC of recognition events |
| API_ON_ASR_CLEANUP | Called once ASR has completed to perform any required cleanup |
| API_ON_TTS_ENSURE_AVAILABLE | Perform any setup and indicate whether TTS is available. Called on each attempt before starting TTS synthesis |
| API_ON_TTS_READ_TEXT | Start the TTS process, receives a handler for notifying of TTS completion |
| API_ON_TTS_STOP | Stop TTS triggered from TWC (for example user mutes TTS) |

### ASR Implementation - Dummy Example

```javascript
    initialize() {
        EventBus.$on(API_ON_ASR_ENSURE_AVAILABLE, (payload) => this.asrEnsureAvailable(payload));
        EventBus.$on(API_ON_ASR_START_RECOGNITION, (payload) => this.asrStartRecognition(payload));
        EventBus.$on(API_ON_ASR_CLEANUP, (payload) => this.asrCleanup(payload));

        EventBus.$on(API_ON_TTS_ENSURE_AVAILABLE, (payload) => this.ttsEnsureAvailable(payload));
        EventBus.$on(API_ON_TTS_READ_TEXT, (payload) => this.ttsReadText(payload));
        EventBus.$on(API_ON_TTS_STOP, (payload) => this.ttsStop(payload));
    }

    async asrEnsureAvailable(payload) {
        // handled = true to prevent default TWC handling
        payload.handledState.handled = true;

        // Initialise ASR - set asrAvailable = true if successful
        payload.asrAvailable = true;
    }

    asrStartRecognition(payload) {
        // handled = true to prevent default TWC handling
        payload.handledState.handled = true;
        
        const { locale, handleFinalResult, handleCancel, handleIntermediateResult } = payload;
        // locale (string) 2 part locale to use for ASR - eg. es-ES
        // handleFinalResult (function(string)): call with final transcription result text
        // handleCancel (function()): call when cancelling ASR from the ASR side
        // handleIntermediateResult (function(string)): call with intermediate transcription result texts (if supported by the ASR system)
    }

    asrCleanup(payload) {
        // handled = true to prevent default TWC handling
        payload.handledState.handled = true;

        // Perform cleanup of ASR after completion (or cancellation)
        // No additional payload
    }

    async ttsEnsureAvailable(payload) {
        // handled = true to prevent default TWC handling
        payload.handledState.handled = true;

        // Initialise TTS - set asrAvailable = true if successful
        payload.ttsAvailable = true;
    }

    ttsReadText(payload) {
        payload.handledState.handled = true;
        const { text, locale, voice, ttsComplete } = payload;
        // text (string): the text to synthesize
        // locale (string): 2 part locale to use for TTS - eg. es-ES
        // voice (string): voice prop of TWC to use choosing TTS voice
        // ttsComplete (function()): call on completion of outputting the synthesized result - eg. when the speaking is complete
    }

    ttsStop(payload) {
        payload.handledState.handled = true;
        // Stop the TTS
    }
```

## How to Use Voice Features

### Automatic Speech Recognition ASR(Recording Your Voice)

+   To Start Recording: Press and hold the microphone button. Speak clearly towards your device's microphone. Your words will be transcribed in real-time (if using web speech).
+   To Stop Recording: Release the microphone button. You can also move your mouse away from the button while holding it down to stop recording.
+   If Recording Stops Unexpectedly: Check to ensure you're still holding the button or haven't moved the mouse away from it.

### Text-to-Speech TTS (Listening to Text)

+   To Hear Text Out Loud: If text-to-speech is active, the application will read aloud messages as they are received.
+   To Stop Listening: Click the speaker icon again while the text is being read to you to stop the playback immediately and to mute TTS for future messages.
+   To Hear Text Out Loud Again: Click the speaker icon again, the application will read aloud the next message received.

### Tips for Best Experience

+   Speak Clearly: For best transcription results, speak clearly and at a moderate pace.
+   Avoid Background Noise: Try to minimize background noise when using the speech-to-text feature to improve accuracy.
+   Check Volume: Make sure your device's volume is turned up when using the text-to-speech feature to hear the playback clearly.

By following these simple steps, you can effortlessly interact with the application using your voice for input and receive auditory feedback. Enjoy a hands-free and accessible experience!
