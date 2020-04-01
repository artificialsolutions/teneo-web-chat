import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';

// eslint-disable-next-line
window['TeneoWebChat'] = {
  initialize(element, serviceName, teneoEngineUrl, closeTieSessionOnExit = 'no', imageUrl = '', extraEngineParams = {}) {
    Vue.use(teneoApiPlugin(teneoEngineUrl));
    Vue.prototype.$extraEngineParams = extraEngineParams;
    
    new Vue({
      render: (h) => h(TeneoWebChat, { props: { serviceName, closeTieSessionOnExit, imageUrl} }),
    }).$mount(element);
  },
};
