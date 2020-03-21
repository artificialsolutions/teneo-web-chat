import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';
import VuePlyr from "vue-plyr";

// eslint-disable-next-line
window['TeneoWebChat'] = {
  initialize(element, serviceName, imageUrl, teneoEngineUrl, closeTieSessionOnExit) {
    Vue.use(VuePlyr)
    Vue.use(teneoApiPlugin(teneoEngineUrl));

    new Vue({
      render: (h) => h(TeneoWebChat, { props: { serviceName, imageUrl, closeTieSessionOnExit } }),
    }).$mount(element);
  },
};
