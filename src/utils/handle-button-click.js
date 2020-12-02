// import Vue from 'vue';
// const tmpVue = new Vue();
import { API_ON_BUTTON_CLICK } from './api-function-names.js';
import handleExtension from './handle-extension.js';
import basePayload from './base-payload';

export default async function handleButtonClick(button, idx, teneoApi) {

    const numMessages = teneoApi.messageList.length;
    const messages =  teneoApi.messageList.slice(0, numMessages - 1);
    const buttonMessage = teneoApi.messageList[numMessages - 1];

    const selectedButton = { ...buttonMessage, selected: idx };

    teneoApi.messageList = [...messages, selectedButton];


    const payload = basePayload()
    payload.button = JSON.parse(JSON.stringify(button))

    // check if there is an extension that want to intercept the new event
    await handleExtension(API_ON_BUTTON_CLICK, payload);
    if (payload.button) {
        button = payload.button
    }

    // only send silent input if postback exists
    if (!(payload.handledState.handled === true) && button.postback) {
        let parameters = {};
        if (button.parameters) {
            parameters = button.parameters;
        }
        await teneoApi.sendSilentMessage(button.postback, parameters);
    }
}

export async function handleComboButtonClick(button, msgID, idx, teneoApi, message) {
    
    // Locate the component where the button was clicked, within the entire webchat, with msgID
    const messages =  teneoApi.messageList;
    const buttonMessage = messages[msgID];

    // Mark the button that was clicked within the component, as selected, with idx
    const selectedButton = { ...buttonMessage, selected: idx };
    messages[msgID] = selectedButton;
    teneoApi.messageList = messages;
    
    console.log("message.selected: " + message.selected)

    // Proceed to handle extensions and response to engine
    const payload = basePayload()
    payload.button = JSON.parse(JSON.stringify(button))

    // Check if there is an extension that want to intercept the new event
    await handleExtension(API_ON_BUTTON_CLICK, payload);
    if (payload.button) {
        button = payload.button
    }

    // Only send silent input if postback exists
    if (!(payload.handledState.handled === true) && button.postback) {
        let parameters = {};
        if (button.parameters) {
            parameters = button.parameters;
        }
        await teneoApi.sendSilentMessage(button.postback, parameters);
    }
}