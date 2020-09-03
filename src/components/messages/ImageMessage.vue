<template>
  <div class="twc-image-message">
    <img :src="imageUrl" :alt="altText" @load="scrollChatUp"/>
  </div>
</template>

<script>

import { EventBus, events } from '../../utils/event-bus.js';

export default {
  name: 'ImageMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'image' &&
          message.data &&
          message.data.image_url
        );
      },
    },
  },
  computed: {
    imageUrl() {
      return this.message.data.image_url;
    },
    altText() {
      return this.message.data.alt;
    },
  },
  methods: {
    scrollChatUp() {
      EventBus.$emit(events.SCROLL_CHAT_DOWN);
    }
  }
};
</script>

<style>
.twc-image-message {
  width: 100%;
  margin-right: 40px;
}
.twc-image-message img {
  max-width: 100%;
  max-height: 200px;
}
</style>
