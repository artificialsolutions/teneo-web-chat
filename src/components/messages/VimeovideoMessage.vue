<template>
  <div class="twc-vimeo-video">
        <iframe
          :src="videoUrl"
          frameborder="0"
          allowfullscreen allowtransparency allow="">
        </iframe>
  </div>
</template>

<script>
export default {
  name: 'VimeovideoMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'vimeovideo' &&
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

<style scoped>
.twc-vimeo-video {
  width: 260px;
  height: 150px;
  margin-right: 40px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  background-color: transparent;
  border-radius: 5px;
  border-bottom-left-radius: 0%;
}

iframe {
  background: none;
  width: 260px;
  height: 150px;
  border-radius: 5px;
  border-bottom-left-radius: 0%;
}
</style>