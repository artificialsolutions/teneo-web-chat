# v2.5.0
## 10-06-2020
* Support for splitting output into multiple text bubbles
* Updated dependencies

# v2.4.0
## 27-05-2020
* Showing spinner while waiting for engine response
* Updated dependencies

# v2.3.0
## 25-05-2020
* The chat window can now be reset programmatically, by calling the resetChat() function

# v2.2.0
## 15-05-2020
* IE11 support

# v2.1.0
## 16-04-2020
* Added new component for Audio playback
* Ignore line breaks in answer texts
* Gracefully handle invalid component JSON

# v2.0.1
## 01-04-2020
* Improved browser support
* An optional map of parameters can now be included when Teneo Web Chat is initialized. These parameters will be included as input parameters in requests to engine
* Minor UI improvements

# v2.0.0
## 24-03-2020
* Udpated existing components/extensions and added many new components that can be used in the bot's response
    * Buttons
    * Cards
    * Clickable lists
    * Image 
    * Quick replies
    * Videos (YouTube, Vimep, mp4)
    * Combo (combine multiple of the above in a single response)
* Updated header icon
* Made header icon configurable
* Updated dependencies


# v1.1.0
## 22-08-2019
* Improved
    * Added config option CLOSE_TIE_SESSION_ON_EXIT. If set to true, the Teneo Engine session will be killed when the chat UI is closed. Default setting is false.
    * Requests to the Teneo Engine now contain a parameter 'channel' with value 'teneo-webchat'

* Fixed
    * Fixed .focus warnings