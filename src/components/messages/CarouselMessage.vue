<template>
  <div class="twc-carousel" :class="{ 'twc-expired': replySent || isExpired }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd">
    
    <div class="twc-carousel-ctrl">
      <button class="twc-carousel-bck twc-carousel-ctrl-arrows"
        @click="slide(-1)"
        :disabled="isFirstSlide">&#171;</button>

      <span class="twc-carousel-ctrl-dots-container">
        <button class="twc-carousel-ctrl-dots"
          v-for="btnIndex in carouselItemCount"
          @click="skipToSlide(btnIndex)"
          :class="{'twc-carousel-ctrl-dots-active': isActiveSlide(btnIndex-1)}"
          :key="'dot' + btnIndex"></button>
      </span>

      <button class="twc-carousel-fwd twc-carousel-ctrl-arrows"
        @click="slide(1)"
        :disabled="isLastSlide">&#187;</button>
    </div>

    <ul class="twc-carousel-list">
      <li v-for="(message, idx) in carouselItems"
          class="twc-carousel-list-item"
          :key="`slide-${idx}`"
          :style="getItemStyle(idx)">

        <div class="twc-card" v-if="message.type==='card'">
          <div class="twc-card-img" v-if="message.image">
            <img :src="message.image.image_url" :alt="message.image.alt"/>
          </div>
          <div class="twc-card-body" v-if="message.title || message.subtitle || message.text">
            <h5 class="twc-card-title" v-if="message.title">{{ message.title }}</h5>
            <h6 class="twc-card-subtitle" v-if="message.subtitle">{{ message.subtitle }}</h6>
            <p class="twc-card-text" v-if="message.text" v-html="sanitizedHtmlText(message.text)"></p>
          </div>
          <div class="twc-card-spacer"></div>
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
          
        </div>
      </li>
    </ul>

  </div>
</template>
<script>

import handleButtonClick from '../../utils/handle-button-click.js';
import { EventBus, events } from '../../utils/event-bus.js';
import handleLinkButtonClick from '../../utils/handle-linkbutton-click.js';
import keyIsSpaceOrEnter from '../../utils/is-space-or-enter.js';
import sanitizeHtml from '../../utils/sanitize-html.js';

export default {
  name: 'CarouselMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (msg) => msg?.type === 'carousel' && Array.isArray(msg.data?.carousel_items) && msg.data.carousel_items.length > 0,
    }
  },
  data() {
    return {
      activeSlide: 0,      
      touchStartX: 0,
      touchEndX: -1
    };
  },
  computed: {
    carouselItems() {
      return this.message.data.carousel_items;
    },
    carouselItemCount() {
      return this.carouselItems.length;
    },
    isFirstSlide() {
      return this.activeSlide === 0;
    },
    isLastSlide() {
      return this.activeSlide === this.carouselItemCount - 1;
    },
    replySent() {
      return this.message.selected !== undefined;
    },
    isExpired() {
      const latestMessage = this.$teneoApi.messageList.at(-1);
      return latestMessage && latestMessage !== this.message;
    },
  },
  methods: {

    slide(direction) {
      const newIndex = this.activeSlide + direction;
      if (newIndex >= 0 && newIndex < this.carouselItemCount) {
        this.activeSlide = newIndex;
      }
    },
    skipToSlide(idx) {
      this.activeSlide = idx - 1;
    },
    isActiveSlide(idx) {
      return idx === this.activeSlide;
    },
    getItemStyle(idx) {
      const translateX = (this.activeSlide * -100) + 4;
      return {
        transform: `translateX(${translateX}%)`
      };
    },
    moveSlideElements() {

      this.isFirstSlide = this.activeSlide === 0;
      this.isLastSlide = this.activeSlide === this.message.data.carousel_items.length - 1;

      let slides = this.$el.getElementsByClassName('twc-carousel-list-item');
      for (let slide of slides) {
        slide.style.transform = 'translateX(' + ((this.activeSlide * -100) + 4) + '%)';
      }

    },   

    slideToIndex(idx) {
      if (idx >= 0 && idx < this.message.data.carousel_items.length) {
        this.activeSlide = idx;
        this.moveSlideElements();
      }
    },
    async onLinkbuttonClick(linkbutton, event) {
      await handleLinkButtonClick(linkbutton, event);
    },
    async onSelect(reply, idx) {
      if (!this.replySent && !this.isExpired) {
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
        spacer.style.height = (maxCardHeight - card.clientHeight) + 'px';
      }
    },
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchEndX= -1 // Reset touchEndX on new drag start
    },

    handleTouchMove(event) {
      this.touchEndX = event.touches[0].clientX;

    },

    handleTouchEnd() {
      if (this.touchEndX === -1) {
        return;
    }
      const touchDiff = this.touchStartX - this.touchEndX;
      const sensitivity = 50; // Adjust the value as per your needs

      if (touchDiff > sensitivity) {
        this.slideToIndex(this.activeSlide + 1); // Slide forward
      } else if (touchDiff < -sensitivity) {
        this.slideToIndex(this.activeSlide - 1); // Slide back
      }
      this.touchEndX= -1 // Reset touchEndX after handling the touch end
    }
  },
  mounted() {
    this.additionalCardProcessing(); 
  },

};

</script>

<style scoped>
.twc-carousel {
  background: none;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  border-radius: 5px;
  position: relative;
}

.twc-carousel-list {
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
  white-space: nowrap;
  position: relative;
}

.twc-carousel-list-item {
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 95%;
  height: 100%;
  vertical-align: top;
  margin: 0;
  transition: all 1s ease;
}

.twc-carousel .twc-card {
  margin: 10px 10px 5px;
  border-radius: 10px;
  box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.16);
  border: 1px solid var(--light-border-color, #c9c9c9);
  width: 95%;
  height: 95%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

.twc-carousel .twc-card .twc-card-body {
  width: 88%;
  height: auto;
}

.twc-carousel .twc-card .twc-clickablelist {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 30%;
  overflow: auto;
  box-shadow: none;
  margin-right: 0;
  margin-bottom: 5%;
  position: relative;
  border-radius: 10px;
}

.twc-carousel .twc-card .twc-clickablelist-message {
  width: 80%;
  height: 70%;
}

.twc-carousel .twc-card .twc-clickablelist-message__item {
  width: 100%;
  height: auto;
  border-radius: 5px;
  background-color: var(--primary-color, #2f286e);
  border: none;
  color: var(--light-fg-color, #ffffff);
  margin: 2px;
  padding: 0;
  padding-top: 3px;
  padding-bottom: 3px;
  text-align: center;
  outline: none;
  font-size: 0.9rem;
}

.twc-carousel-list .twc-clickablelist-message .twc-clickablelist-message__item:hover {
  background-color: var(--primary-color-dark, #160d27);
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
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin: -3px;
  margin-right: 37px;
  text-align: center;
  position: absolute;
  bottom: 0;
}

.twc-card .twc-linkbuttons {
  position: absolute;
  width: auto;
  margin: 0;
  margin-bottom: 5%;
  bottom: 0;
  align-self: center;
}

.twc-carousel-ctrl {
  display: flex;
  align-items: center;
  background: none;
  padding: 0.5rem 0;
  border-radius: 5px 5px 0 0;
}

.twc-carousel-ctrl-arrows {
  display: flex;
  align-items: center;
  background-color: var(--carousel-arrows-bg-color, #74728f);
  border-radius: 60%;
  width: 40px;
  height: 40px;
  opacity: 0.8;
  border: none;
  font-size: xx-large;
  font-weight: bold;
  outline: none;
  color: var(--carousel-ctrl-panel-fg-color, #ffffff);
  flex: 1;
  transition: all 1s ease;
  padding-left: 10px;
  padding-bottom: 5px;
}

.twc-carousel-bck {
  position: absolute;
  left: -2%;
  top: 50%;
  z-index: 9;
}

.twc-carousel-fwd {
  position: absolute;
  right: -2%;
  top: 50%;
  z-index: 9;
}

.twc-carousel-ctrl-arrows:hover {
  opacity: 0.9;
  cursor: pointer;
}

.twc-carousel-ctrl-arrows:active {
  opacity: 1;
  cursor: pointer;
}

.twc-carousel-ctrl-arrows:disabled {
  opacity: 0;
}

.twc-carousel-ctrl-dots-container {
  display: flex;
  flex: 3;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  top: 94%;
  left: 39%;
  opacity: 0.8;
  z-index: 9;
}

.twc-carousel-ctrl-dots {
  border-radius: 0.7rem;
  margin: 0 7px;
  width: 0.7rem;
  height: 0.7rem;
  outline: none;
  background: var(--primary-color, #2f286e);
  border: none;
}

.twc-carousel-ctrl-dots:hover {
  filter: invert(50%);
}

.twc-carousel-ctrl-dots-active {
  background: var(----carousel-ctrl-dots-bg-color, #808080);
}

.twc-carousel .twc-card .twc-card-body::-webkit-scrollbar {
  width: 3px;
}

.twc-carousel .twc-card .twc-card-body::-webkit-scrollbar-track {
  background: var(--light-fg-color, #ffffff);
  border-radius: 10px;
  margin: 2px;
  box-shadow: none;
}

.twc-carousel .twc-card .twc-card-body::-webkit-scrollbar-thumb {
  background-color: var(--light-bg-color, #eceff1);
  border-radius: 10px;
  box-shadow: none;
}

/* Adaptive Styles */
@media only screen and (max-width: 480px) {
  /* Styles for phones */
  .twc-carousel-list-item {
    flex: 0 0 90%;
    width: 90%;
    max-width: 90%;
  }
  
  .twc-carousel .twc-card {
    width: 100%;
  }
  
  .twc-carousel .twc-card .twc-card-body {
    width: 100%;
  }

  .twc-linkbuttons {
    margin-right: 10px;
  }

  .twc-carousel-ctrl-dots-container {
    top: 100%;    
  }
}

</style>
