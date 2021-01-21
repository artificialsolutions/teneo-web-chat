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
  HIDE_TYPING_INDICATOR: 'hide_typing_indicator',
  SHOW_TYPING_INDICATOR: 'show_typing_indicator',
  HIDE_UPLOAD_ICON: 'hide_upload_icon',
  SHOW_UPLOAD_ICON: 'show_upload_icon',
  SEND_INPUT: 'send_input',
  API_STATE_READY: 'ready',
  DISABLE_INPUT: 'disable_input',
  ENABLE_INPUT: 'enable_input',
  DISABLE_UPLOAD: 'disable_upload',
  ENABLE_UPLOAD: 'enable_upload',
  USER_INPUT_FOCUS_CHANGED: 'user_input_focus_changed',
  SCROLL_CHAT_DOWN: 'scroll_chat_down',
  SET_ENGINE_URL: 'set-engine-url',
  SET_LOCALE: 'set_locale',
  SHOW_CALLOUT: 'show_callout',
  HIDE_CALLOUT: 'hide_calllout',
  ZOOM_IMAGE: 'zoom_image'
};

export const EventBus = new Vue();
