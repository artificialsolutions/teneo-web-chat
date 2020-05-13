import Vue from 'vue';
// import TIE from '@artificialsolutions/tie-api-client';
import TIE from '../utils/tie-client.js';

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';
import { CHANNEL_PARAM } from '../utils/constants.js';
import { EventBus, events } from '../utils/event-bus.js';

export default function teneoApiPlugin(teneoApiUrl) {
  const teneoApi = TIE.init(teneoApiUrl);
  const messageListCache = new MessageListCache();
  const tmpVm = new Vue({ data: { messageList: messageListCache.get() } });
  let sessionId = null;

  const plugin = {
    get messageList() {
      return tmpVm.messageList;
    },
    set messageList(newVal) {
      tmpVm.messageList = newVal;
      messageListCache.update(newVal);
    },
    async sendMessage(message) {
      this.messageList = [...this.messageList, message];

      // set text and channel
      var messageDetails = {
        text: message.data.text,
        channel : CHANNEL_PARAM
      }

      // if available, add extra params to messageDetails
      var extraParams = tmpVm.$extraEngineParams;
      if (Object.keys(extraParams).length > 0 && extraParams.constructor === Object) {
        messageDetails = Object.assign(messageDetails, extraParams);
      }

      // send to engine
      const response = await teneoApi.sendInput(sessionId, messageDetails);

      // eslint-disable-next-line prefer-destructuring
      sessionId = response.sessionId;

      const messages = parseTeneoResponse(response);

      messages.forEach((msg) => {
        this._onMessageReceived(msg);
      });

      EventBus.$emit(events.MESSAGE_SENT);
    },
    async sendSilentMessage(text) {

      // set text and channel
      var messageDetails = {
        text: text,
        channel : CHANNEL_PARAM
      }

      // if available, add extra params to messageDetails
      var extraParams = tmpVm.$extraEngineParams;
      if (Object.keys(extraParams).length > 0 && extraParams.constructor === Object) {
        messageDetails = Object.assign(messageDetails, extraParams);
      }

      // send to engine
      const response = await teneoApi.sendInput(sessionId, messageDetails);

      // eslint-disable-next-line prefer-destructuring
      sessionId = response.sessionId;

      const messages = parseTeneoResponse(response);

      messages.forEach((msg) => {
        this._onMessageReceived(msg);
      });

      EventBus.$emit(events.MESSAGE_SENT);
    },
    _onMessageReceived(message) {
      if (!message) {
        return;
      }

      this.messageList = [...this.messageList, message];
    },
    async closeSession(){
      TIE.close(teneoApiUrl,sessionId);
      this.messageList = []
      if(this.messageListCache){
         this.messageListCache.update([]);
      }
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
