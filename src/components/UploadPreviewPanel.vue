<template>
  <div v-if="idToItem != null" class="twc-upload-preview-panel">
    <div class="twc-upload-items">
      <div class="twc-upload-item" v-for="(item, id) in idToItem" :key="id">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="twc-upload-item-close"
          @click.stop.prevent="clickRemoveItem(item)"
        >
          <line x1="14" y1="1" x2="1" y2="14"></line>
          <line x1="1" y1="1" x2="14" y2="14"></line>
        </svg>
        <br/>
        <canvas :id="('twc-upload-item-canvas' + id)" class="twc-upload-item-canvas"></canvas>
      </div>
    </div>
    <textarea v-if="comment != null" :disabled="processing" v-model="comment" class="twc-upload-comment"></textarea>
    <div class="twc-upload-buttonss">
      <button type="button" @click.stop.prevent="clickOpenFileInput" :disabled="processing">Add files</button>
      <button type="button" @click.stop.prevent="clickClearAll" :disabled="processing || !itemsCount">Clear all</button>
      <button type="button" @click.stop.prevent="clickSubmit" :disabled="processing || !itemsCount">Submit</button>
      <button type="button" @click.stop.prevent="clickCancel" :disabled="processing">Cancel</button>
    </div>
    <input type="file" ref="fileInputElement" multiple="multiple" @click.stop="e=>{e.currentTarget.value=null}" @change="addFiles" style="opacity:0"/>
  </div>
</template>


<style scoped>

.twc-upload-item {
  display: inline-block;
  border: thin solid black;
  margin: 2px;
  padding: 2px;
  text-align: right;
}

.twc-upload-item-canvas {
  display: inline-block;
}

</style>


<script>
/* <![CDATA[ */

import { EventBus, events } from '../utils/event-bus.js';
import { API_ON_UPLOAD_PANEL_SUBMIT, API_ON_UPLOAD_PANEL_CANCEL } from '../utils/api-function-names.js';
import basePayload from '../utils/base-payload.js';
import handleExtension from '../utils/handle-extension.js';


const bDebug = true, sName = 'UploadPreviewPanel',

MAX_IMG_PREVIEW_WIDTH = 32, MAX_IMG_PREVIEW_HEIGHT = 32,


newId = () => {
  const s = Math.random().toString(36);
  // Adding a leading non-digit to guarantee the key cannot be interpreted as a
  // number, to prevent number-induced ordering of the entries in the object:
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


getPostuploadCaption = file => {
  var s = file.name;
  return (!s || (s = s.trim()).length === 0) ? '#' : s;
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
};



export default {

  data() {
    return {
      idToItem: null,
      itemsCount: 0,
      comment: null,
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
          if (canvas) this.initCanvas(canvas, this.idToItem[id])
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

    clickOpenFileInput() {
      if (bDebug) console.log(sName, 'clickOpenFileInput(), processing:', this.processing);
      if (this.processing) return;
      this.$refs.fileInputElement.click();
    },


    addFiles(evt) {
      if (bDebug) console.log(sName, 'addFiles()');
      const files = evt.currentTarget.files;
      if (bDebug) console.log(sName, 'addFiles(), files chosen:', files.length);
      for (var file, id, i = 0; i < files.length; i++) {
        file = files[i];
        id = newId();
        if (!this.idToItem.hasOwnProperty(id)) this.itemsCount++;
        this.idToItem[id] = {
          id: id,
          file: file,
          bImageMime: isImageFile(file)
        };
        if (bDebug) console.log(sName, 'addFiles(), adding file [' + file.name + '] of type [' + file.type + '] and size [' + file.size + '] with id [' + id + ']');
      }
      if (bDebug) console.log(sName, 'addFiles(), end, itemsCount [' + this.itemsCount + '], idToItem:', getPrintableDebugObject(this.idToItem));
    },


    open(payload) {
      if (bDebug) console.log(sName, 'open(), payload:', payload);
      this.idToItem = {};
      this.itemsCount = 0;
      this.processing = false;
      if (payload == null) this.comment = null;
      else {
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
              bImageMime: item.bImageMime == null ? isImageFile(item.file) : item.bImageMime
            };
          }
        }
      }
      if (bDebug) console.log(sName, 'open() end, comment [' + this.comment + '], itemsCount [' + this.itemsCount + '], idToItem:', getPrintableDebugObject(this.idToItem));
    },


    close() {
      if (bDebug) console.log(sName, 'close()');
      this.idToItem = null;
      this.itemsCount = 0;
      this.comment = null;
      this.processing = false;
    },


    clickClearAll() {
      if (bDebug) console.log(sName, 'clickClearAll(), processing:', this.processing);
      if (this.processing) return;
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
      if (this.idToItem) payload.items = Object.values(this.idToItem);
      else {
        console.warn(sName, 'clickSubmit(), submitting upload items with undefined idToItem');
        payload.items = [];
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


    insertTextCaption(canvasElement, item) {
      if (bDebug) console.log(sName, 'insertTextCaption()');
      canvasElement.width = MAX_IMG_PREVIEW_WIDTH;
      canvasElement.height = MAX_IMG_PREVIEW_HEIGHT;
      const ctx = canvasElement.getContext("2d");
      if (ctx) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + ((MAX_IMG_PREVIEW_HEIGHT < MAX_IMG_PREVIEW_WIDTH ? MAX_IMG_PREVIEW_HEIGHT : MAX_IMG_PREVIEW_WIDTH) - 2) + 'px sans-serif';
        const captionText = getPreuploadCaption(item.file);
        if (bDebug) console.log(sName, 'insertTextCaption(), fillText, captionText:', captionText);
        ctx.fillText(captionText, MAX_IMG_PREVIEW_WIDTH/2, MAX_IMG_PREVIEW_HEIGHT/2, MAX_IMG_PREVIEW_WIDTH-2);
      } else {
        alert('No context for text in preload preview canvas');
        console.error(sName, 'insertTextCaption(), no context for text in preload preview canvas');
        setTimeout(() => this.removeItem(item));
      }
    },


    insertImage(canvasElement, item) {
      if (bDebug) console.log(sName, 'insertImage()');
      var blobURL = window.URL.createObjectURL(item.file);
      const img = new window.Image();

      img.onload = () => {
        if (bDebug) console.log(sName, 'insertImage(), img.onload, img.width==' + img.width + ', img.height==' + img.height);
        window.URL.revokeObjectURL(blobURL);
        blobURL = null;
        if (Number.isFinite(img.width) && img.width > 0 && Number.isFinite(img.height) && img.height > 0) {
          let w = MAX_IMG_PREVIEW_WIDTH / img.width, h = MAX_IMG_PREVIEW_HEIGHT / img.height, x;
          if (w < h) {
            // w is the reference, width > height
            h = w * img.height;
            w *= img.width;
            // here, w === MAX_IMG_PREVIEW_WIDTH
            x = w / 4;
            if (h < x) h = x;
          } else {
            // h is the reference, height > width
            w = h * img.width;
            h *= img.height;
            // here, h === MAX_IMG_PREVIEW_HEIGHT
            x = h / 4;
            if (w < x) w = x;
          }
          canvasElement.width = w;
          canvasElement.height = h;

          x = canvasElement.getContext("2d");
          if (x != null) {
            if (bDebug) console.log(sName, 'insertImage(), img.onload, drawImage, w==' + w + ', h==' + h);
            try {
              x.drawImage(img, 0, 0, w, h);
            } catch (err) {
              console.warn(sName, 'insertImage(), failure drawing image [' + item.file.name + '] in preload preview canvas', err);
              this.insertTextCaption(canvasElement, item);
            }
          } else {
            alert('No context for image in preload preview canvas');
            console.error(sName, 'insertImage(), no context for image [' + item.file.name + '] in preload preview canvas');
            setTimeout(() => this.removeItem(item));
          }
        } else {
          console.warn(sName, 'insertImage(), bad image size, width', img.width, 'height', img.height);
          this.insertTextCaption(canvasElement, item);
        }
      };

      img.onerror = e => {
        console.warn(sName, 'insertImage(), failure preparing image [' + item.file.name + '] in preload preview canvas', e);
        window.URL.revokeObjectURL(blobURL);
        blobURL = null;
        this.insertTextCaption(canvasElement, item);
      };

      img.src = blobURL;
    },


    initCanvas(el, item) {
      if (bDebug) console.log(sName, 'initCanvas()');
      if (el) {
        if (item.bImageMime) this.insertImage(el, item);
        else this.insertTextCaption(el, item);
      }
    },


    removeItem(item) {
      if (bDebug) console.log(sName, 'removeItem()');
      if (this.idToItem.hasOwnProperty(item.id)) {
        delete this.idToItem[item.id];
        this.itemsCount--;
      }
    }
  }
};

/* ]]> */
</script>
