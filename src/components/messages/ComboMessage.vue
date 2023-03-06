<template>
  <ul class="twc-combo">
    <li v-for="(message, idx) in comboitems" :key="idx">
      <div class="twc-combo-message" v-if="message.type==='linkpreview'">
        <a :href="message.url || undefined"
           :title="message.description || this.$t('message.preview_description_not_available')" 
           target="_blank" class="twc-link-preview">
          <div class="twc-link-preview-left-column">
            <img :src="message.image || 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTE1LjE5IDEyMy4zOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTE1LjE5IDEyMy4zOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDowLjU7c3Ryb2tlLW1pdGVybGltaXQ6Mi42MTMxO308L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05My4xMyw3OS41YzEyLjA1LDAsMjEuODIsOS43NywyMS44MiwyMS44MmMwLDEyLjA1LTkuNzcsMjEuODItMjEuODIsMjEuODJjLTEyLjA1LDAtMjEuODItOS43Ny0yMS44Mi0yMS44MiBDNzEuMzEsODkuMjcsODEuMDgsNzkuNSw5My4xMyw3OS41TDkzLjEzLDc5LjV6IE04LjA4LDAuMjVoOTUuMjhjMi4xNywwLDQuMTEsMC44OSw1LjUzLDIuM2MxLjQyLDEuNDIsMi4zLDMuMzksMi4zLDUuNTN2NzAuMDEgYy0yLjQ2LTEuOTEtNS4yNC0zLjQ0LTguMjUtNC40OFY5Ljk4YzAtMC40My0wLjE2LTAuNzktMC40Ni0xLjA1Yy0wLjI2LTAuMjYtMC42Ni0wLjQ2LTEuMDUtMC40Nkg5Ljk0IGMtMC40MywwLTAuNzksMC4xNi0xLjA1LDAuNDZDOC42Myw5LjE5LDguNDMsOS41OCw4LjQzLDkuOTh2NzAuMDJoMC4wM2wzMS45Ny0zMC42MWMxLjI4LTEuMTgsMy4yOS0xLjA1LDQuNDQsMC4yMyBjMC4wMywwLjAzLDAuMDMsMC4wNywwLjA3LDAuMDdsMjYuODgsMzEuOGMtNC43Myw1LjE4LTcuNjIsMTIuMDgtNy42MiwxOS42NWMwLDMuMjksMC41NSw2LjQ1LDEuNTUsOS40SDguMDggYy0yLjE3LDAtNC4xMS0wLjg5LTUuNTMtMi4zcy0yLjMtMy4zOS0yLjMtNS41M1Y4LjA4YzAtMi4xNywwLjg5LTQuMTEsMi4zLTUuNTNTNS45NCwwLjI1LDguMDgsMC4yNUw4LjA4LDAuMjV6IE03My45OCw3OS4zNSBsMy43MS0yMi43OWMwLjMtMS43MSwxLjkxLTIuOSwzLjYyLTIuNmMwLjY2LDAuMSwxLjI1LDAuNDMsMS43MSwwLjg2bDE3LjEsMTcuOTdjLTIuMTgtMC41Mi00LjQ0LTAuNzktNi43OC0wLjc5IEM4NS45MSw3MS45OSw3OS4xMyw3NC43Nyw3My45OCw3OS4zNUw3My45OCw3OS4zNXogTTgxLjk4LDE4LjE5YzMuMTMsMCw1Ljk5LDEuMjgsOC4wMywzLjMyYzIuMDcsMi4wNywzLjMyLDQuOSwzLjMyLDguMDMgYzAsMy4xMy0xLjI4LDUuOTktMy4zMiw4LjAzYy0yLjA3LDIuMDctNC45LDMuMzItOC4wMywzLjMyYy0zLjEzLDAtNS45OS0xLjI4LTguMDMtMy4zMmMtMi4wNy0yLjA3LTMuMzItNC45LTMuMzItOC4wMyBjMC0zLjEzLDEuMjgtNS45OSwzLjMyLTguMDNDNzYuMDIsMTkuNDQsNzguODYsMTguMTksODEuOTgsMTguMTlMODEuOTgsMTguMTl6IE04NS44Miw4OC4wNWwxOS45NiwyMS42IGMxLjU4LTIuMzksMi41LTUuMjUsMi41LTguMzNjMC04LjM2LTYuNzgtMTUuMTQtMTUuMTQtMTUuMTRDOTAuNDgsODYuMTcsODcuOTksODYuODUsODUuODIsODguMDVMODUuODIsODguMDV6IE0xMDAuNDQsMTE0LjU4IGwtMTkuOTYtMjEuNmMtMS41OCwyLjM5LTIuNSw1LjI1LTIuNSw4LjMzYzAsOC4zNiw2Ljc4LDE1LjE0LDE1LjE0LDE1LjE0Qzk1Ljc4LDExNi40Niw5OC4yNywxMTUuNzgsMTAwLjQ0LDExNC41OEwxMDAuNDQsMTE0LjU4eiIvPjwvZz48L3N2Zz4='"
                 :alt="message.title || this.$t('message.preview_title_not_available')"
                 class="twc-link-preview-img"/>
          </div>
          <div class="twc-link-preview-right-column">
            <p class="twc-link-preview-title">{{ message.title || this.$t('message.preview_title_not_available') }}</p>
            <p class="twc-link-preview-description">{{ message.description ? (message.description.length > 144 ? message.description.substr(0, 144) + '...' : message.description) : this.$t('message.preview_description_not_available') }}</p>
            <p class="twc-link-preview-domain">{{ (()=>{
              var s = message.url, n = s.indexOf('://');
              if (n !== -1) s = s.substring(n + 3);
              n = s.indexOf('/');
              return n === -1 ? s : s.substring(0, n);
            })() }}</p>
          </div>
        </a>
      </div>

      <div class="twc-combo-message" v-if="message.type==='text'">
        <div class="twc-text-message">
          <p class="twc-text-message__text" v-html="message.text"></p>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='audio'">
        <div class="twc-audio-message">
          <audio controls>
            <source :src="message.audio_url"/>
          </audio>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='quickreply'">
        <div class="twc-quickreply-message" :class="{ 'twc-expired': replySent || isExpired }">
            <a
              v-for="(reply, idx) in message.quick_replies"
              :key="idx"
              role="button"
              :tabindex="replySent || isExpired ? -1 : 0"
              class="twc-quickreply-message__item"
              :class="{ 'twc-selected': replySent && selected === idx, 'twc-primary': reply.style == 'primary', 'twc-secondary': reply.style == 'secondary', 'twc-success': reply.style == 'success', 'twc-danger': reply.style == 'danger', 'twc-warning': reply.style == 'warning', 'twc-info': reply.style == 'info'}"
              @click="onSelect(reply, idx)"
              @keydown="handleReturnSpaceKeys($event, reply, idx)"
            >{{ reply.title }}</a>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='clickablelist'">
        <div class="twc-clickablelist" :class="{ 'twc-expired': replySent || isExpired}">
          <h5 class="twc-clickablelist-title" v-if="message.title">{{ message.title }}</h5>
          <ul class="twc-clickablelist-message" :class="{ replied: replySent || isExpired}">
            <li
              v-for="(reply, idx) in message.list_items"
              :key="idx +'ql'"
              role="button"
              :tabindex="replySent || isExpired ? -1 : 0"
              class="twc-clickablelist-message__item"
              :class="{ 'twc-selected': replySent && selected === idx +'ql' }"
              @click="onSelect(reply, idx +'ql')"
              @keydown="handleReturnSpaceKeys($event, reply, idx +'ql')"
            >{{ reply.title }}</li>
          </ul>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='image'">
        <div class="twc-image-message" @click="zoomIn(message.image_url)">
          <img :src="message.image_url" :alt="message.alt" @load="scrollChatUp"/>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='youtubevideo'">
        <div class="twc-youtube-video">
          <iframe
            :src="message.video_url"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='filevideo'">
        <div class="twc-file-video">
          <video controls="1">
            <source :src="videoUrl(message.video_url)" type="video/mp4" />
          </video>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='vimeovideo'">
        <div class="twc-vimeo-video">
          <iframe :src="message.video_url" frameborder="0" allowfullscreen allowtransparency allow></iframe>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='buttons'">
        <div class="twc-buttons" :class="{ 'twc-expired': replySent || isExpired}">
            <h5 class="twc-buttons-title" v-if="message.title">{{ message.title }}</h5>
            <div>
              <a
                role="button"
                :tabindex="replySent || isExpired ? -1 : 0"
                v-for="(button, idx) in message.button_items"
                :key="idx +'btn'"
                class="twc-btn"
                :class="{ 'twc-selected': replySent && selected === idx +'btn', 'twc-primary': button.style == 'primary', 'twc-secondary': button.style == 'secondary', 'twc-success': button.style == 'success', 'twc-danger': button.style == 'danger', 'twc-warning': button.style == 'warning', 'twc-info': button.style == 'info'}"
                @click="onSelect(button, idx +'btn')"
                @keydown="handleReturnSpaceKeys($event, button, idx +'btn')"
              >{{ button.title }}</a>
            </div>
          </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='linkbuttons'">
        <div class="twc-linkbuttons">
            <h5 class="twc-linkbuttons-title" v-if="message.title">{{ message.title }}</h5>
            <a
              v-for="(button, idx) in message.linkbutton_items"
              role="link"
              :key="idx"
              :href="button.url"
              :target="button.target"
              :rel="button.target === '_blank' ? 'noopener': false"
              class="twc-linkbutton"
              @click="onLinkbuttonClick(button, $event)"
            >{{ button.title }}</a>
        </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='card'">
        <div class="twc-card">
            <div class="twc-card-img" v-if="message.image">
              <img :src="message.image.image_url" :alt="message.image.alt" />
            </div>
            <div class="twc-card-body" v-if="message.title || message.subtitle || message.text">
              <h5 class="twc-card-title" v-if="message.title">{{ message.title }}</h5>
              <h6 class="twc-card-subtitle" v-if="message.subtitle">{{ message.subtitle }}</h6>
              <p class="twc-card-text" v-if="message.text" v-html="sanitizedHtmlText(message.text)"></p>
            </div>
            <div class="twc-clickablelist" :class="{ 'twc-expired': replySent || isExpired}" v-if="message.list_items">
              <ul class="twc-clickablelist-message" :class="{ 'twc-replied': replySent}">
                <li
                  v-for="(reply, idx) in message.list_items"
                  :key="idx +'cql'"
                  class="twc-clickablelist-message__item"
                  role="button"
                  :tabindex="replySent || isExpired ? -1 : 0"
                  :class="{ 'twc-selected': replySent && selected === idx +'cql' }"
                  @click="onSelect(reply, idx +'cql')"
                  @keydown="handleReturnSpaceKeys($event, reply, idx +'cql')"
                >{{ reply.title }}</li>
              </ul>
            </div>
            <div class="twc-buttons" :class="{ 'twc-expired': replySent || isExpired}" v-if="message.button_items">
              <div>
                <a
                  role="button"
                  v-for="(button, idx) in message.button_items"
                  :key="idx +'cbtn'"
                  class="twc-btn"
                  :tabindex="replySent || isExpired ? -1 : 0"
                  :class="{ 'twc-selected': replySent && selected === idx +'cbtn', 'twc-primary': button.style == 'primary', 'twc-secondary': button.style == 'secondary', 'twc-success': button.style == 'success', 'twc-danger': button.style == 'danger', 'twc-warning': button.style == 'warning', 'twc-info': button.style == 'info'}"
                  @click="onSelect(button, idx +'cbtn')"
                  @keydown="handleReturnSpaceKeys($event, button, idx +'cbtn')"
                >{{ button.title }}</a>
              </div>
            </div>
            <div class="twc-linkbuttons" v-if="message.linkbutton_items">
                <a
                  role="link"
                  v-for="(button, idx) in message.linkbutton_items"
                  :key="idx"
                  :href="button.url"
                  :target="button.target"
                  :rel="button.target === '_blank' ? 'noopener': false"
                  class="twc-linkbutton"
                  @click="onLinkbuttonClick(button, $event)"
                >{{ button.title }}</a>
            </div>
            <!-- link item in cards are deprecated, please use linkbuttons instead -->
            <div class="twc-links" v-if="linkitems">
                <a
                  v-for="(link, idx) in linkitems"
                  :href="link.url"
                  :key="idx"
                >{{ link.title }}</a>
            </div>
          </div>
      </div>

      <div class="twc-combo-message" v-if="message.type==='table'">
        <div class="twc-table-message">
          <table class="twc-table twc-table-border">
            <caption class="twc-table-title" v-if="message.data.title">{{ message.data.title }}</caption>
            <thead v-if="message.data.headers">
            <tr class="twc-table-header-row">
              <th
                  v-for="(header) in message.data.headers"
                  :key="header"
                  class="twc-table-header-cell"
              >
                {{ header }}
              </th>
            </tr>
            </thead>
            <tbody v-if="message.data.body">
            <tr
                v-for="(row) in message.data.body"
                :key="row"
                class="twc-table-body-row"
            >
              <td
                  v-for="(cell) in row"
                  :key="cell"
                  class="twc-table-body-cell"
              >{{ cell }}
              </td>
            </tr>
            </tbody>
            <tfoot v-if="message.data.footers">
            <tr class="twc-table-footer-row">
              <td
                  v-for="(footer) in message.data.footers"
                  :key="footer"
                  class="twc-table-footer-cell"
              >{{ footer }}
              </td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>

import { PARTICIPANT_BOT } from '../../utils/constants.js';
import handleButtonClick from '../../utils/handle-button-click.js';
import { EventBus, events } from '../../utils/event-bus.js';
import handleLinkButtonClick from '../../utils/handle-linkbutton-click.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';
import sanitizeHtml from '../../utils/sanitize-html.js';

export default {
  name: 'ComboMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'combo' &&
          message.data &&
          message.data.components &&
          message.data.components.length > 0
        );
      },
    },
  },
  computed: {
    previewDomain(m) {
      const s = m.url;
      if (s) {
        console.log('t URL', s);
        s = s.toString();
        if (s.indexOf('://') === -1) s = "http://" + s;
        return new URL(s).hostname;
      }
    },
    comboitems() {
      return this.message.data.components;
    },
    linkitems() {
      return this.message.data.link_items;
    },
    replySent() {
      return !!this.message.selected || this.message.selected === 0;
    },
    selected() {
      return this.message.selected;
    },
    isExpired() {
      const { messageList } = this.$teneoApi;
      const latestMessage = messageList[messageList.length - 1];

      return latestMessage && latestMessage !== this.message;
    },
  },
  methods: {
    async onLinkbuttonClick(linkbutton, event) {
      await handleLinkButtonClick(linkbutton, event)
    },
    async onSelect(reply, idx) {
      if (!this.replySent && !this.isExpired) {
        await handleButtonClick(reply, idx, this.$teneoApi)
      }
    },
    handleReturnSpaceKeys(event, reply, idx) {
      if (keyIsSpaceOrEnter(event)) {
        this.onSelect(reply, idx)
      }
    },
    videoUrl(url) {
      return url + '#t=0.1';
    },
    zoomIn(imageUrl) {
      EventBus.$emit(events.ZOOM_IMAGE, imageUrl);
    },
    scrollChatUp() {
      EventBus.$emit(events.SCROLL_CHAT_DOWN);
    },
    sanitizedHtmlText(text) {
      return sanitizeHtml(text);
    }
  },
};
</script>

<style>
.twc-combo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0 0 -10px 0;
  width: 100%;
  position: relative;
}

.twc-combo-message {
  width: 100%;
  min-width: 300px;
  padding-bottom: 10px;
  display: flex;
}

</style>

<style scoped>

.twc-combo-message .twc-card {
  height: 50%;
  display: flex;
  align-items: center;
  position: relative;
  border: 2px solid rgb(202, 202, 202);
}

.twc-combo-message .twc-card .twc-clickablelist {
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
  overflow: auto;
  box-shadow: none;
  margin-right: 0px;
  margin-bottom: 0%;
  position: relative;
  border-radius: 10px;
}

.twc-combo-message .twc-card .twc-clickablelist-message {
  width: 80%;
  margin-bottom: 3%;
  margin-top: 10px;
  border-radius: 10px;
}
.twc-combo-message .twc-card .twc-clickablelist-message__item {
  width: 100%;
  height: auto;
  border-radius: 5px;
  background-color: var(--primary-color) !important;
  border:none;
  color:white;
  margin: 0;
  margin: 2px;
  padding: 0;
  padding-top: 3px;
  padding-bottom: 3px;
  text-align: center;
  outline: none;
  font-size: 0.9rem;
}

.twc-combo-message .twc-card .twc-clickablelist-message__item:hover {
  height: auto ;
  background-color: var(--primary-color-dark) !important; /**Comment on this */
  border: none;
  border-radius: 5px;
  margin: 2px;
  padding: 0;
  padding-top: 3px;
  padding-bottom: 3px;
  color: white;
  font-size: 0.9rem;
  outline:none;
}


.twc-combo-message .twc-buttons {
  width: 100%;
  margin: -3px 47px -3px -3px;
  text-align: center;
}

.twc-btn {
  min-width: 62px;
}

.twc-combo-message .twc-linkbuttons {
  position:relative;
  width: 100%;
  margin: -3px;
  margin-right: 37px;
  text-align: center;
}

.twc-combo-message .twc-card .twc-linkbuttons {
  width: auto;
  margin: 0;
  position: relative;
}
</style>