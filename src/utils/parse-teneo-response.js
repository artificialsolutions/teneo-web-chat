import { PARTICIPANT_BOT, TENEO_PARAM_KEY, TENEO_OUTPUTTEXTSEGMENTS_PARAM, BUBBLE_DELAY, COMBO_MESSAGE_DELAY } from './constants.js';
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
              EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]),
              timeout(BUBBLE_DELAY),
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

      //Use delay if multiple bubbles, or a bubble + attachment, is expected
      if((messages.length > 1)||((messages.length===1) && data)){
        await Promise.all([   
          EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]),
          timeout(BUBBLE_DELAY),
        ]);
      }
      else{
        EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1])
      }
     
      //Signal engine reply if no more data is expected.
      if(!data){
        EventBus.$emit(events.ENGINE_REPLIED);
      }
    }
  }

  if (data) {
    if (data.type && data.type == "combo") {
      for (var i = 0; i < data.components.length; ++i) {
        const component = data.components[i];
        console.log("component",component)
        messages.push({
          author: PARTICIPANT_BOT,
          type: component.type || defaultMessageType,
          data: component,
        });
        // Emit event that updates UI with new bubble, with a delay timer
        // EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]);
        await Promise.all([   
          EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]),
          timeout(COMBO_MESSAGE_DELAY),
        ]);

      }
    } else {
      console.log("message",data)
      messages.push({
        author: PARTICIPANT_BOT,
        type: data.type || defaultMessageType,
        data,
      });
      // Emit event that updates UI with new bubble, with a delay timer
      EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]);
    }
    
    // Emit event that updates UI with new bubble, with a delay timer
    //EventBus.$emit(events.PUSH_BUBBLE,messages[messages.length-1]);
  }

  return messages;
}
