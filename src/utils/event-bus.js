import Vue from 'vue';

export const events = {
    MESSAGE_SENT: 'message-sent',
    RESET_SESSION: 'reset-session',
    END_SESSION: 'end-session',
    CLEAR_HISTORY: 'clear-history',
    ENGINE_REPLIED: 'engine-replied',
    PUSH_BUBBLE: 'push-bubble',
    START_SPINNER: 'start-spinner',
    MAXIMIZE_WINDOW: 'maximize',
    MINIMIZE_WINDOW: 'minimize',
    CLOSE_WINDOW: 'close',
    ADD_MESSAGE: 'add_message',
    BOT_MESSAGE_RECEIVED: 'bot_message_received',
    HIDE_TYPING_INDICATOR: 'hide_typing_indicator',
    SHOW_TYPING_INDICATOR: 'show_typing_indicator',
    HIDE_UPLOAD_ICON: 'hide_upload_icon',
    SHOW_UPLOAD_ICON: 'show_upload_icon',
    HIDE_ASR_ICON: 'hide_asr_icon',
    SHOW_ASR_ICON: 'show_asr_icon',
    HIDE_TTS_ICON: 'hide_tts_icon',
    SHOW_TTS_ICON: 'show_tts_icon',
    SEND_INPUT: 'send_input',
    API_STATE_READY: 'ready',
    DISABLE_INPUT: 'disable_input',
    ENABLE_INPUT: 'enable_input',
    DISABLE_UPLOAD: 'disable_upload',
    ENABLE_UPLOAD: 'enable_upload',
    DISABLE_ASR: 'disable_asr',
    ENABLE_ASR: 'enable_asr',
    DISABLE_TTS: 'disable_tts',
    ENABLE_TTS: 'enable_tts',
    ASR_ACTIVE: 'asr_active',
    ASR_INACTIVE: 'asr_inactive',
    TTS_ACTIVE: 'tts_active',
    TTS_INACTIVE: 'tts_inactive',
    USER_INPUT_FOCUS_CHANGED: 'user_input_focus_changed',
    SCROLL_CHAT_DOWN: 'scroll_chat_down',
    SET_ENGINE_URL: 'set-engine-url',
    SET_ENGINE_PARAMS: 'set-engine-params',
    SET_LOCALE: 'set_locale',
    SET_MS_VOICE: 'set_ms_voice',
    SHOW_CALLOUT: 'show_callout',
    HIDE_CALLOUT: 'hide_calllout',
    ZOOM_IMAGE: 'zoom_image',
    STOP_ASR_TTS: 'stop_asr_tts',

    HIDE_UPLOAD_PANEL: 'hide_upload_panel',
    SHOW_UPLOAD_PANEL: 'show_upload_panel',
    SET_UPLOAD_STATE: 'set_upload_state',
    UPLOAD_PANEL_CLOSED: 'upload_panel_closed',
    UPLOAD_PANEL_OPENED: 'upload_panel_opened'
};


class EB {

    #eventNameToListeners = new Map();

    $on(eventName, f) {
        if ('function' !== typeof f) throw new Error('Bad listener for event [' + eventName + ']');
        const ff = this.#eventNameToListeners.get(eventName);
        if (ff) ff.push(f);
        else this.#eventNameToListeners.set(eventName, [ f ]);
    }


    $off(eventName, f) {
        var ff;
        if (f != null && (ff = this.#eventNameToListeners.get(eventName)) != null) {
            let n = ff.length;
            while (--n !== -1 && (n = ff.lastIndexOf(f, n)) !== -1) ff.splice(n, 1);
            if (ff.length === 0) ff = null;
        }
        if (ff == null) this.#eventNameToListeners.delete(eventName);
    }


    $emit(eventName, ...args) {
        const ff = this.#eventNameToListeners.get(eventName);
        if (ff == null) return;
        var i = 0;
        do {
            try {
                ff[i].apply(null, args);
            } catch (err) {
                console.warn('Error in callback nr', i, 'for event', eventName, ':', err);
            }
        } while (++i < ff.length);
    }
}


export const EventBus = new EB();
