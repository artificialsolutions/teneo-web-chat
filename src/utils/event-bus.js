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
  SEND_INPUT: 'send_input',
  API_STATE_READY: 'ready',
  DISABLE_INPUT: 'disable_input',
  ENABLE_INPUT: 'enable_input',
  USER_INPUT_FOCUS_CHANGED: 'user_input_focus_changed',
  SCROLL_CHAT_DOWN: 'scroll_chat_down',
  SET_ENGINE_URL: "set-engine-url",
  SET_LOCALE: 'set_locale',
  SHOW_CALLOUT: 'show_callout',
  HIDE_CALLOUT: 'hide_calllout',
  EXPIRE_PREVIOUS_COMBOS: 'expire_previous_combo'
};

export const EventBus = new Vue();
