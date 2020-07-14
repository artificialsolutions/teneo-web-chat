import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';
import { EventBus, events } from '../src/utils/event-bus.js';
import * as constants from '../src/utils/constants.js';

var functionMap = new Map();
var stateMap = {'visibility': events.API_STATE_MINIMIZED, 'title':'Funky'};

window['TeneoWebChat'] = {
  initialize(element, title, teneoEngineUrl, closeTieSessionOnExit = 'no', imageUrl = '', extraEngineParams = {}) {
    Vue.use(teneoApiPlugin(teneoEngineUrl));
    Vue.prototype.$extraEngineParams = extraEngineParams;
    Vue.prototype.$extensionMethods = functionMap;

    console.log('title', title)
    if (title) {
      stateMap['title'] = title;
      EventBus.$emit(events.SET_WINDOW_TITLE, title);
    }
    

    EventBus.$on(events.API_STATE_READY, () => {
      var onReadyMethod = Vue.prototype.$extensionMethods.get(constants.API_ON_READY)
      if(onReadyMethod){
        onReadyMethod(stateMap);
      }
    });

    var serviceName = stateMap['title'];
    var tmpVue = new Vue({
      render: (h) => h(TeneoWebChat, { props: { closeTieSessionOnExit, imageUrl} }),
    }).$mount(element);

    EventBus.$emit(events.SET_WINDOW_TITLE, title); 

    function handleVisibilityChange(event){
      if(stateMap[constants.API_KEY_VISIBILITY] != event){
        stateMap[constants.API_KEY_VISIBILITY] = event;
        if(tmpVue.$extensionMethods.get(constants.API_ON_VISIBILITY_CHANGED)){
          const onVisibilityChangedFunction = tmpVue.$extensionMethods.get(constants.API_ON_VISIBILITY_CHANGED);
          const data = {};
          data[constants.API_KEY_VISIBILITY] = stateMap[constants.API_KEY_VISIBILITY];
          onVisibilityChangedFunction(data);
        }
      }
    }
    //These listeners keep 'state' updated and trigger onVisibilityChanged.
    EventBus.$on(events.API_STATE_MAXIMIZED, () => {
      handleVisibilityChange(events.API_STATE_MAXIMIZED);
    });
    EventBus.$on(events.API_STATE_MINIMIZED, () => {
      handleVisibilityChange(events.API_STATE_MINIMIZED);
    });

  },
  on(function_name, func){
    functionMap.set(function_name,func);
  },
  off(function_name){
    functionMap.delete(function_name);
  },
  get(function_name){
    switch (function_name) {
      case constants.API_GET_STATE:
        return stateMap;
    }
  },
  set(function_name, param1 = undefined) {
    switch (function_name) {
      case constants.API_SET_WINDOW_TITLE:
        EventBus.$emit(events.SET_WINDOW_TITLE, param1);
        stateMap.title = param1
        return stateMap;
    }
  },
  call(function_name, param1 = undefined, param2 = undefined, param3 = undefined) {

    if (param1) {
      console.log("param1", param1)
    }

    if (param2) {
      console.log("param2", param2)
    }

    if (param3) {
      console.log("param3", param3)
    }
    
    switch (function_name) {
      case constants.API_CALL_MAXIMIZE:
        // handle function
        EventBus.$emit(events.MAXIMIZE_WINDOW);
        break
  
      case constants.API_CALL_MINIMIZE:
        // handle function
        EventBus.$emit(events.MINIMIZE_WINDOW);
        break
        
      case constants.API_CALL_SEND_INPUT:
        // handle function
        // TO DO: check if params are of correct type
        EventBus.$emit(events.SEND_INPUT, param1, param2, param3);
        break

      case constants.API_CALL_END_SESSION:
        // handle function
        EventBus.$emit(events.END_SESSION);
        break

      case constants.API_CALL_CLEAR_HISTORY:
        // handle function
        EventBus.$emit(events.CLEAR_HISTORY);
        break

      case constants.API_CALL_RESET:
        // handle function
        EventBus.$emit(events.RESET_SESSION);
        break
        
      case constants.API_CALL_ADD_MESSAGE:
        // handle function
        console.log('Triggering add message')
        // TO DO: make sure we check the format of param1
        EventBus.$emit(events.ADD_MESSAGE, param1);
        break

      default:
        console.log("Function name: ", function_name);
        break
    }
  },
  version() {
    return constants.API_VERSION;
  },
  resetChat(){
    EventBus.$emit(events.RESET_SESSION);
  },
};
