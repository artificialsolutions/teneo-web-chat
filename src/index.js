import Vue from 'vue';
import BeautifulChat from 'vue-beautiful-chat';

import TeneoWebChat from './TeneoWebChat.vue';

Vue.use(BeautifulChat);

new Vue({
  render: (h) => h(TeneoWebChat),
}).$mount('#app');
