# TTS/ASR Feature.
Teneo Web Chat (TWC) incorporates a visual element enabling users to utilize their microphone for transcribing interactions with our chatbot, leveraging the capabilities of the WebspeechAPI. This functionality includes a designated button that initiates or halts the transcription process. Upon clicking the button, the transcription service is activated or deactivated, converting the user's spoken words into text.

## Key Component Component: 
TranscriptionButton

* Provides a visual interface for starting and stopping speech-to-text transcription.
* Changes appearance/state to indicate the active status of transcription.
* Emits events to signal status updates to other parts of the application.

## Web Speech API Integration:

* Leverages the browser's built-in Web Speech API for both speech recognition (ASR) and text-to-speech (TTS) capabilities.

### Props:
`userInputFieldId (String): ` The ID of the text area where the 
transcription results will be displayed.

### Events:
  This component emits the following events:

```transcribing (Boolean):``` Whether or not transcription is in progress.

```transcriptionComplete (String):``` Emitted when the transcription process completes with the final result.

```transcription (String):``` Emitted with the latest transcription result during the transcription process.


### Methods:

```startTranscription():``` Starts transcription.

```stopAsr():```  Stops the speech recognition process.

```readTranscription(text):``` Reads aloud the provided text using TTS.

```stopTTS():``` Stops any ongoing text-to-speech playback.

```resultHandler(event):``` Handles speech recognition results.

## Configuration

To ensure the ASR and TTS functionalities work seamlessly in your application, you must enable them through your environment variables. 

### Setting Environment Variables

1. **Enable ASR and TTS Features:** You need to set environment variables that the component can read to understand whether the ASR and TTS features are enabled. This can be done in the `.env` file in this project.

2. Create or Edit `.env` File: in this repo. 
 Update the following lines to enable ASR and TTS:

    ```plaintext
    ASR_ACTIVE= true
    TTS_ACTIVE= true
    ```

### Component Integration:

* Import and include the TTS/ASR component within your Teneo Web Chat application.
* Ensure its placement aligns with your desired user interface layout.

 # How to Use Voice Features

## Automatic Speech Recognition ASR(Recording Your Voice)
* To Start Recording: Press and hold the microphone button. Speak clearly towards your device's microphone. Your words will be transcribed in real-time.
* To Stop Recording: Release the microphone button. You can also move your mouse away from the button while holding it down to stop recording.
* If Recording Stops Unexpectedly: Check to ensure you're still holding the button or haven't moved the mouse away from it.

## Text-to-Speech TTS (Listening to Text)
* To Hear Text Out Loud: If text-to-speech is active, the application will read aloud the latest message in TWC.
* To Stop Listening: Click the speaker icon again while the text is being read to you to stop the playback immediately.
## Tips for Best Experience

* Speak Clearly: For best transcription results, speak clearly and at a moderate pace.
* Avoid Background Noise: Try to minimize background noise when using the speech-to-text feature to improve accuracy.
* Check Volume: Make sure your device's volume is turned up when using the text-to-speech feature to hear the playback clearly.
