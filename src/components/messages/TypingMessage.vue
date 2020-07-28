<template>
<div class="twc-wrap" :class="messageSource">
    
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="twc-dateline" :class="messageSource" v-if="dateline" v-html="dateline"></p>
    <div class="twc-textwrap" :class="messageSource">
      <div v-if="avatarUrl" class="twc-avatar" :class="messageSource"><img :src="avatarUrl"></div>
      <div class="twc-text-message" :class="messageSource">        
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
import sanitizeHtml from '../../utils/sanitize-html.js';
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
          message.data &&
          message.author
        );
      },
    },
  },
  computed: {
    messageText() {
      return this.message.data.text;
    },
    messageSource() {
      return this.message.author;
    },
    dateline() {
      if (this.message.data.dateline) {
        return sanitizeHtml(this.message.data.dateline)
      }
    },
    isBot() {
      return this.message.author === PARTICIPANT_BOT;
    },
    sanitizedHtmlText() {
      return sanitizeHtml(this.message.data.text);
    },
    avatarUrl() {
      if (this.message.data.avatarUrl && isValidUrl(this.message.data.avatarUrl)) {
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
.twc-spinner {
  margin: 6px auto 0;
  width: 35px;
  text-align: center;
}

.twc-spinner > div {
  width: 9px;
  height: 9px;
  background-color: #fff;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: twc-sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: twc-sk-bouncedelay 1.4s infinite ease-in-out both;
}

.twc-spinner .twc-bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.twc-spinner .twc-bounce2 {
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
.twc-text-message {
  padding: 6px 18px;
  border-radius: 10px;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  -webkit-font-smoothing: subpixel-antialiased;
}
.twc-text-message.bot {
  color: var(--bot-message-fg-color, #263238);
  background-color: var(--bot-message-bg-color, #eceff1);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.twc-text-message.agent {
  color: var(--agent-message-fg-color, #263238);
  background-color: var(--agent-message-bg-color, #e4f1e4);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.twc-text-message.user {
  background: var(--user-message-bg-color, #4e8cff);
  color: var(--user-message-fg-color, #ffffff);
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
}

.twc-text-message__text {
  margin-top: 0.4em;
  margin-bottom: 0.4em;
  font-weight: 400;
}

.twc-text-message a {
  color: var(--text-link-color, #007bff);
  text-decoration: none;
}

.twc-text-message a:hover {
  text-decoration: underline;
}

.twc-textwrap {
  display: flex;
}

.twc-textwrap.user {
  flex-direction: row-reverse;
}

.twc-avatar {
  min-width: 34px;
  min-height: 34px;
  width: 34px;
  height: 34px;
  border-radius: 20px;
  display: flex;
}

.twc-avatar.bot, .twc-avatar.agent {
  margin-right: 6px;
}

.twc-avatar.user {
  margin-left: 6px;
}

.twc-avatar img {
  margin: auto;
  width: 34px;
  height: 34px;
  border-radius: 20px;
}
</style>
