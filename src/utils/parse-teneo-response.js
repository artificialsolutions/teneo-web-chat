import {
    PARTICIPANT_BOT,
    TENEO_PARAM_KEY,
    TENEO_OUTPUTTEXTSEGMENTS_PARAM,
    BUBBLE_DELAY,
    TENEO_TEMPLATE_INDEX
} from './constants.js';
import {EventBus, events} from '../utils/event-bus';
import {store} from '../store/store';
import { messageSchema } from './schema.js';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const defaultMessageType = 'text';

export default async function parseTeneoResponse(teneoResponse) {


    let timeout = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const {parameters, text, link} = teneoResponse.output;
    const messages = [];
    // get ouputTextSegments parameter for speech bubbles
    // it is a list with start and end indexes that looks like this
    // [[0, 39], [40, 67], [68, 96], [97, 97]]

    const ouputTextSegmentsParam = parameters && parameters[TENEO_OUTPUTTEXTSEGMENTS_PARAM];
    let outputTextSegmentIndexes;
    try {
        if (ouputTextSegmentsParam) {
            outputTextSegmentIndexes = JSON.parse(ouputTextSegmentsParam);
        }
    } catch (err) {
        console.error('Error: Unable to parse outputTextSegmentsParam JSON string')
    }

    // handle 'attachments'
    const messageParams = parameters && parameters[TENEO_PARAM_KEY];
    let data;
    try {
        if (messageParams) {
            data = JSON.parse(messageParams);
            
            try {
                const ajv = new Ajv();
                addFormats(ajv);
                const validate = ajv.compile(messageSchema);
                const valid = validate(data);
                if (!valid) {
                    messages.push({
                        author: PARTICIPANT_BOT,
                        type: 'system',
                        data: { 'text': 'Invalid message format' }
                    });
                    const errors = validate.errors;
                    console.error({data, errors});
                }
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        console.error('Error: Unable to parse JSON string')
    }

    if (outputTextSegmentIndexes && Array.isArray(outputTextSegmentIndexes) && text) {

        // each segment (a list that contains a start and an end index) in the list is a bubble
        for (let i = 0; i < outputTextSegmentIndexes.length; ++i) {
            try {
                // get the start and end index for this bubble
                const bubbleStartIndex = outputTextSegmentIndexes[i][0];
                const bubbleEndIndex = outputTextSegmentIndexes[i][1];

                if (!isNaN(bubbleStartIndex) && !isNaN(bubbleEndIndex)) {
                    // get the substring that needs to appear in a bubble
                    const bubbleText = text.substring(bubbleStartIndex, bubbleEndIndex).trim();

                    // add the bubble the list of messages, but only if it is not empty
                    if (bubbleText) {
                        messages.push({
                            author: PARTICIPANT_BOT,
                            type: 'text',
                            data: {'text': bubbleText}
                        });
                    }


                }
            } catch (err) {
                if (process.env.NODE_ENV !== "production") {
                    console.error('Error: unexpected breakpoints value')
                }
            }
        }

    } else if (text) {
        {
            messages.push({
                author: PARTICIPANT_BOT,
                type: 'text',
                data: {text}
            });


        }
    } else {
        console.error('No text content received!');
    }

    if (data) {
        messages.push({
            author: PARTICIPANT_BOT,
            type: data.type || defaultMessageType,
            data
        });
    }

    if (link) {
        let parsedLink;
        let messageData;
        let messageType;
    
        try {                    
            parsedLink = JSON.parse(link);        
        } catch (jsonError) {
            if (!store.getters.autoRedirect) {
                console.log('Unable to parse link as JSON :', jsonError);
            }
            messageType = 'system';
            messageData = {'text': 'Unable to open hyperlink'};
        }
    
        if (store.getters.autoRedirect) {
            window.location.href = parsedLink ? parsedLink.url : link;
        } else if (!parsedLink) {
            messages.push({
                author: PARTICIPANT_BOT,
                type: messageType,
                data: messageData
            });     
        } else {
            messages.push({
                author: PARTICIPANT_BOT,
                type: 'linkpreview',
                data: parsedLink
            });
        }
    }

    var ind = 0;
    while (ind < messages.length) {
        const message = messages[ind];
        message.placeInQueue = ++ind;
        message.queueLength = messages.length;
        // Emit event to update UI with new bubble, with a delay timer
        await timeout(ind === 1 ? 0 : BUBBLE_DELAY).then(() => {
            EventBus.$emit(events.PUSH_BUBBLE, message);
        })
    }

    return parameters.hasOwnProperty('twcAutoReply') ? JSON.parse(parameters.twcAutoReply) : false;
}
