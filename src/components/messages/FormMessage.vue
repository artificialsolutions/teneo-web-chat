<template>
  <form class="twc-form" v-on:submit="handleFormSubmit" id="twcActiveForm">
    <component v-for="(element, idx) in formElements" :key="idx" :is="elementTag(element)">
      {{ element.text }}
      <h2 class="twc-form-title" v-if="element.type==='title'">{{ element.text }}</h2>
      <h3 class="twc-form-subtitle" v-if="element.type==='subtitle'">{{ element.text }}</h3>
      <label v-if="element.type === 'label'">{{ element.text }}</label>
      <label v-if="element.hasOwnProperty('label')" :for="idx">{{ element.label }}</label>
      <input class="twc-input-field" v-if="element.type==='input'" v-bind="element.attributes"/>
      <textarea v-if="element.type==='textarea'" v-bind="element.attributes">{{ element.text }}</textarea>

      <select v-if="element.type==='select'" v-bind="element.attributes">
        <option v-for="(option) in element.options" v-bind="option.attributes">
          {{ option.text }}
        </option>
      </select>

      <output v-if="element.type === 'output'"></output>
      <small v-if="element.type==='caption'">{{ element.text }}</small>
      <button v-if="element.type === 'control' && element.action === 'submit'" class="twc-form-submit-btn"
              type="submit">{{ element.text }}
      </button>
      <button v-if="element.type === 'control' && element.action === 'cancel'" class="twc-form-cancel-btn" type="button"
              @click="handleFormCancel">{{ element.text }}
      </button>
    </component>
  </form>
</template>
<script>

import {PARTICIPANT_BOT} from '../../utils/constants.js';
import handleButtonClick from '../../utils/handle-button-click.js';
import {EventBus, events} from '../../utils/event-bus.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';
import sanitizeHtml from '../../utils/sanitize-html.js';

export default {
  name: 'FormMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        let hasSubmit = true;
        let hasCancel = true;
        let hasContent = message && message.data && message.data.elements && message.data.elements.length > 2

        message.data.elements.forEach((element) => {
          if (element.type === "control") {
            if (element.action.toLowerCase().trim() === "submit") {
              hasSubmit = true;
            } else if (element.action.toLowerCase().trim() === "cancel") {
              hasCancel = true;
            }
          }
        })

        return (
            message.type === 'form' &&
            hasContent &&
            hasCancel &&
            hasSubmit
        );
      },
    },
  },
  computed: {
    formElements() {
      return this.message.data.elements;
    }
  },
  methods: {
    elementTag(elementData) {
      console.log(elementData);
      let tag = '';
      switch (elementData.type){
        case 'title':
          tag = 'h2'
        break;
        case 'subtitle':
          tag = 'h2'
          break;
          case 'control':
          tag = 'button'
          break;
          case 'caption':
          tag = 'small'
          break;
          default:
            tag = elementData.type
      }
      return tag;
    },
    handleReturnSpaceKeys(event, reply, idx) {
      if (keyIsSpaceOrEnter(event)) {
        this.onSelect(reply, idx)
      }
    },
    sanitizedHtmlText(text) {
      return sanitizeHtml(text);
    },
    handleFormSubmit(e) {
      e.preventDefault();
      let formEl = document.forms.twcActiveForm;
      let formData = new FormData(formEl);
      console.log(e, formData);


    },

    handleFormCancel(e) {
      console.log(e);
    }
  },
};
</script>

<style>
.twc-form {
  background: var(--form-background-color);
}
</style>