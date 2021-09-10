<template>
  <form class="twc-form" v-on:submit="handleFormSubmit" id="twcActiveForm">
    <!--@formatter:off-->
    <component v-for="(element, idx) in formElements"
               :key="idx"
               :is="elementTag(element.type)"
               v-bind="elementAttributes(element)"
               v-on="elementListeners(element)"
               :id="elementId(element, idx)"
               :name="elementName(element, idx)"
    >{{elementText(element.text)}}<option
          v-if="element.type==='select'"
          v-for="(option) in element.options"
          v-bind="elementAttributes(option)"
      >{{ option.text }}</option
    ><label
        v-if="element.hasOwnProperty('label')"
        :for="elementId(element, idx)"
        :class="labelClasses(element)"
    >{{ labelText(element) }}</label>
    </component>
    <!--@formatter:on-->
  </form>
</template>
<script>


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
        let hasSubmit = false;
        let hasCancel = false;
        let hasContent = message && message.data && message.data.elements && message.data.elements.length > 2
        let legalTypes = ['control', 'title', 'subtitle', 'caption', 'input', 'textarea', 'select', 'label']
        let hasOnlyLegalTypes = false;

        message.data.elements.forEach((element) => {
          if (element.type === "control") {
            if (element.action === "submit") {
              hasSubmit = true;
            } else if (element.action === "cancel") {
              hasCancel = true;
            }
          } else if (element.type === 'input' && !element.attributes.type) {
            element.attributes.type = 'text'
          }

          if (legalTypes.includes(element.type)) {
            hasOnlyLegalTypes = true;
          } else {
            console.error('Unknown form element type');
          }
        })

        return (
            message.type === 'form' &&
            hasContent &&
            hasOnlyLegalTypes &&
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
  mounted() {
    let associatedLabels = this.$el.querySelectorAll('.twc-form-associated-label');

//Move all auto-generated labels one level up so that the precede the field rather than being contained in it.
    for (let label of associatedLabels) {
      this.$el.insertBefore(label, label.parentNode);
    }
    EventBus.$emit(events.DISABLE_INPUT);


    if (this.message.data.expired) {
      this.$el.removeAttribute('id')
      this.$el.classList.add('twc-expired');
    }

  },
  methods: {
    labelClasses(element) {
      let classes = 'twc-form-label twc-form-associated-label'
      if (element.hasOwnProperty('attributes') && (element.attributes.type === 'radio' || element.attributes.type === 'checkbox')) {
        classes += ' twc-form-attached-label'
      }
      return classes;
    },
    labelText(element) {
      let text = element.label;
      if (element.hasOwnProperty('attributes') && element.attributes.required) {
        text += '*'
      }
      return text
    },
    elementId(element, idx) {
      let currentId = 'twc-form-element-' + element.type + '_' + idx;
      if (element.hasOwnProperty('attributes')) {
        if (element.attributes.hasOwnProperty('id')) {
          currentId = element.attributes.id;
        } else if (element.attributes.type) {
          currentId = 'twc-form-element-' + element.type + '_' + element.attributes.type + '_' + idx;
        }
      }
      return currentId

    },
    elementName(element, idx) {
      if (element.hasOwnProperty('attributes')) {
        if (element.attributes.hasOwnProperty('name')) {
          return element.attributes.name;
        } else if (element.attributes.hasOwnProperty('type')) {
          return element.type + '_' + element.attributes.type + '_' + idx;
        } else {
          return element.type + '_' + idx;
        }
      }
    },
    elementTag(elementType) {
      let tag = '';
      switch (elementType) {
        case 'title':
          tag = 'h2'
          break;
        case 'subtitle':
          tag = 'h3'
          break;
        case 'control':
          tag = 'button'
          break;
        case 'caption':
          tag = 'small'
          break;
        default:
          tag = elementType
      }
      return tag;
    },
    elementAttributes(elementData) {
      let attributes = elementData.attributes || {}
      let type = elementData.type || 'option';

      attributes.class = 'twc-form-' + type;
      if (type === 'control') {
        attributes.class += ' twc-form-' + elementData.action;
        if (elementData.action === 'submit') {
          attributes.type = 'submit';
        } else if ('cancel') {
          attributes.type = 'button'
        } else {
          console.error('Unrecognized action');
        }
      } else if (type === 'input' && attributes.type === 'reset') {
        attributes.class += ' twc-form-' + 'reset';
      }
      return attributes
    },
    elementListeners(element) {
      if (element.type === 'control' && element.action === 'cancel') {
        return {
          'click': () => {
            this.handleFormCancel(element)
          }
        }
      } else {
        return {};
      }
    },
    elementText(text) {
      if (text) return text.trim()
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
      let formData = Object.fromEntries(new FormData(this.$el).entries());
      formData.success = true;
      this.$teneoApi.sendSilentMessage(JSON.stringify(formData));
      e.preventDefault();
      this.decommissionForm();

    },
    handleFormCancel(e) {
      this.$teneoApi.sendSilentMessage(JSON.stringify({success: false}));
      this.decommissionForm();
    },

    decommissionForm() {

      EventBus.$emit(events.ENABLE_INPUT);
      let form = this.$el;
      form.removeAttribute('id');
      form.classList.add('twc-expired');

      let elements = this.message.data.elements;
      let elementIndex = 0;

      form.childNodes.forEach((node) => {

        node.setAttribute('disabled', true);
        node.removeAttribute('id');

        if (elements[elementIndex].type === 'label') {
          elements[elementIndex].attributes = {disabled: true};
          elementIndex++;
        }
        let currentElement = elements[elementIndex];
        if (node.nodeName.toUpperCase() !== 'LABEL') {
          if (currentElement) {
            currentElement.attributes = currentElement.attributes || {}
            currentElement.attributes.disabled = true;
            currentElement.attributes.id = 'twc-form-expired-element';


            switch (currentElement.type) {
              case 'input':
                switch (currentElement.attributes.type) {
                  case 'text':
                  case 'date':
                  case 'time':
                  case 'datetime-local':
                  case 'color':
                  case 'range':
                  case 'textarea':
                    currentElement.attributes.value = node.value;
                    break;
                  case 'checkbox':
                  case 'radio':
                    currentElement.attributes.checked = node.checked
                    break;

                }
                break;
              case 'select':
                break;
            }
          }
          elementIndex++;
        }
      })

      form.setAttribute('disabled', true);

      this.message.data.elements = elements;

      this.message.data.expired = true;

      this.$teneoApi.messageList[this.$teneoApi.messageList.length - 1] = this.message;

      this.$destroy();
    }

  },
};
</script>

<style>
.twc-form {
  background: var(--form-background-color);
  display: flex;
  flex-direction: column;
  flex-flow: wrap;
  border-radius: 10px 10px 10px 0;
}


.twc-form-title {
  flex-basis: 100%;
  text-align: center;
  color: var(--form-title-text-color);
  margin: 5px;
}

.twc-form-subtitle {
  flex-basis: 100%;
  text-align: center;
  color: var(--form-subtitle-text-color);
  margin: 5px;
}

.twc-form-caption {
  flex-basis: 100%;
  text-align: center;
  color: var(--form-caption-text-color);
  margin-bottom: 5%;
}

.twc-form.twc-expired * {
  opacity: 50%;
}

.twc-form-label {
  flex-basis: 100%;
  color: var(--form-label-text-color);
  font-size: 0.9em;
  font-family: var(--primary-font);
  margin: 10px 5% 5px 5%;
}

.twc-form-label.twc-form-attached-label {
  flex-basis: auto;
  line-height: 1.5;
}

.twc-form-textarea {
  flex-basis: 90%;
  margin: auto;
  background: var(--form-input-background-color);
  min-height: 2.5em;
}

.twc-form-select {
  flex-basis: 90%;
  margin: auto;
  background: var(--form-input-background-color);
}

.twc-form-select.twc-form-option {

}

.twc-form-control {
  flex: 1 1 auto;
  border-radius: 5px;
  padding: 5px;
  margin: 5%;
}

.twc-form-control.twc-form-submit:not([disabled]) {
  color: var(--form-submit-text-color);
  background: var(--form-submit-background-color);
}

.twc-form-control.twc-form-cancel:not([disabled]) {
  color: var(--form-cancel-text-color);
  background: var(--form-cancel-background-color);
}

/*Text field types*/
.twc-form-input[type=text], .twc-form-input[type=email], .twc-form-input[type=number], .twc-form-input[type=password], .twc-form-input[type=search], .twc-form-input[type=tel], .twc-form-input[type=url] {
  flex-basis: 90%;
  margin-left: 5%;
  margin-right: 5%;
  background: var(--form-input-background-color);
}

/*Button Types*/
.twc-form-input[type=reset], .twc-form-input[type=button], .twc-form-input[type=file], .twc-form-input[type=image], .twc-form-input[type=submit] {
  border-radius: 5px;
  padding: 5px;
  flex: 1 1 auto;
  margin: auto 5%;
}

.twc-form-input[type=reset]:not([disabled]) {
  color: var(--form-reset-text-color);
  background: var(--form-reset-background-color);
}


/*Datepicker types*/
.twc-form-input[type=date], .twc-form-input[type=datetime-local], .twc-form-input[type=month], .twc-form-input[type=week], .twc-form-input[type=time] {
  background: var(--form-input-background-color);
  flex-basis: 90%;
  margin: auto;
}

/*Checkbox type*/
.twc-form-input[type=checkbox] {
  background: var(--form-input-background-color);
  margin-left: -2%;
  margin-top: 1.1em;
}

/*Radio type*/
.twc-form-input[type=radio] {
  background: var(--form-input-background-color);
  margin-left: -2%;
  margin-top: 1em;
}


/*Color Picker type*/
.twc-form-input[type=color] {
  background: var(--form-input-background-color);
  flex-basis: 90%;
  margin: auto;
}

/*Range Type*/
.twc-form-input[type=range] {
  background: var(--form-input-background-color);
  flex-basis: 90%;
  margin: auto;
}
</style>


