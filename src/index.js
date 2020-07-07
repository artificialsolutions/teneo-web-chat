import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';
import { EventBus, events } from '../src/utils/event-bus.js';
import { API_FUNCTION_CALL_MAXIMIZE, API_FUNCTION_CALL_MINIMIZE, API_FUNCTION_CALL_SEND_INPUT, API_FUNCTION_CALL_END_SESSION, API_FUNCTION_CALL_CLEAR_HISTORY, API_FUNCTION_CALL_RESET } from '../src/utils/constants.js';

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
  call(function_name) {
    switch (function_name) {
      case API_FUNCTION_CALL_MAXIMIZE:
        // handle function
        EventBus.$emit(events.MAXIMIZE_WINDOW)
        break
  
      case API_FUNCTION_CALL_MINIMIZE:
        // handle function
        EventBus.$emit(events.MINIMIZE_WINDOW)
        break

      case API_FUNCTION_CALL_SEND_INPUT:
        // handle function
        break

      case API_FUNCTION_CALL_END_SESSION:
        // handle function
        break

      case API_FUNCTION_CALL_CLEAR_HISTORY:
        // handle function
        break

      case API_FUNCTION_CALL_RESET:
        // handle function
        break                      

      default:
        break
    }
  },
  resetChat(){
    EventBus.$emit(events.RESET_SESSION);
  },
};
