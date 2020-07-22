import Vue from 'vue'
import Vuex from 'vuex'
import { DEFAULT_TITLE } from '../utils/constants.js';

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        visibility: "minimized",
        title: DEFAULT_TITLE,
        titleIconUrl: "",
        teneoEngineUrl: "",
        teneoEngineParams: {},
        showCloseButton: false,
    },
    mutations: {
        visibility(state, newVisibility) {
            state.visibility = newVisibility
        },
        title(state, newTitle) {
            state.title = newTitle
        },
        titleIconUrl(state, newUrl) {
            state.titleIconUrl = newUrl
        },
        teneoEngineUrl(state, newUrl) {
            state.teneoEngineUrl = newUrl
        },
        teneoEngineParams(state, params) {
            state.teneoEngineParams = params
        },
        setEngineParam(state,paramName,paramValue) {
            state.teneoEngineParams[paramName] = paramValue
        },
        showCloseButton(state, showButtonBool) {
            state.showCloseButton = showButtonBool
        }
    },
    getters: {
        teneoEngineUrl: state => state.teneoEngineUrl,
        visibility: state => state.visibility,
        title: state => state.title,
        titleIconUrl: state => state.titleIconUrl,
        teneoEngineParams: state => state.teneoEngineParams,
        showCloseButton: state => state.showCloseButton,
        state: state => {
            return {'visibility':state.visibility}
        },
    }
})
