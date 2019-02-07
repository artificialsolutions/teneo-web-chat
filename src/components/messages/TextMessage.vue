<template>
  <div class="text-message">
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
  },
};
</script>

<style scoped></style>
