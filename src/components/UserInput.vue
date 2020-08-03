<template>
  <div>
    <form class="twc-user-input" :class="{ active: inputActive }">
      <div
        ref="userInput"
        role="button"
        tabIndex="0"
        contentEditable="true"
        :placeholder="placeholder"
        class="twc-user-input__text"
        @focus="setInputActive(true)"
        @blur="setInputActive(false)"
        @keydown="handleReturnKey"
        v-debounce:250="userTyping" :debounce-events="['input']"
      ></div>
      <div class="twc-user-input__button">
        <SendIcon :on-click="_submitText" />
      </div>
    </form>
  </div>
</template>

<script>
import Vue from 'vue';
import vueDebounce from 'vue-debounce'
import SendIcon from '../icons/send.vue';
import { PARTICIPANT_USER } from '../utils/constants.js';
import { API_ON_INPUT_SUBMITTED, API_ON_USER_TYPING } from '../utils/api-function-names.js';
import { EventBus, events } from '../utils/event-bus.js';
import handleExtension from '../utils/handle-extension.js';
import basePayload from '../utils/base-payload.js';

Vue.use(vueDebounce)

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
    handleReturnKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this._submitText(event);
        event.preventDefault();
      }
    },
    userTyping() {
      // create payload object
      const payload = {"text" : this.$refs.userInput.textContent }
      // check if there is an extension that want to be notified about the user typing
      handleExtension(API_ON_USER_TYPING,payload);
    },
    async _submitText() {
      // create payload object
      const payload = basePayload();

      // add user input to base payload
      payload.text = this.$refs.userInput.textContent;

      // clear input field
      this.$refs.userInput.innerHTML = '';

      // check if there is an extension that want to intercept the user input
      await handleExtension(API_ON_INPUT_SUBMITTED,payload);

      // return if extension wants to handle submit itself
      if(payload.handledState.handled === true) {
        return
      }


      if (payload.text && payload.text.length > 0) {
        const text = payload.text
        this.onSubmit({
          author: PARTICIPANT_USER,
          type: 'text',
          data: { text },
        });
      }
    },
  },
};
</script>

<style scoped>
.twc-user-input {
  min-height: 55px;
  margin: 0px;
  position: relative;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  background-color: var(--user-input-bg-color, #f4f7f9);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.twc-user-input__text {
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
  cursor: text;
}

.twc-user-input__text:empty:before {
  content: attr(placeholder);
  display: block;
  filter: contrast(15%);
  outline: none;
}

/* fix placeholder issue on Edge browsers */
@supports (-ms-ime-align:auto) {
    [placeholder]:empty:focus::before {
      content: "";
      margin-top: 14px;
    }
}

/* fix placeholder issue on IE11 browsers */
@media all and (-ms-high-contrast:none) {
    [placeholder]:empty:focus::before {
      content: "";
      margin-bottom: 0px;
    }

   [placeholder]:empty.twc-user-input__text::before {
      height: 0px;
    }
}

.twc-user-input__button {
  width: 40px;
  max-height: 200px;
  margin-left: 2px;
  margin-right: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.twc-user-input.active {
  box-shadow: none;
  background-color: white;
  box-shadow: 0px -2px 10px 0px rgba(150, 165, 190, 0.2);
}

.twc-user-input__button label {
  position: relative;
  height: 24px;
  padding-left: 3px;
  cursor: pointer;
}

.twc-user-input__button label:hover path {
  fill: rgba(86, 88, 103, 1);
}

.twc-user-input__button input {
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
