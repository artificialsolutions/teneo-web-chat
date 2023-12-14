import Vue from 'vue';
import Vuex from 'vuex';
import {DEFAULT_TITLE, FALLBACK_LOCALE} from '../utils/constants.js';
import isValidUrl from '../utils/validate-url';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        calloutVisibility: false,
        calloutText: 'Teneo Web Chat',
        initialTitle: DEFAULT_TITLE,
        initialTitleIconUrl: undefined,
        initialLaunchIconUrl: undefined,
        initialSendIconUrl: undefined,
        initialUploadIconUrl: undefined,
        initialAsrIconUrl: undefined,
        initialTtsIconUrl: undefined,
        visibility: 'minimized',
        title: DEFAULT_TITLE,
        titleIconUrl: '',
        teneoEngineUrl: '',
        teneoEngineParams: {},
        showCloseButton: false,
        agentAvatarUrl: '',
        botAvatarUrl: '',
        userAvatarUrl: '',
        minimizeIconUrl: '',
        closeIconUrl: '',
        launchIconUrl: '',
        sendIconUrl: '',
        uploadIconUrl: '',
        showUploadButton: false,

        showScrollDownButton: false,

        fileUploadSymbolFailed: '',
        fileUploadSymbolInterrupted: '',
        fileUploadSymbolDelete: '',
        fileUploadSymbolStop: '',
        fileUploadSymbolRestart: '',
        fileUploadSymbolRetry: '',
        fileUploadSymbolProgressBackgroundColor: '',
        fileUploadSymbolProgressBarColor: '',

        uploadPanelAddFilesSymbol: '',

        asrIconUrl: '',
        ttsIconUrl: '',
        showAsrButton: false,
        showTtsButton: false,
        asrActive: false,
        ttsActive: false,

        msCognitiveAsrSubscriptionKey: '',
        msCognitiveAsrRegion: '',
        msCognitiveAsrSubscriptionOnly: undefined,
        msCognitiveAsrToken: '',
        msCognitiveAsrCustomAuthTokenUrl: '',
        msCognitiveAsrEndpoint: '',
        msCognitiveAsrHost: '',
        msCognitiveAsrTokenTimeStamp: 0,

        msCognitiveTtsSubscriptionKey: '',
        msCognitiveTtsRegion: '',
        msCognitiveTtsSubscriptionOnly: undefined,
        msCognitiveTtsToken: '',
        msCognitiveTtsCustomAuthTokenUrl: '',
        msCognitiveTtsEndpoint: '',
        msCognitiveTtsHost: '',
        msCognitiveTtsTokenTimeStamp: 0,

        msCognitiveSubscriptionKey: '',
        msCognitiveRegion: '',
        msCognitiveSubscriptionOnly: undefined,
        msCognitiveToken: '',
        msCognitiveCustomAuthTokenUrl: '',
        msCognitiveEndpoint: '',
        msCognitiveHost: '',
        msCognitiveTokenTimeStamp: 0,

        msVoice: '',
        locale: FALLBACK_LOCALE,
        storage: window.sessionStorage,
        autoRedirect: false
    },

    // TODO: Throw error if any of the urls are invalid
    mutations: {
        calloutVisibility(state, newVisibility) {
            state.calloutVisibility = newVisibility;
        },
        calloutText(state, newText) {
            state.calloutText = newText;
        },
        visibility(state, newVisibility) {
            state.visibility = newVisibility;
        },
        initialTitle(state, title) {
            if (typeof title === 'string') {
                state.initialTitle = title;
                state.title = title;
            }
        },
        teneoEngineUrl(state, newUrl) {

            if (isValidUrl(newUrl)) {
                state.teneoEngineUrl = newUrl;
            }
        },
        title(state, newTitle) {
            if (typeof newTitle === 'string') {
                state.title = newTitle;
            }
        },
        initialTitleIconUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.initialTitleIconUrl = newUrl;
                state.titleIconUrl = newUrl;
            }
        },
        titleIconUrl(state, newUrl) {
            if (isValidUrl(newUrl) || newUrl === undefined) {
                state.titleIconUrl = newUrl;
            }
        },
        teneoEngineParams(state, params) {
            state.teneoEngineParams = params;
        },
        setEngineParam(state, paramName, paramValue) {
            state.teneoEngineParams[paramName] = paramValue;
        },
        showCloseButton(state, showButtonBool) {
            if (typeof showButtonBool === 'boolean') {
                state.showCloseButton = showButtonBool;
            }
        },
        agentAvatarUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.agentAvatarUrl = newUrl;
            }
        },
        botAvatarUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.botAvatarUrl = newUrl;
            }
        },
        userAvatarUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.userAvatarUrl = newUrl;
            }
        },
        minimizeIconUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.minimizeIconUrl = newUrl;
            }
        },
        closeIconUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.closeIconUrl = newUrl;
            }
        },
        initialLaunchIconUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.initialLaunchIconUrl = newUrl;
                state.launchIconUrl = newUrl;
            }
        },
        launchIconUrl(state, newUrl) {
            if (isValidUrl(newUrl) || newUrl == undefined) {
                state.launchIconUrl = newUrl;
            }
        },
        initialSendIconUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.initialSendIconUrl = newUrl;
                state.sendIconUrl = newUrl;
            }
        },
        sendIconUrl(state, newUrl) {
            if (isValidUrl(newUrl) || newUrl == undefined) {
                state.sendIconUrl = newUrl;
            }
        },
        initialUploadIconUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.initialUploadIconUrl = newUrl;
                state.uploadIconUrl = newUrl;
            }
        },
        uploadIconUrl(state, newUrl) {

            if (isValidUrl(newUrl) || newUrl === undefined) {
                state.uploadIconUrl = newUrl;
            }
        },
        showUploadButton(state, showButtonBool) {
            if (typeof showButtonBool === 'boolean') {
                state.showUploadButton = showButtonBool;
            }
        },
        showScrollDownButton(state, showButtonBool) {
            if (typeof showButtonBool === 'boolean') {
                state.showScrollDownButton = showButtonBool;
            }
        },

        fileUploadSymbolFailed(state, s) {
            state.fileUploadSymbolFailed = s;
        },
        fileUploadSymbolInterrupted(state, s) {
            state.fileUploadSymbolInterrupted = s;
        },
        fileUploadSymbolDelete(state, s) {
            state.fileUploadSymbolDelete = s;
        },
        fileUploadSymbolStop(state, s) {
            state.fileUploadSymbolStop = s;
        },
        fileUploadSymbolRestart(state, s) {
            state.fileUploadSymbolRestart = s;
        },
        fileUploadSymbolRetry(state, s) {
            state.fileUploadSymbolRetry = s;
        },
        fileUploadSymbolProgressBackgroundColor(state, s) {
            state.fileUploadSymbolProgressBackgroundColor = s;
        },
        fileUploadSymbolProgressBarColor(state, s) {
            state.fileUploadSymbolProgressBarColor = s;
        },

        uploadPanelAddFilesSymbol(state, s) {
            state.uploadPanelAddFilesSymbol = s;
        },

        initialAsrIconUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.initialAsrIconUrl = newUrl;
                state.asrIconUrl = newUrl;
            }
        },
        asrIconUrl(state, newUrl) {

            if (isValidUrl(newUrl) || newUrl === undefined) {
                state.asrIconUrl = newUrl;
            }
        },
        showAsrButton(state, showButtonBool) {
            if (typeof showButtonBool === 'boolean') {
                state.showAsrButton = showButtonBool;
            }
        },
        asrActive(state, activeBool) {
            if (typeof activeBool === 'boolean') {
                state.asrActive = activeBool;
            }
        },
        initialTtsIconUrl(state, newUrl) {
            if (isValidUrl(newUrl)) {
                state.initialTtsIconUrl = newUrl;
                state.ttsIconUrl = newUrl;
            }
        },
        ttsIconUrl(state, newUrl) {

            if (isValidUrl(newUrl) || newUrl === undefined) {
                state.ttsIconUrl = newUrl;
            }
        },
        showTtsButton(state, showButtonBool) {
            if (typeof showButtonBool === 'boolean') {
                state.showTtsButton = showButtonBool;
            }
        },
        ttsActive(state, activeBool) {
            if (typeof activeBool === 'boolean') {
                state.ttsActive = activeBool;
            }
        },


        msCognitiveAsrRegion(state, s) {
            if (typeof s === 'string') state.msCognitiveAsrRegion = s;
        },
        msCognitiveAsrSubscriptionKey(state, s) {
            if (typeof s === 'string') state.msCognitiveAsrSubscriptionKey = s;
        },
        msCognitiveAsrSubscriptionOnly(state, b) {
            if (typeof b === 'boolean') state.msCognitiveAsrSubscriptionOnly = b;
        },
        msCognitiveAsrToken(state, token) {
            state.msCognitiveAsrTokenTimeStamp = Date.now();
            state.msCognitiveAsrToken = token;
        },
        msCognitiveAsrCustomAuthTokenUrl(state, s) {
            if (typeof s === 'string') state.msCognitiveAsrCustomAuthTokenUrl = s;
        },
        msCognitiveAsrEndpoint(state, s) {
            if (typeof s === 'string') state.msCognitiveAsrEndpoint = s;
        },
        msCognitiveAsrHost(state, s) {
            if (typeof s === 'string') state.msCognitiveAsrHost = s;
        },


        msCognitiveTtsRegion(state, s) {
            if (typeof s === 'string') state.msCognitiveTtsRegion = s;
        },
        msCognitiveTtsSubscriptionKey(state, s) {
            if (typeof s === 'string') state.msCognitiveTtsSubscriptionKey = s;
        },
        msCognitiveTtsSubscriptionOnly(state, b) {
            if (typeof b === 'boolean') state.msCognitiveTtsSubscriptionOnly = b;
        },
        msCognitiveTtsToken(state, token) {
            state.msCognitiveTtsTokenTimeStamp = Date.now();
            state.msCognitiveTtsToken = token;
        },
        msCognitiveTtsCustomAuthTokenUrl(state, s) {
            if (typeof s === 'string') state.msCognitiveTtsCustomAuthTokenUrl = s;
        },
        msCognitiveTtsEndpoint(state, s) {
            if (typeof s === 'string') state.msCognitiveTtsEndpoint = s;
        },
        msCognitiveTtsHost(state, s) {
            if (typeof s === 'string') state.msCognitiveTtsHost = s;
        },


        msCognitiveRegion(state, s) {
            if (typeof s === 'string') state.msCognitiveRegion = s;
        },
        msCognitiveSubscriptionKey(state, s) {
            if (typeof s === 'string') state.msCognitiveSubscriptionKey = s;
        },
        msCognitiveSubscriptionOnly(state, b) {
            if (typeof b === 'boolean') state.msCognitiveSubscriptionOnly = b;
        },
        msCognitiveToken(state, token) {
            state.msCognitiveTokenTimeStamp = Date.now();
            state.msCognitiveToken = token;
        },
        msCognitiveCustomAuthTokenUrl(state, s) {
            if (typeof s === 'string') state.msCognitiveCustomAuthTokenUrl = s;
        },
        msCognitiveEndpoint(state, s) {
            if (typeof s === 'string') state.msCognitiveEndpoint = s;
        },
        msCognitiveHost(state, s) {
            if (typeof s === 'string') state.msCognitiveHost = s;
        },


        msVoice(state, voiceName) {
            if (typeof voiceName === 'string') {
                state.msVoice = voiceName;
            }
        },
        autoRedirect(state, autoRedirectBool) {
            if (typeof autoRedirectBool === 'boolean') {
                state.autoRedirect = autoRedirectBool;
            }
        },
        locale(state, newLocale) {
            // TODO: Improve check for valid locale and throw error if locale is invalid
            if (typeof newLocale === 'string') {
                state.locale = newLocale;
            }
        },
        storage(state, newStorage) {
            if (typeof newStorage === 'object') {
                state.storage = newStorage;
            }
        }
    },
    getters: {
        calloutVisibility: (state) => state.calloutVisibility,
        calloutText: (state) => state.calloutText,
        teneoEngineUrl: (state) => state.teneoEngineUrl,
        visibility: (state) => state.visibility,
        initialTitle: (state) => state.initialTitle,
        initialTitleIconUrl: (state) => state.initialTitleIconUrl,
        initialLaunchIconUrl: (state) => state.initialLaunchIconUrl,
        initialSendIconUrl: (state) => state.initialSendIconUrl,
        initialUploadIconUrl: (state) => state.initialUploadIconUrl,
        initialAsrIconUrl: (state) => state.initialAsrIconUrl,
        initialTtsIconUrl: (state) => state.initialTtsIconUrl,
        title: (state) => state.title,
        titleIconUrl: (state) => state.titleIconUrl,
        teneoEngineParams: (state) => state.teneoEngineParams,
        showCloseButton: (state) => state.showCloseButton,
        agentAvatarUrl: (state) => state.agentAvatarUrl,
        botAvatarUrl: (state) => state.botAvatarUrl,
        userAvatarUrl: (state) => state.userAvatarUrl,
        minimizeIconUrl: (state) => state.minimizeIconUrl,
        closeIconUrl: (state) => state.closeIconUrl,
        launchIconUrl: (state) => state.launchIconUrl,
        sendIconUrl: (state) => {
            if (state.sendIconUrl) {
                return state.sendIconUrl;
            }

            return state.initialSendIconUrl;
        },
        uploadIconUrl: (state) => {
            if (state.uploadIconUrl) {
                return state.uploadIconUrl;
            }

            return state.initialUploadIconUrl;
        },
        showUploadButton: (state) => state.showUploadButton,
        showScrollDownButton: (state) => state.showScrollDownButton,

        fileUploadSymbolFailed: (state) => state.fileUploadSymbolFailed,
        fileUploadSymbolInterrupted: (state) => state.fileUploadSymbolInterrupted,
        fileUploadSymbolDelete: (state) => state.fileUploadSymbolDelete,
        fileUploadSymbolStop: (state) => state.fileUploadSymbolStop,
        fileUploadSymbolRestart: (state) => state.fileUploadSymbolRestart,
        fileUploadSymbolRetry: (state) => state.fileUploadSymbolRetry,
        fileUploadSymbolProgressBackgroundColor: (state) => state.fileUploadSymbolProgressBackgroundColor,
        fileUploadSymbolProgressBarColor: (state) => state.fileUploadSymbolProgressBarColor,

        uploadPanelAddFilesSymbol: (state) => state.uploadPanelAddFilesSymbol,

        asrIconUrl: (state) => {
            if (state.asrIconUrl) {
                return state.asrIconUrl;
            }

            return state.initialAsrIconUrl;
        },
        showAsrButton: (state) => state.showAsrButton,
        asrActive: (state) => state.asrActive,
        ttsIconUrl: (state) => {
            if (state.ttsIconUrl) {
                return state.ttsIconUrl;
            }

            return state.initialTtsIconUrl;
        },
        showTtsButton: (state) => state.showTtsButton,
        ttsActive: (state) => state.ttsActive,

        msCognitiveSubscriptionKey: (state) => state.msCognitiveSubscriptionKey,
        msCognitiveRegion: (state) => state.msCognitiveRegion,
        msCognitiveSubscriptionOnly: (state) => state.msCognitiveSubscriptionOnly,
        msCognitiveToken: (state) => state.msCognitiveToken,
        msCognitiveTokenTimeStamp: (state) => state.msCognitiveTokenTimeStamp,
        msCognitiveCustomAuthTokenUrl: (state) => state.msCognitiveCustomAuthTokenUrl,
        msCognitiveEndpoint: (state) => state.msCognitiveEndpoint,
        msCognitiveHost: (state) => state.msCognitiveHost,

        msCognitiveAsrSubscriptionKey: (state) => state.msCognitiveAsrSubscriptionKey,
        msCognitiveAsrRegion: (state) => state.msCognitiveAsrRegion,
        msCognitiveAsrSubscriptionOnly: (state) => state.msCognitiveAsrSubscriptionOnly,
        msCognitiveAsrToken: (state) => state.msCognitiveAsrToken,
        msCognitiveAsrTokenTimeStamp: (state) => state.msCognitiveAsrTokenTimeStamp,
        msCognitiveAsrCustomAuthTokenUrl: (state) => state.msCognitiveAsrCustomAuthTokenUrl,
        msCognitiveAsrEndpoint: (state) => state.msCognitiveAsrEndpoint,
        msCognitiveAsrHost: (state) => state.msCognitiveAsrHost,

        msCognitiveTtsSubscriptionKey: (state) => state.msCognitiveTtsSubscriptionKey,
        msCognitiveTtsRegion: (state) => state.msCognitiveTtsRegion,
        msCognitiveTtsSubscriptionOnly: (state) => state.msCognitiveTtsSubscriptionOnly,
        msCognitiveTtsToken: (state) => state.msCognitiveTtsToken,
        msCognitiveTtsTokenTimeStamp: (state) => state.msCognitiveTtsTokenTimeStamp,
        msCognitiveTtsCustomAuthTokenUrl: (state) => state.msCognitiveTtsCustomAuthTokenUrl,
        msCognitiveTtsEndpoint: (state) => state.msCognitiveTtsEndpoint,
        msCognitiveTtsHost: (state) => state.msCognitiveTtsHost,

        msVoice: (state) => {
            return state.msVoice;
        },
        locale: (state) => state.locale,
        autoRedirect: (state) => state.autoRedirect,
        localeObj: (state) => {
            return {'locale': state.locale};
        },
        state: (state) => {
            return {'visibility': state.visibility};
        },
        engineUrlObj: (state) => {
            return {'engineUrl': state.teneoEngineUrl};
        },
        storage: (state) => state.storage,
    }
});
