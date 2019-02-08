<template>
  <div>
    <form class="user-input" :class="{ active: inputActive }">
      <div
        ref="userInput"
        role="button"
        tabIndex="0"
        contentEditable="true"
        :placeholder="placeholder"
        class="user-input--text"
        @focus="setInputActive(true)"
        @blur="setInputActive(false)"
        @keydown="handleKey"
      ></div>
      <div class="user-input--buttons">
        <div class="user-input--button">
          <SendIcon :on-click="_submitText" />
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import SendIcon from '../icons/SendIcon.vue';
import { PARTICIPANT_USER } from '../utils/constants.js';

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
      default: 'Write a reply',
    },
  },
  data() {
    return {
      inputActive: false,
    };
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
  background-color: #f4f7f9;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.user-input--text {
  width: 300px;
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

.user-input--text:empty:before {
  content: attr(placeholder);
  display: block;
  filter: contrast(15%);
  outline: none;
}

.user-input--buttons {
  height: 100%;
  display: flex;
}

.user-input--button:first-of-type {
  width: 40px;
}

.user-input--button {
  width: 30px;
  height: 55px;
  margin-left: 2px;
  margin-right: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-input.active {
  box-shadow: none;
  background-color: white;
  box-shadow: 0px -5px 20px 0px rgba(150, 165, 190, 0.2);
}

.user-input--button label {
  position: relative;
  height: 24px;
  padding-left: 3px;
  cursor: pointer;
}

.user-input--button label:hover path {
  fill: rgba(86, 88, 103, 1);
}

.user-input--button input {
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
