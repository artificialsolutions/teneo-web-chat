# Microsoft Cognitive Services integration

This integration allows you to enhance the functionality of the app by leveraging Microsoft`s Text-to-Speech (TTS) and Automatic Speech Recognition (ASR) capabilities. By configuring a few properties in the TWC (Text-to-Speech and ASR Widget) settings, you can enable this integration seamlessly.
 
To integrate with Microsoft Cognitive Services, you need to add the corresponding properties to your TWC configuration. For TTS-related parameters, the properties should start with "msCognitiveTts," for ASR-related parameters, they should start with "msCognitiveAsr," and for parameters related to both, they should start with "msCognitive" (without the "Tts" or "Asr" substrings). If a parameter`s value is undefined, null, or an empty string, it will be ignored as if it were absent. In case both a specific parameter (with "Asr" or "Tts") and a general parameter (without "Asr" or "Tts") are used, the specific parameter takes precedence.

The following parameters are implemented: 

- `msCognitiveAsrSubscriptionKey`, `msCognitiveTtsSubscriptionKey`,
- `msCognitiveSubscriptionKey`: (String) the subscription key
- `msCognitiveAsrRegion`, `msCognitiveTtsRegion`, `msCognitiveRegion`: (String) the <a href="https://aka.ms/csspeech/region">region</a>
- `msCognitiveAsrSubscriptionOnly`, `msCognitiveTtsSubscriptionOnly`, `msCognitiveSubscriptionOnly`: (Boolean, defaults to false) a flag indicating that only the subscription key and the region should be used and the token should be skipped
- `msCognitiveAsrCustomAuthTokenUrl`, `msCognitiveTtsCustomAuthTokenUrl`, `msCognitiveCustomAuthTokenUrl`: a custom URL to obtain the token from, to be used if the default one should be overwritten
-`msCognitiveAsrEndpoint`, `msCognitiveTtsEndpoint`, `msCognitiveEndpoint`: an endpoint, to be used with a subscription key. It is is intended only for users who use a non-standard service endpoint or parameters. 

The query parameters specified in the endpoint URL are not changed, even if they are set by any other APIs.

- `msCognitiveAsrHost`, `msCognitiveTtsHost`, `msCognitiveHost`: an host, to be used with a subscription key. 

Standard resource path will be assumed. For services with a non-standard resource path or no path at all, use the endpoint-related parameter instead. Query parameters are not allowed in the host URI. Format is "protocol://host:port" where ":port" is optional.
