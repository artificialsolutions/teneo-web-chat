<template>
<vue-plyr>
    <div class="plyr__video-embed">
      <iframe
        :src="videoUrl"
        allowfullscreen allowtransparency autoplay allow="">
      </iframe>
    </div>
  </vue-plyr>
  
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