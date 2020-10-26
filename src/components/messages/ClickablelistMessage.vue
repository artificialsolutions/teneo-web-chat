<template>
  <div class="twc-clickablelist" :class="{ 'twc-expired': replySent || isExpired }">
    <h5 class="twc-clickablelist-title" v-if="clickablelistTitle">{{ clickablelistTitle }}</h5>
    <ul class="twc-clickablelist-message" :class="{ replied: replySent}">
      <li
        :tabindex="replySent || isExpired ? -1 : 0"
        role="button"
        v-for="(reply, idx) in clickablelistitems"
        :key="idx"
        class="twc-clickablelist-message__item"
        :class="{ 'twc-selected': replySent && selected === idx }"
        @click="onSelect(reply, idx)"
        @keydown="handleReturnSpaceKeys($event, reply, idx)"
      >{{ reply.title }}</li>
    </ul>
  </div>
</template>

<script>
import handleButtonClick from '../../utils/handle-button-click.js';
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
    clickablelistTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    clickablelistitems() {
      return this.message.data.list_items;
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
    async onSelect(reply, idx) {
      if (!this.replySent) {
         await handleButtonClick(reply, idx, this.$teneoApi)
      }
    },
    handleReturnSpaceKeys(event, reply, idx) {
      if (event.code === 'Space' || event.code === 'Enter') {
        this.onSelect(reply, idx)
      }
    },
  },
};
</script>


<style>
.twc-clickablelist {
  background-color: var(--clickablelist-bg-color, #ffffff);
  border: none;
  width: 100%;
  margin-right: 40px;
}

.twc-clickablelist h5 {
  text-align: center;
  font-family: inherit;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 0.6rem;
  font-size: 1em;
  font-weight: 500;
  color: var(--clickablelist-title-color, #263238);
}

.twc-clickablelist.twc-expired h5 {
  color: var(--expired-color, #a9a9a9);
}

.twc-clickablelist-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.twc-clickablelist-message__item {
  border-bottom: 1px solid var(--light-border-color, #c9c9c9);
  border-right: 1px solid var(--light-border-color, #c9c9c9);
  border-left: 1px solid var(--light-border-color, #c9c9c9);
  padding: 8px 14px 8px 14px;
  color: var(--clickablelist-fg-color, #263238);
  cursor: pointer;
  font-size: 0.9em;
}

.twc-clickablelist-message__item:active {
  outline:none;
}

.twc-expired .twc-clickablelist-message__item {
  outline: none;
}

.twc-clickablelist-message__item:first-child {
  border-top: 1px solid var(--light-border-color, #c9c9c9);
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.twc-clickablelist-message__item:last-child {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0.25rem;
}

.twc-clickablelist-message__item.twc-selected,
.twc-clickablelist-message:not(.replied) .twc-clickablelist-message__item:hover {
  background-color: var(--clickablelist-selected-bg-color, #eceff1);
  color: var(--clickablelist-selected-fg-color, #263238);
}

.twc-clickablelist-message.replied .clickablelist-message__item {
  cursor: default;
  color: var(--expired-color, #a9a9a9);
}

.twc-clickablelist.twc-expired .twc-clickablelist-message__item,
.twc-clickablelist.twc-expired .twc-clickablelist-message__item:hover {
  cursor: default;
  color: var(--expired-color, #a9a9a9);
  background-color: var(--clickablelist-bg-color, #ffffff);
}

.twc-clickablelist.twc-expired .twc-clickablelist-message__item.twc-selected,
.twc-clickablelist.twc-expired .twc-clickablelist-message__item.twc-selected:hover {
  cursor: default;
  background-color: var(--clickablelist-selected-bg-color, #eceff1);
  color: var(--expired-color, #a9a9a9);
}

</style>