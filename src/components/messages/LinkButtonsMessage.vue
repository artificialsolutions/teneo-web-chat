<template>
  <div class="twc-linkbuttons">
    <h5 class="twc-linkbuttons-title" v-if="buttonsTitle">{{ buttonsTitle }}</h5>
      <a
        role="button"
        v-for="(button, idx) in linkbuttons"
        :key="idx"
        :href="button.link"
        :target="button.target"
        class="twc-linkbutton"
        :class="{'twc-primary': button.style == 'primary', 'twc-secondary': button.style == 'secondary', 'twc-success': button.style == 'success', 'twc-danger': button.style == 'danger', 'twc-warning': button.style == 'warning', 'twc-info': button.style == 'info'}"
        @click="onClick(button, $event)"
      >{{ button.title }}</a>
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
    buttonsTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    linkbuttons() {
      return this.message.data.linkbutton_items;
    },
    // replySent() {
    //   return !!this.message.selected || this.message.selected === 0;
    // },
    // selected() {
    //   return this.message.selected;
    // },
    // isExpired() {
    //   const { messageList } = this.$teneoApi;
    //   const latestMessage = messageList[messageList.length - 1];

    //   return latestMessage && latestMessage !== this.message;
    // },
  },
  methods: {
    async onClick(linkbutton, event) {
      console.log("Link button clicked")

      // check if there is an extension that want to intercept the new event
      let payload = basePayload();
      payload.linkbutton = JSON.parse(JSON.stringify(linkbutton))
      console.log("before handleExtension", payload)
      await handleExtension(API_ON_LINKBUTTON_CLICK, payload);
      
      // abort if extension says so
      console.log("after handleExtension", payload)

      if (payload.handledState.handled === true) {
        console.log("Abort mission")
        if (event) {
          event.preventDefault()
        }
        
      } else {
        return
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
  border: 1px solid var(--button-bg-color, #4e8cff);
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
  border-radius: 0.25rem;
  min-width: 62px;
  display: inline-block;
  margin: 3px;
  text-decoration: none;
}

.twc-linkbutton:hover {
  color: var(--button-bg-color, #4e8cff);
  background: var(--button-fg-color, #ffffff);
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

.twc-linkbutton.twc-secondary {
  background: var(--secondary-color, #6c757d);
  border-color: var(--secondary-color, #6c757d);
}

.twc-linkbutton.twc-secondary:hover {
  color: var(--secondary-color, #6c757d) !important;
  background: var(--button-fg-color, #ffffff);
}

.twc-linkbutton.twc-success {
  background: var(--success-color, #28a745);
  border-color: var(--success-color, #28a745);
}

.twc-linkbutton.twc-success:hover {
  color: var(--success-color, #28a745) !important;
  background: var(--button-fg-color, #ffffff);
}

.twc-linkbutton.twc-warning {
  background: var(--warning-color, #ffc107);
  border-color: var(--warning-color, #ffc107);
  color: var(--dark-fg-color, #263238);
}

.twc-linkbutton.twc-warning:hover {
  color: var(--warning-color, #ffc107) !important;
  background: var(--button-fg-color, #ffffff);
}

.twc-linkbutton.twc-danger {
  background: var(--danger-color, #dc3545);
  border-color: var(--danger-color, #dc3545);
}

.twc-linkbutton.twc-danger:hover {
  color: var(--danger-color, #dc3545) !important;
  background: var(--button-fg-color, #ffffff);
}

.twc-linkbutton.twc-info {
  background: var(--info-color, #17a2b8);
  border-color: var(--info-color, #17a2b8);
}

.twc-linkbutton.twc-info:hover {
  color: var(--info-color, #17a2b8) !important;
  background: var(--button-fg-color, #ffffff);
}

</style>
