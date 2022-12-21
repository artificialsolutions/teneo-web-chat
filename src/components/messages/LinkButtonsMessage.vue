<template>
  <div class="twc-linkbuttons">
    <h5 class="twc-linkbuttons-title" v-if="buttonsTitle">{{ buttonsTitle }}</h5>
      <a
        role="link"
        v-for="(button, idx) in linkbuttons"
        :key="idx"
        :href="button.url"
        :target="button.target"
        :rel="button.target === '_blank' ? 'noopener': false"
        class="twc-linkbutton"
        @click="onClick(button, $event)"
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
  border: 1px solid var(--link-button-border-color, #c9c9c9) !important;
  color: var(--link-button-fg-color, #007bff) !important;
  background: var(--link-button-bg-color, #ffffff) !important;
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
</style>
