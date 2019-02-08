import Vue from 'vue';
import TIE from '@artificialsolutions/tie-api-client';

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';

export default function teneoApiPlugin(teneoApiUrl) {
  const teneoApi = TIE.init(teneoApiUrl);
  const messageListCache = new MessageListCache();
  const tmpVm = new Vue({ data: { messageList: messageListCache.get() } });

  const plugin = {
    get messageList() {
      return tmpVm.messageList;
    },
    set messageList(newVal) {
      messageListCache.update(this.messageList);
      tmpVm.messageList = newVal;
    },
    async sendMessage(message) {
      this.messageList = [...this.messageList, message];

      const response = await teneoApi.sendInput(null, {
        text: message.data.text,
      });

      const messages = parseTeneoResponse(response);

      messages.forEach((msg) => {
        this._onMessageReceived(msg);
      });
    },
    async sendSilentMessage(text) {
      const response = await teneoApi.sendInput(null, {
        text,
      });

      const messages = parseTeneoResponse(response);

      messages.forEach((msg) => {
        this._onMessageReceived(msg);
      });
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
