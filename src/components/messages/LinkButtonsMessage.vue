<template>
  <div class="twc-linkbuttons">
    <h5 class="twc-linkbuttons-title" v-if="buttonsTitle">{{ buttonsTitle }}</h5>
      <a
        role="link"
        v-for="(button, idx) in linkbuttons"
        :key="idx"
        :href="button.url"
        :target="button.target"
        class="twc-linkbutton"
        @click="onClick(button, $event)"
        @keydown="handleReturnSpaceKeys($event, button, idx)"
      >{{ button.title }}</a>
  </div>
</template>

<script>
import handleLinkButtonClick from '../../utils/handle-linkbutton-click.js';

export default {
  name: 'LinkbuttonsMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'linkbuttons' &&
          message.data &&
          message.data.linkbutton_items &&
          message.data.linkbutton_items.length > 0
        );
      },
    },
  },
  computed: {
    buttonsTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    linkbuttons() {
      return this.message.data.linkbutton_items;
    },
  },
  methods: {
    async onClick(linkbutton, event) {
      await handleLinkButtonClick(linkbutton, event)
    },
    async handleReturnSpaceKeys(event, linkbutton, idx) {
      if (event.code === 'Space' || event.code === 'Enter') {
        this.onClick(linkbutton, idx)
      }
    },
  },
};
</script>

<style scoped>
.twc-linkbuttons {
  width: 100%;
  margin: -3px;
  margin-right: 37px;
  text-align: center;
}
</style>

<style>
.twc-linkbutton {
  border: 1px solid var(--light-border-color) !important;
  color: var(--link-button-fg-color, #007bff) !important;
  background: var(--light-fg-color, #ffffff) !important;
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
  border-radius: 0.25rem;
  /* min-width: 62px; */
  display: inline-block;
  margin: 3px;
  text-decoration: none;
}

.twc-linkbutton:hover {
  text-decoration: underline;
}

.twc-linkbuttons h5 {
  text-align: center;
  font-family: inherit;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 0.6rem;
  font-size: 1em;
  font-weight: 500;
  color: var(--buttons-title-color, #263238);
}
/* 
.twc-linkbutton.twc-secondary {
  color: var(--secondary-color, #6c757d);
}

.twc-linkbutton.twc-success {
  color: var(--success-color, #28a745);
}

.twc-linkbutton.twc-warning, .twc-linkbutton.twc-warning:hover {
  color: var(--warning-fg-text-color, #c99700) !important;
}

.twc-linkbutton.twc-danger {
  color: var(--danger-color, #dc3545);
}

.twc-linkbutton.twc-info {
  color: var(--info-color, #17a2b8);
} */

/* .twc-linkbuttons a[target="_blank"]::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cline x1='3.5' y1='1.5' x2='0.5' y2='1.5' fill='currentColor' stroke='currentColor' stroke-linecap='square' stroke-miterlimit='10'/%3E%3Cline x1='0.5' y1='9.5' x2='0.5' y2='1.5' fill='currentColor' stroke='currentColor' stroke-linecap='square' stroke-miterlimit='10'/%3E%3Cline x1='8.5' y1='9.5' x2='0.5' y2='9.5' fill='currentColor' stroke='currentColor' stroke-linecap='square' stroke-miterlimit='10'/%3E%3Cline x1='8.5' y1='6.5' x2='8.5' y2='9.5' fill='currentColor' stroke='currentColor' stroke-linecap='square' stroke-miterlimit='10'/%3E%3Cline x1='4.5' y1='5.5' x2='9.5' y2='0.5' fill='currentColor' stroke='currentColor' stroke-miterlimit='10'/%3E%3Cline x1='9.5' y1='3.5' x2='9.5' y2='0.5' fill='currentColor' stroke='currentColor' stroke-linecap='square' stroke-miterlimit='10'/%3E%3Cline x1='6.5' y1='0.5' x2='9.5' y2='0.5' fill='currentColor' stroke='currentColor' stroke-linecap='square' stroke-miterlimit='10'/%3E%3C/svg%3E");
  background-size: 10px 10px;
  display: inline-block;
  width: 10px; 
  height: 10px;
  margin: 0 3px 0 5px;
  content:"";
  filter: initial !important;
} */
</style>
