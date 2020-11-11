import Vue from 'vue';
import Vuex from 'vuex';
import { DEFAULT_TITLE } from '../utils/constants.js';
import isValidUrl from '../utils/validate-url';

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        visibility: "minimized",
        initialTitle: undefined,
        title: DEFAULT_TITLE,
        titleIconUrl: "",
        teneoEngineUrl: "",
        teneoEngineParams: {},
        showCloseButton: false,
        agentAvatarUrl: "",
        botAvatarUrl: "",
        userAvatarUrl: "",
        minimizeIconUrl: "",
        closeIconUrl: "",
        launchIconUrl: "",
        sendIconUrl: "",
        locale: "",
    },
    mutations: {
        visibility(state, newVisibility) {
            state.visibility = newVisibility
        },
        title(state, newTitle) {
            if (typeof newTitle === "string") {
                if(state.initialTitle === undefined){
                    state.initialTitle = newTitle
                }
                state.title = newTitle
            }
        },
        titleIconUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.titleIconUrl = newUrl
            }
        },
        teneoEngineUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.teneoEngineUrl = newUrl
            }
        },
        teneoEngineParams(state, params) {
            state.teneoEngineParams = params
        },
        setEngineParam(state, paramName, paramValue) {
            state.teneoEngineParams[paramName] = paramValue
        },
        showCloseButton(state, showButtonBool) {
            if (typeof showButtonBool === "boolean") {
                state.showCloseButton = showButtonBool
            }
        },
        agentAvatarUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.agentAvatarUrl = newUrl
            }
        },
        botAvatarUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.botAvatarUrl = newUrl
            }
        },
        userAvatarUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.userAvatarUrl = newUrl
            }
        },
        minimizeIconUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.minimizeIconUrl = newUrl
            }
        },
        closeIconUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.closeIconUrl = newUrl
            }
        },
        launchIconUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.launchIconUrl = newUrl
            }
        },
        sendIconUrl(state, newUrl) {
            // TODO: Throw error if url is invalid
            if (isValidUrl(newUrl)) {
                state.sendIconUrl = newUrl
            }
        },
        locale(state, newLocale) {
            // TODO: Improve check for valid locale and throw error if locale is invalid
            if (typeof newLocale === "string") {
                state.locale = newLocale
            }
        }
    },
    getters: {
        teneoEngineUrl: state => state.teneoEngineUrl,
        visibility: state => state.visibility,
        initialTitle: state => state.initialTitle,
        title: state => state.title,
        titleIconUrl: state => state.titleIconUrl,
        teneoEngineParams: state => state.teneoEngineParams,
        showCloseButton: state => state.showCloseButton,
        agentAvatarUrl: state => state.agentAvatarUrl,
        botAvatarUrl: state => state.botAvatarUrl,
        userAvatarUrl: state => state.userAvatarUrl,
        minimizeIconUrl: state => state.minimizeIconUrl,
        closeIconUrl: state => state.closeIconUrl,
        launchIconUrl: state => state.launchIconUrl,
        sendIconUrl: state => state.sendIconUrl,
        locale: state => state.locale,
        state: state => {
            return { 'visibility': state.visibility }
        },
        engineUrlObj: state => {
            return { 'engineUrl' : state.teneoEngineUrl}
        },
    }
})
