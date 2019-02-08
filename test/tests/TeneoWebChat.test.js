import { createLocalVue, mount } from '@vue/test-utils';
import teneoApiPlugin from '../../src/plugins/teneo-api.js';
import TeneoWebChat from '../../src/TeneoWebChat.vue';

const teneoApiUrl = 'https://teneo-api.com/some-bot';
const localVue = createLocalVue();

localVue.use(teneoApiPlugin(teneoApiUrl));

const mountComponent = (Component, props) => {
  return mount(Component, {
    propsData: props,
    localVue,
  });
};

describe('TeneoWebChat', () => {
  it('renders', () => {
    const wrapper = mountComponent(TeneoWebChat, {
      serviceName: 'Teneo Web Chat',
    });

    expect(wrapper.contains('.teneo-web-chat')).to.be.true;
  });

  it('renders with the chat window closed', () => {
    const wrapper = mountComponent(TeneoWebChat, {
      serviceName: 'Teneo Web Chat',
    });

    expect(wrapper.contains('.launch-button.closed')).to.be.true;
    expect(wrapper.contains('.chat-window')).to.be.false;
  });

  it('opens the chat window when the launch button is clicked', () => {
    const wrapper = mountComponent(TeneoWebChat, {
      serviceName: 'Teneo Web Chat',
    });

    const launchButton = wrapper.vm.$el.querySelector('.launch-button');
    const click = new window.Event('click');

    launchButton.dispatchEvent(click);

    expect(wrapper.contains('.launch-button.opened')).to.be.true;
    expect(wrapper.contains('.chat-window')).to.be.true;
  });

  it('sets the chat window title to the service name', () => {
    const wrapper = mountComponent(TeneoWebChat, {
      serviceName: 'Teneo Web Chat',
    });

    const launchButton = wrapper.vm.$el.querySelector('.launch-button');
    const click = new window.Event('click');

    launchButton.dispatchEvent(click);

    expect(wrapper.find('.chat-window .header').text()).to.eql(
      'Teneo Web Chat'
    );
  });
});
