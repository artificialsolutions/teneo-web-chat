# Teneo Web Chat
Teneo Web Chat is a chat widget that can be embedded in websites. Support for various components like buttons, quick replies, images, audio, videos and cards is built-in and the available Teneo Web Chat JavaScript API allows for easy live chat integration and extendability.

Core features:
* Supports various message types, like cards, images, buttons, quick replies etc.
* Lightweight
* Easy to embed in websites
* Extendable through a powerful Javascript API
* Works on all major browsers like Chrome, Edge, Firefox, Internet Explorer 11, Opera and Safari
* Works on mobile devices
* Accessible (WCAG ready)
* Available in multiple languages, easy to localize
* Open source

NOTE: This readme contains high-level information about running Teneo Web Chat. For full documentation, please refer to the [Teneo Web Chat Documentation](https://developers.artificial-solutions.com/engine/teneo-web-chat) on the Teneo Developers website.

## Prerequisites
* Your bot needs to be published and you need to know the engine URL.
* To embed Teneo Web Chat in your site, you will need to be able to upload a javascript file and embed code into the website's html.

## Setup options
### Adding the web chat UI to your site
To add the web chat UI to your site, proceed as follows:

#### Download teneo-web-chat.js
Download the file `teneo-web-chat.js` from the [latest release on Github](https://github.com/artificialsolutions/teneo-web-chat/releases/) and add it to your site.

#### Update pages
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

#### Initialization properties
When initializing Teneo Web Chat, an object containing the configuration options can be passed on. In the [code](#update-pages) above, an object called `teneoProps` is used to pass on the configuration options. See the [Teneo Web Chat Documentation](https://developers.artificial-solutions.com/engine/teneo-web-chat) on the Teneo Developers website for all options.

### Deploy to Heroku
If you are looking for a quick way to interact with your bot using Teneo Web Chat but you don't have a website to host it yet, you can deploy it to Heroku. Click the button below to create a new Heroku app that hosts the web chat:

[![Deploy](https://www.herokucdn.com/deploy/button.svg?classes=heroku)](https://heroku.com/deploy?template=https://github.com/artificialsolutions/teneo-web-chat)

1. Give the app a name (lowercase, no spaces)
2. In the 'Config Vars' section, add the following:
    * **TENEO_ENGINE_URL:** The engine url.
3. Click 'Deploy app'.

When Heroku has finished deploying, click 'View app'. You should now be able to use the web chat ui to talk to your bot.

### Running the code locally
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