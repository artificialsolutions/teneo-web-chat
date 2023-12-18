<template>
  <form class="twc-form" v-on:submit.prevent="handleFormSubmit" id="twcActiveForm">
    <!--@formatter:off-->
    
    <component v-for="(element, idx) in formElements"
            :key="idx"
            :is="elementTag(element.type)"
            v-bind="elementAttributes(element)"
            v-on="elementListeners(element)"
            :id="elementId(element, idx)"
            :name="elementName(element, idx)"
            :placeholder="elementText(element.placeholder)"
    >{{elementText(element.text)}}<template v-if="element.type==='select'"><option
          v-for="(option, key) in element.options"
          v-bind="elementAttributes(option)"
          :key="key"
      >{{ option.text }}</option
    ></template><label
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
        let legalElementTypes = ['control', 'title', 'subtitle', 'caption', 'input', 'textarea', 'select', 'label']
        let legalInputTypes = [
          "button",
          "checkbox",
          "color",
          "date",
          "datetime-local",
          "email",
          "hidden",
          "image",
          "month",
          "number",
          "password",
          "radio",
          "range",
          "reset",
          "search",
          "tel",
          "text",
          "time",
          "url",
          "week",
          "datetime"
        ]
        let hasOnlyLegalElementTypes = false;
        let elements = JSON.parse(JSON.stringify(message.data.elements))
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i]
          if (legalElementTypes.includes(element.type)) {
            hasOnlyLegalElementTypes = true;
          } else {
            console.error('Unknown form element type');
          }
          if (element.type === "control") {
            if (element.action === "submit") {
              hasSubmit = true;
            } else if (element.action === "cancel") {
              hasCancel = true;
            }
          } else if (element.type === 'input') {
            if (!element.attributes.type) {
              element.attributes.type = 'text'
            } else if (!legalInputTypes.includes(element.attributes.type)) {
              message.data.elements.splice(i, 1)
              console.error('Illegal input type: ' + element.attributes.type);
            }
          }


        }

        return (
            message.type === 'form' &&
            hasContent &&
            hasOnlyLegalElementTypes &&
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
      var formData = {}, arrayKeys, x;
      for (const e of new FormData(this.$el).entries()) {
        if (formData.hasOwnProperty(e[0])) {
          x = formData[e[0]];
          if (Array.isArray(x)) x.push(e[1]);
          else {
            formData[e[0]] = [x, e[1]];
            if (arrayKeys) arrayKeys.push(e[0]);
            else arrayKeys = [e[0]];
          }
        } else {
          formData[e[0]] = e[1];
        }
      }
      if (arrayKeys) {
        x = arrayKeys.length;
        do {
          x--;
          formData[arrayKeys[x]] = JSON.stringify(formData[arrayKeys[x]]);
        } while (x > 0);
        arrayKeys = null;
      }
      formData.success = true;
      this.$teneoApi.sendSilentMessage(JSON.stringify(formData));
      formData = null;
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
                    case 'checkbox':
                    case 'radio':
                      currentElement.attributes.checked = node.checked;
                  }
                  break;
                case 'select':
                case 'textarea':
                  currentElement.attributes.value = node.value;
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

<style scoped>

.teneo-web-chat {
  --form-background-color: white;
  --form-title-text-color:var(--primary-color);
  --form-subtitle-text-color:rgba(50,62,72,0.9);
  --form-caption-text-color: rgba(50,62,72,0.9);
  --form-label-text-color:rgba(50,62,72,0.9);
  --form-input-background-color:white;

  --form-border-color: #919191;
  
  --form-submit-text-color:white;
  --form-submit-background-color:var(--primary-color);

  --form-cancel-text-color:white;
  --form-cancel-background-color:rgb(255, 76, 91);
  --form-reset-text-color: white;
  --form-reset-background-color:var(--secondary-color);
}


.twc-form {
  background: var(--form-background-color);
  box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  border-radius: 10px 10px 10px 0;
  padding: 0.5cm;
  position: relative;
}

.twc-form-title {
  flex-basis:100%;
  text-align: left;
  color: var(--form-title-text-color);
  margin: 0;
  margin-bottom: 1rem;
}

.twc-form-subtitle {
  flex-basis: 100%;
  text-align: left;
  color: var(--form-subtitle-text-color);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-left: 0.7rem;
}

.twc-form-caption {
  flex-basis: 100%;
  text-align: right;
  color: var(--form-caption-text-color);
  margin-bottom: 0%;
  margin-top: 5%;
}

.twc-form.twc-expired * {
  opacity: 50%;
}

.twc-form-label {
  flex-basis: 100%;
  color: var(--form-label-text-color);
  font-size: 0.9em;
  font-family: var(--primary-font);
  margin: 0.7rem;
}

.twc-form-label.twc-form-attached-label {
  flex-basis: auto;
  line-height: 1.5;
}

.twc-form-textarea {
  width: 90%;
  margin-bottom: 1rem;
  background: var(--form-input-background-color);
  min-height: 5em;
  overflow: auto;
  resize: vertical;
  border: 2px solid #d1d1d1;
  border-radius: 5px;
  text-decoration: none;
  color: var(--expired-color);
  font-family: var(--primary-font);
}

.twc-form-textarea:focus {
  outline: 0; 
  border: 2px solid rgb(47, 40, 110,0.5);
  color: black;
}


.twc-form-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
  margin-bottom: 1rem;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: inherit;
  line-height: inherit;
  z-index: 1;
  outline: none;
  flex-basis: 90%;
  border: 2px solid #d1d1d1;
  border-radius: 5px;
  padding: 2px;
}


.twc-form-select .twc-form-option {
  border-radius: 5px;
  padding-left: 2px;
}

/**Check with Alex */
select option:checked,
select option:focus,
select option:active {
    background: var(--primary-color);
    accent-color: var(--primary-color);
    color: white;
}

/**?? */
.twc-form-control {
  flex: 1 1 auto;
  border-radius: 5px;
  padding: 5px;
  margin: 10%;
}

.twc-form-control.twc-form-submit:not([disabled]) {
  border: none;
  background: var(--form-submit-background-color, #2f286e);
  border: 1px solid var(--form-sumbit-background-color, #2f286e);
  color: var(--button-fg-color, #ffffff);
  cursor: pointer;
  font-weight: 400;
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.1rem;
  font-size: 0.9em;
  line-height: 1.5;
  border-radius: 50px;
  min-width: 62px;
  width: 60%;
  display: inline-block;
  margin: 3px;
  margin-top:15px;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(85, 87, 85, 0.7);
}

.twc-form-control.twc-form-submit:not([disabled]):hover {
  background-color: var(--primary-color-dark);
  color: white;
}



.twc-form-control.twc-form-cancel:not([disabled]) {
  border: none;
  background: var(--form-cancel-background-color, #2f286e);
  border: 1px solid var(--form-cancel-background-color, #2f286e);
  color: var(--button-fg-color, #ffffff);
  cursor: pointer;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.1rem;
  font-size: 0.9em;
  line-height: 1.5;
  border-radius: 50px;
  min-width: 62px;
  width: 30%;
  display: inline-block;
  margin: 3px;
  margin-top:15px;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 1px 2px 0 rgba(85, 87, 85, 0.7);
}

.twc-form-control.twc-form-cancel:not([disabled]):hover {
  background-color: var(--danger-color-dark);
  color: white;
  font-weight: bold;
}

.twc-form-input {
  border:none;
  margin-bottom: 10%;
  background: var(--form-input-background-color);
  border: 2px solid #d1d1d1;
  border-radius: 5px;
  width:90%;
  padding-inline-start: 0px;
  height: 2rem;
  font-family: var(--primary-font);
}

.twc-form-input:focus {
  outline: 0; 
  border: 2px solid rgb(47, 40, 110,0.8);
}
/*Text field types*/
.twc-form-input[type=text], .twc-form-input[type=email], .twc-form-input[type=number], .twc-form-input[type=password], .twc-form-input[type=search], .twc-form-input[type=tel], .twc-form-input[type=url] {
  flex-basis: 90%;
  background: var(--form-input-background-color);
  border: 2px solid #d1d1d1;
  height: 2rem;
  border-radius: 5px;
   margin-bottom: 10%;
}

.twc-form-input[type=text]:focus, .twc-form-input[type=email]:focus, .twc-form-input[type=number]:focus, .twc-form-input[type=password]:focus, .twc-form-input[type=search]:focus, .twc-form-input[type=tel]:focus, .twc-form-input[type=url]:focus {
  border: 2px solid rgb(47, 40, 110,0.8);
}

/*Button Types*/
.twc-form-input[type=reset], .twc-form-input[type=file], .twc-form-input[type=image], .twc-form-input[type=submit] {
  border-radius: 5px;
  padding: 5px;
  /**Comment: flex: 1 1 auto;*/ 
  margin: auto 0;
  margin-bottom: 10%;
  flex-basis: 90%;
}

.twc-form-input[type=button] {
  border: none;
  background: var(--button-bg-color, #2f286e);
  border: 1px solid var(--button-bg-color, #2f286e);
  color: var(--button-fg-color, #ffffff);
  cursor: pointer;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.1rem;
  font-size: 0.9em;
  line-height: 1.5;
  border-radius: 50px;
  min-width: 62px;
  width: 45%;
  display: inline-block;
  margin: 3px;
   margin-bottom: 10%;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 2px 3px 0 rgba(85, 87, 85, 0.7);
}

.twc-form-input[type=button]:active {
  outline: none;
  box-shadow: 0 1px 2px 0 rgba(85, 87, 85, 0.7);
  transform: translateY(1px);
}

.twc-form-input[type=button]:hover {
  color: white;
  background: var(--primary-color-dark);
  box-shadow: 0 1px 2px 0 rgba(85, 87, 85, 0.7);
}

.twc-form-input[type=reset]:not([disabled]) {
  border: none;
  background: var(--form-reset-background-color, #2f286e);
  color: var(--button-fg-color, #ffffff);
  cursor: pointer;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  padding: 0.1rem;
  font-size: 0.9em;
  line-height: 1.5;
  border-radius: 50px;
  width: 90%;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 2px 3px 0 rgba(85, 87, 85, 0.7);
   margin-bottom: 10%;
}

.twc-form-input[type=reset]:hover {
  color: white;
  background: var(--secondary-color-dark);
  box-shadow: 0 1px 2px 0 rgba(85, 87, 85, 0.7);
}

.twc-form-input[type=reset]:active {
  transform: translateY(1px);
}

/*Datepicker types*/
.twc-form-input[type=date], .twc-form-input[type=datetime-local], .twc-form-input[type=month], .twc-form-input[type=week], .twc-form-input[type=time] {
  background: var(--form-input-background-color);
  color:var(--form-subtitle-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 90%;
  margin-left: 0px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.twc-form-input[type=datetime-local] {
  display: flex;
  align-items: center;
}

.twc-form-input::-webkit-calendar-picker-indicator:hover {
  cursor: pointer;
}

.twc-form-input::-webkit-datetime-edit-text {
  font-family: var(--primary-font);
  color: var(--primary-color);
}

/*Checkbox type*/
.twc-form-input[type=checkbox] {
  background: var(--form-input-background-color);
  margin-left: -2%;
  margin-top: 0.6em;
  width: 1.2rem;
  accent-color: var(--primary-color);
}

/*Radio type*/
.twc-form-input[type=radio] {
  background: var(--form-input-background-color);
  margin-left: -2%;
  margin-top: 0.5em;
  width: 1.2rem;
  accent-color: var(--primary-color);
}

/*Color Picker type*/
.twc-form-input[type=color] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  display: inline-flex;
  justify-content: center;
}

.twc-form-input[type=color]:hover {
  cursor:pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  background-color: grey; /* For browsers that do not support gradients */
  background: conic-gradient(
        rgba(255, 0, 0, 1) 0%,
        rgba(255, 154, 0, 1) 10%,
        rgba(208, 222, 33, 1) 20%,
        rgba(79, 220, 74, 1) 30%,
        rgba(63, 218, 216, 1) 40%,
        rgba(47, 201, 226, 1) 50%,
        rgba(28, 127, 238, 1) 60%,
        rgba(95, 21, 242, 1) 70%,
        rgba(186, 12, 248, 1) 80%,
        rgba(251, 7, 217, 1) 90%,
        rgba(255, 0, 0, 1) 100%
    );

  border-radius: 50%;
  height: 30px;
  width: 30px;
	padding: 0;
} 

.twc-form-input[type=color]::-webkit-color-swatch  {
  border-radius: 50%;
  margin: 20%;
  border: 1px solid white;
}

/*Range Type*/

/**The webkit configurations will only work on chrome, safari and opera */
.twc-form-input[type=range] {
  background: var(--form-input-background-color);
  flex-basis: 90%;
  margin-top: 10px;
  margin-bottom:10px;
  /**Webkit appearance: in this part the handlebar is not affected by the style*/
  border-radius: 8px;
  height: 5px;
  border: 1px solid #bdc3c7;
  accent-color: var(--primary-color);
}


/**

Configurations to handle in firefox 

input[type=range]::-moz-range-track {
  border-radius: 8px;
  height: 5px;
  border: 1px solid #bdc3c7;
  background-color: var(--form-input-background-color);
}

input[type=range]::-moz-range-thumb {
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  width: 15px;
  height: 15px;
  border-radius: 10px;
  cursor: pointer;
}


input[type="range"]::-moz-range-progress {
  background-color: var(--primary-color); 
}
**/


</style>


