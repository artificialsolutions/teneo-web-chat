# Teneo Web Chat

This web chat UI is an example implementation of a chat GUI that can be embedded in websites. It is built using the [Vue.js](https://vuejs.org/) javascript framework and based on [Vue Beautiful Chat](https://github.com/mattmezza/vue-beautiful-chat) by Matteo Merola.

## Prerequisites
* Your bot needs to be published and you need to know the engine URL.
* When extending the UI, a basic understanding of [Vue.js](https://vuejs.org) is required.

## Setup instructions
The quickest way to interact with your bot using this web chat UI is to deploy it to Heroku. If you want to modify the UI or add additional extensions, you can run the code locally as well.

### Deploy to Heroku
Click the button below to create a new Heroku app that hosts the web chat:


[![Deploy Branch](https://www.herokucdn.com/deploy/button.svg?classes=heroku)](https://heroku.com/deploy?template=https://github.com/artificialsolutions/teneo-web-chat/tree/extensions)

1. Give the app a name (lowercase, no spaces)
2. In the 'Config Vars' section, add the following:
    * **TENEO_ENGINE_URL:** The engine url.
    * **CLOSE_TIE_SESSION_ON_EXIT:** Optional. If set to true, the Teneo engine session will be killed when the chat UI is closed.
3. Click 'Deploy app'.

When Heroku has finished deploying, click 'View app'. You should now be able to use the web chat ui to talk to your bot.

### Running locally
If you want to run the code locally, proceed as follows:

1. Clone the project:
    ```
    git clone https://github.com/artificialsolutions/teneo-web-chat && cd teneo-web-chat
    ```
2. Install dependencies:
    ```
    npm install
    ```
    Note: if you're using Windows and get an error "'NODE_ENV' is not recognized as an internal or external command, operable program or batch file.", you may want to install a module called [win-node-env](https://github.com/laggingreflex/win-node-env) and run npm install again.
3. Create a `env.env` file in the `teneo-web-chat` folder with following (replace the dummy url with Teneo Engine url of your bot):
    ```
    TENEO_ENGINE_URL=https://some.engine/instance/
    CLOSE_TIE_SESSION_ON_EXIT=false
    ```
4. Start the application:
    ```
    npm run start:dev
    ```

The page should be loaded on [http://localhost:9000](http://localhost:9000) now.

## Embedding in a website

To add the web chat UI to your site, proceed as follows:

### Build main.js
To build the bundle, run:
```
npm run-script build
```
This will add a file `main.js` in the `/dist` folder of the project. Add `main.js` to your site.

### Update pages
Make the following changes to each page where you want the web chat window to appear.

1.  Add a link to `main.js`:
```
<script type="text/javascript" src="/path/to/webchat/main.js"></script>
```  
2. Add an empty `<div>` (or something with an id that can be referenced in the initialization script), for example:
```
<div id="teneo-web-chat"></div>
```
3. Add the following initialization script before the closing `</body>` tag:
```
<script>
  window.onload = function () {
      if (
          window.TeneoWebChat &&
          typeof window.TeneoWebChat.initialize === 'function'
      ) {
          var element = document.getElementById('teneo-web-chat');
          var closeEngineSessionOnExit = false;

          window.TeneoWebChat.initialize(
              element,
              'Teneo Web Chat',
              'https://some.teneo/engine-instance/',
              closeEngineSessionOnExit
          );
      }
  }
</script>
```
When adding the script to your site, note the following:
* You can change the title that is displayed in header of the web chat window. In the script above it is specified as 'Teneo Web Chat'.
* The url `https://some.teneo/engine-instance/` should be updated to match the url of your engine.
* The variable 'closeEngineSessionOnExit' specifies if the Teneo Engine session should be ended when the chat UI is closed. It is advised to keep this value as is, to prevent your bot from losing the conversation history when the user closes the chat UI.
* Make sure the line `var element = document.getElementById('teneo-web-chat');` references the id of the div specified in step 3.

## Channel
In addition to the input entered by the user, requests to the Teneo Engine also contain an input paramter 'channel' with value 'teneo-webchat'. This allows you to change the behavior of your bot, depending on the channel used. For information on how to retrieve the value of an input parameter in Teneo Studio, see [Store input parameters](https://www.teneo.ai/studio/scripting/how-to/store-input-parameters) on the Teneo Developers website.

## Extending

The web chat UI can be extended by adding additional `.vue` files in the [/src/components/messages/](/src/components/messages/) folder. This file should parse the JSON that is included in an output parameter called `teneowebclient` in the engine response. The .vue file should  display the data accordingly.

There are two example extensions included in the project.

### Example: displaying an image

This example extention displays an image below the bot's answer text.

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
    <img :src="imageUrl" />
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
          message.data.url
        );
      },
    },
  },
  computed: {
    imageUrl() {
      return this.message.data.url;
    },
  },
};
</script>

<style scoped>
.image-message img {
  margin: 12px;
  max-width: 80%;
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

To display three buttons (Small, Medium and Large), the JSON that needs to be included in the `teneowebclient` output parameter should look as follows:

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

### Extensions repository
A repostory with additional example extensions can be found here: [https://github.com/artificialsolutions/teneo-web-chat-extensions](https://github.com/artificialsolutions/teneo-web-chat-extensions).

### Extensions repository
A repostory with a helper script that composes JSON to attach extensions to engine output on Teneo Studio can be found in: [https://github.com/artificialsolutions/web-chat-helper](https://github.com/artificialsolutions/web-chat-helper).

## Cross-Origin Resource Sharing (CORS)

In many cases, the website that is hosting the web chat UI uses a different domain than the domain used by the Teneo Engine. Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell a browser to let a web application running at one origin (domain) have permission to access selected resources from a server at a different origin.

By default the Teneo Engine includes CORS headers in the responses to browser requests coming from any domain. This means any site can add the web chat ui and interact with a Teneo Engine. If you want to restrict your solution to only include CORS headers for specific domains, you can add a file called `tieapi_cors_origins.txt` to the Teneo Resource Manager in the `views` folder. The file should contain the list of allowed origin domains (one domain per line, domains should include port numbers if applicable).
