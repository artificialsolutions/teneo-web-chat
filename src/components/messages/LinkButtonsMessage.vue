<template>
  <div class="twc-linkbuttons">
    <h5 class="twc-linkbuttons-title" v-if="buttonsTitle">{{ buttonsTitle }}</h5>
      <a
        role="link"
        v-for="(button, idx) in linkbuttons"
        :key="idx"
        :href="button.url"
        :target="button.target"
        :rel="button.target === '_blank' ? 'noopener': false"
        class="twc-linkbutton"
        @click="onClick(button, $event)"
      >{{ button.title }}
      </a>
      <div><svg width="0.9em" height="0.9em" viewBox="0 0 24 24" role="presentation">
          <g fill="currentColor" fill-rule="evenodd">
            <path d="M12.856 5.457l-.937.92a1.002 1.002 0 000 1.437 1.047 1.047 0 001.463 
            0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 01.203 3.81l-2.903 
            2.852a2.646 2.646 0 01-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 
            1.788 6.622 0l2.905-2.852a4.558 4.558 0 00-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47">
            </path>
            <path d="M11.144 19.543l.937-.92a1.002 1.002 0 000-1.437 1.047 1.047 0 00-1.462 
            0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 01-.203-3.81l2.903-2.852a2.646 
            2.646 0 013.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 
            0l-2.905 2.852a4.558 4.558 0 00.357 6.82c1.893 1.517 4.695 1.226 6.422-.47">
            </path>
          </g>
        </svg></div>
  </div>
</template>

<script>
import handleLinkButtonClick from '../../utils/handle-linkbutton-click.js';

export default {
  name: 'LinkbuttonsMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'linkbuttons' &&
          message.data &&
          message.data.linkbutton_items &&
          message.data.linkbutton_items.length > 0
        );
      },
    },
  },
  computed: {
    buttonsTitle() {
      if (this.message.data.title) {
        return this.message.data.title;
      }
    },
    linkbuttons() {
      return this.message.data.linkbutton_items;
    },
  },
  methods: {
    async onClick(linkbutton, event) {
      await handleLinkButtonClick(linkbutton, event)
    },
  },
};
</script>

<style scoped>
.twc-linkbuttons {
  width: 100%;
  height: max-content;
  margin: -3px;
  margin-right: 37px;
  text-align: center;
  position: relative;
}
</style>

<style>
.twc-linkbutton {
  border: none;
  color: var(--link-button-fg-color, #007bff);
  background: var(--link-button-bg-color, #ffffff);
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.375rem 0.75rem;
  font-size: 0.9em;
  line-height: 1.5;
  border-radius: 50px;
  display: inline-block;
  margin: 3px;
  text-decoration: none;
  box-shadow: 0 4px 8px 0 rgba(85, 87, 85, 0.7);
  transition: all 0.2s;
}

.twc-linkbutton:hover {
  text-decoration: none;
  font-size: 1rem;
  padding-left: 12px;
  padding-right: 12px;
  background-color: var(--primary-color-dark);
  color: var(--light-fg-color);
}

.twc-linkbuttons h5 {
  text-align: center;
  font-family: inherit;
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 0.6rem;
  font-size: 1em;
  font-weight: 500;
  color: var(--buttons-title-color, #263238);
}

.twc-linkbutton a svg {
  display: block;
  color: var(--danger-color,#FF0000);
}
</style>
