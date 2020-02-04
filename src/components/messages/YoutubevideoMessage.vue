<template>
  <div class="video-message">
    <iframe :src="videoUrl" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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