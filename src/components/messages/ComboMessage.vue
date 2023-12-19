<template>
  <ul class="twc-combo">
    <li v-for="(message, idx) in comboitems" :key="'item'+idx">
      <Message
        :key="message.type+idx"
        class="twc-combo-message"
        :message="{type:message.type, data:message, author:'bot'}"
      />
    </li>
  </ul>
</template>
<script>

import { PARTICIPANT_BOT } from '../../utils/constants.js';
import handleButtonClick from '../../utils/handle-button-click.js';
import { EventBus, events } from '../../utils/event-bus.js';
import handleLinkButtonClick from '../../utils/handle-linkbutton-click.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';
import sanitizeHtml from '../../utils/sanitize-html.js';

import Message from '../Message.vue';

export default {
  name: 'ComboMessage',
  components: {
    Message,
  },
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'combo' &&
          message.data &&
          message.data.components &&
          message.data.components.length > 0
        );
      },
    },
  },
  computed: {
    previewDomain(m) {
      const s = m.url;
      if (s) {
        console.log('t URL', s);
        s = s.toString();
        if (s.indexOf('://') === -1) s = "http://" + s;
        return new URL(s).hostname;
      }
    },
    comboitems() {
      return this.message.data.components;
    },
    linkitems() {
      return this.message.data.link_items;
    },
    replySent() {
      return !!this.message.selected || this.message.selected === 0;
    },
    selected() {
      return this.message.selected;
    },
    isExpired() {
      const { messageList } = this.$teneoApi;
      const latestMessage = messageList[messageList.length - 1];

      return latestMessage && latestMessage !== this.message;
    },
  },
  methods: {
    async onLinkbuttonClick(linkbutton, event) {
      await handleLinkButtonClick(linkbutton, event)
    },
    async onSelect(reply, idx) {
      if (!this.replySent && !this.isExpired) {
        await handleButtonClick(reply, idx, this.$teneoApi)
      }
    },
    handleReturnSpaceKeys(event, reply, idx) {
      if (keyIsSpaceOrEnter(event)) {
        this.onSelect(reply, idx)
      }
    },
    videoUrl(url) {
      return url + '#t=0.1';
    },
    zoomIn(imageUrl) {
      EventBus.$emit(events.ZOOM_IMAGE, imageUrl);
    },
    scrollChatUp() {
      EventBus.$emit(events.SCROLL_CHAT_DOWN);
    },
    sanitizedHtmlText(text) {
      return sanitizeHtml(text);
    }
  },
};
</script>

<style>
.twc-combo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0 0 -10px 0;
  width: 100%;
  position: relative;
}

.twc-combo-message {
  width: 100%;
  min-width: 300px;
  padding-bottom: 10px;
  display: flex;
}

</style>

<style scoped>

.twc-combo-message .twc-card {
  height: 50%;
  display: flex;
  align-items: center;
  position: relative;
  border: 2px solid rgb(202, 202, 202);
}

.twc-combo-message .twc-card .twc-clickablelist {
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
  overflow: auto;
  box-shadow: none;
  margin-right: 0px;
  margin-bottom: 0%;
  position: relative;
  border-radius: 10px;
}

.twc-combo-message .twc-card .twc-clickablelist-message {
  width: 80%;
  margin-bottom: 3%;
  margin-top: 10px;
  border-radius: 10px;
}
.twc-combo-message .twc-card .twc-clickablelist-message__item {
  width: 100%;
  height: auto;
  border-radius: 5px;
  background-color: var(--primary-color) !important;
  border:none;
  color:white;
  margin: 0;
  margin: 2px;
  padding: 0;
  padding-top: 3px;
  padding-bottom: 3px;
  text-align: center;
  outline: none;
  font-size: 0.9rem;
}

.twc-combo-message .twc-card .twc-clickablelist-message__item:hover {
  height: auto ;
  background-color: var(--primary-color-dark) !important; /**Comment on this */
  border: none;
  border-radius: 5px;
  margin: 2px;
  padding: 0;
  padding-top: 3px;
  padding-bottom: 3px;
  color: white;
  font-size: 0.9rem;
  outline:none;
}


.twc-combo-message .twc-buttons {
  width: 100%;
  margin: -3px 47px -3px -3px;
  text-align: center;
}

.twc-btn {
  min-width: 62px;
}

.twc-combo-message .twc-linkbuttons {
  position:relative;
  width: 100%;
  margin: -3px;
  margin-right: 37px;
  text-align: center;
}

.twc-combo-message .twc-card .twc-linkbuttons {
  width: auto;
  margin: 0;
  position: relative;
}
</style>