<template>
  <div v-if="status" :class="'twc-upload-file' + getContainerClassAddition(status)">
    <div class="twc-upload-file-visualization">

      <img v-if="imageUrl" src="imageUrl" ref="fileImageElement" class="twc-upload-file-representation twc-upload-file-representation-image" :style="status === 'SUCCEEDED' ? 'filter:blur(0)' : 'filter:blur(4px)'" :alt="message.data.fileName"/>
      <span v-else class="twc-upload-file-representation twc-upload-file-representation-symbol">{{ message.data.fileSymbol || message.data.fileName || '#' }}</span>

      <template v-if="status === 'SUCCEEDED'">
        <a v-if="controlAllowed" @click="deleteFile" class="twc-upload-file-action-delete" role="button" title="Delete file">&#x2715;</a>
        <span class="twc-upload-file-status">Scceeded</span>
      </template>
      <template v-if="status === 'IN_PROGRESS'">
        <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
        <a v-if="controlAllowed" @click="stopUpload" class="twc-upload-file-middle-circle twc-upload-file-stop" role="button" title="Stop upload">&#10007;</a>
        <span v-else class="twc-upload-file-middle-circle"></span>
        <span class="twc-upload-file-status">In progress</span>
      </template>
      <template v-else-if="status === 'INTERRUPTED'">
        <template v-if="controlAllowed">
          <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
          <a @click="restartUpload" class="twc-upload-file-middle-circle twc-upload-file-restart" role="button" title="Restart upload">&#8687;</a>
        </template>
        <span class="twc-upload-file-status">Interrupted</span>
      </template>
      <template v-else-if="status === 'FAILED'">
        <template v-if="controlAllowed">
          <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
          <a @click="restartUpload" class="twc-upload-file-middle-circle twc-upload-file-restart" role="button" title="Restart upload">&#8687;</a>
        </template>
        <span class="twc-upload-file-status">Failed</span>
      </template>
      <template v-else-if="status === 'DELETED'">
        <template v-if="controlAllowed">
          <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
          <a @click="restartUpload" class="twc-upload-file-middle-circle twc-upload-file-restart" role="button" title="Restart upload">&#8687;</a>
        </template>
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


.twc-upload-file {
  position: relative;
  height: 12rem;
  /* width: 16rem; */
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  background-color: yellow;
}

.twc-upload-file-visualization {
  position: absolute;
  height: 10rem;
  width: 90%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  background-color: green;
}

.twc-upload-file-representation {
  position: absolute;
  height: 8rem;
  width: 90%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  background-color: cyan;
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
  /*
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  */
  padding: 0.1rem;
  margin: 0.1rem;
}

.twc-upload-file-status {
  position: absolute;
  bottom: 0;
  right: 0;
  color: black;
  /*
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  */
  padding: 0.1rem;
  margin: 0.1rem;
  background-color:white;
}

.twc-upload-file-name {
  /*
  position: absolute;
  width: 90%;
  bottom: 0;
  color: black;
  background-color: brown;
  */
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



const bDebug = true, sName = 'UploadMessage';

let nUploadPercentage;


export default {
  name: sName,

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
       * @param {object} [message.data.initialUploadState] - the initial upload state.
       * It can have the same properties as the <code>uploadState</code> argument of
       * the <code>setUploadState()</code> method except <code>dataUrl</code> which is explicitly
       * not allowed on <code>initialUploadState</code>. Any attemp to use this property here will
       * produce an error. The purpose of this restriction is to prevent developers from adding
       * here huge data URLs, which can blow up the browser's storage.
       * @param {string|null} [message.data.initialUploadState.status] - the status of the upload.
       * Possible values are SUCCEEDED, IN_PROGRESS, FAILED, INTERRUPTED and DELETED.
       * @param {boolean} [message.data.initialUploadState.controlAllowed] - indicates if the control button
       * should be displayed:
       * for SUCCEEDED it is "Delete"; for IN_PROGRESS - "Stop"; for FAILED, INTERRUPTED and DELETED - "Re-upload".
       * If this flag is undefined, it is ignored. Otherwise, if it evaluates to <code>true</code>,
       * the corresponding button is displayed. If it evaluates to <code>false</code>, the button is suppressed.
       * @param {string|null} [message.data.initialUploadState.imageUrl] the URL of the image to display in the message.
       * It can also be a data URL.
       * @param {number} [message.data.initialUploadState.uploadPercentage] the percentage of the file upload to display.
       * Allowed values are from 0 to 100.
       * 
       * @returns {boolean} <code>true</code> if the argument is a valid upload message, <code>false</code> otherwise.
       */
      validator: (message) => {
        if (!message || message.type !== 'upload') return false;
        const data = message.data;
        if (!data) {
          console.error(sName, 'Missing data', message);
          return false;
        }
        if (data.initialUploadState?.imageUrl) {
          console.error(sName, 'data.initialUploadState.imageUrl is not allowed in messages (itemID ' + data.itemId + '). Use "set_upload_state" to set the image URL instead!');
          return false;
        }
        if (!data.itemId) {
          console.error(sName, 'Missing itemId', message);
          return false;
        }
        if (!(data.fileSymbol || data.fileName)) {
          console.warn(sName, 'Missing both data.fileSymbol and data.fileName', message) ;
        }
        return true;
      }
    }
  },


  data() {
    return {
      reImageUrl: undefined,
      reStatus: undefined,
      reControlAllowed: undefined
    }
  },


  beforeMount() {
    if (bDebug) console.log(sName, 'beforeMount with message', this.message);
    EventBus.$on(events.SET_UPLOAD_STATE, x => {
      if (this.message.data.itemId === x.itemId) this.setUploadState(x.uploadState);
      else if (bDebug) console.log(sName, 'Skipping upload status for', this.message.data.itemId);
    });
  },


  mounted() {
    if (bDebug) console.log(sName, 'mounted with message', this.message);
    if (nUploadPercentage == null) {
      let x = this.message.initialUploadState;
      if (x && (x = x.uploadPercentage) !== undefined) {
        if (Number.isNaN(x = Number(x))) {
          console.error(sName, 'Wrong uploadPercentage value [ ' + this.message.initialUploadState?.uploadPercentage + ' ], should be a number between 0 and 100');
        } else {
          nUploadPercentage = x < 0 ? 0 : x > 100 ? 100 : x;
        }
      }
    }
    this.assignSpinnerValue(nUploadPercentage);
  },


  updated() {
    if (bDebug) console.log(sName, 'updated with message', this.message);
    this.assignSpinnerValue(nUploadPercentage);
  },


  beforeUnmount() {
    if (bDebug) console.log(sName, 'beforeUnmount with message', this.message);
    EventBus.$off(events.SET_UPLOAD_STATE);
  },


  computed: {
    imageUrl() {
      return this.reImageUrl !== undefined ? this.reImageUrl : this.message.initialUploadState?.imageUrl;
    },
    status() {
      return this.reStatus !== undefined ? this.reStatus : this.message.initialUploadState?.status;
    },
    controlAllowed() {
      return this.reControlAllowed !== undefined ? this.reControlAllowed : this.message.initialUploadState?.controlAllowed;
    }
  },


  methods: {
    async stopUpload() {
      if (bDebug) console.log(sName, 'stopUpload() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      await handleExtension(API_ON_UPLOAD_FILE_STOP_CLICK, payload);
    },

    async restartUpload() {
      if (bDebug) console.log(sName, 'restartUpload() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      await handleExtension(API_ON_UPLOAD_FILE_RESTART_CLICK, payload);
    },

    async deleteFile() {
      if (bDebug) console.log(sName, 'deleteFile() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      await handleExtension(API_ON_UPLOAD_FILE_DELETE_CLICK, payload);
    },

    assignSpinnerValue(n) {
      if (this.$refs.spinner) {
        if (n == null) n = 0;
        this.$refs.spinner.style.background = 'conic-gradient(blue ' + n + '%, lightgrey ' + n + '%)';
      }
    },

    /**
     * Sets the state of the upload.
     * 
     * @param {object} uploadState - the upload state.
     * @param {string|null} [uploadState.status] - the status of the upload. Possible values are
     * SUCCEEDED, IN_PROGRESS, FAILED, INTERRUPTED and DELETED or null.
     * @param {boolean} [uploadState.controlAllowed] - indicates if the control button should be displayed:
     * for SUCCEEDED it is "Delete"; for IN_PROGRESS - "Stop"; for FAILED, INTERRUPTED and DELETED - "Re-upload".
     * If this flag is undefined, it is ignored. Otherwise, if it evaluates to <code>true</code>,
     * the corresponding button is displayed. If it evaluates to <code>false</code>, the button is suppressed.
     * @param {number} [uploadState.uploadPercentage] the percentage of the file upload to display. Allowed values are from 0 to 100.
     * @param {string|null} [x.imageUrl] the URL of the image to display in the message. It can also be a data URL.
     */
    setUploadState(uploadState) {
      if (uploadState.hasOwnProperty('status') && uploadState.status !== undefined) {
        if (uploadState.status !== null && !this.getContainerClassAddition(uploadState.status)) {
          console.error(sName, 'Wrong upload status [ ' + uploadState.status + ' ]');
          return;
        }
        this.reStatus = uploadState.status;
        if (bDebug) console.log(sName, 'setUploadState, setting status', this.reStatus);
      }
      if (uploadState.hasOwnProperty('controlAllowed') && uploadState.controlAllowed !== undefined) {
        this.reControlAllowed = uploadState.controlAllowed ? true : false;
        if (bDebug) console.log(sName, 'setUploadState, setting controlAllowed', this.reControlAllowed);
      }
      if (uploadState.hasOwnProperty('imageUrl') && uploadState.imageUrl !== undefined) {
        this.reImageUrl = uploadState.imageUrl;
        if (bDebug) console.log(sName, 'setUploadState, setting imageUrl', this.reImageUrl);
      }
      if (uploadState.hasOwnProperty('uploadPercentage') && uploadState.uploadPercentage !== undefined) {
        const n = Number(uploadState.uploadPercentage);
        if (Number.isNaN(n)) {
          console.error(sName, 'Wrong uploadPercentage value [ ' + uploadState.status + ' ], should be a number between 0 and 100');
        } else {
          nUploadPercentage = n < 0 ? 0 : n > 100 ? 100 : n;
          this.assignSpinnerValue(nUploadPercentage);
          if (bDebug) console.log(sName, 'setUploadState, applying uploadPercentage', nUploadPercentage);
        }
      }
    },



    /**
     * Returns a string containing the class(es) to be added to the main message element
     * according to the upload status. This method can even be used to verify if the value
     * of the upload status is allowed.
     * 
     * @param {string} status - the upload status. Possible values are
     * SUCCEEDED, IN_PROGRESS, FAILED, INTERRUPTED and DELETED.
     * 
     * @returns {string} a string containing the class(es) to be added to the main message element.
     * If the upload status is not from the allowed list, an empty string is returned.
     */
    getContainerClassAddition(status) {
      switch(status) {
        case 'SUCCEEDED':
          return ' twc-upload-file-succeeded';
        case 'IN_PROGRESS':
          return ' twc-upload-file-inprogress';
        case 'FAILED':
          return ' twc-upload-file-failed';
        case 'INTERRUPTED':
          return ' twc-upload-file-interrupted';
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
