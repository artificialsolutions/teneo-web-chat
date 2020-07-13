import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';
import { EventBus, events } from '../src/utils/event-bus.js';
import { API_FUNCTION_CALL_MAXIMIZE, API_FUNCTION_CALL_MINIMIZE, API_FUNCTION_CALL_SEND_INPUT, API_FUNCTION_CALL_END_SESSION, API_FUNCTION_CALL_CLEAR_HISTORY, API_FUNCTION_CALL_RESET, API_FUNCTION_GET_STATE, API_FUNCTION_ON_VISIBILITY_CHANGED,
         API_STATE_MINIMIZED, API_STATE_MAXIMIZED,
         API_KEY_VISIBILITY, 
         API_VERSION, API_FUNCTION_CALL_ADD_MESSAGE} from '../src/utils/constants.js';

var functionMap = new Map();
var stateMap = {'visibility': API_STATE_MINIMIZED};

window['TeneoWebChat'] = {
  initialize(element, serviceName, teneoEngineUrl, closeTieSessionOnExit = 'no', imageUrl = '', extraEngineParams = {}) {
    Vue.use(teneoApiPlugin(teneoEngineUrl));
    Vue.prototype.$extraEngineParams = extraEngineParams;
    Vue.prototype.$extensionMethods = functionMap;

    var tmpVue = new Vue({
      render: (h) => h(TeneoWebChat, { props: { serviceName, closeTieSessionOnExit, imageUrl} }),
    }).$mount(element);

    function handleVisibilityChange(event){
      if(stateMap[API_KEY_VISIBILITY] != event){
        stateMap[API_KEY_VISIBILITY] = event;
        if(tmpVue.$extensionMethods.get(API_FUNCTION_ON_VISIBILITY_CHANGED)){
          const onVisibilityChangedFunction = tmpVue.$extensionMethods.get(API_FUNCTION_ON_VISIBILITY_CHANGED);
          const data = {};
          data[API_KEY_VISIBILITY] = stateMap[API_KEY_VISIBILITY];
          onVisibilityChangedFunction(data);
        }
      }
    }
    //These listeners keep 'state' updated and trigger onVisibilityChanged.
    EventBus.$on(API_STATE_MAXIMIZED, () => {
      handleVisibilityChange(API_STATE_MAXIMIZED);
    });
    EventBus.$on(API_STATE_MINIMIZED, () => {
      handleVisibilityChange(API_STATE_MINIMIZED);
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
        console.log('stateMap: '+JSON.stringify(stateMap));
        return stateMap;
        break;
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
      case API_FUNCTION_CALL_MAXIMIZE:
        // handle function
        EventBus.$emit(events.MAXIMIZE_WINDOW);
        break
  
      case API_FUNCTION_CALL_MINIMIZE:
        // handle function
        EventBus.$emit(events.MINIMIZE_WINDOW);
        break
        
      case API_FUNCTION_CALL_SEND_INPUT:
        // handle function
        // TO DO: check if params are of correct type
        EventBus.$emit(events.SEND_INPUT, param1, param2, param3);
        break

      case API_FUNCTION_CALL_END_SESSION:
        // handle function
        EventBus.$emit(events.END_SESSION);
        break

      case API_FUNCTION_CALL_CLEAR_HISTORY:
        // handle function
        EventBus.$emit(events.CLEAR_HISTORY);
        break

      case API_FUNCTION_CALL_RESET:
        // handle function
        EventBus.$emit(events.RESET_SESSION);
        break
        
      case API_FUNCTION_CALL_ADD_MESSAGE:
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
    return API_VERSION;
  },
  resetChat(){
    EventBus.$emit(events.RESET_SESSION);
  },
};
