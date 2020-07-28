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
};

export const EventBus = new Vue();
