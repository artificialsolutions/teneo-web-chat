<template>
  <div class="twc-header">
    <img v-if="titleIconUrl" class="twc-header__img" :src="titleIconUrl" aria-hidden="true"/>
    <BubbleIcon v-else class="twc-header__img" id="default-header-icon" aria-hidden="true"/>
    <div v-if="title" class="twc-header__title">{{ title }}</div>
    <div v-else class="twc-header__title">{{getDefaultTitle}}</div>
    <button class="twc-header__minimize-button" @click="onMinimize" id="header-minimize-button" aria-label="Minimize chat window" accessKey="/">
      <img v-if="minimizeIconUrl" class="twc-header__minimize-icon" :src="minimizeIconUrl" aria-hidden="true"/>
      <MinimizeIcon v-else class="twc-header__minimize-icon" aria-hidden="true"/>
    </button>
    <button v-if="showCloseButton" class="twc-header__close-button" @click="onClose" id="header-close-button" aria-label="Close chat window" accessKey=".">
      <img v-if="closeIconUrl" class="twc-header__close-icon" :src="closeIconUrl" aria-hidden="true"/>
      <XIcon v-else class="twc-header__close-icon" aria-hidden="true"/>
    </button>
  </div>
</template>

<script>
import XIcon from '../icons/x.vue';
import MinimizeIcon from '../icons/minimize-caret.vue';
import BubbleIcon from '../icons/bubble.vue';
import * as constants from '../utils/constants.js';
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
  },
  methods: {
    getDefaultTitle(){
        return constants.DEFAULT_TITLE;
      }
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
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

.twc-header__minimize-button:active, .twc-header__close-button:active { 
  outline: none;
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
