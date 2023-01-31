<template>
  <div v-if="uploadStatus" :class="'twc-upload-file' + getContainerClassAddition(uploadStatus)">
    <div class="twc-upload-file-visualization">

      <img v-if="imageUrl" src="imageUrl" ref="fileImageElement" class="twc-upload-file-representation twc-upload-file-representation-image" :style="uploadStatus === 'SUCCEEDED' ? 'filter:blur(0)' : 'filter:blur(4px)'" :alt="message.data.fileName"/>
      <span v-else class="twc-upload-file-representation twc-upload-file-representation-symbol">{{ message.data.fileSymbol || message.data.fileName || '#' }}</span>

      <template v-if="uploadStatus === 'SUCCEEDED'">
        <a if="message.data.deleteAllowed" @click="deleteFile" class="twc-upload-file-action-delete" role="button">&#x2715;</a>
        <span class="twc-upload-file-status">Scceeded</span>
      </template>
      <template v-if="uploadStatus === 'IN_PROGRESS'">
        <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
        <a v-if="message.data.stopAllowed" @click="stopUpload" class="twc-upload-file-middle-circle twc-upload-file-middle-circle-stop" role="button">&#10007;</a>
        <span v-else class="twc-upload-file-middle-circle"></span>
        <span class="twc-upload-file-status">In progress</span>
      </template>
      <template v-else-if="uploadStatus === 'INTERRUPTED'">
        <template v-if="message.data.restartAllowed">
          <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
          <a @click="restartUpload" class="twc-upload-file-middle-circle twc-upload-file-middle-circle-restart" role="button">&#8687;</a>
        </template>
        <span class="twc-upload-file-status">Interrupted</span>
      </template>
      <template v-else-if="uploadStatus === 'FAILED'">
        <template v-if="message.data.restartAllowed">
          <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
          <a @click="restartUpload" class="twc-upload-file-middle-circle twc-upload-file-middle-circle-restart" role="button">&#8687;</a>
        </template>
        <span class="twc-upload-file-status">Failed</span>
      </template>
      <template v-else-if="uploadStatus === 'DELETED'">
        <span class="twc-upload-file-status">Deleted</span>
      </template>
    </div>

    <div v-if="message.data.fileName" class="twc-upload-file-name">{{ message.data.fileName }}</div>
  </div>
</template>


<style>

@keyframes twc-upload-file-progress-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.twc-upload-file-visualization {
  position: absolute;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.twc-upload-file-representation {
  height: 8rem;
  width: 12rem;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.twc-upload-file-progress-spinner {
  position: absolute;
  border-radius: 50%;
  height: 4rem;
  width: 4rem;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  opacity: 1;
  animation: twc-upload-file-progress-spin 2s linear infinite;
  /* background: conic-gradient(blue 30%, lightgrey 30%); */
}

.twc-upload-file-middle-circle {
  position: absolute;
  border-radius: 50%;
  height: 3rem;
  width: 3rem;
  background-color: lightgrey;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  opacity: 1;
}

.twc-upload-file-action-delete {
  position: absolute;
  bottom: 0;
  left: 0;
  color: black;
  background-color: red;
  border: thin solid black;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.1rem;
  margin: 0.1rem;
}

.twc-upload-file-status {
  position: absolute;
  bottom: 0;
  right: 0;
  color: black;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.1rem;
  margin: 0.1rem;
  background-color:white;
}

</style>


<script>
/* <![CDATA[ */

import { EventBus, events } from '../../utils/event-bus.js';
import basePayload from '../../utils/base-payload.js';
import handleExtension from '../../utils/handle-extension.js';
import {
  API_ON_UPLOAD_FILE_RESTART_CLICK,
  API_ON_UPLOAD_FILE_STOP_CLICK,
  API_ON_UPLOAD_FILE_DELETE_CLICK
} from '../../utils/api-function-names.js';



const bDebug = true;

let nUploadPercentage = 0;


export default {
  name: 'UploadMessage',

  props: {
    message: {
      type: Object,
      required: true,

      /**
       * Checks if the argument is an upload message. If the check succeeds, it
       * returns <code>true</code>. If it fails, the returned value is <code>false</code>.
       * 
       * @param {object} message - the message to check.
       * @param {string} message.type - the type of the message, should be "upload".
       * @param {object} message.data - the data contained in the message.
       * @param {string} message.data.itemId - the upload ID received from the upload pannel.
       * @param {string} [message.data.fileName] - the name of the uploaded file.
       * @param {string} [message.data.fileSymbol] - the string to be displayed in place of the image if
       * the file is not an image or if the image thumbnail could not be generated. If this property is
       * empty, null or not not defined, the file name will be displayed.
       * @param {*} [message.data.stopAllowed] - a flag indicating if the STOP button should displayed
       * when the file is being loaded.
       * If it evaluates to <code>true</code>, the STOP button will be shown. Otherwise it will be suppressed.
       * @param {*} [message.data.restartAllowed] - a flag indicating if the RESTART button should displayed
       * when the file upload has been interrupted or has failed for reasons other than page reload.
       * If it evaluates to <code>true</code>, the RESTART button will be shown. Otherwise it will be suppressed.
       * @param {*} [message.data.deleteAllowed] - a flag indicating if the DELETE button should displayed
       * when the file upload has succeeded.
       * If it evaluates to <code>true</code>, the DELETE button will be shown. Otherwise it will be suppressed.
       * 
       * @returns {boolean} <code>true</code> if the argument is a valid upload message, <code>false</code> otherwise.
       */
      validator: (message) => {
        if (!message || message.type !== 'upload') return false;
        const data = message.data;
        if (!data) {
          console.error(this.name, 'Missing data', message);
          return false;
        }
        if (!data.itemId) {
          console.error(this.name, 'Missing itemId', message);
          return false;
        }
        if (!(data.fileSymbol || data.fileName)) {
          console.warn(this.name, 'Missing both data.fileSymbol and data.fileName', message) ;
        }
        return true;
      }
    }
  },
  

  data() {
    return {
      imageUrl: null,
      uploadStatus: null
    }
  },


  beforeMount() {
    if (bDebug) console.log(this.name, 'beforeMount with message', this.message);
    EventBus.$on(events.SET_UPLOAD_STATE, x => this.setUploadState(x));
  },


  mounted() {
    if (bDebug) console.log(this.name, 'mounted with message', this.message);
    this.assignSpinnerValue();
  },


  updated() {
    if (bDebug) console.log(this.name, 'updated with message', this.message);
    this.assignSpinnerValue();
  },


  beforeUnmount() {
    if (bDebug) console.log(this.name, 'beforeUnmount with message', this.message);
    EventBus.$off(events.SET_UPLOAD_STATE);
  },


  computed: {
  },


  methods: {
    async stopUpload() {
      if (bDebug) console.log(this.name, 'stopUpload() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      await handleExtension(API_ON_UPLOAD_FILE_STOP_CLICK, payload);
    },

    async restartUpload() {
      if (bDebug) console.log(this.name, 'restartUpload() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      await handleExtension(API_ON_UPLOAD_FILE_RESTART_CLICK, payload);
    },

    async deleteFile() {
      if (bDebug) console.log(this.name, 'deleteFile() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      await handleExtension(API_ON_UPLOAD_FILE_DELETE_CLICK, payload);
    },

    assignSpinnerValue() {
      if (this.$refs.spinner) {
        this.$refs.spinner.style = 'background: conic-gradient(blue ' + nUploadPercentage + '%, lightgrey ' + nUploadPercentage + '%)';
      }
    },

    /**
     * Sets the state of the upload.
     * 
     * @param {object} x - the state of the upload.
     * @param {string} x.itemId - the upload ID received from the upload pannel.
     * @param {string} [x.uploadStatus] - the status of the upload. Possible values are
     * SUCCEEDED, IN_PROGRESS, INTERRUPTED, FAILED and DELETED.
     * @param {string} [x.imageUrl] the URL of the image to display in the message. It can also be a data URL.
     * @param {number} [x.uploadPercentage] the percentage of the file upload to display. Allowed values are from 0 to 100.
     */
    setUploadState(x) {
      if (this.message.data.itemId !== x.itemId) {
        if (bDebug) console.log(this.name, 'Skipping upload status for', this.message.data.itemId);
        return;
      }
      if (x.uploadStatus != null) {
        if (!this.getContainerClassAddition(x.uploadStatus)) {
          console.error(this.name, 'Wrong upload status [ ' + x.uploadStatus + ' ]');
          return;
        }
        this.uploadStatus = x.uploadStatus;
      }
      if (x.imageUrl != null) this.imageUrl = x.imageUrl;
      if (x.uploadPercentage != null) {
        if (0 <= x.uploadPercentage && x.uploadPercentage <= 100) {
          nUploadPercentage = x.uploadPercentage;
          this.assignSpinnerValue();
        } else {
          console.warn(this.name, 'Wrong uploadPercentage [ ' + x,uploadPercentage + '] skipped, should be between 0 and 100');
        }
      }
      if (bDebug) console.log(this.name, 'Setting upload state for', x.itemId);
    },

    /**
     * Returns a string containing the class(es) to be added to the main message element
     * according to the upload status. This methiod can even be used to verify if the value
     * of the upload status is allowed.
     * 
     * @param {string} uploadStatus - the upload status. Possible values are
     * SUCCEEDED, IN_PROGRESS, INTERRUPTED, FAILED and DELETED.
     * 
     * @returns {string} a string containing the class(es) to be added to the main message element.
     * If the upload status is not from the allowed list, an empty string is returned.
     */
    getContainerClassAddition(uploadStatus) {
      switch(uploadStatus) {
        case 'SUCCEEDED':
          return ' twc-upload-file-succeeded';
        case 'IN_PROGRESS':
          return ' twc-upload-file-inprogress';
        case 'INTERRUPTED':
          return ' twc-upload-file-interrupted';
        case 'FAILED':
          return ' twc-upload-file-failed';
        case 'DELETED':
          return ' twc-upload-file-deleted';
        default:
          return '';
      }
    }
  }
};

/* ]]> */
</script>
