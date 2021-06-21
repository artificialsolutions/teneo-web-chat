<template>
  <form class="twc-form" v-on:submit="handleFormSubmit" id="twcActiveForm">
    <component v-for="(element, idx) in formElements"
               :key="idx"
               :is="elementTag(element.type)"
               v-bind="elementAttributes(element)"
               v-on="elementListeners(element)"
               :id="elementId(element, idx)"
               :name="elementName(element, idx)">{{ element.text }}
      <option
          v-if="element.type==='select'"
          v-for="(option) in element.options"
          v-bind="elementAttributes(option)"
      >{{ option.text }}
      </option>
      <label v-if="element.hasOwnProperty('label')" :for="'twc-form-element-' + element.type + '-' + idx"
             :class="labelClasses(element)">{{ labelText(element) }}</label>
    </component>
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
        let legalTypes = ['control', 'title', 'subtitle', 'caption', 'input', 'textarea', 'select', 'label', 'output']
        let hasOnlyLegalTypes = false;

        message.data.elements.forEach((element) => {
          if (element.type === "control") {
            if (element.action === "submit") {
              hasSubmit = true;
            } else if (element.action === "cancel") {
              hasCancel = true;
            }
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
    // this.isExpired();
    let associatedLabels = this.$el.querySelectorAll('.twc-form-associated-label');

//Move all auto-generated labels one level up so that the precede the field rather than being contained in it.
    for (let label of associatedLabels) {
      this.$el.insertBefore(label, label.parentNode);
    }
    EventBus.$emit(events.DISABLE_INPUT);


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
      if (element.hasOwnProperty('attributes')) {
        if (element.attributes.hasOwnProperty('id')) {
          return element.attributes.id;
        } else if (element.attributes.type) {
          return 'twc-form-element-' + element.type + '_' + element.attributes.type + '_' + idx;
        } else {
          return 'twc-form-element-' + element.type + '_' + idx;
        }
      }
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
      if (elementData.type === 'control') {
        attributes.class += ' twc-form-' + elementData.action;
        if (elementData.action === 'submit') {
          attributes.type = 'submit';
        } else if ('cancel') {
          attributes.type = 'button'
        } else {
          console.error('Unrecognized action');
        }
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
      console.log(formData);
      //TODO => Figure out how to keep values in a submitted form after refresh. THIS IS WHERE YOU WERE!!!!!
      this.$teneoApi.sendSilentMessage(JSON.stringify(formData));
      e.preventDefault();
      this.decommissionForm();

    },
    handleFormCancel(e) {
      this.$teneoApi.sendSilentMessage(JSON.stringify({success: false}));
      console.log(e);
      this.decommissionForm();
    },
    // isExpired() {
    //
    //   const latestMessage = this.$teneoApi.messageList[this.$teneoApi.messageList.length - 1];
    //
    //   if (latestMessage && latestMessage !== this.message) {
    //     this.decommissionForm()
    //   }
    // },
    decommissionForm() {
      //TODO => Get form to lose id and gain expired class as well on reload
      EventBus.$emit(events.ENABLE_INPUT);
      let form = this.$el;
      form.removeAttribute('id')
      form.classList.add('twc-expired');

      let elements = this.message.data.elements;
      let elementIndex = 0;

      form.childNodes.forEach((node) => {

        node.setAttribute('disabled', true);


        if (elements[elementIndex].type === 'label') {
          elements[elementIndex].attributes = {disabled: true};
          elementIndex++;
        }
        let currentElement = elements[elementIndex];
        if (node.nodeName.toUpperCase() !== 'LABEL') {

          console.log('node: ', node.nodeName);
          console.log('element: ', elements[elementIndex].type, elements[elementIndex].hasOwnProperty('attributes') ? elements[elementIndex].attributes.type : '');



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

      console.log(elements);
      this.message.data.elements = elements;

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
}

.twc-form * {
  margin: 5px;
}

.twc-form-title {
  flex-basis: 100%;
  text-align: center;
}

.twc-form-subtitle {
  flex-basis: 100%;
  text-align: center;
}

.twc-form-caption {
  flex-basis: 100%;
  text-align: center;
}

.twc-form-label {
  flex-basis: 100%;
  text-align: left;
}

.twc-form-label.twc-form-attached-label {
  flex-basis: auto;
}

.twc-form-textarea {
  flex-basis: 90%;
  align-self: center;
}

.twc-form-select {
  flex-basis: 90%;
  align-self: center;
}

.twc-form-select.twc-form-option {

}

.twc-form-control {
  flex: 1 1 auto;
}

.twc-form-control.twc-form-submit {
}

.twc-form-control.twc-form-cancel {

}

/*Text field types*/
.twc-form-input[type=text], .twc-form-input[type=email], .twc-form-input[type=number], .twc-form-input[type=password], .twc-form-input[type=search], .twc-form-input[type=tel], .twc-form-input[type=url] {
  flex-basis: 90%;
  align-self: center;
}

/*Button Types*/
.twc-form-input[type=reset], .twc-form-input[type=button], .twc-form-input[type=file], .twc-form-input[type=image], .twc-form-input[type=submit] {

}

/*Datepicker types*/
.twc-form-input[type=date], .twc-form-input[type=datetime-local], .twc-form-input[type=month], .twc-form-input[type=week], .twc-form-input[type=time] {

}

/*Checkbox type*/
.twc-form-input[type=checkbox] {
  align-self: center;
}

/*Radio type*/
.twc-form-input[type=radio] {
  align-self: center;
}


/*Color Picker type*/
.twc-form-input[type=color] {

}

/*Range Type*/
.twc-form-input[type=range] {

}
</style>


