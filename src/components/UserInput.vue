<template>
  <div>
    <form class="twc-user-input" :class="{ 'twc-active': inputActive, 'twc-disabled': inputDisabled }">
      <div
        id="twc-user-input-field"
        ref="userInput"
        role="textbox"
        tabIndex="0"
        aria-label="Enter the text to send to the bot"
        :contentEditable="contentIsEditable"
        :placeholder="placeholder"
        class="twc-user-input__text"
        @focus="setInputActive(true)"
        @blur="setInputActive(false)"
        @keydown="handleReturnKey"
        v-debounce:250="userTyping" :debounce-events="['input']"
        :aria-disabled="inputDisabled"
        :disabled="inputDisabled ? true : false"
        aria-label="Input field"
      ></div>
      <div class="twc-user-input__button">
        <button role="button" tabindex="0" aria-label="Send text" class="twc-user-input__send-icon-wrapper" @click.prevent="_submitText" :aria-disabled="inputDisabled" :disabled="inputDisabled ? true : false">
          <img v-if="sendIconUrl" class="twc-user-input__send-icon" :src="sendIconUrl" aria-hidden="true"/>
          <SendIcon v-else class="twc-user-input__send-icon" aria-hidden="true"/>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from 'vue';
import vueDebounce from 'vue-debounce'
import SendIcon from '../icons/send.vue';
import { PARTICIPANT_USER } from '../utils/constants.js';
import { API_ON_INPUT_SUBMITTED, API_ON_USER_TYPING, API_ON_SEND_BUTTON_CLICK } from '../utils/api-function-names.js';
import { EventBus, events } from '../utils/event-bus.js';
import handleExtension from '../utils/handle-extension.js';
import basePayload from '../utils/base-payload.js';
import detectMobile from '../utils/detect-mobile.js';
import { mapState } from 'vuex';

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
  computed: {
    ...mapState([
        'sendIconUrl',
    ]),
  },
  data() {
    return {
      inputActive: false,
      contentIsEditable: true,
      inputDisabled: false,
    };
  },
  mounted() {
    EventBus.$on(events.MESSAGE_SENT, () => {
      if(this.$refs.userInput){ 
          this.$refs.userInput.focus();
      }
    });

    EventBus.$on(events.DISABLE_INPUT, () => {
          this.setInputActive(false);
          this.setContentEditable(false);
          this.setInputDisabled(true);
          
          if (document.getElementById("twc-user-input-field")) {
            document.getElementById("twc-user-input-field").blur();
          }
    });

    EventBus.$on(events.ENABLE_INPUT, () => {
          this.setContentEditable(true);
          this.setInputDisabled(false);
          this.setInputActive(true);
          
          if (document.getElementById("twc-user-input-field")) {
            document.getElementById("twc-user-input-field").focus();
          }
    });

    //Detect changes and focus and emit event. This will be listened by ChatWindow to adapt to iOS Safari
    const userInput = document.getElementById("twc-user-input-field");
    if(userInput){
      userInput.addEventListener('focus', (event) => {
        EventBus.$emit(events.USER_INPUT_FOCUS_CHANGED, true);
      });
      userInput.addEventListener('blur', (event) => {
        EventBus.$emit(events.USER_INPUT_FOCUS_CHANGED, false);
      });
    }

    
    // don't give user input focus on mobile devices, keyboard blocks the view too much
    if (!detectMobile()) {
      this.$refs.userInput.focus();
    }
  },
  methods: {
    setInputActive(onoff) {
      this.inputActive = onoff;
      if(onoff === true){
        EventBus.$emit(events.SCROLL_CHAT_DOWN);
      }
    },
    setContentEditable(onoff) {
      this.contentIsEditable = onoff;
    },
    setInputDisabled(onoff) {
      this.inputDisabled = onoff;
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
    async sendButtonClicked() {
      console.log("Send button clicked yes")
      const payload = basePayload();
      await handleExtension(API_ON_SEND_BUTTON_CLICK,payload);
      // return if extension wants to handle submit itself
      if(payload.handledState.handled === true) {
        console.log("payload.handledState true", payload.handledState)
        return false
      } else {
        console.log("payload.handledState", payload.handledState)
        this._submitText()
      }
    },
    async _submitText() {
      // create payload object
      const payload = basePayload();

      // add user input to base payload
      payload.text = this.$refs.userInput.textContent;

      // clear input field
      this.$refs.userInput.innerHTML = '';

      // check if there is an extension that want to intercept the user input
      // but only if the user actually submitted something
      if (payload.text && payload.text.trim().length > 0) {
        await handleExtension(API_ON_INPUT_SUBMITTED,payload);
      }
      
      // return if extension wants to handle submit itself
      if(payload.handledState.handled === true) {
        return
      }


      if (payload.text && payload.text.trim().length > 0) {
        const text = payload.text
        
        var parameters = {}
        if(payload.parameters){
          parameters = payload.parameters
        }

        this.onSubmit({
          author: PARTICIPANT_USER,
          type: 'text',
          data: { text, parameters }
        });

        
      }
      
      // don't give user input focus on mobile devices, keyboard blocks the view too much
      if (!detectMobile()) {
        this.$refs.userInput.focus();
      }
    },
  },
};
</script>

<style scoped>
.sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap; /* added line */
      border: 0;
}
</style>

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
  pointer-events:initial;
}

.twc-user-input.twc-disabled {
  pointer-events:none;
}

.twc-user-input.twc-disabled .twc-user-input__button, .twc-user-input.twc-disabled .twc-user-input__text, .twc-user-input.twc-disabled .twc-user-input__send-icon {
  filter: grayscale(100%);
  opacity: 0.4;
}

.twc-user-input__text {
  width: 320px;
  resize: none;
  border: none;
  outline: none;
  border-bottom-left-radius: 10px;
  box-sizing: border-box;
  padding: 18px;
  font-size: 0.95em;
  font-weight: 400;
  line-height: 1.33;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--user-input-fg-color, #565867);
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

.twc-user-input.twc-active {
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

.twc-user-input__send-icon-wrapper {
  background: none;
  border: none;
  padding: 0px;
  margin: 0 5px 0 0;
  /* outline: none; */
  color: var(--sendicon-fg-color);
}

.twc-user-input__send-icon-wrapper:active {
  outline: none;
}

.twc-user-input__send-icon {
  height: 20px;
  width: 20px;
  cursor: pointer;
  align-self: center;
}

.twc-user-input__send-icon:hover path {
  filter: contrast(15%);
}
</style>
