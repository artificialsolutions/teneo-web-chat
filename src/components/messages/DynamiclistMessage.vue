<template>
  <div class="attachment-message" :class="messageSource">
    <ul class="clickablelist-message" :class="{ replied: replySent}">
      <li
        v-for="(reply, idx) in dynamiclistitems"
        :key="idx"
      > 
      
      <div v-if='JSON.parse(reply).alt.length>0'>
          <div class="text-message" :class="messageSource">
            <p v-if="isBot" class="text-message__text" v-html=JSON.parse(reply).alt></p>
            <p v-else class="text-message__text">{{ JSON.parse(reply).alt }}</p>
          </div>
      </div>

      <div v-if='JSON.parse(reply).type==="image"'>
        <div class="image-message">
          <img :src=JSON.parse(reply).image_url />
        </div>
      </div>


      <div v-if='JSON.parse(reply).type==="youtubevideo"'>
        <div class="video-message">
          <iframe :src=JSON.parse(reply).video_url frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>

      <div v-if='(JSON.parse(reply).type==="videofile")'>
        <vue-plyr>
          <div class="plyr__video-embed">
            <iframe
              :src=JSON.parse(reply).video_url
              allowfullscreen allowtransparency autoplay allow="">
            </iframe>
          </div>
        </vue-plyr>
      </div>

      
      <div v-if='JSON.parse(reply).type==="vimeo"'>
        <vue-plyr>
          <div class="plyr__video-embed">
            <iframe
              :src=JSON.parse(reply).video_url
              allowfullscreen allowtransparency autoplay allow=""
              >
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

        await this.$teneoApi.sendSilentMessage("replace this reply.postback");
      }
    },
  },
};
</script>

