<template>
<div class="wrap" :class="messageSource">
    
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="dateline" :class="messageSource" v-if="dateline" v-html="dateline"></p>
    <div class="textwrap" :class="messageSource">
      <div v-if="avatarUrl" class="avatar" :class="messageSource"><img :src="avatarUrl"></div>
      
      <div class="text-message" :class="messageSource">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-if="isBot" class="text-message__text" v-html="sanitizedHtmlText"></p>
        <p v-else class="text-message__text">{{ messageText }}</p>
      </div>
    </div>
    
</div>
</template>

<script>
import { PARTICIPANT_BOT } from '../../utils/constants.js';
import sanitizeHtml from '../../utils/sanitize-html.js';
import { mapState } from 'vuex';
import Vue from 'vue';
const tmpVue = new Vue();

export default {
  name: 'TextMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'text' &&
          message.data &&
          message.data.text
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
      if (this.message.data.avatarUrl) {
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
  // methods: {
  //   getAvatarUrl (author) {
  //     if (message.data.avatarUrl) {
  //       return message.data.avatarUrl
  //     } else if (author == 'bot' && tmpVue.$store.getters.botAvatarUrl) {
  //         return tmpVue.$store.getters.botAvatarUrl
  //     } else if (author == 'agent' && tmpVue.$store.getters.agentAvatarUrl) {
  //         return tmpVue.$store.getters.botAvatarUrl
  //     } else if (author == 'user' && tmpVue.$store.getters.userAvatarUrl) {
  //         return tmpVue.$store.getters.botAvatarUrl
  //     }

  //   }
  // },
};
</script>

<style>
.wrap.user {
  max-width: calc(100% - 120px);
}
.dateline {
  font-weight: 400;
  font-size: 0.7em;
  padding: 0;
  margin-bottom: 0.25rem;
  margin-top: 0rem;
  width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;
  color: var(--secondary-color, #6c757d);
}
.dateline.user {
  text-align: right;
}
.text-message {
  padding: 6px 18px;
  border-radius: 10px;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  -webkit-font-smoothing: subpixel-antialiased;
}
.text-message.bot {
  color: var(--bot-message-fg-color, #263238);
  background-color: var(--bot-message-bg-color, #eceff1);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.text-message.agent {
  color: var(--agent-message-fg-color, #263238);
  background-color: var(--agent-message-bg-color, #e4f1e4);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.text-message.user {
  background: var(--user-message-bg-color, #4e8cff);
  color: var(--user-message-fg-color, #ffffff);
  /* max-width: calc(100% - 120px); */
  word-wrap: break-word;
  border-bottom-right-radius: 0px;
  /* text-align: right; */
}

.text-message__text {
  margin-top: 0.4em;
  margin-bottom: 0.4em;
  font-weight: 400;
}

.text-message a {
  color: var(--text-link-color, #007bff);
  text-decoration: none;
}

.text-message a:hover {
  text-decoration: underline;
}

.textwrap {
  display: flex;
}

.textwrap.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 20px;
  display: flex;
}

.avatar.bot, .avatar.agent {
  margin-right: 0.40rem;
  display: flex;
}

.avatar.user {
  margin-left: 0.40rem;
  display: flex;
}

.avatar img {
  margin: auto;
  width: 32px;
  height: 32px;
  border-radius: 20px;
}
</style>
