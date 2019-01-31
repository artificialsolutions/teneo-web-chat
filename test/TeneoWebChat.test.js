import { createLocalVue, mount } from '@vue/test-utils';
import BeautifulChat from 'vue-beautiful-chat';
import TeneoWebChat from '../src/TeneoWebChat.vue';

const localVue = createLocalVue();

localVue.use(BeautifulChat);

const wrapper = mount(TeneoWebChat, { localVue });

describe('TeneoWebChat', () => {
  it('displays a message', () => {
    expect(wrapper.vm.$data.message).to.eql('Open the chat!');
  });
});
