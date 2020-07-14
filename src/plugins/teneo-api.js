import Vue from 'vue';
// import TIE from '@artificialsolutions/tie-api-client';
import TIE from '../utils/tie-client.js';

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';
import { CHANNEL_PARAM, API_ON_ENGINE_REQUEST, API_ON_ENGINE_RESPONSE, API_ON_NEW_MESSAGE } from '../utils/constants.js';
import { EventBus, events } from '../utils/event-bus.js';

export default function teneoApiPlugin(teneoApiUrl) {
  const teneoApi = TIE.init(teneoApiUrl);
  const messageListCache = new MessageListCache();
  const tmpVue = new Vue({ data: { messageList: messageListCache.get() } });
  let sessionId = null;


  const plugin = {
    pushBubble(api, msg){
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
        'channel' : CHANNEL_PARAM
      }

      // if available, add extra params to messageDetails
      var extraParams = tmpVue.$extraEngineParams;
      if (Object.keys(extraParams).length > 0 && extraParams.constructor === Object) {
        messageDetails = Object.assign(messageDetails, extraParams);
      }

      // if available add extra params from method
      if (Object.keys(parameters).length > 0 && parameters.constructor === Object) {
        messageDetails = Object.assign(messageDetails, parameters);
      }

      EventBus.$emit(events.START_SPINNER);

      if (!isSilent) {

        // add messsage to history
        var tmpMessage = {'author': 'user', 'type': 'text', 'data': {'text': text}}

        // check if there is an extension that want to intercept the new messsage
        if(tmpVue.$extensionMethods.get(API_ON_NEW_MESSAGE)){
          var newMessageFunction = tmpVue.$extensionMethods.get(API_ON_NEW_MESSAGE);
          tmpMessage = await newMessageFunction(tmpMessage);
        }
        this.messageList = [...this.messageList, tmpMessage];
      }

      // send request to engine

      // check if there is an extension that want to intercept the request to engine
      var onEngineRequest = tmpVue.$extensionMethods.get(API_ON_ENGINE_REQUEST)
      if(onEngineRequest){
        messageDetails = await onEngineRequest(messageDetails);
      }
      
      var response = await teneoApi.sendInput(sessionId, messageDetails);

      // check if there is an extension that want to intercept the response from engine
      var onEngineResponse = tmpVue.$extensionMethods.get(API_ON_ENGINE_RESPONSE);
      if(onEngineResponse){
        response = await onEngineResponse(response);
      }

      sessionId = response.sessionId;

      EventBus.$off(events.PUSH_BUBBLE);
      EventBus.$on(events.PUSH_BUBBLE, (msg) => {
        this._onMessageReceived(msg)
      });
      
      const messages = await parseTeneoResponse(response);
      if(messages){
        EventBus.$emit(events.ENGINE_REPLIED);
      }


    },

    async sendMessage(message) {
      await this.sendBaseMessage(message.data.text, {}, false)
    },
    async sendSilentMessage(text) {
      await this.sendBaseMessage(text, {}, true)
    },
    _onMessageReceived(message) {
      if (!message) {
        return;
      }
      if(Vue.prototype.$extensionMethods.get(API_ON_NEW_MESSAGE)){
        var newMessageFunction = Vue.prototype.$extensionMethods.get(API_ON_NEW_MESSAGE);
        newMessageFunction(message);
      }
      this.messageList = [...this.messageList, message];
    },
    async closeSession(){
      TIE.close(teneoApiUrl,sessionId);
      
    },
    async clearHistory() {
      this.messageList = []
      if(this.messageListCache){
         this.messageListCache.update([]);
      }
    }
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
