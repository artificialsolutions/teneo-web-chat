import TIE from '@artificialsolutions/tie-api-client';

const TENEO_AUTHOR = 'teneo';

const teneoEngineUrl = 'https://developerarea-dev.teneocloud.com/tiesdktest/';

const teneoApi = TIE.init(teneoEngineUrl);

export default {
  name: 'app',
  data() {
    return {
      message: 'Open the chat!',
      participants: [
        {
          id: 'user1',
          name: 'Me',
          imageUrl:
            'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4',
        },
        {
          id: 'user2',
          name: 'Support',
          imageUrl:
            'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4',
        },
      ],
      titleImageUrl:
        'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [],
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: '',
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff',
        },
        launcher: {
          bg: '#4e8cff',
        },
        messageList: {
          bg: '#ffffff',
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff',
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222',
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867',
        },
      },
      alwaysScrollToBottom: false,
      messageStyling: true,
    };
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen
          ? this.newMessagesCount
          : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: TENEO_AUTHOR,
          type: 'text',
          data: { text },
        });
      }
    },
    async onMessageWasSent(message) {
      this.messageList = [...this.messageList, message];

      if (message.author !== TENEO_AUTHOR) {
        const response = await teneoApi.sendInput(null, {
          text: message.data.text,
        });

        this.sendMessage(response.output.text);
      }
    },
    openChat() {
      this.isChatOpen = true;
      this.newMessagesCount = 0;
      this.message = 'Close the chat!';
    },
    closeChat() {
      this.isChatOpen = false;
      this.message = 'Open the chat!';
    },
  },
};
