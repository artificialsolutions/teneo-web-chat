import Vue from 'vue'
import Vuex from 'vuex'
import { DEFAULT_TITLE } from '../utils/constants.js';
import isValidUrl from '../utils/validate-url';

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        visibility: "minimized",
        title: DEFAULT_TITLE,
        titleIconUrl: "",
        teneoEngineUrl: "",
        teneoEngineParams: {},
        showCloseButton: false,
        agentAvatarUrl: "",
        botAvatarUrl: "",
        userAvatarUrl: "",
    },
    mutations: {
        visibility(state, newVisibility) {
            state.visibility = newVisibility
        },
        title(state, newTitle) {
            state.title = newTitle
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
        }
    },
    getters: {
        teneoEngineUrl: state => state.teneoEngineUrl,
        visibility: state => state.visibility,
        title: state => state.title,
        titleIconUrl: state => state.titleIconUrl,
        teneoEngineParams: state => state.teneoEngineParams,
        showCloseButton: state => state.showCloseButton,
        agentAvatarUrl: state => state.agentAvatarUrl,
        botAvatarUrl: state => state.botAvatarUrl,
        userAvatarUrl: state => state.userAvatarUrl,
        state: state => {
            return { 'visibility': state.visibility }
        },
    }
})
