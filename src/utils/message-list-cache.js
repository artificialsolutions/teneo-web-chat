import { store } from '../store/store.js';
class MessageListCache {
  constructor() {
    this.enabled = !!store.getters.storage;
    this.cacheKey = 'teneo-web-chat-messages';
  }

  get() {
    if (this.enabled) {
      const cached = store.getters.storage.getItem(this.cacheKey);

      if (!cached) {
        return [];
      }

      return JSON.parse(cached);
    }
  }

  update(value) {
    if (this.enabled) {
      store.getters.storage.setItem(this.cacheKey, JSON.stringify(value));
    }
  }
}

export default MessageListCache;
