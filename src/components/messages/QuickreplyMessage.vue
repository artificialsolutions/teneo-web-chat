<template>
  <div class="twc-quickreply-message" :class="{ 'twc-expired': replySent || isExpired }">
    <a
      v-for="(reply, idx) in quickreplies"
      :key="idx"
      role="button"
      :tabindex="replySent || isExpired ? -1 : 0"
      class="twc-quickreply-message__item"
      :class="{ 'twc-selected': replySent && selected === idx, 'twc-primary': reply.style == 'primary', 'twc-secondary': reply.style == 'secondary', 'twc-success': reply.style == 'success', 'twc-danger': reply.style == 'danger', 'twc-warning': reply.style == 'warning', 'twc-info': reply.style == 'info'}"
      @click="onSelect(reply, idx)"
      @keydown="handleReturnSpaceKeys($event, reply, idx)"
    >{{ reply.title }}</a>
  </div>
</template>

<script>
import handleButtonClick, { handleComboButtonClick } from '../../utils/handle-button-click.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';
import { EventBus, events } from '../../utils/event-bus.js';

export default {
  name: 'QuickreplyMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'quickreply' &&
          message.data &&
          message.data.quick_replies &&
          message.data.quick_replies.length > 0
        );
      }
    }
  },
  data() {
    return {
      isComboExpired: false
    };
  },
  mounted() {
    EventBus.$on(events.EXPIRE_PREVIOUS_COMBOS, () => {
        this.isComboExpired = true;
        console.log("events.EXPIRE_PREVIOUS_COMBOS: " + this.isComboExpired)
    });
  },
  computed: {
    quickreplies() {
      return this.message.data.quick_replies;
    },
    replySent() {
      //console.log('reply sent?: '+ !!this.message.selected || this.message.selected === 0 )
      return !!this.message.selected || this.message.selected === 0;
    },
    selected() {
      return this.message.selected;
    },
    msgID() {
      return this.message.msgID
    },
    isPartOfCombo() {
      return this.message.isPartOfCombo
    },
    isExpired() {      
      if((this.message.isPartOfCombo === true)){
        //console.log('isPartOfCombo: TRUE, isComboExpired: '+this.isComboExpired)
        return this.isComboExpired;
      }
      else{
        const { messageList } = this.$teneoApi;
        const latestMessage = messageList[messageList.length - 1];
        return latestMessage && latestMessage !== this.message;
      }
    },
  },
  methods: {
    async onSelect(reply, idx) {
      if (this.replySent || this.isExpired ) {
        return;
      }
      
      if(this.isPartOfCombo){
        console.log("onSelect, msgID: " + this.msgID + ", idx: " + idx)
        await handleComboButtonClick(reply, this.msgID, idx, this.$teneoApi, this.message)
      }
      else{
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
.twc-quickreply-message {
  width: 100%;
  margin-right: 40px;
  display: inline-block;
  text-align: center;
}

.twc-quickreply-message__item {
  border: 1px solid var(--quickreply-border-color, #4e8cff);
  border-radius: 16px;
  padding: 8px 14px 8px 14px;
  color: var(--quickreply-fg-color, #4e8cff);
  cursor: pointer;
  font-size: 0.8em;
  display: inline-block;
  margin: 3px;
}

.twc-quickreply-message__item:active {
  outline:none;
}

.twc-expired .twc-quickreply-message__item {
  outline: none;
}

.twc-quickreply-message__item.twc-selected,
.twc-quickreply-message:not(.twc-expired) .twc-quickreply-message__item:hover {
  background: var(--quickreply-bg-color, #ffffff);
  color: var(--quickreply-fg-color, #4e8cff);
}

.twc-quickreply-message__item.twc-selected,
.twc-quickreply-message:not(.twc-expired) .twc-quickreply-message__item:hover {
  background: var(--quickreply-fg-color, #4e8cff);
  color: var(--quickreply-bg-color, #ffffff);
}

.twc-quickreply-message.twc-expired .twc-quickreply-message__item:not(.twc-selected) {
  cursor: default;
  color: var(--quickreply-expired-color, #a9a9a9);
  border-color: var(--quickreply-expired-color, #a9a9a9);
}

.twc-quickreply-message.twc-expired .twc-quickreply-message__item.twc-selected {
  cursor: default;
  background: var(--quickreply-expired-color, #a9a9a9);
  color: var(--quickreply-bg-color, #ffffff);
  border-color: var(--quickreply-expired-color, #a9a9a9);
}

.twc-quickreply-message__item.twc-secondary {
  color: var(--secondary-color, #6c757d);
  border-color: var(--secondary-color, #6c757d);
}

.twc-quickreply-message:not(.twc-expired) .twc-quickreply-message__item.twc-secondary:hover {
  color: var(--quickreply-bg-color, #ffffff) !important;
  background: var(--secondary-color, #6c757d);
}

.twc-quickreply-message__item.twc-success {
  color: var(--success-color, #28a745);
  border-color: var(--success-color, #28a745);
}

.twc-quickreply-message:not(.twc-expired) .twc-quickreply-message__item.twc-success:hover {
  color: var(--quickreply-bg-color, #ffffff) !important;
  background: var(--success-color, #28a745);
}

.twc-quickreply-message__item.twc-warning {
  border-color: var(--warning-color, #ffc107);
  color: var(--warning-fg-text-color, #c99700);
}

.twc-quickreply-message:not(.twc-expired) .twc-quickreply-message__item.twc-warning:hover {
  color: var(--dark-fg-color, #263238);
  background: var(--warning-color, #ffc107);
}

.twc-quickreply-message__item.twc-danger {
  color: var(--danger-color, #dc3545);
  border-color: var(--danger-color, #dc3545);
}

.twc-quickreply-message:not(.twc-expired) .twc-quickreply-message__item.twc-danger:hover {
  color: var(--quickreply-bg-color, #ffffff);
  background: var(--danger-color, #dc3545);
}

.twc-quickreply-message__item.twc-info {
  color: var(--info-color, #17a2b8);
  border-color: var(--info-color, #17a2b8);
}

.twc-quickreply-message:not(.twc-expired) .twc-quickreply-message__item.twc-info:hover {
  color: var(--quickreply-bg-color, #ffffff);
  background: var(--info-color, #17a2b8);
}

</style>
