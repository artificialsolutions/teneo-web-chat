<template>
  <div class="twc_vimeovideo">
        <iframe
          :src="videoUrl"
          frameborder="0"
          allowfullscreen allowtransparency allow="">
        </iframe>
  </div>
</template>

<script>
export default {
  name: 'VimeoMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'vimeo' &&
          message.data &&
          message.data.video_url
        );
      },
    },
  },
  computed: {
    videoUrl() {
      return this.message.data.video_url;
    },
  },
};
</script>

<style>
.twc_vimeovideo {
  width: 90%;
  min-width: 300px;
}
</style>