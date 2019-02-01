<template>
  <div class="message">
    <div class="message__content" :class="messageSource">
      <div class="message__text">
        <p>{{ messageText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    chatImageUrl: {
      type: String,
    },
    authorName: {
      type: String,
    },
  },
  computed: {
    messageText() {
      return this.message.data.text;
    },
    messageSource() {
      return this.message.author;
    },
  },
};
</script>
<style scoped>
.message {
  width: 300px;
  margin: auto;
  padding-bottom: 10px;
  display: flex;
}

.message__content {
  width: 100%;
  display: flex;
}

.message__content.user {
  justify-content: flex-end;
}

.message__content.system {
  justify-content: flex-start;
}

.message__text {
  padding: 6px 18px;
  border-radius: 6px;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
}

.message__content.user .message__text {
  background: #4e8cff;
  color: #ffffff;
  max-width: calc(100% - 120px);
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

.message__content.system .message__text {
  color: #263238;
  background-color: #f4f7f9;
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}
</style>
