import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';
import { EventBus, events } from '../src/utils/event-bus.js';
import { API_KEY_VISIBILITY, API_VERSION} from '../src/utils/constants.js';
import * as apiConstants from '../src/utils/api-function-names.js';
import handleExtension from '../src/utils/handle-extension.js';

var functionMap = new Map();
var stateMap = {'visibility': events.API_STATE_MINIMIZED, 'title':'Teneo Web Chat'};
var validFunctionNames = Object.values(apiConstants)

window['TeneoWebChat'] = {
  initialize(element, title, teneoEngineUrl, closeTieSessionOnExit = 'no', imageUrl = '', extraEngineParams = {}) {
    Vue.use(teneoApiPlugin(teneoEngineUrl));
    Vue.prototype.$extraEngineParams = extraEngineParams;
    Vue.prototype.$extensionMethods = functionMap;

    if (title) {
      stateMap['title'] = title;
      EventBus.$emit(events.SET_WINDOW_TITLE, title);
    }
    
    EventBus.$on(events.API_STATE_READY, () => {
      handleExtension(apiConstants.API_ON_READY, stateMap)
    });

    var tmpVue = new Vue({
      render: (h) => h(TeneoWebChat, { props: { closeTieSessionOnExit, imageUrl} }),
    }).$mount(element);

    EventBus.$emit(events.SET_WINDOW_TITLE, title); 

    function handleVisibilityChange(event){
      if(stateMap[API_KEY_VISIBILITY] != event){
        stateMap[API_KEY_VISIBILITY] = event;
        const data = {};
        data[API_KEY_VISIBILITY] = stateMap[API_KEY_VISIBILITY];

        // call extension to notify about visibility change
        handleExtension(apiConstants.API_ON_VISIBILITY_CHANGED, data);
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

    // this 'on' method is called each time someone registers
    // a 'function_name' (ready, visibility_change, engine_response etc)

    // only continue if function name provided is valid
    if (!validFunctionNames.includes(function_name)) {
      return
    }
    
    // devs may register same function name multiple times 
    // so we need keep a list of callback functions per 'function_name'

    // fist initialize an empty list
    var callbackFunctions = [];

    // if we already have callbacks for an api function_name, get them
    if (functionMap.get(function_name)) {
      callbackFunctions = functionMap.get(function_name)
    }
    // then add the new callback function to the list
    callbackFunctions.push(func)

    // store the list of callbacks function for this 'function_name'
    functionMap.set(function_name,callbackFunctions);
  },
  off(function_name){
    functionMap.delete(function_name);
  },
  get(function_name){
    switch (function_name) {
      case apiConstants.API_GET_STATE:
        return stateMap;
    }
  },
  call(function_name, payload = undefined) {

    switch (function_name) {
      case apiConstants.API_CALL_MAXIMIZE:
        EventBus.$emit(events.MAXIMIZE_WINDOW);
        break
  
      case apiConstants.API_CALL_MINIMIZE:
        EventBus.$emit(events.MINIMIZE_WINDOW);
        break
        
      case apiConstants.API_CALL_SEND_INPUT:
        // check if payload is object
        if (Object.keys(payload).length > 0 && payload.constructor === Object) {

          // key 'text' is mandatory
          if (payload.text && typeof payload.text === "string") {
            var text = payload.text;
            var parameters = {};
            var isSilent = false;

            if (payload.parameters) {
              parameters = payload.parameters;
            }

            if (payload.silent) {
              isSilent = true;
            }
  
            EventBus.$emit(events.SEND_INPUT, text, parameters, isSilent);
          }
        }
        break

      case apiConstants.API_CALL_END_SESSION:
        EventBus.$emit(events.END_SESSION);
        break

      case apiConstants.API_CALL_CLEAR_HISTORY:
        EventBus.$emit(events.CLEAR_HISTORY);
        break

      case apiConstants.API_CALL_RESET:
        EventBus.$emit(events.RESET_SESSION);
        break
        
      case apiConstants.API_CALL_ADD_MESSAGE:
        if (Object.keys(payload).length > 0 && payload.constructor === Object) {
          EventBus.$emit(events.ADD_MESSAGE, payload);
        }
        break

      case apiConstants.API_CALL_SET_WINDOW_TITLE:
        if (typeof payload === "string") {
          EventBus.$emit(events.SET_WINDOW_TITLE, payload);
          stateMap.title = payload
        }
        break

      default:
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
