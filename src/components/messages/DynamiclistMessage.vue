<template>
  <div class="attachment-message" :class="messageSource">
    <ul class="clickablelist-message" :class="{ replied: replySent}">
      <li
        v-for="(message, idx) in dynamiclistitems"
        :key="idx"
      > 
      
      <div v-if='message.type==="text"'>
        <div class="text-message" :class="messageSource">
            <p class="text-message__text" v-html=message.text></p>
          </div>
      </div>

      <div v-if='message.alt'>
          <div class="text-message" :class="messageSource">
            <p class="text-message__text" v-html=message.alt></p>
          </div>
      </div>

      <div v-if='message.type==="image"'>
        <div class="image-message">
          <img :src=message.image_url />
        </div>
      </div>


      <div v-if='message.type==="youtubevideo"'>
        <div class="twc_youtubevideo">
          <iframe :src=message.video_url frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>

      <div v-if='(message.type==="videofile")'>
        <vue-plyr class="twc_videofile">
            <div class="plyr__video-embed">
              <video controls allowfullscreen allowtransparency>
                <source :src="message.video_url" type="video/mp4" />
              </video>
            </div>
        </vue-plyr>
      </div>

      
      <div v-if='message.type==="vimeo"'>
        <vue-plyr class="twc_vimeovideo">
            <div class="plyr__video-embed">
              <iframe
                :src=message.video_url
                allowfullscreen allowtransparency allow="">
              </iframe>
            </div>
        </vue-plyr>
      </div>


      </li>
    </ul>
  </div>

</template>

<script>
import { PARTICIPANT_BOT } from '../../utils/constants.js';

export default {
  name: 'DynamiclistMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'dynamiclist' &&
          message.data &&
          message.data.list_items &&
          message.data.list_items.length > 0
        );
      },
    },
  },
  computed: {
    dynamiclistitems() {
      return this.message.data.list_items;
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
    isBot() {
      return this.message.author === PARTICIPANT_BOT;
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

<style scoped>
.twc_videofile {
  margin-bottom: 12px;
  width: 90%;
  min-width: 300px;
}
video {
  width: 100%;
  max-height: 100%;
}

.twc_vimeovideo {
  margin-bottom: 12px;
  margin-top: 12px;
  width: 90%;
  min-width: 300px;
}

.text-message {
  margin-bottom: 12px;
}

.twc_youtubevideo {
  margin-bottom: 12px;
  margin-top: 12px;
}
</style>
