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

window.twcTmp = {}
window.TeneoWebChat = {
  initialize(element, twcProps) {

    // TODO: error handling (once store throws error)
    Vue.prototype.$store = store;

    // Store properties in storage
    if (twcProps.teneoEngineUrl) {

      store.commit('teneoEngineUrl', twcProps.teneoEngineUrl);
    }

    if (twcProps.title) {
      // TODO: Check if title is a string
      store.commit('initialTitle', twcProps.title);
    }

    if (twcProps.titleIconUrl) {

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

      store.commit('agentAvatarUrl', twcProps.agentAvatarUrl);
    }

    if (twcProps.botAvatarUrl) {

      store.commit('botAvatarUrl', twcProps.botAvatarUrl);
    }

    if (twcProps.userAvatarUrl) {

      store.commit('userAvatarUrl', twcProps.userAvatarUrl);
    }

    if (twcProps.minimizeIconUrl) {

      store.commit('minimizeIconUrl', twcProps.minimizeIconUrl);
    }

    if (twcProps.closeIconUrl) {

      store.commit('closeIconUrl', twcProps.closeIconUrl);
    }

    if (twcProps.launchIconUrl) {

      store.commit('initialLaunchIconUrl', twcProps.launchIconUrl);
    }

    if (twcProps.sendIconUrl) {

      store.commit('initialSendIconUrl', twcProps.sendIconUrl);
    }

    if (twcProps.uploadIconUrl) {

      store.commit('initialUploadIconUrl', twcProps.uploadIconUrl);
    }

    if (twcProps.showUploadButton === true || twcProps.showUploadButton === "true") {
      store.commit('showUploadButton', true);
    }

    if (twcProps.showScrollDownButton === true || twcProps.showScrollDownButton === "true") {
      store.commit('showScrollDownButton', true);
    }

    if (twcProps.fileUploadSymbolFailed) {
      store.commit('fileUploadSymbolFailed', twcProps.fileUploadSymbolFailed);
    }
    if (twcProps.fileUploadSymbolInterrupted) {
      store.commit('fileUploadSymbolInterrupted', twcProps.fileUploadSymbolInterrupted);
    }
    if (twcProps.fileUploadSymbolDelete) {
      store.commit('fileUploadSymbolDelete', twcProps.fileUploadSymbolDelete);
    }
    if (twcProps.asrRecordSymbol) {
      store.commit('asrRecordSymbol', twcProps.asrRecordSymbol);
    }
    if (twcProps.ttsStopSymbol) {
      store.commit('ttsStopSymbol', twcProps.ttsStopSymbol);
    }
    if (twcProps.asrPauseSymbol) {
      store.commit('asrPauseSymbol', twcProps.asrPauseSymbol);
    }
    if (twcProps.fileUploadSymbolStop) {
      store.commit('fileUploadSymbolStop', twcProps.fileUploadSymbolStop);
    }
    if (twcProps.fileUploadSymbolRestart) {
      store.commit('fileUploadSymbolRestart', twcProps.fileUploadSymbolRestart);
    }
    if (twcProps.fileUploadSymbolRetry) {
      store.commit('fileUploadSymbolRetry', twcProps.fileUploadSymbolRetry);
    }
    if (twcProps.fileUploadSymbolProgressBackgroundColor) {
      store.commit('fileUploadSymbolProgressBackgroundColor', twcProps.fileUploadSymbolProgressBackgroundColor);
    }
    if (twcProps.fileUploadSymbolProgressBarColor) {
      store.commit('fileUploadSymbolProgressBarColor', twcProps.fileUploadSymbolProgressBarColor);
    }

    if (twcProps.uploadPanelAddFilesSymbol) {
      store.commit('uploadPanelAddFilesSymbol', twcProps.uploadPanelAddFilesSymbol);
    }

    if (twcProps.asrIconUrl) {
      store.commit('initialAsrIconUrl', twcProps.asrIconUrl);
    }

    if (twcProps.showAsrButton === true || twcProps.showAsrButton === "true") {
      store.commit('showAsrButton', true);
    }
    if (twcProps.asrActive === true || twcProps.asrActive === "true") {
      store.commit('asrActive', true);
    }
    if (twcProps.ttsIconUrl) {
      store.commit('initialTtsIconUrl', twcProps.ttsIconUrl);
    }

    if (twcProps.showTtsButton === true || twcProps.showTtsButton === "true") {
      store.commit('showTtsButton', true);
    }
    if (twcProps.ttsActive === true || twcProps.ttsActive === "true") {
      store.commit('ttsActive', true);
    }

    if (twcProps.locale) {

      store.commit('locale', twcProps.locale);
    }

//Empty property

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

      store.commit('locale', twcProps.locale);
    }
   //Default is true to autoredirect, false or 'false' will flip it
    if (twcProps.hasOwnProperty('autoRedirect') && twcProps.autoRedirect !== "" && !JSON.parse(twcProps.autoRedirect)) {
      store.commit('autoRedirect', false);
    }

    if (twcProps.storage) {

      store.commit('storage', twcProps.storage);
    }

    // Check required properties
    if (!store.getters.teneoEngineUrl) {
      // TODO: throw error if engine url is missing?
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
        // TODO: throw error if invalid function_name was provided?
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

      case apiConstants.API_GET_ENGINE_PARAMS:
        return store.getters.teneoEngineParams

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

        case apiConstants.API_SET_ENGINE_PARAMS:
        // TODO: throw error if payload is invalid or if store throws error
        store.commit('teneoEngineParams', payload);
        EventBus.$emit(events.SET_ENGINE_PARAMS, store.getters.teneoEngineParams);
        break;

      case apiConstants.API_CALL_MAXIMIZE:
        EventBus.$emit(events.MAXIMIZE_WINDOW);
        break;

      case apiConstants.API_CALL_MINIMIZE:
        EventBus.$emit(events.STOP_ASR_TTS);
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
        EventBus.$emit(events.STOP_ASR_TTS);
        EventBus.$emit(events.END_SESSION);
        break;

      case apiConstants.API_CALL_CLEAR_CHAT_HISTORY:
        EventBus.$emit(events.CLEAR_HISTORY);
        break;

      case apiConstants.API_CALL_RESET:
        EventBus.$emit(events.STOP_ASR_TTS);
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

        case apiConstants.API_CALL_HIDE_UPLOAD_BUTTON:
          store.commit('showUploadButton', false);
        break;

      case apiConstants.API_CALL_SHOW_UPLOAD_BUTTON:
           store.commit('showUploadButton', true);
        break;   
        
        case apiConstants.API_CALL_HIDE_ASR_BUTTON:
          store.commit('showAsrButton', false);
        break;

      case apiConstants.API_CALL_SHOW_ASR_BUTTON:
           store.commit('showAsrButton', true);
        break;
        case apiConstants.API_CALL_ASR_ACTIVE:
          EventBus.$emit(events.ASR_ACTIVE);
           store.commit('asrActive', true);
        break;
      case apiConstants.API_CALL_ASR_INACTIVE:
        EventBus.$emit(events.ASR_INACTIVE);
        store.commit('asrActive', false);
        break;
      case apiConstants.API_CALL_HIDE_TTS_BUTTON:
          store.commit('showTtsButton', false);
        break;

      case apiConstants.API_CALL_SHOW_TTS_BUTTON:
           store.commit('showTtsButton', true);
        break;
      case apiConstants.API_CALL_TTS_ACTIVE:
        EventBus.$emit(events.TTS_ACTIVE);
        store.commit('ttsActive', true);
        break;
        case apiConstants.API_CALL_TTS_INACTIVE:
          EventBus.$emit(events.TTS_INACTIVE);
        store.commit('ttsActive', false);
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

      case apiConstants.API_CALL_RESET_ASR_ICON:
        store.commit('asrIconUrl', store.getters.initialAsrIconUrl);
        break;

      case apiConstants.API_CALL_SET_ASR_ICON:
        // TODO: throw error if payload is invalid or if store throws error
        if (typeof payload === 'string') {
          store.commit('asrIconUrl', payload);
        }
        break;

      case apiConstants.API_CALL_RESET_TTS_ICON:
        store.commit('ttsIconUrl', store.getters.initialTtsIconUrl);
        break;

      case apiConstants.API_CALL_SET_TTS_ICON:
        // TODO: throw error if payload is invalid or if store throws error
        if (typeof payload === 'string') {
          store.commit('ttsIconUrl', payload);
        }
        break;

      case apiConstants.API_CALL_DISABLE_USERINPUT:
        EventBus.$emit(events.DISABLE_INPUT);
        break;

      case apiConstants.API_CALL_ENABLE_USERINPUT:
        EventBus.$emit(events.ENABLE_INPUT);
        break;

      case apiConstants.API_CALL_DISABLE_UPLOAD_BUTTON:
        EventBus.$emit(events.DISABLE_UPLOAD);
        break;

      case apiConstants.API_CALL_ENABLE_UPLOAD_BUTTON:
        EventBus.$emit(events.ENABLE_UPLOAD);
        break;

        case apiConstants.API_CALL_DISABLE_ASR_BUTTON:
        EventBus.$emit(events.DISABLE_ASR);
        break;

      case apiConstants.API_CALL_ENABLE_ASR_BUTTON:
        EventBus.$emit(events.ENABLE_ASR);
        break;

        case apiConstants.API_CALL_DISABLE_TTS_BUTTON:
        EventBus.$emit(events.DISABLE_TTS);
        break;

      case apiConstants.API_CALL_ENABLE_TTS_BUTTON:
        EventBus.$emit(events.ENABLE_TTS);
        break;

      case apiConstants.API_CALL_SET_ENGINE_URL:
        if (typeof payload === 'string') {
          if (isValidUrl(payload)) {
            store.commit('teneoEngineUrl', payload);
            EventBus.$emit(events.SET_ENGINE_URL, payload);
          }
        }
        break;

      case apiConstants.API_CALL_SHOW_UPLOAD_PANEL:
        EventBus.$emit(events.SHOW_UPLOAD_PANEL, payload);
        break;

      case apiConstants.API_CALL_HIDE_UPLOAD_PANEL:
        EventBus.$emit(events.HIDE_UPLOAD_PANEL);
        break;

      case apiConstants.API_ON_SET_UPLOAD_STATE:
        EventBus.$emit(events.SET_UPLOAD_STATE, payload);
        break;

      default:
        break;
    }
  },
  version() {
    return API_VERSION;
  }
};
//Directive to v-visible to use visibility="hidden" instead of v-show to display="none"
Vue.directive('visible', (el, binding) => {
  el.style.visibility = !!binding.value ? 'visible' : 'hidden'
});




if ((process.env.NODE_ENV === 'undefined') || (process.env.NODE_ENV !== 'test')) {
  Object.freeze(window.TeneoWebChat);
}
