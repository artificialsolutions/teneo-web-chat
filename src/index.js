import Vue from 'vue';

import TeneoWebChat from './TeneoWebChat.vue';
import teneoApiPlugin from './plugins/teneo-api.js';
import { EventBus, events } from '../src/utils/event-bus.js';
import { API_VERSION, FALLBACK_LOCALE } from '../src/utils/constants.js';
import * as apiConstants from '../src/utils/api-function-names.js';
import handleExtension from '../src/utils/handle-extension.js';
import messageListCache from '../src/utils/message-list-cache.js';
import { store } from '../src/store/store.js';
import isValidUrl from '../src/utils/validate-url';
import { translatedMessages } from '../src/utils/localized-messages';
import VueI18n from 'vue-i18n';

const functionMap = new Map();
const validFunctionNames = Object.values(apiConstants);
const messageList = new messageListCache();
let isInitialised = false;

window.TeneoWebChat = {
  initialize(element, twcProps) {
    Vue.prototype.$store = store;

    // Store properties in storage
    if (twcProps.teneoEngineUrl) {
      // TODO: error handling (once store thows error)
      store.commit('teneoEngineUrl', twcProps.teneoEngineUrl);
    }

    if (twcProps.title) {
      // TODO: Check if title is a string
      store.commit('initialTitle', twcProps.title);
    }

    if (twcProps.titleIconUrl) {
      // TODO: error handling (once store thows error)
      store.commit('initialTitleIconUrl', twcProps.titleIconUrl);
    }

    if (twcProps.teneoEngineParams) {
      // TODO: Check if twcProps.teneoEngineParams is a map
      store.commit('teneoEngineParams', twcProps.teneoEngineParams);
    }

    if (twcProps.showCloseButton === true || twcProps.showCloseButton === 'true') {
      store.commit('showCloseButton', true);
    }

    if (twcProps.agentAvatarUrl) {
      // TODO: error handling (once store thows error)
      store.commit('agentAvatarUrl', twcProps.agentAvatarUrl);
    }

    if (twcProps.botAvatarUrl) {
      // TODO: error handling (once store thows error)
      store.commit('botAvatarUrl', twcProps.botAvatarUrl);
    }

    if (twcProps.userAvatarUrl) {
      // TODO: error handling (once store thows error)
      store.commit('userAvatarUrl', twcProps.userAvatarUrl);
    }

    if (twcProps.minimizeIconUrl) {
      // TODO: error handling (once store thows error)
      store.commit('minimizeIconUrl', twcProps.minimizeIconUrl);
    }

    if (twcProps.closeIconUrl) {
      // TODO: error handling (once store thows error)
      store.commit('closeIconUrl', twcProps.closeIconUrl);
    }

    if (twcProps.launchIconUrl) {
      // TODO: error handling (once store thows error)
      store.commit('initialLaunchIconUrl', twcProps.launchIconUrl);
    }

    if (twcProps.sendIconUrl) {
      // TODO: error handling (once store thows error)
      store.commit('initialSendIconUrl', twcProps.sendIconUrl);
    }
    if (twcProps.uploadIconUrl) {
      // TODO: error handling (once store thows error)
      store.commit('initialUploadIconUrl', twcProps.uploadIconUrl);
    }

    if (twcProps.locale) {
      // TODO: error handling (once store thows error)
      store.commit('locale', twcProps.locale);
    }

    if (twcProps.customLocalizations) {
      // TODO: error handling
      const { customLocalizations } = twcProps;

      if (Object.keys(customLocalizations).length > 0 && customLocalizations.constructor === Object) {
        // Merge objects
        Object.assign(translatedMessages, customLocalizations);
        // TranslatedMessages[Object.keys(customLocalizations)[0]]=customLocalizations[Object.keys(customLocalizations)[0]]
      }
    }

    if (twcProps.locale) {
      // TODO: error handling (once store thows error)
      store.commit('locale', twcProps.locale);
    }

    if (twcProps.storage) {
      // TODO: error handling (once store thows error)
      store.commit('storage', twcProps.storage);
    }

    // Check required properties
    if (!store.getters.teneoEngineUrl) {
      // TODO: thow error if engine url is missing?
      return;
    }

    Vue.use(VueI18n);
    const i18n = new VueI18n({
      locale: twcProps.locale,
      fallbackLocale: FALLBACK_LOCALE,
      messages: translatedMessages,
      silentTranslationWarn: true
    });

    Vue.use(teneoApiPlugin(store.getters.teneoEngineUrl));
    Vue.prototype.$extensionMethods = functionMap;

    EventBus.$on(events.API_STATE_READY, () => {
      handleExtension(apiConstants.API_ON_READY);
    });

    EventBus.$on(events.SET_LOCALE, (payload) => {
      i18n.locale = payload;
    });

    new Vue({
      render: (h) => h(TeneoWebChat, { props: { } }), i18n
    }).$mount(element);

    /*
     * After initializing, freeze the boolean
     * we use this to prevent people from registering 'on' events after the page has loaded
     */
    isInitialised = true;
    Object.freeze(isInitialised);

  },
  on(function_name, func) {

    // Prevent people from registering 'on' events after teneo web chat was initialized
    if ((isInitialised === false) || (process.env.NODE_ENV === 'test')) {

      /*
       * This 'on' method is called each time someone registers
       * a 'function_name' (ready, visibility_change, engine_response etc)
       */

      // Only continue if function name provided is valid
      if (!validFunctionNames.includes(function_name)) {
        // TODO: thow error if invalid function_name was provided?
        return;
      }

      /*
       * Devs may register same function name multiple times
       * so we need keep a list of callback functions per 'function_name'
       */

      // Fist initialize an empty list
      let callbackFunctions = [];

      // If we already have callbacks for an api function_name, get them
      if (functionMap.get(function_name)) {
        callbackFunctions = functionMap.get(function_name);
      }
      // Then add the new callback function to the list
      callbackFunctions.push(func);

      // Store the list of callbacks function for this 'function_name'
      functionMap.set(function_name, callbackFunctions);
    }
  },
  off(function_name) {
    functionMap.delete(function_name);
  },
  get(function_name) {
    switch (function_name) {
      case apiConstants.API_GET_STATE:
        return store.getters.state;

      case apiConstants.API_GET_CHAT_HISTORY: {
        // Exclude typing indicators from message list
        let filteredMessageList = messageList.get();

        filteredMessageList = filteredMessageList.filter((message) => {
          return message.type !== 'typing';
        });

return filteredMessageList;
      }

      case apiConstants.API_GET_ENGINE_URL:
        return store.getters.engineUrlObj;

      case apiConstants.API_GET_STORAGE:
        return store.getters.storage;

      case apiConstants.API_GET_LOCALE:
        return store.getters.localeObj;

      default:
        break;
    }
  },
  call(function_name, payload = undefined) {

    switch (function_name) {
      case apiConstants.API_CALL_SHOW_CALLOUT:
        if (payload && typeof payload === 'string') {
          EventBus.$emit(events.SHOW_CALLOUT, payload);
        }
        break;

      case apiConstants.API_CALL_HIDE_CALLOUT:
        EventBus.$emit(events.HIDE_CALLOUT);
        break;

      case apiConstants.API_SET_LOCALE:
        // TODO: throw error if payload is invalid or if store throws error
        store.commit('locale', payload);
        EventBus.$emit(events.SET_LOCALE, store.getters.locale);
        break;

      case apiConstants.API_CALL_MAXIMIZE:
        EventBus.$emit(events.MAXIMIZE_WINDOW);
        break;

      case apiConstants.API_CALL_MINIMIZE:
        EventBus.$emit(events.MINIMIZE_WINDOW);
        break;

      case apiConstants.API_CALL_SEND_INPUT:
        /*
         * Check if payload is object
         * TODO: throw error if payload is invalid?
         */
        if (Object.keys(payload).length > 0 && payload.constructor === Object) {

          // Key 'text' is mandatory
          if (payload.text && typeof payload.text === 'string') {
            const { text } = payload;
            let parameters = {};
            let isSilent = false;

            if (payload.parameters && Object.keys(payload.parameters).length > 0 && payload.parameters.constructor === Object) {
              parameters = payload.parameters;
            }

            if (payload.silent) {
              isSilent = true;
            }

            EventBus.$emit(events.SEND_INPUT, text, parameters, isSilent);
          }
        }
        break;

      case apiConstants.API_CALL_END_SESSION:
        EventBus.$emit(events.END_SESSION);
        break;

      case apiConstants.API_CALL_CLEAR_CHAT_HISTORY:
        EventBus.$emit(events.CLEAR_HISTORY);
        break;

      case apiConstants.API_CALL_RESET:
        EventBus.$emit(events.RESET_SESSION);
        break;

      case apiConstants.API_CALL_ADD_MESSAGE:
        /*
         * TODO: throw error if payload is invalid?
         * TODO: check if message type is valid?
         */
        if (Object.keys(payload).length > 0 && payload.constructor === Object) {
          EventBus.$emit(events.ADD_MESSAGE, payload);
        }
        break;

      case apiConstants.API_CALL_HIDE_TYPING_INDICATOR:
        EventBus.$emit(events.HIDE_TYPING_INDICATOR, payload);
        break;

      case apiConstants.API_CALL_SHOW_TYPING_INDICATOR:
        if (Object.keys(payload).length > 0 && payload.constructor === Object) {
           EventBus.$emit(events.SHOW_TYPING_INDICATOR, payload);
        }
        break;

        case apiConstants.API_CALL_HIDE_UPLOAD_ICON:
          store.commit('showUploadButton', false);
        break;

      case apiConstants.API_CALL_SHOW_UPLOAD_ICON:
           store.commit('showUploadButton', true);
        break;

      case apiConstants.API_CALL_SET_CHAT_WINDOW_TITLE:
        // TODO: throw error if payload is invalid or if store throws error
        if (typeof payload === 'string') {
          store.commit('title', payload);
        }
        break;

      case apiConstants.API_CALL_RESET_CHAT_WINDOW_TITLE:
        store.commit('title', store.getters.initialTitle);
        break;

      case apiConstants.API_CALL_SET_CHAT_WINDOW_ICON:
        // TODO: throw error if payload is invalid or if store throws error
        if (typeof payload === 'string') {
          store.commit('titleIconUrl', payload);
        }
        break;

      case apiConstants.API_CALL_RESET_CHAT_WINDOW_ICON:
        store.commit('titleIconUrl', store.getters.initialTitleIconUrl);
        break;

      case apiConstants.API_CALL_SET_LAUNCH_ICON:
        // TODO: throw error if payload is invalid or if store throws error
        if (typeof payload === 'string') {
          store.commit('launchIconUrl', payload);
        }
        break;

      case apiConstants.API_CALL_RESET_LAUNCH_ICON:
        store.commit('launchIconUrl', store.getters.initialLaunchIconUrl);
        break;

      case apiConstants.API_CALL_SET_SEND_ICON:
        // TODO: throw error if payload is invalid or if store throws error
        if (typeof payload === 'string') {
          store.commit('sendIconUrl', payload);
        }
        break;

      case apiConstants.API_CALL_RESET_SEND_ICON:
        store.commit('sendIconUrl', store.getters.initialSendIconUrl);
        break;
      
      case apiConstants.API_CALL_SET_UPLOAD_ICON:
        // TODO: throw error if payload is invalid or if store throws error
        if (typeof payload === 'string') {
          store.commit('uploadIconUrl', payload);
        }
        break;

      case apiConstants.API_CALL_RESET_UPLOAD_ICON:
        store.commit('uploadIconUrl', store.getters.initialUploadIconUrl);
        break;

      case apiConstants.API_CALL_DISABLE_USERINPUT:
        EventBus.$emit(events.DISABLE_INPUT);
        break;

      case apiConstants.API_CALL_ENABLE_USERINPUT:
        EventBus.$emit(events.ENABLE_INPUT);
        break;

      case apiConstants.API_CALL_DISABLE_UPLOAD_ICON:
        EventBus.$emit(events.DISABLE_UPLOAD);
        break;

      case apiConstants.API_CALL_ENABLE_UPLOAD_ICON:
        EventBus.$emit(events.ENABLE_UPLOAD);
        break;

      case apiConstants.API_CALL_SET_ENGINE_URL:
        if (typeof payload === 'string') {
          if (isValidUrl(payload)) {
            store.commit('teneoEngineUrl', payload);
            EventBus.$emit(events.SET_ENGINE_URL, payload);
          }
        }
        break;

      default:
        break;
    }
  },
  version() {
    return API_VERSION;
  }
};
if ((process.env.NODE_ENV === 'undefined') || (process.env.NODE_ENV !== 'test')) {
  Object.freeze(window.TeneoWebChat);
}
