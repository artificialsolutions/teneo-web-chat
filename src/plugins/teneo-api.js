/* eslint-disable capitalized-comments */
/* eslint-disable max-statements */
import Vue from 'vue';

/*
 * Disabled to fix error on IE11
 * import TIE from '@artificialsolutions/tie-api-client'; 
 * Import tie client SDK like this to fix error on IE11
 */
//import TIE from '../utils/tie-client.js';
import { sendInput, close } from '../utils/tie-client.js';

import MessageListCache from '../utils/message-list-cache.js';
import parseTeneoResponse from '../utils/parse-teneo-response.js';
import {
    CHANNEL_PARAM,
    FALLBACK_LOCALE,
    PARTICIPANT_BOT,
    SESSION_ID_STORAGE_KEY,
    BUBBLE_DELAY,
} from '../utils/constants.js';
import {
    API_ON_ENGINE_REQUEST,
    API_ON_ENGINE_RESPONSE,
    API_ON_NEW_MESSAGE
} from '../utils/api-function-names.js';
import { EventBus, events } from '../utils/event-bus.js';
import handleExtension from '../utils/handle-extension.js';
import basePayload from '../utils/base-payload.js';
import VueI18n from 'vue-i18n';
import { translatedMessages } from '../utils/localized-messages';

export default function teneoApiPlugin() {

    Vue.use(VueI18n);
    const i18n = new VueI18n({
        locale: 'en',
        fallbackLocale: FALLBACK_LOCALE,
        messages: translatedMessages,
        silentTranslationWarn: true
    });

    const messageListCache = new MessageListCache();
    const tmpVue = new Vue({ data: { messageList: messageListCache.get() }, i18n });

    let lastMessageTimestamp = Date.now();

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

            if (parameters.obfuscated)
                console.log('INPUT_SUBMITTED obfuscated: ' + parameters.obfuscated)
            // set text and channel
            let messageDetails = {
                'text': text,
                'channel': CHANNEL_PARAM
            }

            // if available, add extra params to messageDetails
            const extraParams = tmpVue.$store.getters.teneoEngineParams;

            if (Object.keys(extraParams).length > 0 && extraParams.constructor === Object) {
                messageDetails = Object.assign(messageDetails, extraParams);
            }

            // if available add extra params from method
            if (Object.keys(parameters).length > 0 && parameters.constructor === Object) {
                messageDetails = Object.assign(messageDetails, parameters);
            }

            if (!isSilent) {

                // construct user message object
                const tmpMessage = { 'author': 'user', 'type': 'text', 'data': { text } };

                // add user message to history
                await this._onMessageReceived(tmpMessage);
            }

            // check if there is an extension that want to intercept the request to engine
            const requestPayload = basePayload();

            requestPayload.requestDetails = messageDetails;
            await handleExtension(API_ON_ENGINE_REQUEST, requestPayload);

            // abort if extension says so
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

            // only continue if message details contains text key
            if (!('text' in requestPayload.requestDetails)) {

                return;
            }
            EventBus.$emit(events.MESSAGE_SENT);
            EventBus.$emit(events.START_SPINNER);

            const handleResponse = async (response) => {
                const responsePayload = basePayload();

                responsePayload.responseDetails = response;

                // check if there is an extension that want to intercept the response from engine
                await handleExtension(API_ON_ENGINE_RESPONSE, responsePayload);

                EventBus.$emit(events.ENGINE_REPLIED, response);

                // abort if extension says so
                if (responsePayload.handledState.handled === true) {
                    return;
                }

                // stop further processing if response is not an object
                if (Object.keys(responsePayload.responseDetails).length === 0 ||
                    responsePayload.responseDetails.constructor !== Object) {
                    return;
                }

                // stop further processing if response does not have status or proper keys in 'output' part of the response
                if (!('status' in response) ||
                    response.status !== 0 ||
                    !('output' in response) ||
                    !('text' in response.output) ||
                    !('parameters' in response.output)) {
                        console.error('Response must declare status (with value 0), output, text and parameters');

                        return;
                }

                return parseTeneoResponse(response);
            };

            sendInput(tmpVue.$store.getters.teneoEngineUrl,
                    requestPayload.requestDetails,
                    tmpVue.$store.getters.streamResponses,
                    async (response) => {
                        const { messages } = await handleResponse(response);

                        for (const message of messages) {
                            this._onMessageReceived(message);
                        }
                    }).then(async (response) => {

                const { autoReply } = await handleResponse(response);

                if (autoReply) {
                    setTimeout(() => {
                        this.sendSilentMessage(autoReply.message, {});
                    }, autoReply.delay);
                }
            }).catch(
                (error) => {
                    console.error({ error }, `retries remaining: ${retries}`);
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
                            'placeInQueue':1,
                            'queueLength':1
                        });
                        console.log('Trying again ' + retries);
                        setTimeout(() => {
                            this.sendBaseMessage(text, parameters, true, retries)
                        }, 7000)

                    } else {
                        console.log('Giving up ' + retries);
                        EventBus.$emit(events.ADD_MESSAGE, {
                            'type': 'system',
                            'data': {
                                'text': finalMessage
                            },
                            'placeInQueue':1,
                            'queueLength':1
                        });
                        setTimeout(() => {
                            EventBus.$emit(events.STOP_ASR_TTS);
                            EventBus.$emit(events.CLOSE_WINDOW);
                        }, 5000);

                    }
                    return false
                }
            );
        },
        async sendMessage(message) {
            await this.sendBaseMessage(message.data.text, message.data.parameters, false);
        },
        async sendSilentMessage(text = '', parameters = {}) {
            await this.sendBaseMessage(text, parameters, true);
        },
        async _enforceMessageCadence() {
            const thisMessageTimestamp = Math.max(lastMessageTimestamp + BUBBLE_DELAY, Date.now());

            lastMessageTimestamp = thisMessageTimestamp;

            await new Promise((resolve,) => setTimeout(resolve, thisMessageTimestamp - Date.now()));
        },
        async _onMessageReceived(message) {
            await this._enforceMessageCadence();

            if (message.author === PARTICIPANT_BOT || message.type === 'system') {
                EventBus.$emit(events.BOT_MESSAGE_RECEIVED, message);
            }

            if (!message) {
                return;
            }

            // create payload
            const payload = basePayload();

            payload.message = message

            /*
             * check if there is an extension that wants to intercept the message
             * except for typing indicator messages
             */
            if (payload.message.type !== 'typing') {
                await handleExtension(API_ON_NEW_MESSAGE, payload);
            }


            // abort if extension says so
            if (payload.handledState.handled === true) {
                return
            }

            // if there is a typing indicator active for this author, hide it
            this.hideTypingIndicator(message);

            // stop further processing if message is not an object
            if (Object.keys(payload.message).length == 0 || payload.message.constructor !== Object) {
                return
            }

            this.messageList = [...this.messageList.filter((m) => !m.data?.temporary), message];
        },
        async closeSession() {
            close(tmpVue.$store.getters.teneoEngineUrl);
        },
        async clearHistory() {
            this.messageList = []
            if (this.messageListCache) {
                this.messageListCache.update([]);
            }
        },
        async getMessageList() {
            return this.messageList;
        },
        hideTypingIndicator(data) {
            //remove messages of type 'typing', from users of author 'data.author'
            this.messageList = this.messageList.filter(function (item, index, array) {
                return (!((item.author === data.author) && (item.type === 'typing')));
            });
        },
        async showTypingIndicator(message) {
            this.hideTypingIndicator(message);
            message.type = 'typing'
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
