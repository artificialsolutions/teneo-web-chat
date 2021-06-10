import {PARTICIPANT_BOT, TENEO_PARAM_KEY, TENEO_OUTPUTTEXTSEGMENTS_PARAM, BUBBLE_DELAY} from './constants.js';
import {EventBus, events} from '../utils/event-bus';
import {store} from '../store/store';


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
        let parsedLink = JSON.parse(link);
        if (store.getters.autoRedirect) {
            window.location.href = parsedLink.url;
        } else {

            messages.push({
                author: PARTICIPANT_BOT,
                type: 'linkpreview',
                data: parsedLink
            });

        }

    }

    for (const message of messages) {
        const index = messages.indexOf(message);
        message.placeInQueue = index + 1;
        message.queueLength = messages.length;
        // Emit event to update UI with new bubble, with a delay timer

        await timeout(index === 0 ? 0 : BUBBLE_DELAY).then(()=>{EventBus.$emit(events.PUSH_BUBBLE, message)})
    }

    return messages;
}
