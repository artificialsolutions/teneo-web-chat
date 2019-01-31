export default {
  name: 'app',
  data() {
    return {
      message: 'Open the chat!',
      participants: [
        {
          id: 'user1',
          name: 'Matteo',
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
      messageList: [
        { type: 'text', author: `me`, data: { text: `Say yes!` } },
        { type: 'text', author: `user1`, data: { text: `No.` } },
      ],
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
          author: 'support',
          type: 'text',
          data: { text },
        });
      }
    },
    onMessageWasSent(message) {
      this.messageList = [...this.messageList, message];
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
