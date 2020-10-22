<template>
<div class="twc-text-message-wrapper">
    
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="twc-dateline" v-if="dateline" v-html="dateline"></p>
    <div class="twc-avatar-text-wrapper">
      <div v-if="avatarUrl" class="twc-avatar"><img :src="avatarUrl"></div>
      <div class="twc-text-message">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="twc-text-message__text" v-html="sanitizedHtmlText"></p>
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
    dateline() {
      if (this.message.data && this.message.data.dateline) {
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
.twc-message.twc-user .twc-text-message-wrapper {
  max-width: calc(100% - 84px);
}

/* workaround to fix wicth of text message box on IE11 */
_:-ms-fullscreen, :root .twc-message.twc-bot .twc-text-message-wrapper, :root .twc-message.twc-agent .twc-text-message-wrapper {
  max-width: calc(100% - 1px);
}

_:-ms-fullscreen, :root .twc-message.twc-user .twc-text-message-wrapper  {
  max-width: calc(100% - 86px);
  margin-left: 85px
}
/* End of workaround */

.twc-dateline {
  font-weight: 400;
  font-size: 0.7em;
  padding: 0;
  margin-bottom: 0.25rem;
  margin-top: 0rem;
  -webkit-font-smoothing: subpixel-antialiased;
  color: var(--secondary-color, #6c757d);
}
.twc-message.twc-user .twc-dateline {
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
.twc-message.twc-bot .twc-text-message {
  color: var(--bot-message-fg-color, #263238);
  background-color: var(--bot-message-bg-color, #eceff1);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.twc-message.twc-agent .twc-text-message {
  color: var(--agent-message-fg-color, #ffffff);
  background-color: var(--agent-message-bg-color, #47b2fd);
  margin-right: 40px;
  border-bottom-left-radius: 0px;
}

.twc-message.twc-user .twc-text-message {
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

.twc-avatar-text-wrapper {
  display: flex;
}

.twc-message.twc-user .twc-avatar-text-wrapper {
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

.twc-message.twc-bot .twc-avatar, .twc-message.twc-agent .twc-avatar {
  margin-right: 6px;
}

.twc-message.twc-user .twc-avatar {
  margin-left: 6px;
}

.twc-avatar img {
  margin: auto;
  width: 34px;
  height: 34px;
  border-radius: 20px;
}
</style>
