<template>
  <div class="twc-card" role="group" :aria-label="cardTitle">
    <div class="twc-card-img" v-if="imageUrl">
      <img :src="imageUrl" :alt="altText" />
    </div>
    <div class="twc-card-body" v-if="cardTitle || cardSubtitle || messageText">
      <h5 class="twc-card-title" v-if="cardTitle">{{ cardTitle }}</h5>
      <h6 class="twc-card-subtitle" v-if="cardSubtitle">{{ cardSubtitle }}</h6>
      <p class="twc-card-text" v-if="messageText" v-html="sanitizedHtmlText"></p>
    </div>
    <div class="twc-clickablelist" :class="{ 'twc-expired': replySent || isExpired}" v-if="clickablelistitems">
      <ul class="twc-clickablelist-message" :class="{ replied: replySent}">
        <li
          v-for="(reply, idx) in clickablelistitems"
          :key="idx"
          class="twc-clickablelist-message__item"
          role="button"
          :tabindex="replySent || isExpired ? -1 : 0"
          :class="{ 'twc-selected': replySent && selected === idx }"
          @click="onSelect(reply, idx)"
          @keydown="handleReturnSpaceKeys($event, reply, idx, 'clickablelist')"
        >{{ reply.title }}</li>
      </ul>
    </div>
    <div class="twc-buttons" :class="{ 'twc-expired': replySent || isExpired}" v-if="buttonitems">
      <div>
        <a
          role="button"
          v-for="(button, idx) in buttonitems"
          :tabindex="replySent || isExpired ? -1 : 0"
          :key="idx"
          class="twc-btn"
          :class="{ 'twc-selected': replySent && selected === idx, 'twc-primary': button.style == 'primary', 'twc-secondary': button.style == 'secondary', 'twc-success': button.style == 'success', 'twc-danger': button.style == 'danger', 'twc-warning': button.style == 'warning', 'twc-info': button.style == 'info'}"
          @click="onSelect(button, idx)"
          @keydown="handleReturnSpaceKeys($event, button, idx, 'button')"
        >{{ button.title }}</a>
      </div>
    </div>
    <div class="twc-linkbuttons" v-if="linkbutton_items">
        <a
          role="link"
          v-for="(button, idx) in linkbutton_items"
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
</template>

<script>
import { PARTICIPANT_BOT } from '../../utils/constants.js';
import sanitizeHtml from '../../utils/sanitize-html.js';
import handleButtonClick from '../../utils/handle-button-click.js';
import handleLinkButtonClick from '../../utils/handle-linkbutton-click.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';

export default {
  name: 'CardMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return message && message.type === 'card' && message.data;
      },
    },
  },
  computed: {
    cardTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    cardSubtitle() {
      if (this.message.data.subtitle) {
        return this.message.data.subtitle;
      }
    },
    imageUrl() {
      if (this.message.data.image && this.message.data.image.image_url) {
        return this.message.data.image.image_url;
      }
    },
    altText() {
      if (this.message.data.image && this.message.data.image.alt) {
        return this.message.data.image.alt;
      }
    },
    messageText() {
      if (this.message.data.text) {
        return this.message.data.text;
      }
    },
    clickablelistitems() {
      if (this.message.data.list_items) {
        return this.message.data.list_items;
      }
    },
    buttonitems() {
      return this.message.data.button_items;
    },
    linkitems() {
      return this.message.data.link_items;
    },
    linkbutton_items() {
      return this.message.data.linkbutton_items;
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
    sanitizedHtmlText() {
      return sanitizeHtml(this.message.data.text);
    }
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
    handleReturnSpaceKeys(event, button, idx, type) {
      if (keyIsSpaceOrEnter(event)) {
        this.onSelect(button, idx)
      }
    }
  }
};
</script>

<style>
.twc-card {
  width: 100%;
  margin-right: 40px;
  min-width: 0;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  word-wrap: break-word;
  background-color: var(--card-bg-color, #ffffff);
  background-clip: border-box;
  border: 1px solid var(--light-border-color, #c9c9c9);
  border-radius: 0.25rem;
  border-bottom-left-radius: 0px;
}
.twc-card-img {
  display: flex;
}

.twc-card-img img {
  object-fit: cover;
  width: 100%;
  height: auto;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}

.twc-card-body {
  padding: 14px 14px 6px 14px;
}

.twc-card-body h5,
.twc-card .twc-card-body h6 {
  font-family: inherit;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 0.6rem;
}

.twc-card-body h5 {
  font-size: 1.25em;
  font-weight: 500;
  color: var(--bot-message-fg-color, #263238);
}

.twc-card-body h6 {
  font-size: 1em;
  font-weight: 500;
  color: var(--secondary-color, #263238) !important;
}

.twc-card-text {
  font-weight: 400;
  font-size: 0.9em;
  line-height: 1.6;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
  color: var(--bot-message-fg-color, #263238);
  margin-top: 0.6rem;
  margin-bottom: 0.6rem;
}

.twc-card .twc-clickablelist-message__item {
  border-left: none;
  border-right: none;
}

.twc-card .twc-clickablelist-message__item:first-child {
  border-top: 1px solid var(--light-border-color, #c9c9c9);
  border-top-left-radius: initial;
  border-top-right-radius: initial;
}

.twc-card .twc-clickablelist-message__item:last-child {
  border-bottom-left-radius: initial;
  border-bottom-right-radius: initial;
  border-bottom: none;
}

.twc-card .twc-buttons, .twc-card .twc-linkbuttons {
  text-align: center;
  border-top: 1px solid var( --light-border-color, #c9c9c9);
  padding: 12px;
}

.twc-card .twc-links {
  border-top: 1px solid var( --light-border-color, #c9c9c9);
  padding: 12px;
}

.twc-card .twc-links a {
  color: var(--card-link-color, #007bff);
  font-size: 0.9em;
  padding-right: 10px;
  text-decoration: none;
}

.twc-card .twc-links a:hover {
  text-decoration: underline;
}

.twc-card .twc-links a:last-child {
  padding-right: 0px;
}

.twc-card .twc-btn {
  min-width: 50px !important;
  margin-top: 3px;
}
</style>
