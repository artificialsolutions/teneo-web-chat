# TTS/ASR Feature.
Teneo Web Chat (TWC) incorporates a visual element enabling users to utilize their microphone for transcribing interactions with our chatbot, leveraging the capabilities of the WebspeechAPI. This functionality includes a designated button that initiates or halts the transcription process. Upon clicking the button, the transcription service is activated or deactivated, converting the user's spoken words into text.

## Key Component Component: TranscriptionButton

This component displays a button that allows users to start and stop transcription. The button is disabled when transcription is already in progress, and it emits an event when transcription is started or stopped.

### Props:
`userInputFieldId (String): ` The ID of the text area where the 
transcription results will be displayed.

### State:
```transcribing (Boolean):``` Whether or not transcription is in progress.
```recognition (SpeechRecognition):``` The SpeechRecognition object used to transcribe the user's speech.

### Methods:

```startTranscription():``` Starts transcription.
```pauseTranscription():```  Pauses transcription.
```resultHandler(event):``` Handles speech recognition results.

### Events:

```transcribing:``` Emits when transcription is started or stopped.
```transcription:``` Emits with the latest transcription result.
