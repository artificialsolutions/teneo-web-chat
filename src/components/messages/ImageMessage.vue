<template>
  <div class="image-message">
    <img :src="imageUrl" />
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
  },
};
</script>

<style scoped>
.image-message img {
  margin: 12px;
  max-width: 80%;
}
</style>
