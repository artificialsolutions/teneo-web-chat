import { PARTICIPANT_BOT, TENEO_PARAM_KEY, TENEO_OUTPUTTEXTSEGMENTS_PARAM } from './constants.js';
import { EventBus, events } from '../utils/event-bus.js';

const defaultMessageType = 'text';

export default async function parseTeneoResponse(teneoResponse) {

  var timeout = function (ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const { parameters, text } = teneoResponse.output;
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
  } catch(err) {
    // console.log('Error: Unable to parse ouputTextSegmentsParam JSON string')
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

  if (outputTextSegmentIndexes && Array.isArray(outputTextSegmentIndexes)) {

    if (text) {
      // each segment (a list that contians a start and an end index) in the list is a bubble
      for (var i = 0; i < outputTextSegmentIndexes.length; ++i) {
        try {
          // get the start and end index for this bubble
          var bubbleStartIndex = outputTextSegmentIndexes[i][0];
          var bubbleEndIndex = outputTextSegmentIndexes[i][1];

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
            
            // Emit event to update UI with new bubble, with a delay timer
            await Promise.all([   
              console.log('emit bubble'),
              EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]),
              timeout(800),
            ]);

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

      await Promise.all([   
        EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]),
        timeout(800),
      ]);
     
      if(!messageParams){
        EventBus.$emit(events.ENGINE_REPLIED);
      }
    }
  }

  if (data) {
    messages.push({
      author: PARTICIPANT_BOT,
      type: data.type || defaultMessageType,
      data,
    });
    // Emit event that updates UI with new bubble, with a delay timer
    EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]);
  }

  return messages;
}
