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
  ADD_MESSAGE: 'add_message',
  SEND_INPUT: 'send_input',
  API_STATE_MAXIMIZED: 'maximized',
  API_STATE_MINIMIZED: 'minimized',
  API_STATE_READY: 'ready',
  SET_WINDOW_TITLE: 'set-window-title',
};

export const EventBus = new Vue();
