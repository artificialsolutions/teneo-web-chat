<template>
  <a :href=previewUrl :title=previewTooltip target="_blank" class="twc-link-preview">
    <div class="twc-link-preview-left-column">
      <img :src="previewImage" :alt="previewTitle" class="twc-link-preview-img"/>
    </div>
    <div class="twc-link-preview-right-column">
      <p class="twc-link-preview-title">{{ previewTitle }}</p>
      <p class="twc-link-preview-description">{{ previewDescription }}</p>
      <p class="twc-link-preview-domain">{{ previewDomain }}</p>
    </div>
  </a>
</template>

<script>
import {PARTICIPANT_BOT} from '../../utils/constants.js';
import sanitizeHtml from '../../utils/sanitize-html.js';


export default {
  name: 'LinkpreviewMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return message && message.type === 'linkpreview' && message.data;
      },
    },
  },
  computed: {
    previewTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      } else {
        return this.$t('message.preview_title_not_available');
      }
    },
    previewDescription() {
      //Description is cut to 144 characters to keep previews small. Full text in tooltip.
      if (this.message.data.description) {
        if(this.message.data.description.length > 144 ){
          return this.message.data.description.substr(0, 144) + "...";
        }
        else{
          return this.message.data.description;
        }

      } else {
        return this.$t('message.preview_description_not_available');
      }
    },
    previewTooltip() {
      if (this.message.data.description) {
        return this.message.data.description;
      } else {
        return this.$t('message.preview_description_not_available');
      }
    },
    previewImage() {
      if (this.message.data.image) {
        return this.message.data.image;
      } else {
        return "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTE1LjE5IDEyMy4zOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTE1LjE5IDEyMy4zOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDowLjU7c3Ryb2tlLW1pdGVybGltaXQ6Mi42MTMxO308L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05My4xMyw3OS41YzEyLjA1LDAsMjEuODIsOS43NywyMS44MiwyMS44MmMwLDEyLjA1LTkuNzcsMjEuODItMjEuODIsMjEuODJjLTEyLjA1LDAtMjEuODItOS43Ny0yMS44Mi0yMS44MiBDNzEuMzEsODkuMjcsODEuMDgsNzkuNSw5My4xMyw3OS41TDkzLjEzLDc5LjV6IE04LjA4LDAuMjVoOTUuMjhjMi4xNywwLDQuMTEsMC44OSw1LjUzLDIuM2MxLjQyLDEuNDIsMi4zLDMuMzksMi4zLDUuNTN2NzAuMDEgYy0yLjQ2LTEuOTEtNS4yNC0zLjQ0LTguMjUtNC40OFY5Ljk4YzAtMC40My0wLjE2LTAuNzktMC40Ni0xLjA1Yy0wLjI2LTAuMjYtMC42Ni0wLjQ2LTEuMDUtMC40Nkg5Ljk0IGMtMC40MywwLTAuNzksMC4xNi0xLjA1LDAuNDZDOC42Myw5LjE5LDguNDMsOS41OCw4LjQzLDkuOTh2NzAuMDJoMC4wM2wzMS45Ny0zMC42MWMxLjI4LTEuMTgsMy4yOS0xLjA1LDQuNDQsMC4yMyBjMC4wMywwLjAzLDAuMDMsMC4wNywwLjA3LDAuMDdsMjYuODgsMzEuOGMtNC43Myw1LjE4LTcuNjIsMTIuMDgtNy42MiwxOS42NWMwLDMuMjksMC41NSw2LjQ1LDEuNTUsOS40SDguMDggYy0yLjE3LDAtNC4xMS0wLjg5LTUuNTMtMi4zcy0yLjMtMy4zOS0yLjMtNS41M1Y4LjA4YzAtMi4xNywwLjg5LTQuMTEsMi4zLTUuNTNTNS45NCwwLjI1LDguMDgsMC4yNUw4LjA4LDAuMjV6IE03My45OCw3OS4zNSBsMy43MS0yMi43OWMwLjMtMS43MSwxLjkxLTIuOSwzLjYyLTIuNmMwLjY2LDAuMSwxLjI1LDAuNDMsMS43MSwwLjg2bDE3LjEsMTcuOTdjLTIuMTgtMC41Mi00LjQ0LTAuNzktNi43OC0wLjc5IEM4NS45MSw3MS45OSw3OS4xMyw3NC43Nyw3My45OCw3OS4zNUw3My45OCw3OS4zNXogTTgxLjk4LDE4LjE5YzMuMTMsMCw1Ljk5LDEuMjgsOC4wMywzLjMyYzIuMDcsMi4wNywzLjMyLDQuOSwzLjMyLDguMDMgYzAsMy4xMy0xLjI4LDUuOTktMy4zMiw4LjAzYy0yLjA3LDIuMDctNC45LDMuMzItOC4wMywzLjMyYy0zLjEzLDAtNS45OS0xLjI4LTguMDMtMy4zMmMtMi4wNy0yLjA3LTMuMzItNC45LTMuMzItOC4wMyBjMC0zLjEzLDEuMjgtNS45OSwzLjMyLTguMDNDNzYuMDIsMTkuNDQsNzguODYsMTguMTksODEuOTgsMTguMTlMODEuOTgsMTguMTl6IE04NS44Miw4OC4wNWwxOS45NiwyMS42IGMxLjU4LTIuMzksMi41LTUuMjUsMi41LTguMzNjMC04LjM2LTYuNzgtMTUuMTQtMTUuMTQtMTUuMTRDOTAuNDgsODYuMTcsODcuOTksODYuODUsODUuODIsODguMDVMODUuODIsODguMDV6IE0xMDAuNDQsMTE0LjU4IGwtMTkuOTYtMjEuNmMtMS41OCwyLjM5LTIuNSw1LjI1LTIuNSw4LjMzYzAsOC4zNiw2Ljc4LDE1LjE0LDE1LjE0LDE1LjE0Qzk1Ljc4LDExNi40Niw5OC4yNywxMTUuNzgsMTAwLjQ0LDExNC41OEwxMDAuNDQsMTE0LjU4eiIvPjwvZz48L3N2Zz4=";
      }

    },
    previewUrl() {
      if (this.message.data.url) {
        return this.message.data.url;
      }
    },
    previewDomain() {
      if (this.message.data.url) {
        if (!/^(?:f|ht)tps?\:\/\//.test(this.message.data.url)) {
          this.message.data.url = "http://" + this.message.data.url;
        }
        return new URL(this.message.data.url).hostname;
      }
    },
    isExpired() {
      const {messageList} = this.$teneoApi;
      const latestMessage = messageList[messageList.length - 1];

      return latestMessage && latestMessage !== this.message;
    },
    sanitizedHtmlText() {
      return sanitizeHtml(this.message.data.text);
    }
  },

};
</script>

<style>
.twc-link-preview {
  max-width: 90%;
  text-decoration: none;
  color: var(--dark-fg-color);
  background: var(--light-bg-color);
  border-radius: 10px;
}

.twc-link-preview-left-column {
  background: var(--dark-bg-color);
  /* padding: 5%; */
  display: flex;
  width: 25%;
  height: 100%;
  float: left;
  margin: 0;
  border-top-left-radius: 10px;
}
.twc-link-preview-right-column {
display:flex;
  flex-direction: column;
  margin: 0;
  float:left;
  width: 75%;
}

.twc-link-preview-img {
  object-fit: contain;
  max-width: 90%;
  margin: 0 auto;
}

.twc-link-preview-title {
  font-size: medium;
  font-weight: bold;
  overflow-wrap: anywhere;
  text-align: center;
  margin: 10px;
}

.twc-link-preview-description {
  font-size: small;
  margin: 0 10px;
}

.twc-link-preview-domain {
  font-size: x-small;
  font-weight: bold;
  margin: 10px;
  text-align: right;
}

</style>
