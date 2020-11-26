<template>
  <div class="twc-image-message">

    <!-- original ImageMessage
    <img :src="imageUrl" :alt="altText" @load="scrollChatUp"/>
     -->

    <!-- Thumbnail Image wrapped in a link -->
    <a href="#twc-zoomable-image">
      <img :src="thumbnailUrl">
    </a>
    <!-- Zoomed Image container hidden with CSS -->
    <a v-if="message.data.image_url" href="#" class="twc-lightbox" id="twc-zoomable-image">
      <span :style="imageUrl"></span>
    </a>

    
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
          (message.data.image_url || message.data.thumbnail_url )
        );
      },
    },
  },
  computed: {
    thumbnailUrl() {
      if(this.message.data.thumbnail_url) {
        return this.message.data.thumbnail_url
      }
      else {
        return this.message.data.image_url
      }
    },
    imageUrl() {
      return "background-image: url('"+this.message.data.image_url+"')"
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

/** LIGHTBOX MARKUP **/
.twc-lightbox {
  /* Default to hidden */
  display: none;

  /* Overlay entire screen */
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  /* A bit of padding around image */
  padding: 1em;

  /* Translucent background */
  background: rgba(0, 0, 0, 0.8);
}

/* Unhide the lightbox when it's the target */
.twc-lightbox:target {
  display: block;
}

.twc-lightbox span {
  /* Full width and height */
  display: block;
  width: 100%;
  height: 100%;

  /* Size and position background image */
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}


.twc-image-message {
  width: 100%;
  margin-right: 40px;
}
.twc-image-message img {
  max-width: 100%;
  max-height: 200px;
}
</style>
