import Vue from 'vue';
// import TIE from '@artificialsolutions/tie-api-client'; // Disabled to fix error on IE11
import TIE from '../utils/tie-client.js'; // import tie client SDK like this to fix error on IE11

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';
import { CHANNEL_PARAM, SESSION_ID_STORAGE_KEY } from '../utils/constants.js';
import { API_ON_ENGINE_REQUEST, API_ON_ENGINE_RESPONSE, API_ON_NEW_MESSAGE } from '../utils/api-function-names.js';
import { EventBus, events } from '../utils/event-bus.js';
import handleExtension from '../utils/handle-extension.js';
import basePayload from '../utils/base-payload.js';
import detectSafari from '../utils/detect-safari';
import isValidUrl from '../utils/validate-url';

export default function teneoApiPlugin(teneoApiUrl) {
  var teneoApi = TIE.init(teneoApiUrl);
  EventBus.$on(events.SET_ENGINE_URL, (newTeneoApiUrl) => {
    if(isValidUrl(newTeneoApiUrl)){
      teneoApi = TIE.init(newTeneoApiUrl);
    }
  });

  const messageListCache = new MessageListCache();
  const tmpVue = new Vue({ data: { messageList: messageListCache.get() } });
  const isSafari = detectSafari();
  const sessionKey = SESSION_ID_STORAGE_KEY;
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
      const requestPayload = basePayload();
      requestPayload.requestDetails = messageDetails
      await handleExtension(API_ON_ENGINE_REQUEST, requestPayload);

      // abort if extension says so
      if(requestPayload.handledState.handled === true) {
        return
      }      

      // only continue if message details is object
      if (requestPayload.requestDetails.constructor !== Object) {
        // TODO: throw error?
        return
      }

      // only continue if message details contains text key
      if (!("text" in requestPayload.requestDetails)) {
        // TODO: throw error?
        return
      }

      EventBus.$emit(events.START_SPINNER);

      // get session from storage when safari is used
      // to prevent issues when 'prevent cross-site tracking' is enabled
      if (isSafari) {
        sessionId = window.sessionStorage.getItem(sessionKey);
      }
      
      // send the input to engine
      var response = await teneoApi.sendInput(sessionId, requestPayload.requestDetails);

      const responsePayload = basePayload();
      responsePayload.responseDetails = response;

      // check if there is an extension that want to intercept the response from engine
      await handleExtension(API_ON_ENGINE_RESPONSE, responsePayload);


      EventBus.$emit(events.ENGINE_REPLIED);

      // abort if extension says so
      if(responsePayload.handledState.handled === true) {
        return
      } 

      // stop further processing if response is not an object
      if (Object.keys(responsePayload.responseDetails).length == 0 || responsePayload.responseDetails.constructor !== Object) {
        // TODO: throw error?
        return
      }

      // stop further processing if response does not have status or proper keys in 'output' part of the response
      if (!"status" in response || response.status !== 0 || !"output" in response || !"text" in response.output || !"parameters" in response.output) {
        // TODO: throw error?
        return
      }

      // if users have 'prevent cross-site tracking' enabled
      // a reload of the page may lose the session
      if (isSafari) {
        window.sessionStorage.setItem(sessionKey, response.sessionId);
      } else {
        sessionId = response.sessionId;
      }

      // sessionId = response.sessionId;

      EventBus.$off(events.PUSH_BUBBLE);
      EventBus.$on(events.PUSH_BUBBLE, async (msg) => {
        await this._onMessageReceived(msg)
      });

      await parseTeneoResponse(response);

    },

    async sendMessage(message, parameters = {}) {
      await this.sendBaseMessage(message.data.text, parameters, false);
    },
    async sendSilentMessage(text = '', parameters = {}) {
      await this.sendBaseMessage(text, parameters, true);
    },
    async _onMessageReceived(message) {
      // TODO: throw error if payload is invalid?
      // TODO: check if message type is valid?
      if (!message) {
        return;
      }

      // create payload
      const payload = basePayload();
      payload.message = message

      // check if there is an extension that wants to intercept the message
      // except for typing indicator messages
      if (payload.message.type !== "typing") {
        await handleExtension(API_ON_NEW_MESSAGE, payload);
      }
      // TODO: throw error if message returned by extension is invalid?

      // abort if extension says so
      if(payload.handledState.handled === true) {
        return
      }

      // if there is a typing indicator active for this author, hide it
      this.hideTypingIndicator(message);

      // stop further processing if message is not an object
      if (Object.keys(payload.message).length == 0 || payload.message.constructor !== Object) {
        return
      }

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
