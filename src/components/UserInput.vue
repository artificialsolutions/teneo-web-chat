<template>
  <div>
    <form class="user-input" :class="{ active: inputActive }">
      <div
        ref="userInput"
        role="button"
        tabIndex="0"
        contentEditable="true"
        :placeholder="placeholder"
        class="user-input__text"
        @focus="setInputActive(true)"
        @blur="setInputActive(false)"
        @keydown="handleKey"
      ></div>
      <div class="user-input__button">
        <SendIcon :on-click="_submitText" />
      </div>
    </form>
  </div>
</template>

<script>
import SendIcon from '../icons/send.vue';
import { PARTICIPANT_USER } from '../utils/constants.js';
import { EventBus, events } from '../utils/event-bus.js';

export default {
  components: {
    SendIcon,
  },
  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Please type here...',
    },
  },
  data() {
    return {
      inputActive: false,
    };
  },
  mounted() {
    EventBus.$on(events.MESSAGE_SENT, () => {
      if(this.$refs.userInput){ 
          this.$refs.userInput.focus();
      }
    });

    this.$refs.userInput.focus();
  },
  methods: {
    setInputActive(onoff) {
      this.inputActive = onoff;
    },
    handleKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this._submitText(event);
        event.preventDefault();
      }
    },
    _submitText() {
      const text = this.$refs.userInput.textContent;

      if (text && text.length > 0) {
        this.onSubmit({
          author: PARTICIPANT_USER,
          type: 'text',
          data: { text },
        });
        this.$refs.userInput.innerHTML = '';
      }
    },
  },
};
</script>

<style scoped>
.user-input {
  min-height: 55px;
  margin: 0px;
  position: relative;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  background-color: var(--user-input-bg-color);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.user-input__text {
  width: 320px;
  resize: none;
  border: none;
  outline: none;
  border-bottom-left-radius: 10px;
  box-sizing: border-box;
  padding: 18px;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.33;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #565867;
  -webkit-font-smoothing: antialiased;
  max-height: 200px;
  overflow: scroll;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.user-input__text:empty:before {
  content: attr(placeholder);
  display: block;
  filter: contrast(15%);
  outline: none;
}

.user-input__button {
  width: 40px;
  max-height: 200px;
  margin-left: 2px;
  margin-right: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-input.active {
  box-shadow: none;
  background-color: white;
  box-shadow: 0px -2px 10px 0px rgba(150, 165, 190, 0.2);
}

.user-input__button label {
  position: relative;
  height: 24px;
  padding-left: 3px;
  cursor: pointer;
}

.user-input__button label:hover path {
  fill: rgba(86, 88, 103, 1);
}

.user-input__button input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 99999;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  overflow: hidden;
}
</style>
