<template>
  <div class="twc-header">
    <img v-if="titleIconUrl" class="twc-header__img" :src="titleIconUrl" />
    <BubbleIcon v-else class="twc-header__img" />
    <div class="twc-header__title">{{ title }}</div>
    <button class="twc-header__minimize-button" @click="onMinimize">
      <img v-if="minimizeIconUrl" class="twc-header__img" :src="minimizeIconUrl" />
      <MinimizeIcon class="twc-header__minimize-icon" />
    </button>
    <button v-if="showCloseButton" class="twc-header__close-button" @click="onClose">
      <img v-if="closeIconUrl" class="twc-header__img" :src="closeIconUrl" />
      <XIcon v-else class="twc-header__close-icon" />
    </button>
  </div>
</template>

<script>
import XIcon from '../icons/x.vue';
import MinimizeIcon from '../icons/minimize-caret.vue';
import BubbleIcon from '../icons/bubble.vue';
import { mapState } from 'vuex';

export default {
  components: {
    XIcon,
    MinimizeIcon,
    BubbleIcon,
  },
  props: {
    onClose: {
      type: Function,
      required: true,
    },
    onMinimize: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState([
        'title',
        'titleIconUrl',
        'showCloseButton',
        'minimizeIconUrl',
        'closeIconUrl',
    ]),
  }
};
</script>

<style scoped>
.twc-header {
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

.twc-header__img {
  height: 24px;
  width: 24px;
  margin: 0 8px 0 8px;
  color: var(--header-fg-color, #ffffff);
}

.twc-header__title {
  color: var(--header-fg-color, #ffffff);
}

.twc-header__close-button {
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 0px;
}

.twc-header__close-icon {
  height: 32px;
  width: 32px;
  color: var(--header-fg-color, #ffffff);
  stroke-width: 1;
}

.twc-header__minimize-button {
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

.twc-header__minimize-icon {
  height: 32px;
  width: 32px;
  color: var(--header-fg-color, #ffffff);
    stroke-width: 1;
}

@media (max-width: 450px) {
  .twc-header {
    border-radius: 0px;
  }
}
</style>
