import { PARTICIPANT_BOT, TENEO_PARAM_KEY, TENEO_BREAKPOINTS_PARAM } from './constants.js';

const defaultMessageType = 'text';

export default function parseTeneoResponse(teneoResponse) {
  const { parameters, text } = teneoResponse.output;

  const messages = [];

  // get breakpoints param for speech bubbles
  // it is a list with start and end indexes that looks like this
  // [[0, 39], [40, 67], [68, 96], [97, 97]]
  const breakpointsparam = parameters && parameters[TENEO_BREAKPOINTS_PARAM];
  let breakpoints;
  try {
    if (breakpointsparam) {
      breakpoints = JSON.parse(breakpointsparam);
    }
  } catch(err) {
    // console.log('Error: Unable to parse breakpointsparam JSON string')
  }

  if (breakpoints && Array.isArray(breakpoints)) {

    if (text) {
      // each breakpoint in the list is a bubble
      for (var i = 0; i < breakpoints.length; ++i) {

        try {
          // get the start and end index for this bubble
          var bubbleStartIndex = breakpoints[i][0];
          var bubbleEndIndex = breakpoints[i][1];

          if (!isNaN(bubbleStartIndex) && !isNaN(bubbleEndIndex)) {
            // get the substring that needs to appear in a bubble
            var bubbleText = text.substring(bubbleStartIndex,bubbleEndIndex).trim();

            // add the bubble the list of messages, but only if it is not empty
            if (bubbleText) {
              messages.push({
                author: PARTICIPANT_BOT,
                type: 'text',
                data: {'text': bubbleText },
              });
            }
          }
          
        } catch (err) {
          // console.log('Error: unexpected breakpoints value')
        }
      }
    }
  } else {
    if (text) {
      messages.push({
        author: PARTICIPANT_BOT,
        type: 'text',
        data: { text },
      });
    }
  }

  // handle 'attachments'
  const messageParams = parameters && parameters[TENEO_PARAM_KEY];
  let data;
  try {
    if (messageParams) {
      data = JSON.parse(messageParams);
    }
  } catch(err) {
    // console.log('Error: Unable to parse JSON string')
  }

  if (data) {
    messages.push({
      author: PARTICIPANT_BOT,
      type: data.type || defaultMessageType,
      data,
    });
  }

  return messages;
}
