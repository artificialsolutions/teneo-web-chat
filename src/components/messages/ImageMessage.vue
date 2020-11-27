<template>
  <div class="twc-image-message">

    <!-- original ImageMessage
    <img :src="imageUrl" :alt="altText" @load="scrollChatUp"/>
     -->

    <!-- Thumbnail Image wrapped in a link -->
    <a v-if="!(thumbnailUrl && !imageUrl)">
      <img :src="thumbnailUrl" :alt="altText" @load="scrollChatUp" v-on:click = "zoomIn">
    </a>
    <a v-else>
      <img :src="thumbnailUrl" :alt="altText" @load="scrollChatUp">
    </a>

  </div>
</template>

<script>

import { EventBus, events } from '../../utils/event-bus.js';

export default {
  name: 'ImageMessage',
  data() {
      return{
        zoomedIn: false
      }
  },
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
      //used later as: "background-image: url('"+this.message.data.image_url+"')"
      return this.message.data.image_url;
    },
    altText() {
      return this.message.data.alt;
    },
  },
  methods: {
    zoomIn() {
      if(this.message.data.image_url) {
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
