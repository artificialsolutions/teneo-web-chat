# v3.6.2
## 22-07-2021
* Implemented voice selection in store and API. Better warnings and disabling ASR in insecure contexts.
* Fixed issues with auto ASR and multiple bubbles
* Added message type for table
* Added message type for forms
* Fixed carousel swiping issue
* Sets ASR/TTS buttons to broken if error is encountered

# v3.6.1
## 09-06-2021
* Automatic ASR disabled after the first time it has been canceled
* Detects when connection to backend server fails with error handler added
* TTS now reads system messages
* ASR and TTS can now be canceled

# v3.6.0
## 05-05-2021
* Fix reset title icon issue
* Implemented ASR and TTS with Microsoft Azure Speech services as default provider, with other providers available through extensions

# v3.5.0
## 21-01-2021
* Allow html in body of cards
* Added api's to display an upload button next to the send icon. An extension can then be used to handle the 'on upload_button_clicked' click event. The following api's were added to support this:
    * call set_upload_icon
    * call reset_upload_icon
    * call show_upload_button
    * call hide_upload_button
    * call disable_upload_button
    * call enable_upload_button
    * on upload_button_clicked


# v3.4.0
## 07-01-2021
* Added new api to add a callout message to the launch button to catch the web visitor's attention
* Added new callback api 'reset' to intercept chat window reset events
* Images can now be enlarged
* Added css variables for lightbox colors used for enlarged images
* When icons and window title are reset using the api, reset to init value instead of teneo web chat default value
* Added config option to allow use of localStorage instead of sessionStorage
* Added api to get the storage object
* Added api to get locale
* Use dedicated css variables for typing indicators
* Use css variable for modal background color
* Use Chinese Traditional if locale is set to just 'cn'
* Added id's to teneo web chat container and send icon
* Fix font size in Safari on macOS Big Sur
* Fix issue with launch button and chat window dropping behind some layers
* Fix URL validation issue

# v3.3.0
## 9-11-2020
* New: UI can be configured in multiple langauges
* New: Added option to add custom translations
* Accessibility improvements
* Minor bugfixes

# v3.2.0
## 27-10-2020
* New message type: [Link buttons](https://developers.artificial-solutions.com/engine/teneo-web-chat#link-buttons)
* New configuration setting: sendIconUrl
* New api's: [Set send icon](https://developers.artificial-solutions.com/engine/teneo-web-chat/web-chat-api#set-send-icon) and [Reset send icon](https://developers.artificial-solutions.com/engine/teneo-web-chat/web-chat-api#reset-send-icon)
* New api: [On send button clicked](https://developers.artificial-solutions.com/engine/teneo-web-chat/web-chat-api#on-send-button-clicked)
* New api: [Set engine URL](https://developers.artificial-solutions.com/engine/teneo-web-chat/web-chat-api#set-engine-url)
* Improved accessibility
* Added 'twc-' prefix to the following classes:
    * active -> twc-active
	* disabled -> twc-disabled
	* expired -> twc-expired
	* selected -> twc-selected
	* bot -> twc-bot
	* user - twc-user
	* agent - twc-agent
* Launch button now has an additional class 'twc-minimized' or 'twc-closed', depending on whether the window was minmized or closed.

For more details on the styles used by Teneo Web Caht, see the new page [Styling Teneo Web Chat](https://developers.artificial-solutions.com/engine/teneo-web-chat/styling-teneo-web-chat).

Note: as of this version, link_items in cards are deprecated. They still work but will be removed in the next major release of Teneo Web Chat. If your solution uses cards with link_items, please update them to use linkbutton_items instead.

# v3.1.0
## 23-09-2020
* Buttons, quick replies and clickable lists can now include engine input parameters
* Added API-call 'Set chat window icon'
* Reworked unit tests to use jest instead of mocha
* Updated dependencies and removed obsolete dependencies

# v3.0.1
## 09-09-2020
* Support Dynamic Type on iOS - Font size in Teneo Web Chat will depend on Dynmic Type setting in iOS
* Fixed a bug where session was not properly maintained in Safari
* Improved keyboard handling on iOS

# v3.0.0
## 02-09-2020
__*** THIS VERSION CONTAINS BREAKING CHANGES ***__
* The file name of the Teneo Web Chat has been changed from `main.js` to `teneo-web-chat.js`.
* CSS styles used by Teneo Web Chat are now prefixed with `twc-`. If you modified the look & feel by overriding the Teneo Web Chat CSS styles, you may need to rename some styles.
* The code to embed Teneo Web Chat in your site has changed. When updating, make sure you update the embed code on all pages where Teneo Web Chat is made available.

### NEW FEATURES
* Javascript API
* New message type 'Modal'
* New message type 'System message'
* Option to show both a minimize and close button in header
* Text messages can now contain an avatar icon and a date line
* Support for message author type 'agent' (in addition to the already existing author types 'bot' and 'user')
* Support for typing indicators

### JAVASCRIPT API
The new Teneo Web Chat Javascript API allows you to trigger Teneo Web Chat events, respond to events that happen inside Teneo Web Chat and get details from Teneo Web Chat. This lets you change or extend its behavior in ways that are not provided by the standard configuration.
* Trigger events
    * Maximize
    * Minimize
    * Send input
    * End session
    * Clear chat history
    * Reset
    * Add message
    * Show typing indicator
    * Hide typing indicator
    * Set chat window title
    * Disable user input
    * Enable user input
* Subscribe to events
    * On ready
    * On open button clicked
    * On minimize button clicked
    * On close button clicked
    * On visibility changed
    * On user typing
    * On input submitted
    * On message button clicked
    * On engine request
    * On engine response
    * On new message
* Getters
    * Get state
    * Get message list
    * Get engine URL

### IMPROVEMENTS AND FIXES
* Icons used in the UI can now be configured
* Improved support for iOS
* Fix error in console about scrolling
* Fix scrolling issue when displaying large images
* Fix layout of buttons with long text
* Streamlined initialization parameters
* Updated dependencies

# v2.5.1
## 17-06-2020
* Fix: don't show scrolling animation when reopening chat window but start at bottom instantly
* Improvement: show spinner after clicking buttons, quick replies etc

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
