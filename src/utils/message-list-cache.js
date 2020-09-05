import { store } from '../store/store.js';

class MessageListCache {
  constructor() {
    if (store.getters.useLocalStorage) {
      this.enabled = !!window.localStorage;
    } else {
      this.enabled = !!window.sessionStorage;
    }
    //this.enabled = !!window.localStorage;
    this.cacheKey = 'teneo-web-chat-messages';
  }

  get() {
    if (this.enabled) {
      let cached;
      if (store.getters.useLocalStorage) {
        cached = window.localStorage.getItem(this.cacheKey);
      } else {
        cached = window.sessionStorage.getItem(this.cacheKey);
      }

      if (!cached) {
        return [];
      }

      return JSON.parse(cached);
    }
  }

  update(value) {
    if (this.enabled) {
      if(store.getters.useLocalStorage) {
        window.localStorage.setItem(this.cacheKey, JSON.stringify(value));
      } else {
        window.sessionStorage.setItem(this.cacheKey, JSON.stringify(value));
      }
    }
  }
}

export default MessageListCache;
