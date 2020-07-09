<template>
  <div class="card" :class="{ expired: replySent || isExpired }">
    <div class="card-img" v-if="imageUrl">
      <img :src="imageUrl" :alt="altText" />
    </div>
    <div class="card-body" v-if="cardTitle || cardSubtitle || messageText">
      <h5 class="card-title" v-if="cardTitle">{{ cardTitle }}</h5>
      <h6 class="card-subtitle" v-if="cardSubtitle">{{ cardSubtitle }}</h6>
      <p class="card-text" v-if="messageText">{{ messageText }}</p>
    </div>
    <div class="clickablelist" :class="{ expired: replySent || isExpired}" v-if="clickablelistitems">
      <ul class="clickablelist-message" :class="{ replied: replySent}">
        <li
          v-for="(reply, idx) in clickablelistitems"
          :key="idx"
          class="clickablelist-message__item"
          :class="{ selected: replySent && selected === idx }"
          @click="onSelect(reply, idx)"
        >{{ reply.title }}</li>
      </ul>
    </div>
    <div class="buttons" :class="{ expired: replySent || isExpired}" v-if="buttonitems">
      <div>
        <a
          role="button"
          v-for="(button, idx) in buttonitems"
          :key="idx"
          class="btn"
          :class="{ selected: replySent && selected === idx, 'primary': button.style == 'primary', 'secondary': button.style == 'secondary', 'success': button.style == 'success', 'danger': button.style == 'danger', 'warning': button.style == 'warning', 'info': button.style == 'info'}"
          @click="onSelect(button, idx)"
        >{{ button.title }}</a>
      </div>
    </div>
    <div class="links" v-if="linkitems">
      <div>
        <a
          v-for="(link, idx) in linkitems"
          :href="link.url"
          :key="idx"
        >{{ link.title }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { PARTICIPANT_BOT } from '../../utils/constants.js';
import sanitizeHtml from '../../utils/sanitize-html.js';
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
    },
  },
  methods: {
    async onSelect(reply, idx) {
      if (!this.replySent) {
        const numMessages = this.$teneoApi.messageList.length;
        const messages = this.$teneoApi.messageList.slice(0, numMessages - 1);
        const dynamiclistMessage = this.$teneoApi.messageList[numMessages - 1];

        const selectedItem = { ...dynamiclistMessage, selected: idx };

        this.$teneoApi.messageList = [...messages, selectedItem];

        await this.$teneoApi.sendSilentMessage(reply.postback);
      }
    },
  },
};
</script>

<style>
.card {
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
.card-img {
  display: flex;
}

.card-img img {
  object-fit: cover;
  width: 100%;
  height: 180px;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}

.card-body {
  padding: 14px 14px 6px 14px;
}

.card-body h5,
.card .card-body h6 {
  font-family: inherit;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 0.6rem;
}

.card-body h5 {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--bot-message-fg-color, #263238);
}

.card-body h6 {
  font-size: 1rem;
  font-weight: 500;
  color: #6c757d !important;
}

.card-text {
  font-weight: 400;
  font-size: 0.9em;
  line-height: 1.6;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
  color: var(--bot-message-fg-color, #263238);
  margin-top: 0.6rem;
  margin-bottom: 0.6rem;
}

.card .clickablelist-message__item {
  border-left: none;
  border-right: none;
}

.card .clickablelist-message__item:first-child {
  border-top: 1px solid var(--light-border-color, #c9c9c9);
  border-top-left-radius: initial;
  border-top-right-radius: initial;
}

.card .clickablelist-message__item:last-child {
  border-bottom-left-radius: initial;
  border-bottom-right-radius: initial;
  border-bottom: none;
}

.card .buttons {
  text-align: center;
  border-top: 1px solid var( --light-border-color, #c9c9c9);
  padding: 12px;
}

.card .links {
  border-top: 1px solid var( --light-border-color, #c9c9c9);
  padding: 12px;
}

.card .links a {
  color: var(--card-link-color, #007bff);
  font-size: 0.9rem;
  padding-right: 10px;
  text-decoration: none;
}

.card .links a:hover {
  text-decoration: underline;
}

.card .links a:last-child {
  padding-right: 0px;
}

.card .btn {
  min-width: 50px !important;
  margin-top: 3px;
}
</style>
