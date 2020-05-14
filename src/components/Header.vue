<template>
  <div class="header">
    <img v-if="imageUrl" class="header__img" :src="imageUrl" />
    <BubbleIcon v-else class="header__img" />
    <div class="header__title">{{ title }}</div>
    <button class="header__close-button" @click="onClose">
      <XIcon class="header__close-icon" />
    </button>
  </div>
</template>

<script>
import XIcon from '../icons/x.vue';
import BubbleIcon from '../icons/bubble.vue';

export default {
  components: {
    XIcon,
    BubbleIcon,
  },
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.header {
  background: var(--header-bg-color, #4e8cff);
  min-height: 64px;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 10px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.header__img {
  height: 24px;
  width: 24px;
  margin: 0 8px 0 8px;
  color: var(--header-fg-color, #ffffff);
}

.header__title {
  color: var(--header-fg-color, #ffffff);
}

.header__close-button {
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

.header__close-icon {
  height: 32px;
  width: 32px;
  color: var(--header-fg-color, #ffffff);
}

.header__close-icon {
  stroke-width: 1;
}

@media (max-width: 450px) {
  .header {
    border-radius: 0px;
  }
}
</style>
