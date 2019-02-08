<template>
  <div class="image-message">
    <img :src="imageUrl" />
    <p v-if="messageText">{{ messageText }}</p>
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
          message.data.payload &&
          message.data.payload.url
        );
      },
    },
  },
  computed: {
    imageUrl() {
      return this.message.data.payload.url;
    },
    messageText() {
      return this.message.data.text;
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
