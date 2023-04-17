<template>
  <div class="twc-youtube-video">
    <iframe
      :src="videoUrl"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'YoutubevideoMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'youtubevideo' &&
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
.twc-youtube-video {
  width: 100%;
  margin-right: 40px;
  min-width: 260px;
}
.twc-youtube-video iframe {
  width: 100%;
  max-height: 100%;
}
</style>