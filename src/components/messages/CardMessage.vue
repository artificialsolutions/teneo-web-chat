<template>
  <div class="twc-card" role="group" :aria-label="cardTitle">
    <div class="twc-card-img" v-if="imageUrl">
      <img :src="imageUrl" :alt="altText" />
      <div v-if="this.message.data.tags" class = "tags">
        <ul>
          <li
            v-for="(tag, idx) in this.message.data.tags"
            :key="idx"
            :id="tag.id || false"
          >{{ tag.innerContent }}</li>
        </ul>
      </div>
      
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
        >{{ link.title }}
          <svg width="1em" height="1em" viewBox="0 0 24 24" role="presentation">
            <g fill="currentColor" fill-rule="evenodd">
              <path d="M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 
              0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 
              2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 
              1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47">
              </path>
              <path d="M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 
              0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 
              2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 
              0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47">
              </path>
            </g>
          </svg>
        </a>
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
  height: 50%;
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
  border-radius: 10px;
  border-bottom-left-radius: 0px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  box-sizing: border-box;
  border: 0.5px solid var(--light-border-color, #c9c9c9);
  position: relative;
}
.twc-card-img {
  width: 100%;
  height: 200px;
  display: flex;
  position: relative;
  border-bottom: 1px solid var(--light-border-color, #c9c9c9);
}

.twc-card-img img {
  width: 100%;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin:0;
  /**mix-blend-mode: overlay;**/
  
  /** mix-blend-mode: multiply; fade effect property*/
}

.tag {
  text-align: center;
  position: absolute;
  top: -4%;
  left: 2%;
  color: var(--light-fg-color, #ffffff);
  justify-content: space-around;
}

.tags {
  position: absolute;
  top: 75%;
  left: -9%;
  color: var(--light-fg-color, #ffffff);
  opacity: 0.9;
  font-weight: bold;
}

.tags ul{
  list-style-type: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.tags ul li {
  background-color: var(--success-color, #28a745);
  border: 1px solid var(--success-color, #28a745);
  border-radius: 10px;
  padding: 5px;
  margin-right: 5px;
  font-size: 0.8em;
}

#one {
  background-color: var(--warning-color, #e2ab07);
  border: none;
}

#two {
  background-color: var(--danger-color, #dc3545);
  border: none;
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
  font-weight: bold;
}

.twc-card-body h6 {
  font-size: 1em;
  font-weight: 500;
  color: var(--secondary-color, #263238) ;
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

.twc-card .twc-clickablelist {
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

.twc-card .twc-clickablelist-message {
  width: 80%;
  margin-bottom: 3%;
  margin-top: 10px;
  border-radius: 10px;

}

.twc-card .twc-clickablelist-message__item {
  width: 100%;
  height: auto;
  border-radius: 5px;
  background-color: var(--primary-color);
  border:none;
  color: var(--light-fg-color, #ffffff);
  margin: 0;
  margin: 2px;
  padding: 0;
  padding-top: 3px;
  padding-bottom: 3px;
  text-align: center;
  outline: none;
  font-size: 0.9rem;
}


.twc-card .twc-clickablelist-message__item:hover {
  height: auto ;
  background-color: var(--primary-color-dark); /**Comment on this */
  border: none;
  border-radius: 5px;
  margin: 2px;
  padding: 0;
  padding-top: 3px;
  padding-bottom: 3px;
  color: var(--light-fg-color, #ffffff);
  font-size: 0.9rem;
  outline:none;
}

.twc-card .twc-buttons, .twc-card .twc-linkbuttons {
  width: 90%;
  text-align: center;
  border-top: none;
  padding: 12px;
}


.twc-card .twc-links {
  height:30px;
  border-top: none;
  padding: 12px;
  background-color: var(--dark-fg-color, #263238);
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom-right-radius: 10px;
}

.twc-card .twc-links a {
  color: var(--card-link-color, #007bff);
  font-size: 0.9em;
  padding-right: 10px;
  text-decoration: none;
}

.twc-card .twc-links a:hover {
  text-decoration: underline;
  font-size: 1.2em;
}

.twc-card .twc-links a:last-child {
  padding-right: 0px;
}

.twc-card .twc-btn {
  min-width: 50px;
  margin-top: 3px;
}
</style>
