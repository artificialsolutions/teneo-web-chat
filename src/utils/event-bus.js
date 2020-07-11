import Vue from 'vue';

export const events = {
  MESSAGE_SENT: 'message-sent',
  RESET_SESSION: 'reset-session',
  END_SESSION: 'end-session',
  CLEAR_HISTORY: 'clear-history',
  ENGINE_REPLIED: 'engine-replied',
  PUSH_BUBBLE: 'push-bubble',
  START_SPINNER: 'start-spinner',
  MAXIMIZE_WINDOW: 'maximize',  //check usage
  MINIMIZE_WINDOW: 'minimize',  //check usage
  ADD_MESSAGE: 'add_message',
};

export const EventBus = new Vue();
