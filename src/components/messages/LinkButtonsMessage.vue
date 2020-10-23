<template>
  <div class="twc-linkbuttons-message">
    <div>
    <a
      v-for="(button, idx) in linkbuttons"
      :href="`${button.link}`"
      :target="`${button.target}`"
      :key="idx"
      role="button"
      class="twc-linkbuttons-message__item"
      :class="{ 'twc-primary': button.style == 'primary', 'twc-secondary': button.style == 'secondary', 'twc-success': button.style == 'success', 'twc-danger': button.style == 'danger', 'twc-warning': button.style == 'warning', 'twc-info': button.style == 'info'}"
      v-on:click="onClick(button, idx, $event)"
    >{{ button.title }}</a>
    </div>
  </div>
</template>

<script>
import { API_ON_LINKBUTTON_CLICK } from '../../utils/api-function-names.js';
import handleExtension from '../../utils/handle-extension.js';
import basePayload from '../../utils/base-payload';

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
    linkbuttons() {
      return this.message.data.linkbutton_items;
    }
  },
  methods: {
    async onClick(linkbutton, idx, event) {
      // check if there is an extension that want to intercept the new event
      const payload = basePayload();
      payload.linkbutton = JSON.parse(JSON.stringify(linkbutton))
      await handleExtension(API_ON_LINKBUTTON_CLICK, payload);
      // abort if extension says so
      if (payload.handledState.handled === true) {
        if (event) {
          event.preventDefault()
        }
        return
      }
    },
  },
};
</script>

<style>
.twc-linkbuttons-message {
  width: 100%;
  margin-right: 40px;
  display: inline-block;
  text-align: center;
}

.twc-linkbuttons-message__item {
  border: 1px solid var(--linkbuttons-border-color, #4e8cff);
  border-radius: 16px;
  padding: 8px 14px 8px 14px;
  color: var(--linkbuttons-fg-color, #4e8cff);
  cursor: pointer;
  font-size: 0.8em;
  display: inline-block;
  margin: 3px;
}

.twc-linkbuttons-message__item.twc-secondary {
  color: var(--secondary-color, #6c757d);
  border-color: var(--secondary-color, #6c757d);
}

.twc-linkbuttons-message .twc-linkbuttons-message__item.twc-secondary:hover {
  color: var(--linkbuttons-bg-color, #ffffff) !important;
  background: var(--secondary-color, #6c757d);
}

.twc-linkbuttons-message__item.twc-success {
  color: var(--success-color, #28a745);
  border-color: var(--success-color, #28a745);
}

.twc-linkbuttons-message .twc-linkbuttons-message__item.twc-success:hover {
  color: var(--linkbuttons-bg-color, #ffffff) !important;
  background: var(--success-color, #28a745);
}

.twc-linkbuttons-message__item.twc-warning {
  border-color: var(--warning-color, #ffc107);
  color: #e0a800;
}

.twc-linkbuttons-message .twc-linkbuttons-message__item.twc-warning:hover {
  color: var(--dark-fg-color, #263238);
  background: var(--warning-color, #ffc107);
}

.twc-linkbuttons-message__item.twc-danger {
  color: var(--danger-color, #dc3545);
  border-color: var(--danger-color, #dc3545);
}

.twc-linkbuttons-message .twc-linkbuttons-message__item.twc-danger:hover {
  color: var(--linkbuttons-bg-color, #ffffff);
  background: var(--danger-color, #dc3545);
}

.twc-linkbuttons-message__item.twc-info {
  color: var(--info-color, #17a2b8);
  border-color: var(--info-color, #17a2b8);
}

.twc-linkbuttons-message:not(.expired) .twc-linkbuttons-message__item.twc-info:hover {
  color: var(--linkbuttons-bg-color, #ffffff);
  background: var(--info-color, #17a2b8);
}

</style>
