<template>
  <div class="header">
    <img v-if="imageUrl" class="header__img" :src="imageUrl">
    <HeaderImagePlaceholder v-else class="header__img" />
    <div class="header__title">{{ title }}</div>
    <button class="header__close-button" @click="onClose">
      <XIcon class="header__close-icon" />
    </button>
  </div>
</template>

<script>
import XIcon from '../icons/x.vue';
import HeaderImagePlaceholder from '../icons/titleImage.vue';

export default {
  components: {
    XIcon,
    HeaderImagePlaceholder,
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
  background: var(--header-bg-color);
  min-height: 64px;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 10px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  color: #e1e1e1;
}

.header__img {
  border-radius: 100%;
  height: 32px;
  width: 32px;
}

.header__title {
  margin-left: 12px;
  color: #fff;
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
  color: var(--light-fg-color);
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
