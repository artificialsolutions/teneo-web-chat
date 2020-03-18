<template>
  <div class="clickablelist" :class="messageSource">
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
</template>

<script>
export default {
  name: 'ClickablelistMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'clickablelist' &&
          message.data &&
          message.data.list_items &&
          message.data.list_items.length > 0
        );
      },
    },
  },
  computed: {
    clickablelistitems() {
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
  },
  methods: {
    async onSelect(reply, idx) {
      if (!this.replySent) {
        const numMessages = this.$teneoApi.messageList.length;
        const messages = this.$teneoApi.messageList.slice(0, numMessages - 1);
        const clickablelistMessage = this.$teneoApi.messageList[
          numMessages - 1
        ];

        const selectedItem = { ...clickablelistMessage, selected: idx };

        this.$teneoApi.messageList = [...messages, selectedItem];

        await this.$teneoApi.sendSilentMessage(reply.postback);
      }
    },
  },
};
</script>


<style>
.clickablelist-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.clickablelist.bot {
  background-color: #fff;
  margin-right: 40px;
  border: none;
  width: 100%;
}

.clickablelist-message__item {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  padding: 8px 14px 8px 14px;
  color: #323e48;
  cursor: pointer;
  font-size: 0.8rem;
}

.clickablelist-message__item:first-child {
  border-top: 1px solid #ccc;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.clickablelist-message__item:last-child {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 12px;
}

.clickablelist-message__item.selected,
.clickablelist-message:not(.replied) .clickablelist-message__item:hover {
  background-color: #eceff1;
}

.clickablelist-message.replied .clickablelist-message__item {
  cursor: default;
}

.clickablelist-message__item i.material-icons {
  font-size: 1rem;
  float: right;
}
</style>