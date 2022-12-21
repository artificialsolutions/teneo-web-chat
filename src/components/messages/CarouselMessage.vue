<template>
  <div class="twc-carousel" :class="{ 'twc-expired': replySent || isExpired}">
    <div class="twc-carousel-ctrl">
      <button class="twc-carousel-bck twc-carousel-ctrl-arrows"
              @click="slideBack()"
              v-bind:disabled="this.isFirstSlide"
              ref="backBtn"
      >&#171;
      </button>
      <span class="twc-carousel-ctrl-dots-container">
      <button class="twc-carousel-ctrl-dots"
              v-for="(btnIndex) in carouselItemCount"
              @click="skipToSlide(btnIndex)"
              v-bind:class="{'twc-carousel-ctrl-dots-active': isActiveSlide(btnIndex-1)}"
              :ref="'skipTo' + btnIndex"
      >
      </button>
      </span>
      <button class="twc-carousel-fwd twc-carousel-ctrl-arrows"
              @click="slideForward()"
              v-bind:disabled="this.isLastSlide"
              :ref="'fwdBtn'"
      >&#187;
      </button>
    </div>

    <ul class="twc-carousel-list">
      <li v-for="(message, idx) in carouselItems"
          class="twc-carousel-list-item"
          :key="idx + 'Slide'"
          v-bind:data-slide="idx"
          ref="cards"
      >

        <div class="twc-card" v-if="message.type==='card'">
          <div class="twc-card-img" v-if="message.image">
            <img :src="message.image.image_url" :alt="message.image.alt"/>
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
                  @click="isExpired ? console.log(e.target + 'clicked') : onSelect(reply, idx + 'cql')"
                  @keydown="handleReturnSpaceKeys($event, reply, idx +'cql')"
              >{{ reply.title }}
              </li>
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
          <div class="twc-card-spacer"></div>
        </div>
      </li>
    </ul>

  </div>
</template>
<script>

import {PARTICIPANT_BOT} from '../../utils/constants.js';
import handleButtonClick from '../../utils/handle-button-click.js';
import {EventBus, events} from '../../utils/event-bus.js';
import handleLinkButtonClick from '../../utils/handle-linkbutton-click.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';
import sanitizeHtml from '../../utils/sanitize-html.js';

export default {
  name: 'CarouselMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
            message &&
            message.type === 'carousel' &&
            message.data &&
            message.data.carousel_items &&
            message.data.carousel_items.length > 0
        );
      },
    }
  },
  computed: {
    carouselItems() {
      return this.message.data.carousel_items;
    },
    carouselItemCount() {
      return this.message.data.carousel_items.length;
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
      const {messageList} = this.$teneoApi;
      const latestMessage = messageList[messageList.length - 1];

      return latestMessage && latestMessage !== this.message;
    }
  },
  data() {
    return {
      activeSlide: 0,
      isFirstSlide: true,
      isLastSlide: false
    };
  },
  methods: {
    moveSlideElements() {

      this.isFirstSlide = this.activeSlide === 0;
      this.isLastSlide = this.activeSlide === this.message.data.carousel_items.length - 1;

      let slides = this.$el.getElementsByClassName('twc-carousel-list-item');
      for (let slide of slides) {
        slide.style.transform = 'translateX(' + ((this.activeSlide * -100) + 4) + '%)';
      }

    },
    isActiveSlide(idx) {
      return idx === this.activeSlide;
    },
    skipToSlide(idx) {
      this.activeSlide = idx - 1;
      this.moveSlideElements();
    },
    slideBack() {
      if (this.activeSlide !== 0) {
        this.activeSlide--;
        this.moveSlideElements();
      }
    },
    slideForward() {
      if (this.activeSlide < this.message.data.carousel_items.length - 1) {
        this.activeSlide++;
        this.moveSlideElements();
      }
    },
    async onLinkbuttonClick(linkbutton, event) {
      await handleLinkButtonClick(linkbutton, event);
    },
    async onSelect(reply, idx) {
      if (!this.replySent) {
        await handleButtonClick(reply, idx, this.$teneoApi);
      }
    },
    handleReturnSpaceKeys(event, reply, idx) {
      if (keyIsSpaceOrEnter(event)) {
        this.onSelect(reply, idx);
      }
    },
    videoUrl(url) {
      return url + '#t=0.1';
    },
    scrollChatUp() {
      EventBus.$emit(events.SCROLL_CHAT_DOWN);
    },
    sanitizedHtmlText(text) {
      return sanitizeHtml(text);
    },
    additionalCardProcessing() {
      let maxCardHeight = 0;
      for (let card of this.$refs.cards) {
        maxCardHeight = card.clientHeight > maxCardHeight ? card.clientHeight : maxCardHeight;
      }

      for (let card of this.$refs.cards) {
        let spacer = card.getElementsByClassName('twc-card-spacer')[0];
        spacer.style.height = maxCardHeight - card.clientHeight + 'px';
      }
    }

  },
  mounted() {
    this.additionalCardProcessing();
    this.$el.addEventListener('touchstart', function (evt) {
      window.twcTmp.touchstartX = evt.changedTouches[0].screenX;
    });
    this.$el.addEventListener('touchend', function (evt) {
      (window.twcTmp.touchstartX < evt.changedTouches[0].screenX) ? this.slideBack() : this.slideForward();
    }.bind(this));
  },

};

</script>

<style>


.twc-carousel-list {
  justify-content: center;
  list-style: none;
  padding: 0;
  margin-block-start: 0.5rem;
  margin-block-end: 0.5em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.twc-carousel-list-item {
  overflow: hidden;
  transition: all 1s ease;
  display: inline-block;
  width: 90%;
  vertical-align: top;
  padding: 1%;
}

.twc-carousel {
  background: lightgray;
  height: max-content;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  border-radius: 5px;
}

.twc-carousel .twc-card {
  margin: 0 auto;
}

.twc-buttons {
  width: 100%;
  margin: -3px 47px -3px -3px;
  text-align: center;
}

.twc-btn {
  min-width: 62px;
}

.twc-linkbuttons {
  width: 100%;
  margin: -3px;
  margin-right: 37px;
  text-align: center;
}

.twc-card .twc-linkbuttons {
  width: auto;
  margin: 0;
}

.twc-carousel-bck {
  float: left;
}

.twc-carousel-fwd {
  float: right;
}

.twc-carousel-ctrl {
  display: flex;
  background: var(--carousel-ctrl-panel-bg-color, #4e8cff);
  padding: 0.5rem 0;
  border-radius: 5px 5px 0 0;
}

.twc-carousel-ctrl-arrows {
  background: none;
  border: none;
  font-size: xx-large;
  outline: none;
  color: var(--carousel-ctrl-panel-fg-color, #ffffff);
  flex: 1;
}

.twc-carousel-ctrl-arrows:disabled {
  color: var(--carousel-ctrl-panel-disabled-color, #a9a9a9);
}

.twc-carousel-ctrl-dots-container {
  display: flex;
  flex: 3;
  justify-content: space-evenly;
  align-items: center;
}

.twc-carousel-ctrl-dots {
  border-radius: 0.5rem;
  margin: 0 5px;
  width: 1rem;
  height: 1rem;
  outline: none;
  background: var(--carousel-ctrl-panel-fg-color, #ffffff);
  border: none;
}

.twc-carousel-ctrl-dots:hover {
  filter: invert(50%);
}

.twc-carousel-ctrl-dots-active {
  background: var(--carousel-ctrl-panel-active-color, #6c757d);
}

</style>
