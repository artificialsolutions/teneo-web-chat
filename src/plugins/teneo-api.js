import Vue from 'vue';
// import TIE from '@artificialsolutions/tie-api-client'; // Disabled to fix error on IE11
import TIE from '../utils/tie-client.js'; // import tie client SDK like this to fix error on IE11

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';
import { CHANNEL_PARAM } from '../utils/constants.js';
import { API_ON_ENGINE_REQUEST, API_ON_ENGINE_RESPONSE, API_ON_NEW_MESSAGE } from '../utils/api-function-names.js';
import { EventBus, events } from '../utils/event-bus.js';
import handleExtension from '../utils/handle-extension.js';

export default function teneoApiPlugin(teneoApiUrl) {
  const teneoApi = TIE.init(teneoApiUrl);
  const messageListCache = new MessageListCache();
  const tmpVue = new Vue({ data: { messageList: messageListCache.get() } });
  let sessionId = null;


  const plugin = {
    pushBubble(api, msg) {
      api._onMessageReceived(msg);
    },
    get messageList() {
      return tmpVue.messageList;
    },
    set messageList(newVal) {
      tmpVue.messageList = newVal;
      messageListCache.update(newVal);
    },

    async sendBaseMessage(text, parameters, isSilent) {

      // set text and channel
      var messageDetails = {
        'text': text,
        'channel': CHANNEL_PARAM
      }

      // if available, add extra params to messageDetails
      var extraParams = tmpVue.$store.getters.teneoEngineParams;
      if (Object.keys(extraParams).length > 0 && extraParams.constructor === Object) {
        messageDetails = Object.assign(messageDetails, extraParams);
      }

      // if available add extra params from method
      if (Object.keys(parameters).length > 0 && parameters.constructor === Object) {
        messageDetails = Object.assign(messageDetails, parameters);
      }

      if (!isSilent) {

        // construct user message object
        var tmpMessage = { 'author': 'user', 'type': 'text', 'data': { 'text': text } }

        // add user messsage to history
        await this._onMessageReceived(tmpMessage)
      }

      // check if there is an extension that want to intercept the request to engine
      messageDetails = await handleExtension(API_ON_ENGINE_REQUEST, messageDetails);

      // only continue if message details is object
      if (messageDetails.constructor !== Object) {
        // TODO: throw error?
        return
      }

      // only continue if message details contains text key
      if (!("text" in messageDetails)) {
        // TODO: throw error?
        return
      }

      EventBus.$emit(events.START_SPINNER);

      // send the input to engine
      var response = await teneoApi.sendInput(sessionId, messageDetails);

      // check if there is an extension that want to intercept the response from engine
      response = await handleExtension(API_ON_ENGINE_RESPONSE, response);


      EventBus.$emit(events.ENGINE_REPLIED);

      // stop further processing if response is not an object
      if (Object.keys(response).length == 0 || response.constructor !== Object) {
        // TODO: throw error?
        return
      }

      // stop further processing if response does not have status or proper keys in 'output' part of the response
      if (!"status" in response || response.status !== 0 || !"output" in response || !"text" in response.output || !"parameters" in response.output) {
        // TODO: throw error?
        return
      }

      sessionId = response.sessionId;

      EventBus.$off(events.PUSH_BUBBLE);
      EventBus.$on(events.PUSH_BUBBLE, async (msg) => {
        await this._onMessageReceived(msg)
      });

      await parseTeneoResponse(response);

    },

    async sendMessage(message) {
      await this.sendBaseMessage(message.data.text, {}, false)
    },
    async sendSilentMessage(text) {
      await this.sendBaseMessage(text, {}, true)
    },
    async _onMessageReceived(message) {
      // TODO: throw error if payload is invalid?
      // TODO: check if message type is valid?
      if (!message) {
        return;
      }
      // check if there is an extension that want to intercept the message
      message = await handleExtension(API_ON_NEW_MESSAGE, message);
      // TODO: throw error if message returned by extension is invalid?
      
      // if there is a typing indicator active for this author, hide it
      this.hideTypingIndicator(message);

      // add message to list
      this.messageList = [...this.messageList, message];
    },
    async closeSession() {
      TIE.close(teneoApiUrl, sessionId);
    },
    async clearHistory() {
      this.messageList = []
      if (this.messageListCache) {
        this.messageListCache.update([]);
      }
    },
    async getMessageList() {
      return this.messageList;
    },
    hideTypingIndicator(data){
      //remove messages of type 'typing', from users of author 'data.author'
      this.messageList = this.messageList.filter(function(item, index, array){ return (!((item.author === data.author)&&(item.type === 'typing')));});
    },
    async showTypingIndicator(message) {
      this.hideTypingIndicator(message);
      message.type = "typing"
      await this._onMessageReceived(message);
    },
  };

  plugin.install = function install() {
    Object.defineProperty(Vue.prototype, '$teneoApi', {
      get() {
        return plugin;
      },
    });
  };

  return plugin;
}
