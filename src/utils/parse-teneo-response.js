import { PARTICIPANT_BOT, TENEO_PARAM_KEY } from './constants.js';

const defaultMessageType = 'text';

export default function parseTeneoResponse(teneoResponse) {
  const { parameters, text } = teneoResponse.output;

  const messages = [];

  if (text) {
    messages.push({
      author: PARTICIPANT_BOT,
      type: 'text',
      data: { text },
    });
  }

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
