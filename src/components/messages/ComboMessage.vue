<template>
  <ul class="combo" :class="{ replied: replySent}">
    <li v-for="(message, idx) in comboitems" :key="idx">
      <div class="combo-message" v-if="message.type==='text'">
        <div class="text-message" :class="messageSource">
          <p class="text-message__text" v-html="message.text"></p>
        </div>
      </div>

      <div class="combo-message" v-if="message.type==='audio'">
        <div class="audio-message">
          <audio controls>
            <source :src="message.audio_url"/>
          </audio>
        </div>
      </div>

      <div class="combo-message" v-if="message.type==='quickreply'">
        <div class="quickreply-message" :class="{ expired: replySent || isExpired }">
          <div>
            <a
              v-for="(reply, idx) in message.quick_replies"
              :key="idx"
              role="button"
              class="quickreply-message__item"
              :class="{ selected: replySent && selected === idx, 'primary': reply.style == 'primary', 'secondary': reply.style == 'secondary', 'success': reply.style == 'success', 'danger': reply.style == 'danger', 'warning': reply.style == 'warning', 'info': reply.style == 'info'}"
              @click="onSelect(reply, idx)"
            >{{ reply.title }}</a>
          </div>
        </div>
      </div>

      <div class="combo-message" v-if="message.type==='clickablelist'">
        <div class="clickablelist" :class="{ expired: replySent || isExpired}">
          <h5 class="clickablelist-title" v-if="message.title">{{ message.title }}</h5>
          <ul class="clickablelist-message" :class="{ replied: replySent || isExpired}">
            <li
              v-for="(reply, idx) in message.list_items"
              :key="idx +'ql'"
              class="clickablelist-message__item"
              :class="{ selected: replySent && selected === idx +'ql' }"
              @click="onSelect(reply, idx +'ql')"
            >{{ reply.title }}</li>
          </ul>
        </div>
      </div>

      <div class="combo-message" v-if="message.type==='image'">
        <div class="image-message">
          <img :src="message.image_url" :alt="message.alt" />
        </div>
      </div>

      <div class="combo-message" v-if="message.type==='youtubevideo'">
        <div class="twc_youtubevideo">
          <iframe
            :src="message.video_url"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div class="combo-message" v-if="message.type==='mp4video'">
        <div class="twc_videofile">
          <video controls="1">
            <source :src="videoUrl(message.video_url)" type="video/mp4" />
          </video>
        </div>
      </div>
      
      <div class="combo-message" v-if="message.type==='vimeovideo'">
        <div class="twc_vimeovideo">
          <iframe :src="message.video_url" frameborder="0" allowfullscreen allowtransparency allow></iframe>
        </div>
      </div>

      <div class="combo-message" v-if="message.type==='buttons'">
        <div class="buttons" :class="{ expired: replySent || isExpired}">
            <h5 class="buttons-title" v-if="message.title">{{ message.title }}</h5>
            <div>
              <a
                role="button"
                v-for="(button, idx) in message.button_items"
                :key="idx +'btn'"
                class="btn"
                :class="{ selected: replySent && selected === idx +'btn', 'primary': button.style == 'primary', 'secondary': button.style == 'secondary', 'success': button.style == 'success', 'danger': button.style == 'danger', 'warning': button.style == 'warning', 'info': button.style == 'info'}"
                @click="onSelect(button, idx +'btn')"
              >{{ button.title }}</a>
            </div>
          </div>
      </div>

      <div class="combo-message" v-if="message.type==='card'">
        <div class="card">
            <div class="card-img" v-if="message.image">
              <img :src="message.image.image_url" :alt="message.image.alt" />
            </div>
            <div class="card-body" v-if="message.title || message.subtitle || message.text">
              <h5 class="card-title" v-if="message.title">{{ message.title }}</h5>
              <h6 class="card-subtitle" v-if="message.subtitle">{{ message.subtitle }}</h6>
              <p class="card-text" v-if="message.text">{{ message.text }}</p>
            </div>
            <div class="clickablelist" :class="{ expired: replySent || isExpired}" v-if="message.list_items">
              <ul class="clickablelist-message" :class="{ replied: replySent}">
                <li
                  v-for="(reply, idx) in message.list_items"
                  :key="idx +'cql'"
                  class="clickablelist-message__item"
                  :class="{ selected: replySent && selected === idx +'cql' }"
                  @click="onSelect(reply, idx +'cql')"
                >{{ reply.title }}</li>
              </ul>
            </div>
            <div class="buttons" :class="{ expired: replySent || isExpired}" v-if="message.button_items">
              <div>
                <a
                  role="button"
                  v-for="(button, idx) in message.button_items"
                  :key="idx +'cbtn'"
                  class="btn"
                  :class="{ selected: replySent && selected === idx +'cbtn', 'primary': button.style == 'primary', 'secondary': button.style == 'secondary', 'success': button.style == 'success', 'danger': button.style == 'danger', 'warning': button.style == 'warning', 'info': button.style == 'info'}"
                  @click="onSelect(button, idx +'cbtn')"
                >{{ button.title }}</a>
              </div>
            </div>
            <div class="links" v-if="message.link_items">
              <div>
                <a
                  v-for="(link, idx) in message.link_items"
                  :href="link.url"
                  :key="idx"
                >{{ link.title }}</a>
              </div>
            </div>
          </div>
      </div>
    </li>
  </ul>
</template>
<script>
import { PARTICIPANT_BOT } from '../../utils/constants.js';
export default {
  name: 'ComboMessage',
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
    comboitems() {
      return this.message.data.components;
    },
    replySent() {
      return !!this.message.selected || this.message.selected === 0;
    },
    selected() {
      return this.message.selected;
    },
    messageSource() {
      return this.message.author;
    },
    isExpired() {
      const { messageList } = this.$teneoApi;
      const latestMessage = messageList[messageList.length - 1];

      return latestMessage && latestMessage !== this.message;
    },
  },
  methods: {
    async onSelect(reply, idx) {
      if (!this.replySent) {
        const numMessages = this.$teneoApi.messageList.length;
        const messages = this.$teneoApi.messageList.slice(0, numMessages - 1);
        const comboMessage = this.$teneoApi.messageList[numMessages - 1];

        const selectedItem = { ...comboMessage, selected: idx };

        this.$teneoApi.messageList = [...messages, selectedItem];

        await this.$teneoApi.sendSilentMessage(reply.postback);
      }
    },
    videoUrl(url) {
      return url + '#t=0.1';
    },
  },
};
</script>

<style>
.combo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0 0 -10px 0;
  width: 100%;
}

.combo-message {
  width: 100%;
  min-width: 300px;
  padding-bottom: 10px;
  display: flex;
}

</style>

<style scoped>
.buttons {
  width: 100%;
  margin: -3px 47px -3px -3px;
  text-align: center;
}

.btn {
  min-width: 62px;
}
</style>