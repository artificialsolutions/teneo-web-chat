<template>
  <div class="twc-modal" @click="hideModal()" >
    <div class="twc-modal-content" v-on:click.stop>
      <div class="twc-modal-img" v-if="imageUrl">
        <img :src="imageUrl" :alt="altText"/>
      </div>
      <div class="twc-modal-body" v-if="modalTitle || messageText">
        <h5 class="twc-modal-title" v-if="modalTitle">{{ modalTitle }}</h5>
        <p class="twc-modal-text" v-if="messageText" v-html="sanitizedHtmlText"></p>
      </div>
      <div class="twc-buttons" v-if="buttonitems">
        <div>
           <a
          role="button"
          v-for="(button, idx) in buttonitems"
          :key="idx"
          class="twc-btn"
          :class="{ 'twc-primary': button.style == 'primary', 'twc-secondary': button.style == 'secondary', 'twc-success': button.style == 'success', 'twc-danger': button.style == 'danger', 'twc-warning': button.style == 'warning', 'twc-info': button.style == 'info'}"
          @click="onSelect(button, idx)"
          >{{ button.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_ON_MODAL_BUTTON_CLICK } from '../../utils/api-function-names.js';
import sanitizeHtml from '../../utils/sanitize-html.js';
import handleExtension from '../../utils/handle-extension.js';

export default {
  name: 'ModalMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return message && message.type === 'modal' && message.data;
      },
    },
  },
  computed: {
    modalTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
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
    buttonitems() {
      return this.message.data.button_items;
    },
    sanitizedHtmlText() {
      return sanitizeHtml(this.message.data.text);
    },
  },
  methods: {
    async onSelect(reply, idx) {
      console.log(this)
      if (!this.replySent) {
        // hide modal
        this.hideModal();
        // check if there is an extension that want to intercept the new event
        reply = await handleExtension(API_ON_MODAL_BUTTON_CLICK, reply);

        // only send silent input of postback exists
        if (reply.postback) {
            await this.$teneoApi.sendSilentMessage(reply.postback);
        }

      }
    },
    hideModal() {
      let messages =  this.$teneoApi.messageList;
      messages = messages.filter(function( message ) {
          return message.type !== 'modal';
      });      
      this.$teneoApi.messageList = messages;
    },
  },
};
</script>

<style>
.twc-modal {
  position: fixed;
  z-index: 2700; /* Sit on top */
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5); 
  width: 370px;
  height: calc(100% - 120px);
  max-height: 590px;
  right: 25px;
  bottom: 25px;
  box-sizing: border-box;
  border-radius: 10px;
  transition: 0.3s ease-in-out;
}

.twc-modal-content {
  margin: 40% auto;
  width: 80%; 
  border: none;
  min-width: 0;
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  background-color: var(--card-bg-color, #ffffff);
  background-clip: border-box;
  border-radius: 0.25rem;
}

.twc-modal-content .twc-modal-img, .twc-modal-content .twc-modal-img img {
  width: 100% !important;
}

.twc-modal-content .twc-modal-body {
  text-align: center;
  padding: 6px 14px 6px 14px;
}

.twc-modal-body .twc-modal-title {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--bot-message-fg-color, #263238);
    font-family: inherit;
    line-height: 1.2;
    margin-top: 0.6rem;
    margin-bottom: 0.6rem;
}

.twc-modal-text {
    font-weight: 400;
    font-size: 0.9em;
    line-height: 1.6;
    white-space: pre-wrap;
    -webkit-font-smoothing: subpixel-antialiased;
    color: var(--bot-message-fg-color, #263238);
    margin-top: 0.6rem;
    margin-bottom: 0.6rem;
}

.twc-modal-content .twc-buttons {
    text-align: center;
    padding: 0px 12px 12px 12px;
}

@media (max-width: 450px) {
  .twc-modal {
    width: 100%;
    height: 100%;
    max-height: 100%;
    right: 0px;
    bottom: 0px;
    border-radius: 0px;
  }
}
</style>