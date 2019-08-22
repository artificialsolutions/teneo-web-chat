
# v1.1.0
## 22-08-2019
* Improved
    * Added config option CLOSE_TIE_SESSION_ON_EXIT. If set to true, the Teneo Engine session will be killed when the chat UI is closed. Default setting is false.
    * Requests to the Teneo Engine now contain a parameter 'channel' with value 'teneo-webchat'

* Fixed
    * Fixed .focus warnings