<template>
  <div class="twc-file-video">
    <video controls="1">
      <source :src="videoUrl" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  name: 'FilevideoMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'filevideo' &&
          message.data &&
          message.data.video_url
        );
      },
    },
  },
  computed: {
    videoUrl() {
      return this.message.data.video_url + '#t=0.1';
    },
  },
};
</script>

<style>
.twc-file-video {
  width: 100%;
  margin-right: 40px;
  min-width: 260px;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  border: none;
  position: relative;
  
  display: flex;
}
.twc-file-video video {
  width: 100%;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  margin: 10px;
  margin-left:0px;
  object-fit: cover;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
}
</style>