<template>
  <button
    class="twc-launch-button"
    :class="{ 'twc-opened': isOpen, 'twc-closed': !isOpen && !isMinimized, 'twc-minimized': isMinimized}"
    @click.prevent="isOpen ? close() : open()"
    @keydown="handleReturnSpaceKeys"
    tabindex="0"
    :aria-roledescription="$t('message.launchbutton_aria_roledescription')"
    :aria-label="$t('message.launchbutton_aria_label')"
  >
    <img v-if="launchIconUrl" class="twc-launch-button__open-icon" :src="launchIconUrl" aria-hidden="true" alt=""/>
    <BubbleIcon v-else class="twc-launch-button__open-icon" id="default-launch-button-icon" aria-hidden="true"/>
  </button>
</template>
<script>
import BubbleIcon from '../icons/bubble.vue';
import keyIsSpaceOrEnter from '../utils/is-space-or-enter.js';
import { mapState } from 'vuex';

export default {
  components: {
    BubbleIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    isMinimized: {
      type: Boolean,
      required: false,
    },
    open: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState([
        'launchIconUrl',
    ]),
  },
  methods: {
    handleReturnSpaceKeys(event) {
      if (keyIsSpaceOrEnter(event)) {
        this.open();
        event.preventDefault();
      }
    },
  },
};
</script>
<style scoped>
.twc-launch-button {
  background-color: var(--launch-button-bg-color, #4e8cff);
  width: 60px;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  right: 25px;
  bottom: 25px;
  border-radius: 50%;
  border: none;
  box-shadow: none;
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

.twc-launch-button__open-icon {
  height: 26px;
  width: 26px;
  color: var(--launchicon-fg-color, #ffffff);
  transform-origin: 50% 50%;
  transition: transform .4s, filter .5s ease-out;
}
.twc-launch-button:active {
  outline: none;
}

.twc-launch-button:hover {
  box-shadow: 0 0px 27px 1.5px rgba(0, 0, 0, 0.2);
}

.twc-launch-button:hover .twc-launch-button__open-icon, .twc-launch-button:focus .twc-launch-button__open-icon {
  transform: scale(1.1);
}

</style>
