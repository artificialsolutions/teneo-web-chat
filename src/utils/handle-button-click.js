import Vue from 'vue';
const tmpVue = new Vue();
import { API_ON_BUTTON_CLICK } from './constants';
import handleExtension from './handle-extension.js';

export default async function handleButtonClick(button, idx, teneoApi) {
    const numMessages = teneoApi.messageList.length;
    const messages =  teneoApi.messageList.slice(0, numMessages - 1);
    const buttonMessage = teneoApi.messageList[numMessages - 1];

    const selectedButton = { ...buttonMessage, selected: idx };

    teneoApi.messageList = [...messages, selectedButton];

    // check if there is an extension that want to intercept the new event
    button =  await handleExtension(API_ON_BUTTON_CLICK, button);

    await teneoApi.sendSilentMessage(button.postback);

}
  