<template>
  <div class="twc-audio-message">
    <audio controls>
      <source :src="audioUrl"/>
    </audio>
  </div>
</template>

<script>
export default {
  name: 'AudioMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'audio' &&
          message.data &&
          message.data.audio_url
        );
      },
    },
  },
  computed: {
    audioUrl() {
      return this.message.data.audio_url;
    },
    isAudio() {
      return this.message.data.audio_url.endsWith('.mp3');
    }
  },
};
</script>

<style>
.twc-audio-message {
  width: 100%;
  margin-right: 40px;
}
.twc-audio-message audio {
  width: 100%;
  outline: none;
}
</style>
