import TeneoWebChat from '@/components/../TeneoWebChat.vue';
import ChatWindow from '@/components/ChatWindow.vue';
import Header from '@/components/Header.vue';

import MessageList from '@/components/MessageList.vue';
import UserInput from '@/components/UserInput.vue';
import LaunchButton from '@/components/LaunchButton.vue';

import BubbleIcon from '@/icons/bubble.vue';
import SendIcon from '@/icons/send.vue';
import UploadIcon from '@/icons/upload.vue';
import AsrIcon from '@/icons/asr.vue';
import TtsIcon from '@/icons/tts.vue';
import MinimizeIcon from '@/icons/minimize-caret.vue';
import XIcon from '@/icons/x.vue';

import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';


const teneoApiUrl = 'https://teneo-api.com/some-bot';
const localVue = createLocalVue();

localVue.use(Vuex);


const mountComponent = (Component, props) => {
  return mount(Component, {
    propsData: props,
    localVue,
  });
};

const mountComponentWithStore = (Component, props, store) => {
  return mount(Component, {
    propsData: props,
    store,
    localVue,
  });
};

const shallowMountComponent = (Component, props, store) => { // Experimental
  return shallowMount(Component, {
    propsData: props,
    store,
    localVue,
  });
};


const mockTeneoApi = {
  sendBaseMessage: jest.fn(),
  sendMessage: jest.fn(),
  sendSilentMessage: jest.fn(),
  messageList: []
};

const mockStore = {
  state: {
    title: 'Teneo Web Chat',
  },
  getters: {
    title: (state) => state.title,
  }
};


describe('Check hierarchy of Components', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TeneoWebChat, {
    });
  });


  it('Renders TeneoWebChat component.', () => {
    expect(wrapper.exists()).toBe(true);
  });


  it('Renders the 2 Subcomponents of TeneoWebChat: LaunchButton and ChatWindow', () => {

    expect(wrapper.findComponent(LaunchButton).exists()).toBe(true);
    expect(wrapper.findComponent(ChatWindow).exists()).toBe(false);
  });


  it('Renders the 3 Subcomponents of ChatWindow: Header, MessageList and UserInput', () => {

    const wrapper = shallowMount(ChatWindow, {
      propsData: {
        onClose: jest.fn(),
        onMinimize: jest.fn(),
      },
      localVue,
      mocks: {
        $teneoApi: mockTeneoApi,
        $t: jest.fn()
        }
    });

    expect(wrapper.findComponent(Header).exists()).toBe(true);
    expect(wrapper.findComponent(MessageList).exists()).toBe(true);
    expect(wrapper.findComponent(UserInput).exists()).toBe(true);
  });


  it('Renders MinimizeIcon inside Header, Close Button is hidden by default.', async () => {
    const wrapper = shallowMount(Header, {
      propsData: {
        onClose: jest.fn(),
        onMinimize: jest.fn(),
      },
      mocks: {
        $store: {
          state: {},
          getters: {}
        },
        $t: jest.fn()
      }
    });

    expect(wrapper.findComponent(MinimizeIcon).exists()).toBe(true);
    expect(wrapper.findComponent(XIcon).exists()).toBe(false);
  });


  it('Renders SendIcon inside UserInput', async () => {
    const wrapper = shallowMount(UserInput, {
      propsData: {
        onSubmit: jest.fn()
      },
      mocks: {
        $store: {
          state: {},
          getters: {}
        },
        $t: jest.fn()
      }
    });

    expect(wrapper.findComponent(SendIcon).exists()).toBe(true);
  });
  it('Renders UploadIcon inside UserInput', async () => {
    const wrapper = shallowMount(UserInput, {
      propsData: {
        onSubmit: jest.fn()
      },
      mocks: {
        $store: {
          state: { 'showUploadButton': true },
          getters: {}
        },
        $t: jest.fn()
      }
    });

    expect(wrapper.findComponent(UploadIcon).exists()).toBe(true);
  });  it('Renders AsrIcon inside UserInput', async () => {
    const wrapper = shallowMount(UserInput, {
      propsData: {
        onSubmit: jest.fn()
      },
      mocks: {
        $store: {
          state: { 'showAsrButton': true },
          getters: {}
        },
        $t: jest.fn()
      }
    });

    expect(wrapper.findComponent(AsrIcon).exists()).toBe(true);
  });it('Renders TtsIcon inside UserInput', async () => {
    const wrapper = shallowMount(UserInput, {
      propsData: {
        onSubmit: jest.fn()
      },
      mocks: {
        $store: {
          state: { 'showTtsButton': true },
          getters: {}
        },
        $t: jest.fn()
      }
    });

    expect(wrapper.findComponent(TtsIcon).exists()).toBe(true);
  });
});


describe('Check behavior of UI components', () => {

  it('isChatOpen controls whether ChatWindow, or LaunchButton, is displayed.', async() => {

      const wrapper = shallowMount(TeneoWebChat, {
        title: 'Teneo Web Chat',
        teneoEngineUrl: 'https://teneo-api.com/some-bot',
        propsData: { isChatOpen: false }
      }
    );

    // LaunchButton exists first
    expect(wrapper.findComponent(ChatWindow).exists()).toBe(false);
    expect(wrapper.findComponent(LaunchButton).exists()).toBe(true);

    // ..if clicked:
    await wrapper.setData({ isChatOpen: true });
    await wrapper.vm.$nextTick();

    // ChatWindow appears, and Launchbutton disappears
    expect(wrapper.findComponent(ChatWindow).exists()).toBe(true);
    expect(wrapper.findComponent(LaunchButton).exists()).toBe(false);
  });

  it('Assert BubbleIcon or custom image renders inside LaunchButton', async() => {

    /*
     * BubbleIcon is initially rendered when its parent, LaunchButton is rendered
     * ChatWindow is in a closed state.
     */
    let wrapper = shallowMount(LaunchButton, {
      propsData: {
        isOpen: false, // The state of ChatWindow
        open: jest.fn()
      },
      computed: {
        launchIconUrl: () => 'www.someurl.com' // Mock .env variable to make CloseButton visible
      },
      mocks: {
        $t: jest.fn()
      }
    });
    // Expect Custom image to be rendered if launchIconUrl is available

    expect(wrapper.findAll('img').at(0)
.exists()).toBe(true);
    expect(wrapper.findComponent(BubbleIcon).exists()).toBe(false);

    // Simulate no launch icon URL is provided
    wrapper = shallowMount(LaunchButton, {
      propsData: {
        isOpen: false, // The state of ChatWindow
        open: jest.fn()
      },
      computed: {
        launchIconUrl: () => false // Mock .env variable to make CloseButton visible
      },
      mocks: {
        $t: jest.fn()
      }
    });
    // Expect BubbleIcon to be rendered if no custom launchIconUrl is available
    expect(wrapper.findAll('img').exists()).toBe(false);
    expect(wrapper.findComponent(BubbleIcon).exists()).toBe(true);
  });


  it('Checks that Title is displayed in Header.', async () => {
    const wrapper = mount(ChatWindow, {
      propsData: {
        onClose: jest.fn(),
        onMinimize: jest.fn(),
      },
      mocks: {
        $teneoApi: mockTeneoApi,
        $store: mockStore,
        $t: jest.fn()
      }
    });

    expect(wrapper.findComponent(Header).text()).toBe('Teneo Web Chat');
  });


it('Renders Close Button inside Header, when showCloseButton is true.', async () => {
  const wrapper = shallowMount(Header, {
    propsData: {
      onClose: jest.fn(),
      onMinimize: jest.fn(),
    },
    mocks: {
      $store: {
        state: { 'showCloseButton': true },
        getters: {}
      },
      $t: jest.fn()
    }
  });

  expect(wrapper.findComponent(MinimizeIcon).exists()).toBe(true);
  expect(wrapper.findComponent(XIcon).exists()).toBe(true);
});
});
