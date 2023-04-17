<template>
    <div class="modal-backdrop">
      <div class="modal">
        
          <slot name="header">
            This is the default title!
          </slot>
          <!--button
            type="button"
            class="btn-close"
            @click="close"
          >
          </button-->
    
  
        <section class="modal-body">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 296.8 426.4" xml:space="preserve">
            <path d="M148.4 276.1c-35.2 0-63.7-28.5-63.7-63.7V63.7C84.7 28.5 113.2 0 148.4 0s63.7 28.5 63.7 63.7v148.7c0 35.2-28.5 63.7-63.7 63.7z" fill="#2f286e"/>
            <rect x="127.2" y="348.5" width="42.5" height="77.9" fill="#20edf2"/>
            <path d="M254.8 213.2c-.1 58.6-47.8 106.3-106.4 106.3-29.4 0-56.1-12-75.4-31.4l-29.7 29.7c26.9 26.9 64 43.6 105.1 43.6 81.9 0 148.3-66.4 148.4-148.3h-42z" fill="#ac2936"/>
            <path d="M73 288.1c-19.1-19.2-31-45.7-31-74.9H0C0 254 16.6 291 43.3 317.8L73 288.1z" fill="#fbbc05"/>
            </svg>
         </section>
  
        <!--footer class="modal-footer">
          <slot name="footer">
            This is the default footer!
          </slot>
          <button
            type="button"
            class="btn-green"
            @click="close"
          >
            Close Modal
          </button>
        </footer-->
      </div>
    </div>
</template>


<script>

import {EventBus, events} from '../../utils/event-bus.js';

export default {
  name: 'Modal',
  mounted() {
    EventBus.$on(events.ENABLE_VOICEDEMO, () => {
        this.activateModal();
    });

    EventBus.$on(events.DISABLE_VOICEDEMO, () => {
        this.disableModal();
    });
  },
  methods: {
    close() {
      this.$emit('close');
    },
    activateModal() {
        const modaL = document.getElementsByClassName('modal-backdrop');
        const messageList = document.getElementsByClassName('twc-message-list');
        messageList.style.display = 'none';
        modaL.style.display = "flex";
    }, 
    disableModal() {
        const modaL = document.getElementsByClassName('modal-backdrop');
        const messageList = document.getElementsByClassName('twc-message-list');
        messageList.style.display = 'contents';
        modaL.style.display = "none";
    }
  }

};

/**
 *  
 */
</script>

<style>

  .modal-backdrop {
    height: 80%;
    overflow-y: auto;
    overflow-x: hidden;
    background-size: 100%;
    padding: 20px 0px;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: transparent;
    box-shadow: none;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }


  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    display: flex;
    padding: 20px 10px;
    align-content: center;
    justify-content: center;
    flex-direction: row;
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }

  svg {
    width: 100px;
    height: auto;
  }
</style>
