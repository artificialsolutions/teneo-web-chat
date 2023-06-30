<template>
  <div class="twc-buttons" :class="{ 'twc-expired': replySent || isExpired}">
    <h5 class="twc-buttons-title" v-if="buttonsTitle">{{ buttonsTitle }}</h5>
    <a
        role="button"
        :tabindex="replySent || isExpired ? -1 : 0"
        v-for="(button, idx) in buttonitems"
        :key="idx"
        class="twc-btn"
        :class="{
          'twc-selected': replySent && selected === idx,
          'twc-primary': button.style === 'primary',
          'twc-secondary': button.style === 'secondary',
          'twc-success': button.style === 'success',
          'twc-danger': button.style === 'danger',
          'twc-warning': button.style === 'warning',
          'twc-info': button.style === 'info',
          'twc-star': button.style === 'star'
        }"
        @click="onSelect(button, idx)"
        @keydown="handleReturnSpaceKeys($event, button, idx)"
    >
      <span>{{ button.title }}</span>
      <StarIcon v-if="button.style=='star'" class="twc-star-icon"/>
    </a>
  </div>
</template>

<script>

import handleButtonClick from '../../utils/handle-button-click.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';
import StarIcon from '../../icons/x.vue';

export default {
  name: 'ButtonsMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
            message &&
            message.type === 'buttons' &&
            message.data &&
            message.data.button_items &&
            message.data.button_items.length > 0
        );
      },
    },
  },
  components: {
    StarIcon
  },
  computed: {
    buttonsTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    buttonitems() {
      return this.message.data.button_items;
    },
    replySent() {
      return !!this.message.selected || this.message.selected === 0;
    },
    selected() {
      return this.message.selected;
    },
    isExpired() {
      const {messageList} = this.$teneoApi;
      const latestMessage = messageList[messageList.length - 1];

      return latestMessage && latestMessage !== this.message;
    },
  },
  methods: {
    async onSelect(button, idx) {
      if (this.replySent || this.isExpired) {
        return;
      }
      await handleButtonClick(button, idx, this.$teneoApi)
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
  .twc-buttons {
    width: 100%;
    margin: -3px;
    margin-right: 37px;
    margin-bottom: 10px;
    text-align: center;
  }

  /** General button configuration */
  .twc-btn {
    border: none;
    background: var(--button-bg-color, #4e8cff);
    color: var(--button-fg-color, #ffffff);
    cursor: pointer;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 0.375rem 0.75rem;
    font-size: 0.9em;
    line-height: 1.5;
    border-radius: 50px;
    min-width: 62px;
    display: inline-block;
    margin: 5px;
    text-decoration: none;
    transition: all 0.5s;
    box-shadow: 0 4px 8px 0 rgba(85, 87, 85, 0.7);
  }

  /** General clicked button */
  .twc-btn:active {
    outline: none;
    box-shadow: 0 2px 4px 0 rgba(85, 87, 85, 0.7);
  }

  /** Expired button */
  .twc-expired .twc-btn {
    outline: none;
  }

  .twc-expired .twc-btn:active {
    box-shadow: 0 4px 8px 0 rgba(85, 87, 85, 0.7);
  }

  .twc-expired .twc-btn.twc-selected:active {
    box-shadow: 0 4px 8px 0 rgba(85, 87, 85, 0.7);
  }

  /** The user hasn't selected anything yet */
  .twc-btn.twc-selected,
  .twc-btn:not(.twc-expired):hover {
    color: var(--button-bg-color, #4e8cff);
    background: var(--button-fg-color, #ffffff);
    box-shadow: 0 1px 2px 0 rgba(85, 87, 85, 0.7);
  }

  .twc-buttons.twc-selected,
  .twc-buttons:not(.twc-expired) .twc-btn:hover {
    color: var(--button-bg-color, #4e8cff);
    background: var(--button-fg-color, #ffffff);
    box-shadow: 0 4px 8px 0 rgba(85, 87, 85, 0.7);
    font-size: 0.9rem;
    padding: 0.475rem 0.75rem;
  }

  /** The user has already moved on and the buttons are expired */
  .twc-buttons.twc-expired .twc-btn,
  .twc-buttons.twc-expired .twc-btn:hover {
    cursor: default;
    color: var(--expired-color, #a9a9a9);
    background: var(--button-fg-color, #ffffff);
    border: 1px solid var(--expired-color, #a9a9a9);
  }

  .twc-buttons.twc-expired .twc-btn.twc-selected {
    cursor: default;
    color: var(--button-fg-color, #ffffff);
    background: var(--expired-color, #a9a9a9);
    border: 1px solid var(--expired-color, #a9a9a9);
  }

  /** Buttons title */
  .twc-buttons h5 {
    text-align: center;
    font-family: inherit;
    line-height: 1.2;
    margin-top: 0.6rem;
    margin-bottom: 0.6rem;
    font-size: 1em;
    font-weight: 500;
    color: var(--buttons-title-color, #263238);
  }

  .twc-buttons.twc-expired h5 {
    color: var(--expired-color, #a9a9a9);
  }

  /** Primary button: don't know yet if it's necessary */
  .twc-btn.twc-primary {
    border: 1px solid var(--button-bg-color, #4e8cff);
    background: var(--button-bg-color, #4e8cff);
  }

  .twc-buttons:not(.twc-expired) .twc-btn.twc-primary:hover {
    color: var(--button-fg-color, #ffffff);
    background: var(--primary-color-dark, #160d27);
    border-color: var(--primary-color-dark, #160d27);
  }

  /** Secondary button */
  .twc-btn.twc-secondary {
    background: var(--secondary-color, #6c757d);
    border-color: var(--secondary-color, #6c757d);
  }

  .twc-buttons:not(.twc-expired) .twc-btn.twc-secondary:hover {
    color: var(--button-fg-color, #ffffff);
    background: var(--secondary-color-dark, #4e5459);
    border-color: var(--secondary-color-dark, #4e5459);
  }

  /** Success button */
  .twc-btn.twc-success {
    background: var(--success-color, #28a745);
    border-color: var(--success-color, #28a745);
  }

  .twc-buttons:not(.twc-expired) .twc-btn.twc-success:hover {
    color: var(--button-fg-color, #ffffff);
    background: var(--success-color-dark, #1c7932);
    border-color: var(--success-color-dark, #1c7932);
  }

  /** Warning button */
  .twc-btn.twc-warning {
    background: var(--warning-color, #ffc107);
    border-color: var(--warning-color, #ffc107);
  }

  .twc-buttons:not(.twc-expired) .twc-btn.twc-warning:hover {
    color: var(--button-fg-color, #ffffff);
    background: var(--warning-color-dark, #c79605);
    border-color: var(--warning-color-dark, #c79605);
  }

  /** Danger button */
  .twc-btn.twc-danger {
    background: var(--danger-color, #dc3545);
    border-color: var(--danger-color, #dc3545);
  }

  .twc-buttons:not(.twc-expired) .twc-btn.twc-danger:hover {
    color: var(--button-fg-color, #ffffff);
    background: var(--danger-color-dark, #ac2936);
    border-color: var(--danger-color-dark, #ac2936);
  }

  /** Info button */
  .twc-btn.twc-info {
    background: var(--info-color, #17a2b8);
    border-color: var(--info-color, #17a2b8);
  }

  .twc-buttons:not(.twc-expired) .twc-btn.twc-info:hover {
    color: var(--button-fg-color, #ffffff);
    background: var(--info-color-dark, #0e798a);
    border-color: var(--info-color-dark, #0e798a);
  }
</style>
