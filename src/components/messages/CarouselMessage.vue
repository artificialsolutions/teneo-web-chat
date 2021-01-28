<template>
  <ul class="twc-carousel">
    <li v-for="(message, idx) in carouselItems" :key="idx">
      
        <div class="twc-card" v-if="message.type==='card'">
            <div class="twc-card-img" v-if="message.image">
              <img :src="message.image.image_url" :alt="message.image.alt" />
            </div>
            <div class="twc-card-body" v-if="message.title || message.subtitle || message.text">
              <h5 class="twc-card-title" v-if="message.title">{{ message.title }}</h5>
              <h6 class="twc-card-subtitle" v-if="message.subtitle">{{ message.subtitle }}</h6>
              <p class="twc-card-text" v-if="message.text" v-html="sanitizedHtmlText(message.text)"></p>
            </div>
            <div class="twc-clickablelist" :class="{ 'twc-expired': replySent || isExpired}" v-if="message.list_items">
              <ul class="twc-clickablelist-message" :class="{ 'twc-replied': replySent}">
                <li
                  v-for="(reply, idx) in message.list_items"
                  :key="idx +'cql'"
                  class="twc-clickablelist-message__item"
                  role="button"
                  :tabindex="replySent || isExpired ? -1 : 0"
                  :class="{ 'twc-selected': replySent && selected === idx +'cql' }"
                  @click="onSelect(reply, idx +'cql')"
                  @keydown="handleReturnSpaceKeys($event, reply, idx +'cql')"
                >{{ reply.title }}</li>
              </ul>
            </div>
            <div class="twc-buttons" :class="{ 'twc-expired': replySent || isExpired}" v-if="message.button_items">
              <div>
                <a
                  role="button"
                  v-for="(button, idx) in message.button_items"
                  :key="idx +'cbtn'"
                  class="twc-btn"
                  :tabindex="replySent || isExpired ? -1 : 0"
                  :class="{ 'twc-selected': replySent && selected === idx +'cbtn', 'twc-primary': button.style == 'primary', 'twc-secondary': button.style == 'secondary', 'twc-success': button.style == 'success', 'twc-danger': button.style == 'danger', 'twc-warning': button.style == 'warning', 'twc-info': button.style == 'info'}"
                  @click="onSelect(button, idx +'cbtn')"
                  @keydown="handleReturnSpaceKeys($event, button, idx +'cbtn')"
                >{{ button.title }}</a>
              </div>
            </div>
            <div class="twc-linkbuttons" v-if="message.linkbutton_items">
                <a
                  role="link"
                  v-for="(button, idx) in message.linkbutton_items"
                  :key="idx"
                  :href="button.url"
                  :target="button.target"
                  :rel="button.target === '_blank' ? 'noopener': false"
                  class="twc-linkbutton"
                  @click="onLinkbuttonClick(button, $event)"
                >{{ button.title }}</a>
            </div>
            <!-- link item in cards are deprecated, please use linkbuttons instead -->
            <div class="twc-links" v-if="linkitems">
                <a
                  v-for="(link, idx) in linkitems"
                  :href="link.url"
                  :key="idx"
                >{{ link.title }}</a>
            </div>
          </div>
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

export default {
  name: 'CarouselMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'carousel' &&
          message.data &&
          message.data.carousel_items &&
          message.data.carousel_items.length > 0
        );
      },
    },
  },
  computed: {
    carouselItems() {
      return this.message.data.carousel_items;
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
      if (!this.replySent) {
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
.twc-carousel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0 0 -10px 0;
  width: 100%;
}

/* .twc-combo-message {
  width: 100%;
  min-width: 300px;
  padding-bottom: 10px;
  display: flex;
} */

</style>

<style scoped>
.twc-buttons {
  width: 100%;
  margin: -3px 47px -3px -3px;
  text-align: center;
}

.twc-btn {
  min-width: 62px;
}

.twc-linkbuttons {
  width: 100%;
  margin: -3px;
  margin-right: 37px;
  text-align: center;
}

.twc-card .twc-linkbuttons {
  width: auto;
  margin: 0;
}
</style>