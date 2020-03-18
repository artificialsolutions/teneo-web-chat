<template>
  <div class="image-message">
    <img :src="imageUrl" :alt="altText"/>
  </div>
</template>

<script>
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
};
</script>

<style>
.image-message img {
  max-width: 100%;
  max-height: 200px;
}
</style>
