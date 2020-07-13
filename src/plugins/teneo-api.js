import Vue from 'vue';
// import TIE from '@artificialsolutions/tie-api-client';
import TIE from '../utils/tie-client.js';

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';
import { CHANNEL_PARAM, API_FUNCTION_ON_ENGINE_REQUEST, API_FUNCTION_ON_ENGINE_RESPONSE } from '../utils/constants.js';
import { EventBus, events } from '../utils/event-bus.js';
import { API_FUNCTION_ON_NEW_MESSAGE } from '../utils/constants.js';

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
    async sendMessage(message) {
      if(tmpVue.$extensionMethods.get(API_FUNCTION_ON_NEW_MESSAGE)){
        var newMessageFunction = tmpVue.$extensionMethods.get(API_FUNCTION_ON_NEW_MESSAGE);
        newMessageFunction(message);
      }
      this.messageList = [...this.messageList, message];

      // set text and channel
      var messageDetails = {
        text: message.data.text,
        channel : CHANNEL_PARAM
      }

      // if available, add extra params to messageDetails
      var extraParams = tmpVue.$extraEngineParams;
      if (Object.keys(extraParams).length > 0 && extraParams.constructor === Object) {
        messageDetails = Object.assign(messageDetails, extraParams);
      }

      // send to engine
      console.log('Initial Engine Request: '+JSON.stringify(messageDetails));
      var onEngineRequest = tmpVue.$extensionMethods.get(API_FUNCTION_ON_ENGINE_REQUEST)
      if(onEngineRequest){
        messageDetails = onEngineRequest(messageDetails);
      }
      
      var response = await teneoApi.sendInput(sessionId, messageDetails);

      var onEngineResponse = tmpVue.$extensionMethods.get(API_FUNCTION_ON_ENGINE_RESPONSE);
      if(onEngineResponse){
        response=onEngineResponse(response);
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
    async sendSilentMessage(text) {
      
      EventBus.$emit(events.START_SPINNER);
      // set text and channel
      var messageDetails = {
        text: text,
        channel : CHANNEL_PARAM
      }

      // if available, add extra params to messageDetails
      var extraParams = tmpVue.$extraEngineParams;
      if (Object.keys(extraParams).length > 0 && extraParams.constructor === Object) {
        messageDetails = Object.assign(messageDetails, extraParams);
      }

      EventBus.$off(events.PUSH_BUBBLE);
      EventBus.$on(events.PUSH_BUBBLE, (msg) => {
        this._onMessageReceived(msg)
      });


      // send to engine
      const response = await teneoApi.sendInput(sessionId, messageDetails);
      sessionId = response.sessionId;
      const messages = await parseTeneoResponse(response);

      if(messages){
        EventBus.$emit(events.ENGINE_REPLIED);
      }
    },
    _onMessageReceived(message) {
      console.log("onMessageReceived")
      if (!message) {
        return;
      }
      //if(tmpVue.$extensionMethods.get(API_FUNCTION_ON_NEW_MESSAGE)){
      //  var newMessageFunction = tmpVue.prototype.$extensionMethods.get(API_FUNCTION_ON_NEW_MESSAGE);
      if(Vue.prototype.$extensionMethods.get(API_FUNCTION_ON_NEW_MESSAGE)){
        var newMessageFunction = Vue.prototype.$extensionMethods.get(API_FUNCTION_ON_NEW_MESSAGE);
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
