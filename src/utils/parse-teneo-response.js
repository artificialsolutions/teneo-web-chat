import {
    PARTICIPANT_BOT,
    TENEO_PARAM_KEY,
    TENEO_OUTPUTTEXTSEGMENTS_PARAM
} from './constants.js';
import { store } from '../store/store';
import validateMessage from '../utils/validate-message.js';

const defaultMessageType = 'text';

const getJsonParameterValue = (parameters, paramName) => {
    if (Object.prototype.hasOwnProperty.call(parameters, paramName)) {
        const paramValue = parameters[paramName];

        try {
            if (paramValue) {
                return JSON.parse(paramValue);
            }
        } catch (err) {
            console.error(`Error: Unable to parse '${paramName}' value as JSON string`);
        }
    }
};

const getTextBubbles = (outputTextSegmentIndexes, text) => {
    const segmentStart = (segment) => segment[0];
    const segmentEnd = (segment) => segment[1];

    const textBubbles = outputTextSegmentIndexes
      .filter((segment) => !(isNaN(segmentStart(segment)) || isNaN(segmentEnd(segment))))
      .map((validSegment) => text.substring(segmentStart(validSegment), segmentEnd(validSegment)).trim());

    return textBubbles.filter((bubbleText) => bubbleText);
};

const parseAndSplitText = (output, messages) => {
    const { parameters, text } = output;
    const outputTextSegmentIndexes = getJsonParameterValue(parameters, TENEO_OUTPUTTEXTSEGMENTS_PARAM);

    if (outputTextSegmentIndexes && Array.isArray(outputTextSegmentIndexes)) {
        if (!text) {

            /*
             * This can happen with streaming responses
             * and bubbles are arguably obsoleted by streaming responses anyway
             * So this is now just a log message
             */
            console.log(`${TENEO_OUTPUTTEXTSEGMENTS_PARAM} defined, but no text returned to segment`);

            return;
        }

        const textBubbles = getTextBubbles(outputTextSegmentIndexes, text);

        textBubbles.forEach((bubbleText) => {
            messages.push({
                author: PARTICIPANT_BOT,
                type: 'text',
                data: { 'text': bubbleText }
            });
        });
    } else if (text) {
        messages.push({
            author: PARTICIPANT_BOT,
            type: 'text',
            data: { text }
        });
    }
};

const parseMessageData = (output, messages) => {
    const { parameters } = output;
    const data = getJsonParameterValue(parameters, TENEO_PARAM_KEY);

    if (!data) {
        return;
    }

    const vResult = validateMessage(data);

    if (!vResult) {
        const { errors } = validateMessage;

        console.warn('Unrecognised message data', { data, errors });
    }

    messages.push({
        author: PARTICIPANT_BOT,
        type: data.type || defaultMessageType,
        data
    });
};

const parseLinkData = (output, messages) => {
    const { link } = output;
    const { autoRedirect } = store.getters;

    if (!link) {
        return;
    }

    const tryParseLink = (linkParam) => {
        try {
            return JSON.parse(linkParam);
        } catch {
            // Property 'link' can contain JSON or just a url - so if it errors, we assume just a url
        }
    };

    const parsedLink = tryParseLink(link);

    if (autoRedirect) {
        window.location.href = parsedLink ? parsedLink.url : link;
    } else if (parsedLink) {
        messages.push({
            author: PARTICIPANT_BOT,
            type: 'linkpreview',
            data: parsedLink
        });
    } else {
        messages.push({
            author: PARTICIPANT_BOT,
            type: 'system',
            data: { 'text': 'Unable to display link preview' }
        });
    }
};

const buildMessageQueue = (messages) => {
    return messages.map((message, i) => {
        return {
            ...message,
            placeInQueue: i + 1,
            queueLength: messages.length
        };
    });
};

export default function parseTeneoResponse(teneoResponse) {

    const { output } = teneoResponse;
    const { parameters } = output;
    const messages = [];

    parseAndSplitText(output, messages);
    parseMessageData(output, messages);
    parseLinkData(output, messages);

    return {
        messages: buildMessageQueue(messages),
        autoReply: getJsonParameterValue(parameters, 'twcAutoReply') || false
    };
}
