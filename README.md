# Teneo Web Chat
Teneo Web Chat is a chat widget that can be embedded in websites. Support for various components like buttons, quick replies, images, audio, videos and cards is built-in and the available Teneo Web Chat JavaScript API allows for easy live chat integration and extendability.

Core features:
* Lightweight
* Easy to embed in websites
* Supports various message types, like cards, images, buttons, quick replies etc.
* Extendable through a powerful Javascript API
* Works on all major browsers like Chrome, Edge, Firefox, Internet Explorer 11, Opera and Safari. 
* Open source

NOTE: This readme contains high-level information about Teneo Web Chat. For full documentation, please refer to the [Teneo Web Chat Documentation](https://www.teneo.ai/engine/channels/teneo-web-chat) on teneo.ai.

## Prerequisites
* Your bot needs to be published and you need to know the engine URL.
* To embed Teneo Web Chat in your site, you will need to be able to upload a javascript file and embed code into the website's html.

## Setup options
### Adding the web chat UI to your site
To add the web chat UI to your site, proceed as follows:

##### Download teneo-web-chat.js
Download the file `teneo-web-chat.js` from the [latest release on Github](https://github.com/artificialsolutions/teneo-web-chat/releases/) and add it to your site.

##### Update pages
Add the following code before the closing `</body>` tag to _each page_ where you want the web chat window to appear.

```
<!-- Teneo Web Chat start -->
<div id="teneo-web-chat"></div>
<script src="/path/to/teneo-web-chat.js"></script>
<script>
  window.onload = function () {
    if (
      window.TeneoWebChat &&
        typeof window.TeneoWebChat.initialize === 'function'
    ) {
      var element = document.getElementById('teneo-web-chat');
      const teneoProps = {
        'teneoEngineUrl': 'https://some.teneo/engine-instance/',
      }
      window.TeneoWebChat.initialize(element,teneoProps);
    }
  }
</script>
<!-- Teneo Web Chat end -->
```

When adding the script to your site, note the following:
* Make sure `/path/to/teneo-web-chat.js` is replaced with the correct path.
* Make sure `https://some.teneo/engine-instance/` is updated to match the url of your engine.

##### Initialization properties
When initializing Teneo Web Chat, an object containing the initialization properties can be passed on. In the [code](#update-pages) above, an object called `teneoProps` is used to pass on the initialization properties. The following properties are supported:


|  Property  | Type | Description  |
|  :-----          |  :-----          |  :-----          |
|  teneoEngineUrl | string | Mandatory. The URL of the Teneo Engine. |
|  title | string | Optional. Title shown in the header. If empty or not provided, 'Teneo Web Chat' is used. |
|  titleIconUrl | string | Optional. URL to a custom icon (with a size of 24x24 pixels).  If empty or not provided, the default icon is used. |
|  showCloseButton | boolean | Optional. If true, a close button is shown next to the minimize button. When clicked, the chat window is closed, the chat history deleted and the engine session is ended. |
| minimizeIconUrl | string |  Optional. URL to a custom minimize icon (with a size of 32x32 pixels).  If empty or not provided, the default icon is used. |
| closeIconUrl | string |  Optional. URL to a custom close icon (with a size of 32x32 pixels).  If empty or not provided, the default icon is used. |
| launchIconUrl | string |  Optional. URL to a custom launch icon (with a size of 26x26 pixels). If empty or not provided, the default icon is used. |
|  botAvatarUrl | string | Optional. URL to a custom bot avatar (with a size of 34x34 pixels) shown next to messages with author 'bot'. If empty or not provided, no avatar will be shown. |
|  userAvatarUrl | string | Optional. URL to a custom user avatar (with a size of 34x34 pixels) shown next to messages with author user. If empty or not provided, no avatar will be shown. |
|  agentAvatarUrl | string | Optional. URL to a custom agent avatar (with a size of 34x34 pixels) shown next to messages with author agent. If empty or not provided, no avatar will be shown. |
|  teneoEngineParams | object | Optional. Key-value pairs of input parameters that should be included in requests to the Teneo Engine. Both the keys and the values in the map should be strings. |


### Deploy to Heroku
If you are looking for a quick way to interact with your bot using Teneo Web Chat but you don't have a website to host it yet, you can deploy it to Heroku. Click the button below to create a new Heroku app that hosts the web chat:

[![Deploy](https://www.herokucdn.com/deploy/button.svg?classes=heroku)](https://heroku.com/deploy?template=https://github.com/artificialsolutions/teneo-web-chat)

1. Give the app a name (lowercase, no spaces)
2. In the 'Config Vars' section, add the following:
    * **TENEO_ENGINE_URL:** The engine url.
3. Click 'Deploy app'.

When Heroku has finished deploying, click 'View app'. You should now be able to use the web chat ui to talk to your bot.

## Message types
Teneo Web Chat offers various message types that can be 'attached' to the bot's answer text. This is achieved by adding an output parameter `teneowebclient` with JSON specific for the message type. For more details on the message types supported, see the [documentation on teneo.ai](https://www.teneo.ai/engine/channels/teneo-web-chat).

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
### Javascript API
The functionality provided by Teneo Web Chat can be extended and modified using the [Teneo Web Chat JavaScript API](https://www.teneo.ai/engine/channels/teneo-web-chat/teneo-web-chat-api). This api allows developers to create extensions that can trigger events in the Teneo Web Chat widget, or subscribe to events that may occur in the chat widget. This lets developers change or extend its behavior in ways that are not provided by the standard configuration. 

Extensions can be created using standard JavaScript, without needing to modify the source code of Teneo Web Chat. Full specification of the API can be foud here: [Teneo Web Chat JavaScript API](https://www.teneo.ai/engine/channels/teneo-web-chat/teneo-web-chat-api).

### Modifying the source code
While in most cases using the Javascript API provides enough functionality to extend Teneo Web Chat, you can also access and work with Teneo Web Chat's source code directly. To modify and run the source code, a basic understanding of [Vue.js](https://vuejs.org) is required. Teneo Web Chat is based on [Vue Beautiful Chat](https://github.com/mattmezza/vue-beautiful-chat) by Matteo Merola. 

#### Running the code locally
If you want to run the code locally, proceed as follows:

1. Clone the project:
    ```
    git clone https://github.com/artificialsolutions/teneo-web-chat && cd teneo-web-chat
    ```
2. Install dependencies:
    ```
    npm install
    ```
    !!! Note: if you're using Windows and get an error "'NODE_ENV' is not recognized as an internal or external command, operable program or batch file.", you may want to install a module called [win-node-env](https://github.com/laggingreflex/win-node-env) and run `npm install` again.
3. Create a `.env` file in the `teneo-web-chat` folder with the following (replace the dummy url with Teneo Engine url of your bot):
    ```
    TENEO_ENGINE_URL=https://some.engine/instance/
    ```
4. Start the application:
    ```
    npm run start:dev
    ```

The page is now available on [http://localhost:9000](http://localhost:9000).

#### Building teneo-web-chat.js
If you've made modifications to the code and you want to build the bundle, run:
```
npm run-script build
```
This will add a file `teneo-web-chat.js` in the `/dist` folder of the project. You can use this `teneo-web-chat.js` to add to your site.

#### Creating custom message types
Teneo Web Chat can be extended with custom message types by adding additional `.vue` files in the `/src/components/messages/` folder. These files should parse the JSON that is included in an output parameter called `teneowebclient` in the engine response. The .vue files should display the data accordingly. 

Let's look at two message types included in Teneo Web Chat.

##### Example: Image
As we have seen above, to display an image, the JSON that should be included in the `teneowebclient` output parameter should look as follows:

```
{
    "type": "image",
    "image_url": "https://url.to/an/image.png",
    "alt": "This is an image"
}
```
The type parameter is linked to the .vue file for this message type. Allowed characters for the type name are `a-z` and `-` where `-` cannot be the first character. Based on the `type`, the Teneo Web Chat code will look for a matching Vue file in the `/src/components/messages/` folder. The assumed file name is derived by taking the type field, turn it into upper _CamelCase_ and append _Message_ to the resulting string. E.g `image` becomes `ImageMessage` and `image-list` would become `ImageListMessage`.

###### Vue file
Because the type is `image`, Teneo Web Chat looks for a file called `ImageMessage.vue` in the `/src/components/messages/` folder and it will execute that file. This is what the `ImageMessage.vue` file looks like:

```
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
* **script**: contains the javascript to parse the engine JSON and return the image url and the alt text
* **style**: contains the css styles to format and position the image

##### Example: Quick replies
To display three quick reply buttons (Small, Medium and Large), the JSON that needs to be included in the `teneowebclient` output parameter should look as follows:

```
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

The title is displayed in the button and the postback value is sent back to engine when the button is clicked.

###### Vue file
Because the type is `quickreply`, the web chat code looks for a file called `QuickreplyMessage.vue` in the `/src/components/messages/` folder and renders it. 

Again, everything needed to handle this type of extension is contained in the single .vue file. It contains a template section to specify the html, a script section to parse the JSON but to also handle what happens when a user clicks one of the buttons. It also contains the styles needed to style the buttons.

The Teneo API is available as `this.$teneoApi` if you need to send messages back to the bot. Look at the `QuickreplyMessage.vue` for an example of how to use it.

##### Steps for creating custom message types
To create custom message types, these are the steps to take:
1. Define the JSON that specifies the message type and any additional data.
2. Create an example flow in studio that includes the JSON in the output parameter `teneowebclient` and publish your solution.
3. Create a .vue file for the message type.
4. Add the template, scripts and applicable styles to the .vue file.
5. Test the result by connecting your Teneo Web Chat to the engine with the example flow.

## Engine input parameters
### channel
In addition to the input entered by the user, requests to the Teneo Engine also contain an input parameter 'channel' with value 'teneo-webchat'. This allows you to change the behavior of your bot, depending on the channel used. For information on how to retrieve the value of an input parameter in Teneo Studio, see [Store input parameters](https://www.teneo.ai/studio/scripting/how-to/store-input-parameters) on the Teneo Developers website.

### Extra parameters
An optional map of parameters can be included when Teneo Web Chat is initialized. The keys in this map (and their values) will be included as individual input parameters in all requests to the Teneo Engine. 

## Cross-Origin Resource Sharing (CORS)
In many cases, the website that is hosting the web chat UI uses a different domain than the domain used by the Teneo Engine. Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell a browser to let a web application running at one origin (domain) have permission to access selected resources from a server at a different origin. 

By default the Teneo Engine includes CORS headers in the responses to browser requests coming from any domain. This means any site can add the web chat ui and interact with a Teneo Engine. If you want to restrict your solution to only include CORS headers for specific domains, you can add a file called `tieapi_cors_origins.txt` to the Teneo Resource Manager in the `views` folder. The file should contain the list of allowed origin domains (one domain per line, domains should include port numbers if applicable).
