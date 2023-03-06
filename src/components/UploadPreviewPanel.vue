<template>
  <div v-if="idToItem != null" 
    class="twc-upload-preview-panel"
    contenteditable="true"
    style="caret-color:transparent"
    onbeforeinput="return false"

    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover.prevent="onDragOver"
    @drop.prevent="addFilesFromDrop"
    @paste.prevent="addFilesFromPaste"
  >
    <div class = "twc-files-space">
      <div class="twc-upload-items">

        <div class="twc-upload-item" 
          v-for="(item, id) in idToItem" 
          :key="id"
          :title="item.file.name"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="twc-upload-item-close"
            @click.stop.prevent="clickRemoveItem(item)"
          >
            <line x1="10" y1="1" x2="1" y2="10"></line>
            <line x1="1" y1="1" x2="10" y2="10"></line>
          </svg>

          <canvas :id="('twc-upload-item-canvas' + id)" class="twc-upload-item-canvas"></canvas>
          <div class = "twc-file-name">{{item.file.name}}</div>
         
        </div>
      </div>

      <input type="file" ref="fileInputElement" multiple="multiple" @click.stop="e=>{e.currentTarget.value=null}" @change="addFilesFromInput" style="opacity:0"/>
      
    </div>

    <textarea v-if="comment != null" :disabled="processing" v-model="comment" class="twc-upload-comment"></textarea>
    
    <div class="twc-upload-buttons">
      <button type="button" @click.stop.prevent="clickOpenFileInput" :disabled="processing" :title="$t('message.upload_panel_add_files')">&#10010;</button>
      <button v-if="!hideClearAllButton" type="button" @click.stop.prevent="clearAll" :disabled="processing || !itemsCount">{{ $t('message.upload_panel_clear_all') }}</button>
      <button v-if="!hideSubmitButton" type="button" @click.stop.prevent="clickSubmit" :disabled="processing || !itemsCount">{{ $t('message.upload_panel_submit') }}</button>
      <button v-if="!hideCancelButton" type="button" @click.stop.prevent="clickCancel" :disabled="processing">{{ $t('message.upload_panel_cancel') }}</button>
    </div>

  </div>
</template>

<style scoped>

/* Parent: hall panel */
.twc-upload-preview-panel {
  box-sizing: border-box;
  height: auto;
  border: none;
  background-color: var(--user-input-bg-color, #f4f7f9);
  padding: 10px;
  position: relative;
}

[contenteditable] {
  outline: 0px solid transparent;
}

.twc-upload-preview-panel-drag {
  background-color: var(--user-input-fg-color, #565867);
  opacity: 60%;
}

.twc-files-space {
  height: 5rem;
  display: flex;
  position: relative;
  justify-content: center;
}

/* Uploaded items visualizer */
.twc-upload-items {
  -webkit-overflow-scrolling: touch; /** Makes it possible to scroll in mobile */
  width: 80%;
  height: 90px;
  position: absolute;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 5px;
  direction: rtl; /* right to left scrolling */ 
}

/* width */
.twc-upload-items::-webkit-scrollbar {
  height: 5px;
  margin: 2px;
}

/* Track */
.twc-upload-items::-webkit-scrollbar-track {
  background: var(--user-input-bg-color); 
  border-radius: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
  box-shadow: none;
}
 
/* Handle */
.twc-upload-items::-webkit-scrollbar-thumb {
  background: grey; 
  border-radius: 10px;
  box-shadow: none;
  width: 2px;
}

/* Handle on hover */
.twc-upload-items::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color); 
}

/* Input zone: if you click on it, the file selector will appear automatically. 
This may used to implement the drag and drop?*/
input[type = "file"] {
  position: absolute;
  top: 0;
  z-index: 1;
  height: 5rem;
  width: 100%;
}

input[type = "file"]:hover {
  cursor: pointer;
}

.twc-upload-item {
  background-color: white;
  border: 1px solid var(--light-border-color, #c9c9c9);
  border-radius: 10px;
  min-width: 3.5rem;
  min-height: 3.5rem;
  font-size: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: 5px;
  margin-bottom: 0;
  padding: 5px;
  text-align: right;
  position: relative;
}

/* items to visualize the uploaded files */
.twc-file-icon {
  stroke: gray;
  margin-bottom: 2px;
}

.twc-file-name {
  font-size: 0.6rem;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 80%;
  white-space: nowrap;
  position: absolute;
  bottom: 1%;
}

.twc-upload-item-canvas {
  display: inline-block;
}

.twc-upload-item-close {
  position: absolute;
  z-index: 50;
  top: -8%;
  right: -8%;
  border-radius: 50%;
  border: none;
  background-color: red;
  stroke: white;
  padding: 4px;
  box-shadow: 0px 4px 6px 0px rgba(201, 201, 201, 0.8);
}

.twc-upload-item-close:hover{
  cursor: pointer;
}

/* Buttons to handle the attachment feature */
.twc-upload-buttons {
  margin-top: 20px;
  padding: 5px;
  height: auto;
  padding: 5px;
  display: flex;
  align-content: center;
  flex-direction: row;
  justify-content: flex-end;
  position: relative;
}

button {
  border: none;
  cursor: pointer;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 0.9em;
  line-height: 1;
  border-radius: 50px;
  display: inline-block;
  margin: 5px;
  text-decoration: none;
  transition: all 0.5s;
  box-shadow: 0 2px 4px 0 rgba(85, 87, 85, 0.5);
}

button:nth-child(1){
  color: var(--success-color, #28a745);
  background-color: var(--light-fg-color, #ffffff);
  border: 1px solid  var(--success-color, #28a745);
  padding: 0.275rem 0.275rem;
  align-self: flex-start;
  
  text-align: center;
  justify-content: center;
}

button:nth-child(2){
  color: var(--danger-color, #dc3545);
  background-color: var(--light-fg-color, #ffffff); 
  border: 1px solid  var(--danger-color, #dc3545);
  padding: 0.275rem 0.65rem;
  min-width: 62px;
  
}

button:nth-child(3){
  color: var(--light-fg-color, #ffffff);
  background-color: var(--success-color, #28a745);
  padding: 0.275rem 0.65rem;
  min-width: 62px;
}

button:nth-child(4){
  color: var(--light-fg-color, #ffffff);
  background-color: var(--danger-color, #dc3545);
  padding: 0.275rem 0.65rem;
  min-width: 62px;
}



</style>

<script>
/* <![CDATA[ */

// TODO ALPE

import { EventBus, events } from '../utils/event-bus.js';
import { API_ON_UPLOAD_PANEL_SUBMIT, API_ON_UPLOAD_PANEL_CANCEL } from '../utils/api-function-names.js';
import basePayload from '../utils/base-payload.js';
import handleExtension from '../utils/handle-extension.js';

/**
 * Mapping from item ID to the extra data for that item. This extra data is not kept in the item itself
 * to avoid reactive effects. It can include the size of the image, its data URL and eventual visualization
 * errors.
 * 
 * @type {(object|null|undefined)}
 */
var idToExtraData = null;

/**
 * Indicates if additiona debug information should be logged.
 * 
 * @const {boolean}
 */
const bDebug = true,

/**
 * The name of the component, to be used for debug purposes.
 * 
 * @const {string}
 */
sName = 'UploadPreviewPanel',

/**
 * Max image width in preview, in pixels.
 * 
 * @const {number}
 */
MAX_IMG_PREVIEW_WIDTH = 32,

/**
 * Max image height in preview, in pixels.
 * 
 * @const {number}
 */
 MAX_IMG_PREVIEW_HEIGHT = 32,


newId = () => {
  const s = Math.random().toString(36);
  // Adding a leading non-digit and non-letter to guarantee the key cannot be
  // interpreted as a number, to prevent number-induced ordering of the entries
  // in the object:
  return ':' + Date.now().toString(36) + s.substring(s.indexOf('.') + 1);
},


isImageFile = file => (file.type || '').toLowerCase().startsWith('image/'),


getAbbreviated = (s, nMaxLength) => nMaxLength < 4 || s.length <= nMaxLength ? s : s.substring(0, nMaxLength - 3) + '...',


getPreuploadCaption = file => {
  var s = file.name;
  if (!s || (s = s.trim()).length === 0) return '#';
  return s.charAt(0);
  /*
  if (s.length <= 7) return s;
  const n = s.lastIndexOf('.');
  if (n === -1) return getAbbreviated(s, 7);
  const t = s.substring(n + 1).trim();
  s = s.substring(0, n).trim();
  if (s.length > 2) s = s.charAt(0) + '.';
  return (s.endsWith('.') ? s : s + '.') + getAbbreviated(t, 4);
  */
},


getPrintableDebugObject = obj => {
  if (obj == null) return obj;
  if (Array.isArray(obj)) return obj.map(x => getPrintableDebugObject(x));
  if ('object' !== typeof obj) return obj;
  const m = {};
  if (obj.constructor === File || obj.constructor === Blob) {
    m['_'] = 'SOURCE';
    if (obj.name !== undefined) m.name = obj.name;
    if (obj.type !== undefined) m.type = obj.type;
    if (obj.size !== undefined) m.size = obj.size;
  } else {
    Object.entries(obj).forEach(e => {m[e[0]] = getPrintableDebugObject(e[1]);});
  }
  return m;
},

getFileExtension = file => {
  var s = file.name;
  if (!s) return '#';
  const n = s.lastIndexOf('.');
  return (n === -1 || (s = s.substring(n + 1).trim()).length === 0) ? '#' : s;
};


export default {

  data() {
    return {
      idToItem: null,
      itemsCount: 0,
      comment: null,
      hideSubmitButton: false,
      hideCancelButton: false,
      hideClearAllButton: false,
      processing: false
    };
  },


  mounted() {
    if (bDebug) console.log(sName, 'mounted');
    EventBus.$on(events.SHOW_UPLOAD_PANEL, payload => this.open(payload));
    EventBus.$on(events.HIDE_UPLOAD_PANEL, () => this.close());
  },


  updated() {
    if (bDebug) console.log(sName, 'updated');
    if (this.idToItem) {
      for (var id in this.idToItem) {
        if (this.idToItem.hasOwnProperty(id)) {
          const canvas = document.getElementById('twc-upload-item-canvas' + id);
          if (canvas) this.initCanvas(canvas, this.idToItem[id]);
          else console.warn(sName, 'Missing canvas for id', id);
        }
      }
    }
  },


  unmounted() {
    if (bDebug) console.log(sName, 'unmounted');
    EventBus.$off(events.SHOW_UPLOAD_PANEL);
    EventBus.$off(events.HIDE_UPLOAD_PANEL);
  },


  methods: {

    onDragOver(evt) {
      if (bDebug) console.log(sName, 'onDragOver(), processing:', this.processing);
      if (this.processing) return;
      evt.currentTarget.classList.add("twc-upload-preview-panel-drag");
    },


    onDragEnter(evt) {
      if (bDebug) console.log(sName, 'onDragEnter(), processing:', this.processing);
      if (this.processing) return;
      evt.currentTarget.classList.add("twc-upload-preview-panel-drag");
    },


    onDragLeave(evt) {
      if (bDebug) console.log(sName, 'onDragLeave(), processing:', this.processing);
      evt.currentTarget.classList.remove("twc-upload-preview-panel-drag");
    },


    addFilesFromDrop(evt) {
      if (bDebug) console.log(sName, 'addFilesFromDrop(), processing:', this.processing);
      evt.currentTarget.classList.remove("twc-upload-preview-panel-drag");
      if (this.processing) return;
      this.addFiles(evt.dataTransfer.files);
    },


    addFilesFromPaste(evt) {
      if (bDebug) console.log(sName, 'addFilesFromPaste(), processing:', this.processing);
      if (this.processing) return;
      this.addDataTransferItemsAsFiles(evt.clipboardData.items);
    },


    addFilesFromInput(evt) {
      if (bDebug) console.log(sName, 'addFilesFromInput(), processing:', this.processing);
      if (this.processing) return;
      this.addFiles(evt.currentTarget.files);
    },


    clickOpenFileInput() {
      if (bDebug) console.log(sName, 'clickOpenFileInput(), processing:', this.processing);
      if (this.processing) return;
      this.$refs.fileInputElement.click();
    },


    addFile(file) {
      const id = newId();
      if (!this.idToItem.hasOwnProperty(id)) this.itemsCount++;
      this.idToItem[id] = {
        id: id,
        file: file,
        asImage: isImageFile(file)
      };
      if (bDebug) console.log(sName, 'addFile(), adding file [' + file.name + '] of type [' + file.type + '] and size [' + file.size + '] with id [' + id + ']');
    },


    addFiles(files) {
      if (files) {
        if (bDebug) console.log(sName, 'addFiles(), files chosen:', files.length);
        for (var file of files) {
          this.addFile(file);
        }
      } else {
        if (bDebug) console.log(sName, 'addFiles(), files chosen: NO');
      }
      if (bDebug) console.log(sName, 'addFiles(), end, itemsCount [' + this.itemsCount + '], idToItem:', getPrintableDebugObject(this.idToItem));
    },


    addDataTransferItemsAsFiles(dataTransferItems) {
      if (dataTransferItems) {
        if (bDebug) console.log(sName, 'addAsFiles(), dataTransferItems chosen:', dataTransferItems ? dataTransferItems.length : null);
        for (var dti of dataTransferItems) {
          if (dti.kind === 'file') this.addFile(dti.getAsFile());
          else if (bDebug) console.log(sName, 'addAsFiles(), skipping dataTransferItem.kind:', dti.kind);
        }
      } else {
        if (bDebug) console.log(sName, 'addAsFiles(), dataTransferItems chosen: NO');
      }
      if (bDebug) console.log(sName, 'addAsFiles(), end, itemsCount [' + this.itemsCount + '], idToItem:', getPrintableDebugObject(this.idToItem));
    },


    open(payload) {
      if (bDebug) console.log(sName, 'open(), payload:', payload);
      idToExtraData = {};
      this.idToItem = {};
      this.itemsCount = 0;
      this.processing = false;
      if (payload == null) {
        this.hideSubmitButton = false;
        this.hideCancelButton = false;
        this.hideClearAllButton = false;
        this.comment = null;
      } else {
        this.hideSubmitButton = payload.hideSubmitButton ? true : false;
        this.hideCancelButton = payload.hideCancelButton ? true : false;
        this.hideClearAllButton = payload.hideClearAllButton ? true : false;
        if (payload.comment == null) this.comment = null;
        else switch (typeof payload.comment) {
          case 'string':
            this.comment = payload.comment;
            break;
          case 'boolean':
            this.comment = payload.comment ? '' : null;
            break;
          default:
            this.comment = payload.comment.toString();
        }
        if (payload.items != null) {
          for (var item, i = 0; i < payload.items.length; i++) {
            item = payload.items[i];
            if (item == null) {
              console.warn(sName, 'open(), item at index', i, 'is undefined when opening an upload panel');
              continue;
            }
            if (item.id == null) {
              console.warn(sName, 'open(), item.id at index', i, 'is undefined when opening an upload panel');
              continue;
            }
            if (item.file == null) {
              console.warn(sName, 'open(), item.file at index', i, 'is undefined when opening an upload panel');
              continue;
            }
            if (!this.idToItem.hasOwnProperty(item.id)) this.itemsCount++;
            this.idToItem[item.id] = {
              id: item.id,
              file: item.file,
              asImage: item.asImage == null ? isImageFile(item.file) : (item.asImage ? true : false)
            };
          }
        }
      }
      EventBus.$emit(events.UPLOAD_PANEL_OPENED);
      if (bDebug) console.log(sName, 'open() end, comment [' + this.comment + '], itemsCount [' + this.itemsCount + '], idToItem:', getPrintableDebugObject(this.idToItem));
    },


    close() {
      if (bDebug) console.log(sName, 'close()');
      idToExtraData = null;
      this.idToItem = null;
      this.itemsCount = 0;
      this.comment = null;
      this.hideSubmitButton = false;
      this.hideCancelButton = false;
      this.hideClearAllButton = false;
      this.processing = false;
      EventBus.$emit(events.UPLOAD_PANEL_CLOSED);
    },


    clearAll() {
      if (bDebug) console.log(sName, 'clearAll(), processing:', this.processing);
      if (this.processing) return;
      if (idToExtraData != null) idToExtraData = {};
      if (this.idToItem != null) this.idToItem = {};
      this.itemsCount = 0;
      if (this.comment != null) this.comment = '';
      this.processing = false;
    },


    async clickCancel() {
      if (bDebug) console.log(sName, 'clickCancel(), processing:', this.processing);
      if (this.processing) return;
      this.processing = true;
      const payload = basePayload();
      payload.itemsCount = this.itemsCount;
      try {
        await handleExtension(API_ON_UPLOAD_PANEL_CANCEL, payload);
      } finally {
        this.processing = false;
        if (bDebug) console.log(sName, 'clickCancel() end, payload:', getPrintableDebugObject(payload));
        if (payload.handledState.handled === true) return;
        this.close();
      }
    },


    async clickSubmit() {
      if (bDebug) console.log(sName, 'clickSubmit(), processing:', this.processing);
      if (this.processing) return;
      this.processing = true;
      const payload = basePayload();

      payload.items = [];
      if (this.idToItem) {
        //payload.items = Object.values(this.idToItem);
        let id, item, x;
        for (id in this.idToItem) {
          if (this.idToItem.hasOwnProperty(id)) {
            item = Object.assign({}, this.idToItem[id]);
            if (idToExtraData && (x = idToExtraData[id]) != null) {
              x = x.imageUrl;
              if (x) item.imageUrl = x;
            }
            payload.items.push(item);
          }
        }
      } else {
        console.warn(sName, 'clickSubmit(), submitting upload items with undefined idToItem');
      }
      payload.comment = this.comment;
      try {
        await handleExtension(API_ON_UPLOAD_PANEL_SUBMIT, payload);
      } finally {
        this.processing = false;
        if (bDebug) console.log(sName, 'clickSubmit() end, payload:', getPrintableDebugObject(payload));
        if (payload.handledState.handled === true) return;
        this.close();
      }
    },


    clickRemoveItem(item) {
      if (bDebug) console.log(sName, 'clickRemoveItem(), processing:', this.processing);
      if (this.processing) return;
      this.removeItem(item);
    },

    /** This function can use getPreuploadCaption() to print the first letter of the file content or display a label with the file extension using getfileExtension() */
    insertTextCaption(canvasElement, item, ctx) {
      if (bDebug) console.log(sName, 'insertTextCaption()');
      canvasElement.width = MAX_IMG_PREVIEW_WIDTH;
      canvasElement.height = MAX_IMG_PREVIEW_HEIGHT;
      if (ctx == null) ctx = canvasElement.getContext("2d");
      if (ctx) {
    
        /*const captionText = getPreuploadCaption(item.file);*/

        const captionText = getFileExtension(item.file);
        if (bDebug) console.log(sName, 'insertTextCaption(), fillText, captionText:', captionText);

        /** Tag color depending on file extension */
        var color = "";
        switch (captionText) {
          case "pdf":
            color = "red";
            break;
          case "docx":
          case "doc":
            color = "blue";
            break
          case "csv":
          case "xls":
          case "xlsb":
          case "xlsx":
            color = "green";
            break;
          default:
            color = "grey";
            break;
        }
        /** Caption Tag */
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(0, 5, 30, 20, 10);
        ctx.fill();

        /** Tag content */
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '0.25em sans-serif';
        /*ctx.font = 'bold ' + ((MAX_IMG_PREVIEW_HEIGHT < MAX_IMG_PREVIEW_WIDTH ? MAX_IMG_PREVIEW_HEIGHT : MAX_IMG_PREVIEW_WIDTH) - 2) + 'px sans-serif';*/
        ctx.fillStyle = "white";
        ctx.fillText(captionText, MAX_IMG_PREVIEW_WIDTH/2, MAX_IMG_PREVIEW_HEIGHT/2, 25);

      } else {
        alert('No context for text in preload preview canvas');
        console.error(sName, 'insertTextCaption(), no context for text in preload preview canvas');
        setTimeout(() => this.removeItem(item));
      }
    },


    insertImage(canvasElement, item) {
      if (bDebug) console.log(sName, 'insertImage()');
      const ctx = canvasElement.getContext("2d");
      if (ctx == null) {
        alert('No context for image in preload preview canvas');
        console.error(sName, 'insertImage(), no context for image [' + item.file.name + '] in preload preview canvas');
        setTimeout(() => this.removeItem(item));
        return;
      }
      var extraData = idToExtraData[item.id];
      if (extraData == null) idToExtraData[item.id] = extraData = {};
      else {
        if (extraData.imageFailure) {
          this.insertTextCaption(canvasElement, item, ctx);
          return;
        }
        canvasElement.width = extraData.width;
        canvasElement.height = extraData.height;
      }

      const f = () => {
        const img = new window.Image();
        img.addEventListener('load', () => {
          if (bDebug) console.log(sName, 'insertImage(), img.onload, img.width==' + img.width + ', img.height==' + img.height);
          if (Number.isFinite(img.width) && img.width > 0 && Number.isFinite(img.height) && img.height > 0) {
            if (extraData.width == null || extraData.height == null) {
              let w = MAX_IMG_PREVIEW_WIDTH / img.width, h = MAX_IMG_PREVIEW_HEIGHT / img.height;
              if (w < h) {
                // w is the reference, width > height
                h = w * img.height;
                w *= img.width;
                // here, w === MAX_IMG_PREVIEW_WIDTH
                const x = w / 4;
                if (h < x) h = x;
              } else {
                // h is the reference, height > width
                w = h * img.width;
                h *= img.height;
                // here, h === MAX_IMG_PREVIEW_HEIGHT
                const x = h / 4;
                if (w < x) w = x;
              }
              canvasElement.width = w;
              canvasElement.height = h;

              extraData.width = w;
              extraData.height = h;
            }
            if (bDebug) console.log(sName, 'insertImage(), img.onload, drawImage, extraData:', extraData);
            try {
              ctx.drawImage(img, 0, 0, extraData.width, extraData.height);
            } catch (err) {
              extraData.imageFailure = 'insertImage(), failure drawing image [' + item.file.name + '] in preload preview canvas';
              console.warn(sName, extraData.imageFailure, err);
              this.insertTextCaption(canvasElement, item, ctx);
            }
          } else {
            extraData.imageFailure = 'insertImage(), bad image size, width [' + img.width + '], height [' + img.height + ']';
            console.warn(sName, extraData.imageFailure);
            this.insertTextCaption(canvasElement, item, ctx);
          }
        });

        img.addEventListener('error', () => {
          extraData.imageFailure = 'insertImage(), failure preparing image [' + item.file.name + '] in preload preview canvas';
          console.warn(sName, extraData.imageFailure);
          this.insertTextCaption(canvasElement, item, ctx);
        });

        img.src = extraData.imageUrl;
      };

      if (extraData.imageUrl) f();
      else {
        const fileReader = new FileReader();

        fileReader.addEventListener('load', () => {
          if (extraData.imageUrl) return;
          extraData.imageUrl = fileReader.result;
          if (extraData.imageUrl) f();
          else {
            extraData.imageFailure = 'insertImage(), empty data URL for file [' + item.file.name + ']';
            console.warn(sName, extraData.imageFailure);
            this.insertTextCaption(canvasElement, item, ctx);
          }
        });

        fileReader.addEventListener('error', () => {
          extraData.imageFailure = 'insertImage(), failure to read file [' + item.file.name + ']';
          console.warn(sName, extraData.imageFailure);
          this.insertTextCaption(canvasElement, item, ctx);
        });

        fileReader.addEventListener('abort', () => {
          console.warn(sName, 'insertImage(), aborting reading file', item.file.name);
          this.insertTextCaption(canvasElement, item, ctx);
        });

        fileReader.readAsDataURL(item.file);
      }
    },


    initCanvas(el, item) {
      if (bDebug) console.log(sName, 'initCanvas()');
      if (el) {
        if (item.asImage) this.insertImage(el, item);
        else this.insertTextCaption(el, item);
      }
    },


    removeItem(item) {
      if (bDebug) console.log(sName, 'removeItem()');
      delete idToExtraData[item.id];
      if (this.idToItem.hasOwnProperty(item.id)) {
        delete this.idToItem[item.id];
        this.itemsCount--;
      }
    }
  }
};

/* ]]> */
</script>
