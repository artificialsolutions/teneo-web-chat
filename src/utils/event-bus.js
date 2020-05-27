import Vue from 'vue';

export const events = {
  MESSAGE_SENT: 'message-sent',
  RESET_SESSION: 'reset-session',
  ENGINE_REPLIED: 'engine-replied',
};

export const EventBus = new Vue();
