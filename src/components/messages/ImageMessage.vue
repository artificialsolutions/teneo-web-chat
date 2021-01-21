<template>
  <div class="twc-image-message">
    <span v-if="!(thumbnailUrl && !imageUrl)">
      <a href="#" title="Click to enlarge" class="twc-image-link" @click="zoomIn">
        <img :src="thumbnailUrl" :alt="altText" @load="scrollChatUp">
      </a>
    </span>
    <span v-else>
      <img :src="thumbnailUrl" :alt="altText" @load="scrollChatUp">
    </span>
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
          (message.data.image_url || message.data.thumbnail_url)
        );
      },
    },
  },
  data() {
      return {
        zoomedIn: false
      };
  },
  computed: {
    thumbnailUrl() {
      if (this.message.data.thumbnail_url) {
        return this.message.data.thumbnail_url;
      }

        return this.message.data.image_url;

    },
    imageUrl() {
      return this.message.data.image_url;
    },
    altText() {
      return this.message.data.alt;
    },
  },
  methods: {
    zoomIn() {
      // Prevent anchor from being added to url
      event.preventDefault();

      /*
       * TODO: handle extension
       * await handleExtension(API_MESSAGE_IMAGE_CLICKED, payload);
       */

      if (this.message.data.image_url) {
        EventBus.$emit(events.ZOOM_IMAGE, this.imageUrl);
      }

    },
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
