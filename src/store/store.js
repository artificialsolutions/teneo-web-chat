import Vue from 'vue';
import Vuex from 'vuex';
import { DEFAULT_TITLE, FALLBACK_LOCALE } from '../utils/constants.js';
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
        locale: FALLBACK_LOCALE,
        storage: window.sessionStorage,
    },
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
            // TODO: Throw error if url is invalid
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
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl) || newUrl == undefined) {
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
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.agentAvatarUrl = newUrl;
            }
        },
        botAvatarUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.botAvatarUrl = newUrl;
            }
        },
        userAvatarUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.userAvatarUrl = newUrl;
            }
        },
        minimizeIconUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.minimizeIconUrl = newUrl;
            }
        },
        closeIconUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
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
            // TODO: Throw error if url is invalid
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
            // TODO: Throw error if url is invalid
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
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl) || newUrl == undefined) {
                state.uploadIconUrl = newUrl;
            }
        },
        showUploadButton(state, showButtonBool) {
            if (typeof showButtonBool === 'boolean') {
                state.showUploadButton = showButtonBool;
            }
        },
        locale(state, newLocale) {
            // TODO: Improve check for valid locale and throw error if locale is invalid
            if (typeof newLocale === 'string') {
                state.locale = newLocale;
            }
        },
        storage(state, newStorage) {
            // TODO: Improve check for valid locale and throw error if locale is invalid
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
        locale: (state) => state.locale,
        localeObj: (state) => {
            return { 'locale': state.locale };
        },
        state: (state) => {
            return { 'visibility': state.visibility };
        },
        engineUrlObj: (state) => {
            return { 'engineUrl': state.teneoEngineUrl };
        },
        storage: (state) => state.storage,
    }
});
