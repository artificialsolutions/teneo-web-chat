import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';
import { EventBus, events } from '../src/utils/event-bus.js';
import { API_FUNCTION_CALL_MAXIMIZE, API_FUNCTION_CALL_MINIMIZE, API_FUNCTION_CALL_SEND_INPUT, API_FUNCTION_CALL_END_SESSION, API_FUNCTION_CALL_CLEAR_HISTORY, API_FUNCTION_CALL_RESET, API_FUNCTION_GET_STATE, API_STATE_MINIMIZED, API_STATE_MAXIMIZED, API_FUNCTION_ON_VISIBILITY_CHANGED } from '../src/utils/constants.js';

var functionMap = new Map();
var state = API_STATE_MINIMIZED; //keeps track of state

window['TeneoWebChat'] = {
  initialize(element, serviceName, teneoEngineUrl, closeTieSessionOnExit = 'no', imageUrl = '', extraEngineParams = {}) {
    Vue.use(teneoApiPlugin(teneoEngineUrl));
    Vue.prototype.$extraEngineParams = extraEngineParams;
    Vue.prototype.$extensionMethods = functionMap;

    /*console.log('**VUE extension MAP: ') //just logging
    for (var [key, value] of Vue.prototype.$extensionMethods) {
      console.log(key + " = " + value);
    }*/

    var tmpVue = new Vue({
      render: (h) => h(TeneoWebChat, { props: { serviceName, closeTieSessionOnExit, imageUrl} }),
    }).$mount(element);

    //These to listeners keep 'state' updated and trigger onVisibilityChanged
    EventBus.$on(API_STATE_MAXIMIZED, () => {
      state = API_STATE_MAXIMIZED;
      if(tmpVue.$extensionMethods.get(API_FUNCTION_ON_VISIBILITY_CHANGED)){
        var onVisibilityChangedFunction = tmpVue.$extensionMethods.get(API_FUNCTION_ON_VISIBILITY_CHANGED);
        var data = {'state' : state};
        onVisibilityChangedFunction(data);
      }
    }); 
    EventBus.$on(API_STATE_MINIMIZED, () => {
      state = API_STATE_MINIMIZED;
      if(tmpVue.$extensionMethods.get(API_FUNCTION_ON_VISIBILITY_CHANGED)){
        var onVisibilityChangedFunction = tmpVue.$extensionMethods.get(API_FUNCTION_ON_VISIBILITY_CHANGED);
        var data = {'state': state};
        onVisibilityChangedFunction(data);
      }
    });
  },
  on(function_name, func){
    functionMap.set(function_name,func);
  },
  off(function_name){
    functionMap.delete(function_name);
  },
  get(param){
    switch (param) {
      case API_FUNCTION_GET_STATE:
        console.log('get(' + param + ') is: '+state);
        return state;
        break;
    }
  },
  call(function_name) {
    switch (function_name) {
      case API_FUNCTION_CALL_MAXIMIZE:
        // handle function
        EventBus.$emit(API_FUNCTION_CALL_MAXIMIZE);
        break
  
      case API_FUNCTION_CALL_MINIMIZE:
        // handle function
        EventBus.$emit(API_FUNCTION_CALL_MINIMIZE);
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
