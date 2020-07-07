import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';
import { EventBus, events } from '../src/utils/event-bus.js';

// eslint-disable-next-line
var functionMap = new Map();

window['TeneoWebChat'] = {
  initialize(element, serviceName, teneoEngineUrl, closeTieSessionOnExit = 'no', imageUrl = '', extraEngineParams = {}) {
    Vue.use(teneoApiPlugin(teneoEngineUrl));
    Vue.prototype.$extraEngineParams = extraEngineParams;
    Vue.prototype.$extensionMethods = functionMap;

    console.log('**VUE extension MAP: ')
    for (var [key, value] of Vue.prototype.$extensionMethods) {
      console.log(key + " = " + value);
    }

    new Vue({
      render: (h) => h(TeneoWebChat, { props: { serviceName, closeTieSessionOnExit, imageUrl} }),

    }).$mount(element);
  },
  on(function_name, func){
    functionMap.set(function_name,func);
  },
  off(function_name){
    functionMap.delete(function_name);
  },
  resetChat(){
    EventBus.$emit(events.RESET_SESSION);
  },
};
