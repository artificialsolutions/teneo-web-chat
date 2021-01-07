<template>
  <div>
    <button
      id="twc-launchbutton"
      class="twc-launch-button"
      :class="{ 'twc-opened': isOpen, 'twc-closed': !isOpen && !isMinimized, 'twc-minimized': isMinimized, 'twc-has-callout' : isCalloutVisible}"
      @click.prevent="isOpen ? close() : open()"
      @keydown="handleReturnSpaceKeys"
      tabindex="0"
      :aria-roledescription="$t('message.launchbutton_aria_roledescription')"
      :aria-label="$t('message.launchbutton_aria_label')"
    >
      <img v-if="launchIconUrl" class="twc-launch-button__open-icon" :src="launchIconUrl" aria-hidden="true" alt=""/>
      <BubbleIcon v-else class="twc-launch-button__open-icon" id="default-launch-button-icon" aria-hidden="true"/>
    </button>

    <div v-if="isCalloutVisible" class="twc-callout">
      <div class="twc-callout-button__close" @click="closeCallOut()"><CloseIcon class="twc-callout-button__close-icon" aria-hidden="true"/></div>
      <div class="twc-callout-message-box">
        <p class="twc-callout-message-text"  @click="open()" v-html="sanitizedHtmlText"></p>
      </div>
    </div>
  </div>


</template>
<script>
import BubbleIcon from '../icons/bubble.vue';
import CloseIcon from '../icons/x.vue';
import { EventBus, events } from '../utils/event-bus.js';
import keyIsSpaceOrEnter from '../utils/is-space-or-enter.js';
import { mapState } from 'vuex';
import { store } from '../store/store.js';
import sanitizeHtml from '../utils/sanitize-html.js';

export default {
  components: {
    BubbleIcon,
    CloseIcon
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
    sanitizedHtmlText() {
      return sanitizeHtml(this.calloutText);
    },
  },
  data() {
    return {
      isCalloutVisible: false,
      calloutText: ''
    };
  },
  methods: {
    handleReturnSpaceKeys(event) {
      if (keyIsSpaceOrEnter(event)) {
        this.open();
        event.preventDefault();
      }
    },
    closeCallOut() {
      this.isCalloutVisible = false;
    }
  },
  mounted() {
    EventBus.$on(events.SHOW_CALLOUT, (payload) => {
      this.isCalloutVisible = true;
      this.calloutText = payload;
      store.commit('calloutVisibility', this.isCalloutVisible);
      store.commit('calloutText', payload)
    });
    EventBus.$on(events.HIDE_CALLOUT, () => {
      this.isCalloutVisible = false;
      store.commit('calloutVisibility', false);
    });
  }
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
  z-index: 2700; /* sit on top */
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
  box-shadow: 0 0px 27px 1.5px rgba(0, 0, 0, 0.2) !important;
}

.twc-launch-button:hover .twc-launch-button__open-icon, .twc-launch-button:focus .twc-launch-button__open-icon {
  transform: scale(1.1);
}

.twc-launch-button.twc-has-callout {
  box-sizing: border-box;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
}

.twc-callout {
  position: fixed;
  right: 25px;
  bottom: 98px;
  max-width: 220px;
  display: flex;
  align-items: right;
  flex-direction: column;
}

.twc-callout-message-box {
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  background-color: var(--callout-bg-color, #ffffff);
  transition: 0.3s ease-in-out;
  border-radius: 10px;
  cursor: pointer;
  border-bottom-right-radius: 0px;
  -webkit-animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: twc-fade-in 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

.twc-callout-message-text {
  color: var(--callout-fg-color, #263238);
  font-family: var(--primary-font, 'Helvetica Neue', Helvetica, Arial, sans-serif);
  padding: 16px;
  border-radius: 10px;
  font-size: 0.9em;
  line-height: 1.4;
  -webkit-font-smoothing: subpixel-antialiased;
  margin: 0;
}

.twc-callout-button__close {
  margin-left: auto;
  margin-right: -6px;
  width: 32px;
  height: 32px;
  visibility: hidden;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s linear;
}

.twc-callout-button__close-icon {
  color: var(--callout-close-button-fg-color, #6c757d);
}

.twc-callout:hover .twc-callout-button__close {
  opacity: 1;
  visibility: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}

@-webkit-keyframes twc-fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes twc-fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

</style>
