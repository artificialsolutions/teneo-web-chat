<template>
  <vue-plyr class="twc_vimeovideo">
      <div class="plyr__video-embed">
        <iframe
          :src="videoUrl"
          allowfullscreen allowtransparency allow="">
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

<style>
.twc_vimeovideo {
  width: 90%;
  min-width: 300px;
}
</style>