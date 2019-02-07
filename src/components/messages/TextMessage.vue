<template>
  <div class="text-message" :class="messageSource">
    <p>{{ messageText }}</p>
  </div>
</template>

<script>
export default {
  name: 'TextMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'text' &&
          message.data &&
          message.data.text
        );
      },
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
.text-message {
  padding: 6px 18px;
  border-radius: 6px;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
}

.text-message.user {
  background: #4e8cff;
  color: #ffffff;
  max-width: calc(100% - 120px);
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

.text-message.bot {
  color: #263238;
  background-color: #f4f7f9;
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}
</style>
