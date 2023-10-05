<template>
  <div v-if="status" :class="'twc-upload-file' + getContainerClassAddition(status)">
    <div class="twc-upload-file-visualization">

      <img v-if="imageUrl" :src="imageUrl" ref="fileImageElement" class="twc-upload-file-representation twc-upload-file-representation-image" :alt="message.data.fileName"/>
      <span v-else class="twc-upload-file-representation twc-upload-file-representation-symbol">
        {{status === 'INTERRUPTED' ? (fileUploadSymbolInterrupted || '&#9888;') : status === 'Failed' ? (fileUploadSymbolFailed || '&#x27f3;') : (message.data.fileSymbol || message.data.fileName || '#') }}
      </span>

      <template v-if="status === 'SUCCEEDED'">
        <a v-if="controlAllowed" role="button" @click="deleteFile" class="twc-upload-file-cta twc-upload-file-action-delete" :title="$t('message.upload_file_delete')">
          {{ fileUploadSymbolDelete || '&#x1F5D1;' }}
        </a>
      </template>
      <template v-else-if="status === 'IN_PROGRESS'">
        <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
        <a v-if="controlAllowed" role="button" @click="stopUpload" class="twc-upload-file-cta twc-upload-file-middle-circle twc-upload-file-stop" :title="$t('message.upload_file_stop')">
          {{ fileUploadSymbolStop || '&#x23F3;' }}
        </a>
        <span v-else class="twc-upload-file-middle-circle"></span>
      </template>
      <template v-else-if="status === 'INTERRUPTED'">
        <template v-if="controlAllowed">
          <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
          <a @click="restartUpload" role="button" class="twc-upload-file-cta twc-upload-file-middle-circle twc-upload-file-restart" :title="$t('message.upload_file_restart')">
            {{ fileUploadSymbolRestart || '&#9888;' }}
          </a>
        </template>
      </template>
      <template v-else-if="status === 'FAILED'">
        <template v-if="controlAllowed">
          <span ref="spinner" class="twc-upload-file-progress-spinner"></span>
          <a @click="restartUpload" role="button" class="twc-upload-file-cta twc-upload-file-middle-circle twc-upload-file-restart" :title="$t('message.upload_file_retry')">
            {{ fileUploadSymbolRetry || '&#x27f3;' }}
          </a>
        </template>
      </template>
      <template v-else-if="status === 'DELETED'">
        <template v-if="controlAllowed"></template>
      </template>
    </div>

    <div v-if="message.data.fileName" class="twc-upload-file-name">{{ message.data.fileName}}</div>
  </div>
</template>


<style>


@keyframes twc-upload-file-progress-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.twc-upload-file-deleted .twc-upload-file-representation-symbol {
  color: #eceff1;
  text-decoration: line-through;
  filter: blur(0);
}

.text-center {
  text-align: center;
}

.bg-grey {
  background-color: #eceff1;
}

.twc-upload-file,
.twc-upload-file-name {
  position: relative;
  background-color: #2f286e;
  padding: 5px;
  border-radius: 10px;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.twc-upload-file-name {
  color: #eceff1;
  text-align: center;
  padding: 2px 1px;
  margin: 1px 0 0;
  right: 0;
}

.twc-upload-file-visualization,
.twc-upload-file-representation {
  position: relative;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  background-color: #2f286e;
  padding: 10px;
  right: 0;
  max-width: 100%;
  height: auto;
}

.twc-upload-file-representation-image {
  max-height: 50%;
  max-width: 50%;
  height: auto;
  width: auto;
  object-fit: contain;
}

.twc-upload-file-progress-spinner,
.twc-upload-file-middle-circle {
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  opacity: 1;
}

.twc-upload-file-progress-spinner {
  height: 4rem;
  width: 4rem;
  animation: twc-upload-file-progress-spin 2s linear infinite;
}

.twc-upload-file-middle-circle {
  height: 3rem;
  width: 3rem;
  background-color: lightgrey;
}

.twc-upload-file.twc-upload-file-succeeded .twc-upload-file-representation-image {
  filter: blur(0);
}

.twc-upload-file:not(.twc-upload-file-succeeded) .twc-upload-file-representation-image {
  filter: blur(4px);
}

.twc-upload-file-cta {
  cursor: pointer;
}

.twc-upload-file-action-delete {
  position: absolute;
  bottom: 0;
  left: 0;
  color: black;  
  border: thin solid #eceff1;
  padding: 0.05rem;
  margin: 0.05rem;
  font-size: 1.0em;
}

.twc-upload-file-status {
  position: absolute;
  bottom: 0;
  right: 0;
  color: black;
  padding: 0.1rem;
  margin: 0.1rem;
  background-color:#eceff1;
}

</style>



<script>
/* <![CDATA[ */

import { mapState } from 'vuex';
import { EventBus, events } from '../../utils/event-bus.js';
import basePayload from '../../utils/base-payload.js';
import handleExtension from '../../utils/handle-extension.js';
import {
  API_ON_UPLOAD_FILE_RESTART_CLICK,
  API_ON_UPLOAD_FILE_STOP_CLICK,
  API_ON_UPLOAD_FILE_DELETE_CLICK
} from '../../utils/api-function-names.js';



const bDebug = true, sName = 'UploadMessage', itemIdToDataSaved = {};


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
       * @param {string} message.data.itemId - the upload ID received from the upload panel.
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
       * @param {?} [message.data.initialUploadState.imageUrl] the URL of the image to display in the message.
       * If this value evaluates to <code>true</code>, the message will be discarded
       * because image URLs are not allowed in messages.
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
      imageUrl: undefined,
      reStatus: undefined,
      reControlAllowed: undefined,
      nUploadPercentage: undefined,
      bProcessing: false
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
    if (bDebug) console.log(sName, 'mounted with message', this.message, 'and nUploadPercentage', this.nUploadPercentage);

    EventBus.$on(events.ACTUAL_RESET, () => this.deleteData());
    EventBus.$on(events.ACTUAL_MINIMIZE, () => this.storeData());
    EventBus.$on(events.ACTUAL_MAXIMIZE, () => this.restoreData());

    if (this.nUploadPercentage == null) {
      // nUploadPercentage has not been set explicitly.
      // Reading it from the saved or, if absent, from the message:
      let x = this.message.data.initialUploadState;
      if (x !== undefined && (x = x.uploadPercentage) !== undefined) {
        if (Number.isNaN(x = Number(x))) {
          console.error(sName, 'Wrong initialUploadState.uploadPercentage value [ ' + this.message.data.initialUploadState.uploadPercentage + ' ], should be a number between 0 and 100');
        } else {
          this.nUploadPercentage = x < 0 ? 0 : x > 100 ? 100 : x;
          this.storeData();
          if (bDebug) console.log(sName, 'Setting nUploadPercentage on mount', this.nUploadPercentage);
        }
      }
    }
    this.assignSpinnerValue(this.nUploadPercentage);
  },


  updated() {
    if (bDebug) console.log(sName, 'updated with message', this.message);
    this.assignSpinnerValue(this.nUploadPercentage);
  },


  beforeUnmount() {
    if (bDebug) console.log(sName, 'beforeUnmount with message', this.message);
    EventBus.$off(events.SET_UPLOAD_STATE);
  },


  computed: {
    ...mapState([
      'fileUploadSymbolFailed',
      'fileUploadSymbolInterrupted',
      'fileUploadSymbolDelete',
      'fileUploadSymbolStop',
      'fileUploadSymbolRestart',
      'fileUploadSymbolRetry',
      'fileUploadSymbolProgressBackgroundColor',
      'fileUploadSymbolProgressBarColor'
    ]),

    status() {
      return this.reStatus !== undefined ? this.reStatus : (this.message.data.initialUploadState?.status || null);
    },
    controlAllowed() {
      return this.reControlAllowed !== undefined ? this.reControlAllowed : (this.message.data.initialUploadState?.controlAllowed ? true : false);
    }
  },


  methods: {

    storeData() {
      let x = itemIdToDataSaved[this.message.data.itemId];
      if (x == null) itemIdToDataSaved[this.message.data.itemId] = x = {};
      x.imageUrl = this.imageUrl;
      x.reStatus = this.reStatus;
      x.reControlAllowed = this.reControlAllowed;
      x.nUploadPercentage = this.nUploadPercentage;
      x.bProcessing = this.bProcessing;
    },

    restoreData() {
      const x = itemIdToDataSaved[this.message.data.itemId];
      if (x == null) return;
      this.imageUrl = x.imageUrl;
      this.reStatus = x.reStatus;
      this.reControlAllowed = x.reControlAllowed;
      this.nUploadPercentage = x.nUploadPercentage;
      this.bProcessing = x.bProcessing;
    },

    deleteData() {
      delete itemIdToDataSaved[this.message.data.itemId];
      this.imageUrl = undefined;
      this.reStatus = undefined;
      this.reControlAllowed = undefined;
      this.nUploadPercentage = undefined;
      this.bProcessing = false;
    },

    async stopUpload() {
      if (this.bProcessing) {
        if (bDebug) console.log(sName, 'stopUpload(), already processing for itemId', this.message.data.itemId);
        return;
      }
      this.bProcessing = true;
      if (bDebug) console.log(sName, 'stopUpload() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      try {
        await handleExtension(API_ON_UPLOAD_FILE_STOP_CLICK, payload);
      } finally {
        this.bProcessing = false;
      }
    },

    async restartUpload() {
      if (this.bProcessing) {
        if (bDebug) console.log(sName, 'restartUpload(), already processing for itemId', this.message.data.itemId);
        return;
      }
      if (bDebug) console.log(sName, 'restartUpload() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      try {
        await handleExtension(API_ON_UPLOAD_FILE_RESTART_CLICK, payload);
      } finally {
        this.bProcessing = false;
      }
    },

    async deleteFile() {
      if (this.bProcessing) {
        if (bDebug) console.log(sName, 'deleteFile(), already processing for itemId', this.message.data.itemId);
        return;
      }
      if (bDebug) console.log(sName, 'deleteFile() for itemId', this.message.data.itemId);
      const payload = basePayload();
      payload.itemId = this.message.data.itemId;
      try {
        await handleExtension(API_ON_UPLOAD_FILE_DELETE_CLICK, payload);
      } finally {
        this.bProcessing = false;
      }
    },

    assignSpinnerValue(n) {
      if (this.$refs.spinner) {
        if (n == null) n = 0;
        this.$refs.spinner.style.background =
          'conic-gradient(' + (this.fileUploadSymbolProgressBarColor||'blue') + ' ' + n +
          '%, ' + (this.fileUploadSymbolProgressBackgroundColor||'lightgrey') + ' ' + n + '%)';
        if (bDebug) console.log(sName, 'Setting upload percentage', n);
      } else {
        if (bDebug) console.log(sName, '!$refs.spinner, reStatus:', this.reStatus, ', mesaage:', this.message);
      }
    },

    /**
     * Sets the state of the upload.
     * 
     * @param {object} us - the upload state.
     * @param {string|null} [us.status] - the status of the upload. Possible values are
     * SUCCEEDED, IN_PROGRESS, FAILED, INTERRUPTED and DELETED or null.
     * @param {boolean} [us.controlAllowed] - indicates if the control button should be displayed:
     * for SUCCEEDED it is "Delete"; for IN_PROGRESS - "Stop"; for FAILED, INTERRUPTED and DELETED - "Re-upload".
     * If this flag is undefined, it is ignored. Otherwise, if it evaluates to <code>true</code>,
     * the corresponding button is displayed. If it evaluates to <code>false</code>, the button is suppressed.
     * @param {number} [us.uploadPercentage] the percentage of the file upload to display. Allowed values are from 0 to 100.
     * @param {string|null} [x.imageUrl] the URL of the image to display in the message. It can also be a data URL.
     */
    setUploadState(us) {
      if (us.status !== undefined) {
        if (us.status !== null && !this.getContainerClassAddition(us.status)) {
          console.error(sName, 'Wrong upload status [ ' + us.status + ' ]');
          return;
        }
        this.reStatus = us.status;
        if (bDebug) console.log(sName, 'setUploadState, setting status', this.reStatus);
      }
      if (us.controlAllowed !== undefined) {
        this.reControlAllowed = us.controlAllowed ? true : false;
        if (bDebug) console.log(sName, 'setUploadState, setting controlAllowed', this.reControlAllowed);
      }
      if (us.imageUrl !== undefined) {
        this.imageUrl = us.imageUrl;
        if (bDebug) console.log(sName, 'setUploadState, setting imageUrl', this.imageUrl);
      }
      if (us.uploadPercentage !== undefined) {
        const n = Number(us.uploadPercentage);
        if (Number.isNaN(n)) {
          console.error(sName, 'Wrong uploadPercentage value [ ' + us.status + ' ], should be a number between 0 and 100');
        } else {
          this.nUploadPercentage = n < 0 ? 0 : n > 100 ? 100 : n;
          if (bDebug) console.log(sName, 'setUploadState, applying uploadPercentage', this.nUploadPercentage);
          this.assignSpinnerValue(this.nUploadPercentage);
        }
      }
      this.storeData();
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
