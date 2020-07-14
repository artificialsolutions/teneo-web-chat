import Vue from 'vue';
const tmpVue = new Vue();
import { API_ON_BUTTON_CLICK } from './constants';

export default async function handleButtonClick(button, idx, teneoApi) {
    console.log("handleButtonClick", button)

    const numMessages = teneoApi.messageList.length;
    const messages =  teneoApi.messageList.slice(0, numMessages - 1);
    const buttonMessage = teneoApi.messageList[numMessages - 1];

    const selectedButton = { ...buttonMessage, selected: idx };

    teneoApi.messageList = [...messages, selectedButton];

    console.log("button", button)
    // check if there is an extension that want to intercept the new event
    if(tmpVue.$extensionMethods.get(API_ON_BUTTON_CLICK)){
      var extensionCallback = tmpVue.$extensionMethods.get(API_ON_BUTTON_CLICK);
      button = await extensionCallback(button);
    }

    await teneoApi.sendSilentMessage(button.postback);

}
  