<template>
<div class="twc-wrap" :class="messageSource">
    
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="twc-dateline" :class="messageSource" v-if="dateline" v-html="dateline"></p>
    <div class="twc-textwrap" :class="messageSource">
      <div v-if="avatarUrl" class="twc-avatar" :class="messageSource"><img :src="avatarUrl"></div>
      <div class="twc-typing-message" :class="messageSource">        
        <div class="twc-spinner">
          <div class="twc-bounce1"></div>
          <div class="twc-bounce2"></div>
          <div class="twc-bounce3"></div>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
      </div>
    </div>
    
</div>
</template>

<script>
import { PARTICIPANT_BOT } from '../../utils/constants.js';
import isValidUrl from '../../utils/validate-url';
import { mapState } from 'vuex';
import Vue from 'vue';
const tmpVue = new Vue();

export default {
  name: 'TypingMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'typing' &&
          message.author
        );
      },
    },
  },
  computed: {
    messageSource() {
      return this.message.author;
    },
    dateline() {
      if (this.message.data && this.message.data.dateline) {
        return sanitizeHtml(this.message.data.dateline)
      }
    },
    isBot() {
      return this.message.author === PARTICIPANT_BOT;
    },
    avatarUrl() {
      if (this.message.data && this.message.data.avatarUrl && isValidUrl(this.message.data.avatarUrl)) {
        return this.message.data.avatarUrl
      } else if (this.message.author == 'bot' && tmpVue.$store.getters.botAvatarUrl) {
          return tmpVue.$store.getters.botAvatarUrl
      } else if (this.message.author == 'agent' && tmpVue.$store.getters.agentAvatarUrl) {
          return tmpVue.$store.getters.agentAvatarUrl
      } else if (this.message.author == 'user' && tmpVue.$store.getters.userAvatarUrl) {
          return tmpVue.$store.getters.userAvatarUrl
      }
    },
    ...mapState([
        'botAvatarUrl',
        'userAvatarUrl',
        'agentAvatarUrl',
    ]),
  },
};
</script>

<style>
.twc-typing-message .twc-spinner {
  margin: 4px 0 8px 0;
  width: 26px;
  text-align: center;
}

.twc-typing-message  .twc-spinner > div {
  width: 6px;
  height: 6px;
  background-color: var(--light-fg-color, #6c757d);
  border-radius: 100%;
  display: inline-block;
  -webkit-animation: twc-sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: twc-sk-bouncedelay 1.4s infinite ease-in-out both;
}

.twc-typing-message.bot  .twc-spinner > div {
  background-color: var(--secondary-color, #6c757d);
}

.twc-typing-message .twc-spinner .twc-bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.twc-typing-message .twc-spinner .twc-bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes twc-sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes twc-sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}

.twc-wrap.user {
  max-width: calc(100% - 84px);
}

_:-ms-fullscreen, :root .twc-wrap.bot {
  max-width: calc(100% - 1px);
}
.twc-dateline {
  font-weight: 400;
  font-size: 0.7em;
  padding: 0;
  margin-bottom: 0.25rem;
  margin-top: 0rem;
  -webkit-font-smoothing: subpixel-antialiased;
  color: var(--secondary-color, #6c757d);
}
.twc-dateline.user {
  text-align: right;
}
.twc-typing-message {
  padding: 6px 18px;
  border-radius: 10px;
  font-size: 0.9em;
  line-height: 1.4;
}
.twc-typing-message.bot {
  background-color: var(--bot-message-bg-color, #eceff1);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.twc-typing-message.agent {
  background-color: var(--agent-message-bg-color, #47b2fd);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.twc-typing-message.user {
  background: var(--user-message-bg-color, #4e8cff);
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

</style>
