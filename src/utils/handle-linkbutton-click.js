import { API_ON_LINKBUTTON_CLICK } from './api-function-names.js';
import handleExtension from './handle-extension.js';
import basePayload from './base-payload';

export default async function handleLinkButtonClick(button, event) {

    const payload = basePayload()

    // include button detials in paylaod
    payload.button = button

    // check if there is an extension that want to intercept the new event
    await handleExtension(API_ON_LINKBUTTON_CLICK, payload);

    // if extension handles button, prevent default button click behaviour from happening
    if (payload.handledState.handled === true) {
        if (event) {
          event.preventDefault()
        }
        return
    }    
}
  