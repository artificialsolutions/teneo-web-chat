<template>
  <div class="header">
    <img v-if="titleIconUrl" class="header__img" :src="titleIconUrl" />
    <BubbleIcon v-else class="header__img" />
    <div class="header__title">{{ title }}</div>
    <button class="header__minimize-button" @click="onMinimize">
      <MinimizeIcon class="header__minimize-icon" />
    </button>
    <button v-if="showCloseButton" class="header__close-button" @click="onClose">
      <XIcon class="header__close-icon" />
    </button>
  </div>
</template>

<script>
import XIcon from '../icons/x.vue';
import MinimizeIcon from '../icons/minimize.vue';
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
        'showCloseButton'
    ]),
  }
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
  margin-left: 0px;
}

.header__close-icon {
  height: 32px;
  width: 32px;
  color: var(--header-fg-color, #ffffff);
}

.header__close-icon {
  stroke-width: 1;
}

.header__minimize-button {
  outline: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

.header__minimize-icon {
  height: 32px;
  width: 32px;
  color: var(--header-fg-color, #ffffff);
}

.header__minimize-icon {
  stroke-width: 1;
}

@media (max-width: 450px) {
  .header {
    border-radius: 0px;
  }
}
</style>
