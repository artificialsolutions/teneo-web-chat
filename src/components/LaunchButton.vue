<template>
  <div
    class="twc-launch-button"
    :class="{ opened: isOpen, closed: !isOpen }"
    @click.prevent="isOpen ? close() : open()"
  >
    <BubbleIcon v-if="!isOpen" class="twc-launch-button__open-icon" />
    <!-- <MinmizeArrows v-if="isOpen" class="launch-button__close-icon" /> -->
  </div>
</template>
<script>
import BubbleIcon from '../icons/bubble.vue';
// import XIcon from '../icons/x.vue';

export default {
  components: {
    BubbleIcon,
    // XIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    open: {
      type: Function,
      required: true,
    },
  },
};
</script>
<style scoped>
.twc-launch-button {
  background-color: var(--header-bg-color, #4e8cff);
  width: 60px;
  height: 60px;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  right: 25px;
  bottom: 25px;
  border-radius: 50%;
  box-shadow: none;
  transition: box-shadow 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.twc-launch-button__open-icon {
  height: 26px;
  width: 26px;
  color: var(--light-fg-color, #ffffff);
}

.twc-launch-button__close-icon {
  stroke-width: 1;
  height: 32px;
  width: 32px;
  color: var(--light-fg-color, #ffffff);
}

.twc-launch-button:hover {
  box-shadow: 0 0px 27px 1.5px rgba(0, 0, 0, 0.2);
}

@media (max-width: 450px) {
  .twc-launch-button.opened {
    display: none;
  }
}
</style>
