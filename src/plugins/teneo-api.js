import Vue from 'vue';
// Import TIE from '@artificialsolutions/tie-api-client'; // Disabled to fix error on IE11
import TIE from '../utils/tie-client.js'; // Import tie client SDK like this to fix error on IE11

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';
import { CHANNEL_PARAM, FALLBACK_LOCALE, SESSION_ID_STORAGE_KEY, PARTICIPANT_BOT} from '../utils/constants.js';
import { API_ON_ENGINE_REQUEST, API_ON_ENGINE_RESPONSE, API_ON_NEW_MESSAGE } from '../utils/api-function-names.js';
import { EventBus, events } from '../utils/event-bus.js';
import handleExtension from '../utils/handle-extension.js';
import basePayload from '../utils/base-payload.js';
// Import detectSafari from '../utils/detect-safari';
import { createI18n } from 'vue-i18n'
import { translatedMessages } from '../utils/localized-messages';

export default function teneoApiPlugin(teneoApiUrl) {


    const i18n = createI18n({
        locale: 'en',
        fallbackLocale: FALLBACK_LOCALE,
        globalInjection: true,
        messages: translatedMessages,
        silentTranslationWarn: true
    });

    const messageListCache = new MessageListCache();
    const tmpVue = new Vue({ data: { messageList: messageListCache.get() }, i18n });
    // Const isSafari = detectSafari();
    const sessionKey = SESSION_ID_STORAGE_KEY;
    let sessionId = null;

    // Default initialisation of teneoApi
    var teneoApiUrl = tmpVue.$store.getters.teneoEngineUrl;
    let teneoApi = TIE.init(teneoApiUrl);

    // Update teneoApi if engine url changed using API call
    EventBus.$on(events.SET_ENGINE_URL, () => {
        teneoApiUrl = tmpVue.$store.getters.teneoEngineUrl;
        teneoApi = TIE.init(teneoApiUrl);
    });


    const plugin = {
        pushBubble(api, msg) {
            api._onMessageReceived(msg);
        },
        get messageList() {
            return tmpVue.messageList;
        },
        set messageList(newVal) {
            tmpVue.messageList = newVal;
            messageListCache.update(newVal);
        },

        async sendBaseMessage(text, parameters, isSilent, retries = 0) {

            if (parameters.obfuscated) {
 console.log(`INPUT_SUBMITTED obfuscated: ${parameters.obfuscated}`);
}
            // Set text and channel
            let messageDetails = {
                text,
                'channel': CHANNEL_PARAM
            };

            // If available, add extra params to messageDetails
            const extraParams = tmpVue.$store.getters.teneoEngineParams;

            if (Object.keys(extraParams).length > 0 && extraParams.constructor === Object) {
                messageDetails = Object.assign(messageDetails, extraParams);
            }

            // If available add extra params from method
            if (Object.keys(parameters).length > 0 && parameters.constructor === Object) {
                messageDetails = Object.assign(messageDetails, parameters);
            }

            if (!isSilent) {

                // Construct user message object
                const tmpMessage = { 'author': 'user', 'type': 'text', 'data': { text } };

                // Add user message to history
                await this._onMessageReceived(tmpMessage);
            }

            // Check if there is an extension that want to intercept the request to engine
            const requestPayload = basePayload();

            requestPayload.requestDetails = messageDetails;
            await handleExtension(API_ON_ENGINE_REQUEST, requestPayload);

            // Abort if extension says so
            if (requestPayload.handledState.handled === true) {
                return;
            }

/*
 * TODO: throw errors on payload check failures, if message returned by extension is invalid or if message type is invalid
 * only continue if message details is object
 */
            if (requestPayload.requestDetails.constructor !== Object) {

                return;
            }

            // Only continue if message details contains text key
            if (!('text' in requestPayload.requestDetails)) {

                return;
            }

            EventBus.$emit(events.START_SPINNER);

            /*
             * Get session from storage when safari is used
             * to prevent issues when 'prevent cross-site tracking' is enabled
             * if (isSafari) {
             */
                sessionId = tmpVue.$store.getters.storage.getItem(sessionKey);
           // }

            // Send the input to engine

            teneoApi.sendInput(sessionId, requestPayload.requestDetails).then(async (response) => {
                const responsePayload = basePayload();

                responsePayload.responseDetails = response;

                // Check if there is an extension that want to intercept the response from engine
                await handleExtension(API_ON_ENGINE_RESPONSE, responsePayload);


                EventBus.$emit(events.ENGINE_REPLIED, response);

                // Abort if extension says so
                if (responsePayload.handledState.handled === true) {
                    return;
                }

                // Stop further processing if response is not an object
                if (Object.keys(responsePayload.responseDetails).length === 0 || responsePayload.responseDetails.constructor !== Object) {

                    return;
                }

                // Stop further processing if response does not have status or proper keys in 'output' part of the response
                if (!'status' in response || response.status !== 0 || !'output' in response || !'text' in response.output || !'parameters' in response.output) {

                    return;
                }

                /*
                 * If users have 'prevent cross-site tracking' enabled
                 * a reload of the page may lose the session
                 *     if (isSafari) {
                 */

                    tmpVue.$store.getters.storage.setItem(sessionKey, response.sessionId);

                /*
                 *    TmpVue.$store.getters.storage.setItem(lbKey, response.sessionId);
                 * } else {
                 *     sessionId = response.sessionId;
                 * }
                 */


                EventBus.$off(events.PUSH_BUBBLE);
                EventBus.$on(events.PUSH_BUBBLE, async (msg) => {
                    await this._onMessageReceived(msg);

                });

               const autoReply = await parseTeneoResponse(response);

               if (autoReply) {
                   setTimeout(() => {
                       this.sendSilentMessage(autoReply.message, {});
                   }, autoReply.delay);
               }

            })
.catch(
                (error) => {
                    EventBus.$emit(events.START_SPINNER);
                        const retryMessage = tmpVue.$t('message.connection_error_retry_message');
                        const finalMessage = tmpVue.$t('message.connection_error_final_message');

                        retries++;
                        if (retries < 3) {
                            EventBus.$emit(events.ADD_MESSAGE, {
                                'type': 'system',
                                'data': {
                                    'text': retryMessage
                                },
                                'placeInQueue': 1,
                                'queueLength': 1
                            });
                            console.log(`Trying again ${retries}`);
                            setTimeout(() => {
                                this.sendBaseMessage(text, parameters, true, retries);
                            }, 7000);

                        } else {
                            console.log(`Giving up ${retries}`);
                            EventBus.$emit(events.ADD_MESSAGE, {
                                'type': 'system',
                                'data': {
                                    'text': finalMessage
                                },
                                'placeInQueue': 1,
                                'queueLength': 1
                            });
                            setTimeout(() => {
 EventBus.$emit(events.CLOSE_WINDOW);
}, 5000);

                        }

                    return false;
                }
            );


        },

        async sendMessage(message) {
            await this.sendBaseMessage(message.data.text, message.data.parameters, false);
        },
        async sendSilentMessage(text = '', parameters = {}) {
            await this.sendBaseMessage(text, parameters, true);
        },
        async _onMessageReceived(message) {
            if (message.author === PARTICIPANT_BOT || message.type === 'system') {
                EventBus.$emit(events.BOT_MESSAGE_RECEIVED, message);
            }


            if (!message) {
                return;
            }

            // Create payload
            const payload = basePayload();

            payload.message = message;

            /*
             * Check if there is an extension that wants to intercept the message
             * except for typing indicator messages
             */
            if (payload.message.type !== 'typing') {
                await handleExtension(API_ON_NEW_MESSAGE, payload);
            }


            // Abort if extension says so
            if (payload.handledState.handled === true) {
                return;
            }

            // If there is a typing indicator active for this author, hide it
            this.hideTypingIndicator(message);

            // Stop further processing if message is not an object
            if (Object.keys(payload.message).length == 0 || payload.message.constructor !== Object) {
                return;
            }

            // Add message to list

            this.messageList = [...this.messageList, message];
        },
        async closeSession() {

            /*
             * Get session from storage when safari is used
             * to prevent issues when 'prevent cross-site tracking' is enabled
             *    if (isSafari) {
             */
                sessionId = tmpVue.$store.getters.storage.getItem(sessionKey);
          //  }
            TIE.close(teneoApiUrl, sessionId);

            tmpVue.$store.getters.storage.setItem(sessionKey, '');
        },
        async clearHistory() {
            this.messageList = [];
            if (this.messageListCache) {
                this.messageListCache.update([]);
            }
        },
        async getMessageList() {
            return this.messageList;
        },
        hideTypingIndicator(data) {
            // Remove messages of type 'typing', from users of author 'data.author'
            this.messageList = this.messageList.filter((item, index, array) => {
                return (!((item.author === data.author) && (item.type === 'typing')));
            });
        },
        async showTypingIndicator(message) {
            this.hideTypingIndicator(message);
            message.type = 'typing';
            await this._onMessageReceived(message);
        },
    };

    plugin.install = function install() {
        Object.defineProperty(Vue.prototype, '$teneoApi', {
            get() {
                return plugin;
            },
        });
    };

    return plugin;
}
