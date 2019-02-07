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

  console.log(JSON.stringify(teneoResponse, null, 2));

  const messageParams = parameters && parameters[TENEO_PARAM_KEY];

  const data = messageParams && JSON.parse(messageParams);

  if (data) {
    messages.push({
      author: PARTICIPANT_BOT,
      type: data.type || defaultMessageType,
      data,
    });
  }

  return messages;
}
