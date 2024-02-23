<template>
  <form id="twc-ratingmessage" @submit.prevent="handleFormSubmit">
    <fieldset id="twc-ratingsection">
      <p class="twc-rating-title">{{ ratingText }}</p>
      <fieldset id="twc-stars">
        <span
  v-for="(star, index) in stars"
  :key="index"
  :class="{
    'star': true,
    'filled': index < selectedStar,
    'highlighted': index <= hoveredStar
  }"
  @click="selectStar(stars - index)"
  @mouseover="highlightStar(index)"
  @mouseout="resetStars"
  :disabled="disabled"
>
  &#9733;
</span>

      </fieldset>
      <textarea
        v-model="formData.comment"
        v-show="message.data.commentsAllowed"
        class="twc-feedback-comment"
        placeholder="Leave us a comment..."
        :disabled="disabled"
      ></textarea>
      <fieldset class="twc-submit-section">
        <button type="submit" id="twc-rating-submit-button" :disabled="disabled" :class="{ 'disabled': disabled }">Submit</button>

      </fieldset>
    </fieldset>
  </form>
</template>

<script>
export default {
  name: 'RatingMessage',
  data() {
    return {
      formData: {
        comment: '',
        success: false
      },
      stars: 5, // Total number of stars
      selectedStar: 0, // Currently selected star
      hoveredStar: -1, // Currently hovered star
      disabled: false // Flag to disable the component
    };
  },
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'rating' &&
          message.data &&
          message.data.title &&
          message.data.maxValue &&
          message.data.commentsAllowed
          /* Other elements that may have the rating message */
        );
      }
    }
  },
  computed: {
    ratingText() {
      return this.message.data.title;
    }
  },
  methods: {
    handleFormSubmit() {
      const formData = {
        rating: this.selectedStar,
        success: true,
        comment: ''
      };

      const textarea = document.querySelector('.twc-feedback-comment');
      if (textarea) {
        formData.comment = textarea.value;
      }

      console.log('Form data:', formData);
      // Send the form data or perform any other desired action
      this.$teneoApi.sendSilentMessage(JSON.stringify(formData));

      const submitButton = document.getElementById('twc-rating-submit-button');
    if (submitButton) {
      submitButton.style.backgroundColor = '#a9a9a9';
    }
      // Disable the component after submitting the form
      this.disabled = true;
    },

    selectStar(star) {
      if (!this.disabled) {
        this.selectedStar = this.stars - star + 1;
        console.log('Selected stars:', this.selectedStar); // Display selected star count in the console
      }
    },

    highlightStar(star) {
      if (!this.disabled) {
        this.hoveredStar = star;
      }
    },

    resetStars() {
      if (!this.disabled) {
        this.hoveredStar = -1;
      }
    }
  }
};
</script>
<style scoped>
#twc-ratingmessage {
  max-width: calc(100% - 84px);
}
#twc-stars {
  height: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.twc-star-cb-group {
  font-size: 0px;
  unicode-bidi: bidi-override;
  direction: rtl;
}

.twc-star-cb-group * {
  font-size: 2rem;
}
.twc-star-cb-group > input {
  display: none;
}
.twc-star-cb-group > input + label {
  /* only enough room for the star */
  display: inline-block;
  overflow: hidden;
  text-indent: 9999px;
  width: 0.9em;
  white-space: nowrap;
  cursor: pointer;
}
.twc-star-cb-group > input + label:before {
  display: inline-block;
  text-indent: -9999px;
  content: var(--scale-rep,"☆");
  color: var(--scale-color-default,#888);
  font-size: var(--scale-size,30px);
}
.twc-star-cb-group > input:checked ~ label:before,
.twc-star-cb-group > input + label:hover ~ label:before,
.twc-star-cb-group > input + label:hover:before {
  content: var(--scale-rep,"☆");
  color: var(--scale-color-highlight, #e52);
  text-shadow: var(--scale-shadow, 0 0 1px #333);
  font-size: var(--scale-size,30px);
}
.twc-star-cb-group > .star-cb-clear + label {
  text-indent: -9999px;
  width: 0.5em;
  margin-left: -0.5em;
}
.twc-star-cb-group > .star-cb-clear + label:before {
  width: 0.5em;
}
.twc-star-cb-group:hover > input + label:before {
  content: var(--scale-rep,"☆");
  color: var(--scale-color-default,#888);
  text-shadow: none;
  font-size: var(--scale-size,30px);
}
.twc-star-cb-group:hover > input + label:hover ~ label:before,
.twc-star-cb-group:hover > input + label:hover:before {
  content: var(--scale-rep,"☆");
  color: var(--scale-color-highlight,#e52);
  text-shadow: var(--scale-shadow, 0 0 1px #333);
  font-size: var(--scale-size,30px);
}
fieldset {
  border: none;
}

#twc-ratingsection {
  border: none;
  background: var(--user-input-bg-color,#f3f3f3);
  width: auto;
  border-radius: 10px;
  padding: 0.5em 0.5em;
  margin: 1em 0;
  box-shadow: 0 2px 4px 0 rgba(85, 87, 85, 0.5);
}

.twc-feedback-comment {
  width: 250px;
  height: 50px;
  border: none;
  color: var(--user-input-bg-color,#f3f3f3);
  margin-bottom: 10px;
  text-align: start;
  resize: none;
  overflow-y: scroll;
}

.twc-feedback-comment:focus {
  outline: 0;
  border: 1px solid var(--primary-color, rgb(47, 40, 110, 0.5));
  color: var(--font-color);
}

.twc-submit-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#twc-rating-submit-button {
  border: none;
  color: var(--light-fg-color, #ffffff);
  background-color: var(--primary-color);
  padding: 5px;
  border-radius: 5px;
}

.twc-rating-title {
  color: var(--bot-message-fg-color, #263238);
  font-weight: 300;
  font-size: 0.9em;
  line-height: 1.4;
  -webkit-font-smoothing: subpixel-antialiased;
  margin: 0.5rem 0;
  text-align: center;
}

.star {
  cursor: pointer;
  font-size: 24px;
  color: var(--scale-color-default,#aaa);
  transition: color 0.2s;
  flex: 1;
  display: flex;
  justify-content: center;
}

.filled {
  color: var(--scale-message-color,#ffca28);
}

.highlighted {
  color: var(--scale-message-color,#ffc107);
}
</style>
