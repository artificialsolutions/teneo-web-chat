import Vue from 'vue';
import TIE from '@artificialsolutions/tie-api-client';

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';
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

      const response = await teneoApi.sendInput(sessionId, {
        text: message.data.text,
      });

      // eslint-disable-next-line prefer-destructuring
      sessionId = response.sessionId;

      const messages = parseTeneoResponse(response);

      messages.forEach((msg) => {
        this._onMessageReceived(msg);
      });

      EventBus.$emit(events.MESSAGE_SENT);
    },
    async sendSilentMessage(text) {
      const response = await teneoApi.sendInput(sessionId, {
        text,
      });

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
