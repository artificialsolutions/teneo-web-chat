import { PARTICIPANT_BOT, TENEO_PARAM_KEY } from './constants.js';

const defaultMessageType = 'text';

export default function parseMessage(teneoResponse) {
  const { parameters, text } = teneoResponse.output;

  const messageParams = parameters && parameters[TENEO_PARAM_KEY];

  const payload = messageParams ? JSON.parse(messageParams) : {};

  return {
    author: PARTICIPANT_BOT,
    type: payload.type || defaultMessageType,
    data: {
      text,
      ...payload,
    },
  };
}
