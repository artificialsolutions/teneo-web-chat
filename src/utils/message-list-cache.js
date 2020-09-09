import { store } from '../store/store.js';

class MessageListCache {
  constructor() {
    this.enabled = !!window.sessionStorage;
    this.cacheKey = 'teneo-web-chat-messages';
  }

  get() {
    if (this.enabled) {
      const cached = window.sessionStorage.getItem(this.cacheKey);

      if (!cached) {
        return [];
      }

      return JSON.parse(cached);
    }
  }

  update(value) {
    if (this.enabled) {
      window.sessionStorage.setItem(this.cacheKey, JSON.stringify(value));
    }
  }
}

export default MessageListCache;
