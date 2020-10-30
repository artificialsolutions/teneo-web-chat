<template>
  <div>
    <form class="twc-user-input" :class="{ 'twc-active': inputActive, 'twc-disabled': inputDisabled }">
      <textarea 
        rows="1" 
        class="twc-user-input__text" 
        id="twc-user-input-field"
        ref="userInput"
        role="textbox"
        tabIndex="0"
        aria-label="Message input field"
        :placeholder="placeholder"
        @focus="setInputActive(true)"
        @blur="setInputActive(false)"
        @keydown="handleReturnKey"
        @input="auto_height"
        v-debounce:250="userTyping" :debounce-events="['input']"
        :aria-disabled="inputDisabled"
        :disabled="inputDisabled ? true : false"
      ></textarea>
      <div class="twc-user-input__button">
        <button role="button" tabindex="0" aria-label="Send message" title="Send message" class="twc-user-input__send-icon-wrapper" @click.prevent="" @click="sendButtonClicked()" :aria-disabled="inputDisabled" :disabled="inputDisabled ? true : false">
          <img v-if="sendIconUrl" class="twc-user-input__send-icon" :src="sendIconUrl" aria-hidden="true" alt=""/>
          <SendIcon v-else class="twc-user-input__send-icon" aria-hidden="true"/>
        </button>
      </div>
    </form>
    <a v-if="isMobile()" href="#1" id="twc-focus-fix" aria-hidden="true"></a>
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
          this.setInputDisabled(true);
          
          if (document.getElementById("twc-user-input-field")) {
            document.getElementById("twc-user-input-field").blur();
          }
    });

    EventBus.$on(events.ENABLE_INPUT, () => {
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

    
    // give user input focus on on desktop
    if (!detectMobile()) {
      this.$refs.userInput.focus();
    } else {
      // if user gives input field focus without having first interacted with the chatwindow
      // the chat window will shrink down and the keyboard will overlap the chat window 
      // this is solved by giving a non visible dummy element focus as soon as the chat window loads
      // it also prevents the keyboard from taking up too much space on other devices
      const dummyFocusElement = document.getElementById("twc-focus-fix");
      dummyFocusElement.focus();
    }
  },
  methods: {
    setInputActive(onoff) {
      this.inputActive = onoff;
      if(onoff === true){
        EventBus.$emit(events.SCROLL_CHAT_DOWN);
      }
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
      const payload = {"text" : this.$refs.userInput.value }
      // check if there is an extension that want to be notified about the user typing
      handleExtension(API_ON_USER_TYPING,payload);
    },
    isMobile () {
      return detectMobile();
    },
    async sendButtonClicked() {

      const payload = basePayload();

      await handleExtension(API_ON_SEND_BUTTON_CLICK,payload);

      // return if extension wants to handle submit itself
      if(payload.handledState.handled === true) {
        return
      }
      // call submit function
      this._submitText()
    },
    async _submitText() {
      // create payload object
      const payload = basePayload();

      // add user input to base payload
      payload.text = this.$refs.userInput.value;

      // clear input field
      this.$refs.userInput.value = '';

      // restore height of input box
      this.auto_height();

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
    auto_height() {
      const userInput = document.getElementById("twc-user-input-field");
      userInput.style.height = "1px";
      userInput.style.height = (userInput.scrollHeight)+"px";
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
  pointer-events:initial;
}

#twc-focus-fix {
  outline: none;
  position: absolute;
  margin-left: -9999;
}

.twc-user-input.twc-disabled {
  pointer-events:none;
}

.twc-user-input.twc-disabled .twc-user-input__button, .twc-user-input.twc-disabled .twc-user-input__text, .twc-user-input.twc-disabled .twc-user-input__send-icon {
  filter: grayscale(100%);
  opacity: 0.4;
}

.twc-user-input__text {
  width: 100%;
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
  background-color: transparent;
  -webkit-font-smoothing: antialiased;
  max-height: 100px;
  overflow: scroll;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  font-family: var(--primary-font, Arial, Helvetica, Sans-serif);
}


.twc-user-input__text:empty:before {
  content: attr(placeholder);
  display: block;
  /* filter: contrast(50%); */
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
  width: 44px;
  max-height: 100px;
  margin-left: 2px;
  margin-right: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.twc-user-input.twc-active {
  box-shadow: none;
  background-color: var(--light-fg-color, #ffffff);
  box-shadow: 0px -2px 10px 0px rgba(150, 165, 190, 0.2);
}


.twc-user-input__send-icon-wrapper {
  background: none;
  border: none;
  padding: 0px;
  color: var(--sendicon-fg-color);
  width: 44px;
  height: 44px;
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
</style>
