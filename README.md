# Teneo Web Chat

Teneo Web Chat is a chat interface that can be embedded in websites.  It is built using the [Vue.js](https://vuejs.org/) javascript framework and based on [Vue Beautiful Chat](https://github.com/mattmezza/vue-beautiful-chat) by Matteo Merola.

Support for various components like buttons, quick replies, images, videos and cards is built-in and additonal components can easily be added. For more details, see [the Teneo Web Chat page on teneo.ai](https://stagingcontent.teneo.ai/engine/channels/teneo-web-chat).

Teneo Web Chat works on modern browsers, like Chrome, Edge, Firefox, Opera and Safari.

## Prerequisites
* Your bot needs to be published and you need to know the engine URL.
* When extending the UI, a basic understanding of [Vue.js](https://vuejs.org) is required.

## Setup options

### Adding the web chat UI to your site
To add Teneo Web Chat to your site, proceed as follows:

#### Download main.js
Download the file main.js from the [latest release of teneo-web-chat](https://github.com/artificialsolutions/teneo-web-chat/releases/) and add it to your site.

#### Update pages
Make the following changes to *each* page where you want the web chat window to appear.
Add the following code before the closing &lt;/body&gt; tag to each page where you want the web chat window to appear.

```javascript
<script type="text/javascript" src="/path/to/webchat/main.js"></script>
<div id="teneo-web-chat"></div>
<script>
  window.onload = function () {
      if (
          window.TeneoWebChat &&
          typeof window.TeneoWebChat.initialize === 'function'
      ) {
          var element = document.getElementById('teneo-web-chat')
          var teneoEngineUrl = 'https://some.teneo/engine-instance/'
          var closeEngineSessionOnExit = 'no'
          var headerTitle = ''
          var headerIconUrl = ''
          var extraEngineInputParams = {}

          window.TeneoWebChat.initialize(
              element,
              headerTitle,
              teneoEngineUrl,
              closeEngineSessionOnExit,
              headerIconUrl,
              extraEngineInputParams
          );
      }
  }
</script>
```
When adding the script to your site, note the following:
* Make sure `/path/to/webchat/main.js` in the first line is replaced with the correct path.
* The value of 'teneoEngineUrl' should be updated to match the url of your Teneo Engine.
* The variable 'closeEngineSessionOnExit' specifies if the Teneo Engine session should be ended when the chat UI is closed. It is advised to keep this value as is, to prevent your bot from losing the conversation history when the user closes the chat UI.
* The value of 'headerTitle' specifies the title shown in the header of the chat window. If empty, 'Teneo Web Chat' is used.
* The variable 'headerIconUrl' can be used to specify a custom icon () in the header. It's an image with a size of 24x24 px.
* The variable 'extraEngineInputParams' can be populated with additional input parameters that need to be included in each Teneo Engine request. Note that both the keys and the values in the map should be strings.


### Deploy to Heroku
If you are looking for a quick way to interact with your bot using Teneo Web Chat but you don't have a website to host it yet, you can deploy it to Heroku. Click the button below to create a new Heroku app that hosts the web chat:

[![Deploy Branch](https://www.herokucdn.com/deploy/button.svg?classes=heroku)](https://heroku.com/deploy?template=https://github.com/artificialsolutions/teneo-web-chat/)

1. Give the app a name (lowercase, no spaces)
2. In the 'Config Vars' section, add the following:
    * **TENEO_ENGINE_URL:** The engine url.
    * **CLOSE_TIE_SESSION_ON_EXIT:** Optional. If set to true, the Teneo engine session will be killed when the chat UI is closed.
    * **HEADER_TITLE:** Optional. Title shown in the header of the chat window. Defaults to 'Teneo Web Chat' if empty.
    * **HEADER_ICON_URL:** Optional. Can be used to specify a custom icon (with a size of 24x24 pixels) shown in the header.
3. Click 'Deploy app'.

When Heroku has finished deploying, click 'View app'. You should now be able to use the web chat ui to talk to your bot.

### Running locally
If you want to run the code locally, for example to extend or update it, proceed as follows:

1. Clone the project:
    ```
    git clone https://github.com/artificialsolutions/teneo-web-chat && cd teneo-web-chat
    ```
2. Install dependencies:
    ```
    npm install
    ```
    Note: if you're using Windows and get an error "'NODE_ENV' is not recognized as an internal or external command, operable program or batch file.", you may want to install a module called [win-node-env](https://github.com/laggingreflex/win-node-env) and run npm install again.
3. Create a `.env` file in the `teneo-web-chat` folder with following (replace the dummy url with Teneo Engine url of your bot):
    ```
    TENEO_ENGINE_URL="https://some.engine/instance/"
    ```
4. Start the application:
    ```
    npm run start:dev
    ```

The page should be loaded on [http://localhost:9000](http://localhost:9000) now.

#### Building main.js
To build the bundle, run:
```
npm run-script build
```
This will add a file `main.js` in the `/dist` folder of the project. You can use this `main.js` to add to your site.

## Engine input parameters
The following input parameters are included in requests to Engine.

### channel
In addition to the input entered by the user, requests to the Teneo Engine also contain an input paramter 'channel' with value 'teneo-webchat'. This allows you to change the behavior of your bot, depending on the channel used. For information on how to retrieve the value of an input parameter in Teneo Studio, see [Store input parameters](https://www.teneo.ai/studio/scripting/how-to/store-input-parameters) on the Teneo Developers website.

### Extra parameters
An optional map of parameters can be included when Teneo Web Chat is initialized. The keys in this map (and their values) will be included as individual input parameters in all requests to the Teneo Engine. 

## Engine output parameters
The following ouput parameters can be included in responses from Engine.

### teneowebclient
The output parameter `teneowebclient` can contain JSON that is used to display attachments, like images, videos, buttons, cards etc. For more details on the compontent that are supported, please see: [teneo.ai](https://www.teneo.ai/engine/channels/teneo-web-chat).

## Programmatically resetting the chat window
You can programmatically reset the chat window by calling the `resetChat()` function, for example in an onclick event on your website:

```html
<button onclick="window.TeneoWebChat.resetChat()">Reset Chat</button>
```

This will end the session with the Teneo Engine, clear the chat history and close the chat window.

## Splitting answers into 'bubbles'
Sometimes you may wish to provide an answer using multiple text bubbles. This can be achieved by including an output parameter called `outputTextSegmentIndexes`. This output parameter should contain a list of index pairs, to indicate where the output text can be split into separate bubbles. The value of the `outputTextSegmentIndexes` should be structured like this (linebreaks are added for readability):
```
[
	[startIndexOfFirstBubble, endIndexOfFirstBubble],
  [startIndexOfSecondBubble, endIndexOfSecondBubble],
    ...
]
```

For more details on how to generate the value of `outputTextSegmentIndexes` in Teneo Studio, please refer to [Splitting answers into bubbles](https://www.teneo.ai/engine/channels/teneo-web-chat#splitting-answers-into-bubbles).

## Extending
The web chat UI can be extended by adding additional `.vue` files in the [/src/components/messages/](/src/components/messages/) folder. This file should parse the JSON that is included in an output parameter called `teneowebclient` in the engine response. The .vue file should display the data accordingly.

### Example: ImageMessage.vue

The ImageMessasge.vue extension displays an image below the bot's answer text.

#### Engine JSON

The JSON that should be included in the `teneowebclient` output parameter should look as follows:

``` json
{
    "type": "image",
    "url": "https://url.to/an/image.png"
}
```

Allowed characters for the type name are `a-z` and `-` where `-` cannot be the first character. Based on the `type`, the Teneo Web Chat code will look for a matching Vue component in the [/src/components/messages/](/src/components/messages) folder. The assumed file name is derived by taking the `type` field, turn it into upper `CamelCase` and append `Message` to the resulting string. E.g `image` becomes `ImageMessage` and `image-list` would become `ImageListMessage`.

#### Vue file

Because the type is `image`, the web chat code looks for a component in a file called [ImageMessage.vue](/src/components/messages/ImageMessage.vue) and renders it. This is what the [ImageMessage.vue](/src/components/messages/ImageMessage.vue) file looks like:

``` html
<template>
  <div class="image-message">
    <img :src="imageUrl" :alt="altText"/>
  </div>
</template>

<script>
export default {
  name: 'ImageMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'image' &&
          message.data &&
          message.data.image_url
        );
      },
    },
  },
  computed: {
    imageUrl() {
      return this.message.data.image_url;
    },
    altText() {
      return this.message.data.alt;
    },
  },
};
</script>

<style>
.image-message {
  width: 100%;
  margin-right: 40px;
}
.image-message img {
  max-width: 100%;
  max-height: 200px;
}
</style>
```

As you can see the file contains three sections:
* **template**: contains the html used to display the image
* **script**: contains the javascript to parse the engine json and return the image url
* **style**: contains the css styles to format the image

### Example: Quick replies

A second example extension shows how buttons can be displayed below the bot answer. When clicked a new input with the clicked postback value is sent to the bot.

#### Engine JSON

To display three buttons (Small, Medium and Large), the JSON that needs to be included in the `teneowebclient` output parameter can look as follows:

``` json
{
    "type": "quickreply",
    "quick_replies": [
        {
            "title": "Small",
            "postback": "small"
        },
        {
            "title": "Medium",
            "postback": "medium"
        },
        {
            "title": "Large",
            "postback": "large"
        }
    ]
}
```

For each button, the title is displayed in the button and the postback value is sent back to engine when the button is clicked.

#### Vue file

Because the type is `quickreply`, the web chat code looks for a component defined in a file called [QuickreplyMessage.vue](/src/components/messages/QuickreplyMessage.vue) and renders it.

Again, everything needed to handle this type of extension is contained in the single .vue file. It contains a template section to specify the html, a script section to parse the json but to also handle what happens when a user clicks one of the buttons. It also contains the styles needed to style the buttons.

The Teneo API is available as `this.$teneoApi` if you need to send messages back to the bot. Look at the [QuickreplyMessage.vue](/src/components/messages/QuickreplyMessage.vue) for an example of how to use it.

### Adding custom extensions

To add custom extensions, these are the steps to take:

1. Define the JSON that specifies the message type and any additional data.
2. Create an example flow in Teneo Studio that includes the JSON in the output parameter `teneowebclient` and publish your solution.
3. Create a .vue file for the message type
4. In the view file create the template, scripts and applicable styles
5. Test the result by connecting your web chat UI to the the engine with the example flow.

## Cross-Origin Resource Sharing (CORS)

In many cases, the website that is hosting the web chat UI uses a different domain than the domain used by the Teneo Engine. Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell a browser to let a web application running at one origin (domain) have permission to access selected resources from a server at a different origin.

By default the Teneo Engine includes CORS headers in the responses to browser requests coming from any domain. This means any site can add the web chat ui and interact with a Teneo Engine. If you want to restrict your solution to only include CORS headers for specific domains, you can add a file called `tieapi_cors_origins.txt` to the Teneo Resource Manager in the `views` folder. The file should contain the list of allowed origin domains (one domain per line, domains should include port numbers if applicable).
