// import Vue from 'vue';
// const tmpVue = new Vue();
import { API_ON_LINKBUTTON_CLICK } from './api-function-names.js';
import handleExtension from './handle-extension.js';
import basePayload from './base-payload';

export default async function handleLinkButtonClick(button) {

    const payload = basePayload()
    payload.button = button
    console.log("payload before handleExtension", payload);
    // check if there is an extension that want to intercept the new event
    await handleExtension(API_ON_LINKBUTTON_CLICK, payload);
    if (payload.button) {
        button = payload.button
    }
    console.log("payload after handleExtension", payload);

    // only send silent input if postback exists
    if (payload.handledState.handled === true) {
        console.log("bla")
    } else {
        console.log("button",button)
        if (button.target) {
            console.log("Open page in new window")
            window.open(button.link, button.target);
        } else {
            console.log("Open page in same window")
            window.location.href = button.link;
        }
        
    }
    
}
  