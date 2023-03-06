<template>
  <div class="twc-clickablelist" :class="{ 'twc-expired': replySent || isExpired }">
    <h5 class="twc-clickablelist-title">Message types</h5>
    <!--<h5 class="twc-clickablelist-title" v-if="clickablelistTitle">{{ clickablelistTitle }}</h5>-->
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
      ><span>{{ reply.title }}</span></li>
    </ul>
  </div>
</template>


<script>
import handleButtonClick from '../../utils/handle-button-click.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';

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
      if (!this.replySent && !this.isExpired ) {
         await handleButtonClick(reply, idx, this.$teneoApi)
      }
    },
    handleReturnSpaceKeys(event, reply, idx) {
      if (keyIsSpaceOrEnter(event)) {
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
  border-top-left-radius: 0px;
  width: 100%;
  margin-right: 40px;
  padding: 0;
  box-shadow: none;
}

.twc-clickablelist h5 {
  text-align: center;
  font-family: inherit;
  line-height: 1.2;
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  margin: 0;
  font-size: 1em;
  font-weight: 500;
  color: var(--clickablelist-title-color, #263238);
  border-bottom: none;
}

.twc-clickablelist.twc-expired{
  color: var(--expired-color, #a9a9a9);
  background: none;
}

.twc-clickablelist-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  padding: 0px;
  margin: 0;
  border-radius: 3px;
}

.twc-clickablelist-message li {
 background-color: white;
 border: 1px solid #e2e2e2;
 margin: 4px 0px;
 box-shadow: 0 2px 4px 0 rgba(85, 87, 85, 0.3);
 border-radius: 5px;
}

.twc-clickablelist-message__item  span{
  /**border-bottom: 1px solid var(--light-border-color, #c9c9c9);
  border-right: 1px solid var(--light-border-color, #c9c9c9);
  border-left: 1px solid var(--light-border-color, #c9c9c9);**/
  border: none;
  padding: 8px 4px;
  color: var(--clickablelist-fg-color, #263238);
  cursor: pointer;
  font-size: 0.9em;
  border: none;
  display: inline-block;
  border-bottom: none;
  border-top: none;
  text-align: left;
}

.twc-clickablelist-message__item span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}



.twc-clickablelist-message__item span:after {
  content: '\00bb';
  position: absolute;
  font-size: 20px;
  opacity: 0;
  top: 13%;
  right: -10px;
  transition: 0.3s;
}

.twc-clickablelist-message__item:hover span {
  padding-right: 25px;
}

.twc-clickablelist-message__item:hover span:after {
  opacity: 1;
  right: 0;
}


.twc-clickablelist-message__item:active {
  outline: none;
}

.twc-expired .twc-clickablelist-message__item {
  outline: none;
}

li.twc-selected,
.twc-clickablelist-message:not(.replied) li:hover {
  background-color: rgba(47, 40, 110,0.2);
  box-shadow: 0 1px 2px 0 rgba(85, 87, 85, 0.2);
  color: black;
  padding: 2px;
  margin: 2px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.twc-clickablelist-message.replied .clickablelist-message__item {
  cursor: default;
  color: var(--expired-color, #a9a9a9);
}

.twc-clickablelist.twc-expired .twc-clickablelist-message__item,
.twc-clickablelist.twc-expired .twc-clickablelist-message__item:hover {
  cursor: default;
  color: var(--expired-color, #a9a9a9);
  background-color: var(--expired-bg-color, #a9a9a9);
  box-shadow: 0 1px 2px 0 rgba(85, 87, 85, 0.2);
  opacity: 0.7;
}

.twc-clickablelist.twc-expired .twc-clickablelist-message__item.twc-selected,
.twc-clickablelist.twc-expired .twc-clickablelist-message__item.twc-selected:hover { 
  cursor: default;
  background-color: #c2c2c2;
  color: #616060;
}

.twc-clickablelist.twc-expired .twc-clickablelist-message__item:hover span:after {
  opacity: 0;
}

.twc-clickablelist.twc-expired .twc-clickablelist-message__item span, 
.twc-clickablelist.twc-expired .twc-clickablelist-message__item span:hover {
  cursor:default;
}

</style>