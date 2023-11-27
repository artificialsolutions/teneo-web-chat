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

<style scoped>
.twc-image-message {
  display:flex;
  width: auto;
  height: auto;
  min-width: auto;
  max-width: 260px;
  margin-right: 40px;
  border-radius: 10px;
  border-bottom-left-radius: 0px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  background-color: transparent; /*For images with transparent background*/
}
.twc-image-message img {
  width: auto;
  height: auto;
  max-height: 100%;
  max-width: 100%;
  border-radius: 10px;
  border-bottom-left-radius: 0px;

}
</style>
