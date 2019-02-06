import Vue from 'vue';
import TIE from '@artificialsolutions/tie-api-client';

import TeneoWebChat from './TeneoWebChat.vue';
import MessageListCache from './utils/message-list-cache.js';

// eslint-disable-next-line
window['TeneoWebChat'] = {
  initialize(serviceName, teneoEngineUrl) {
    const teneoApi = TIE.init(teneoEngineUrl);
    const messageListCache = new MessageListCache();

    new Vue({
      render: (h) =>
        h(TeneoWebChat, { props: { serviceName, teneoApi, messageListCache } }),
    }).$mount('#app');
  },
};
