const GATEWAY_SESSION_STORAGE_KEY = 'X-Gateway-Session';
const ENGINE_SESSION_STORAGE_KEY = 'sessionId';

const readClientOrigin = () => {
  if (typeof document !== 'undefined' || document.location) {
    return document.location.origin;
  }
};

// Returns a shallow copy object containing all properties _except_ those specified in 'keys'
const prune = (keys) => {
  return (obj) => Object.keys(obj).reduce((result, key) => {
    if (keys.includes(key)) {
      return result;
    }

    return { ...result, [key]: obj[key] };
  }, {});
};

const getParameters = prune(['viewtype', 'userinput', 'text', 'clientOrigin']);
const buildSessionIdent = (sessionId) => {
  return `JSESSIONID=${sessionId}`;
};

const formatEngineUrl = (url) => {
  return url.endsWith('/') ? url : `${url}/`;
};

const sessionHeaders = () => {
  const gatewaySession = window.sessionStorage.getItem(GATEWAY_SESSION_STORAGE_KEY);
  const sessionId = window.sessionStorage.getItem(ENGINE_SESSION_STORAGE_KEY);

  return {
    ...(gatewaySession ? { 'X-Teneo-Session': `${buildSessionIdent(sessionId)}; ${gatewaySession}` } : {}),
  };
};

const storeSaaSSession = (response) => {
  const gatewayHeader = response.headers.get('X-Gateway-Session');

  if (gatewayHeader) {
    const sessionHeaderIndex = 0;
    const gatewaySession = gatewayHeader.split(';')[sessionHeaderIndex];

    window.sessionStorage.setItem(GATEWAY_SESSION_STORAGE_KEY, gatewaySession);
  }

  return response;
};

const storeEngineSession = (bodyJson) => {
  const { sessionId } = bodyJson;

  if (sessionId) {
    window.sessionStorage.setItem(ENGINE_SESSION_STORAGE_KEY, sessionId);
  } else {
    window.sessionStorage.removeItem(ENGINE_SESSION_STORAGE_KEY);
  }

  return bodyJson;
};

const applySessionUrlParamForLocalHost = (url) => {
  const { hostname } = document.location;

  // When running locally - we are not allowed to set the cookies with fetch - so we use the url param approach
  if (hostname === 'localhost') {
    const sessionId = window.sessionStorage.getItem(ENGINE_SESSION_STORAGE_KEY);

    if (sessionId) {
      return `${url};jsessionid=${sessionId}`;
    }
  }

  return url;
};

// eslint-disable-next-line func-style
export function close (teneoEngineUrl) {
  const endSessionUrl = `${formatEngineUrl(teneoEngineUrl)}endsession`;

  return fetch(applySessionUrlParamForLocalHost(endSessionUrl), {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...sessionHeaders(),
    }
  }).then((response) => {
    if (response.ok) {
      return response.body;
    }

    return `[${response.status}] ${response.statusText}`;
  });
}

const verifyInputData = (inputData) => {
  const validDataType = (x) => ['string', 'number', 'bool'].includes(typeof x);
  const keys = Object.keys(inputData);

  if (!(typeof inputData === 'object' && keys.includes('text'))) {
    throw new TypeError(`sendInput input data must be an object with atleast a 'text' property: ${JSON.stringify(inputData)}`);
  }

  if (!keys.every((key) => validDataType(inputData[key]))) {
    throw new TypeError(`sendInput input data object can only contain values of type string, number or bool ${JSON.stringify(inputData)}`);
  }
};

const doSend = (reactUrl, headers, content, handleMessage) => {
  return fetch(reactUrl, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: new URLSearchParams(content),
  })
  .then(storeSaaSSession)
  .then(async (response) => {
    if (response.ok) {
      const json = await response.json();

      handleMessage(json);

      return json;
    }
    throw new Error(`[${response.status}] ${response.statusText}`);
  })
  .then(storeEngineSession);
};

const doSendForStream = (reactUrl, headers, content, handleMessage) => {
  const responseStream = new EventSource(`${reactUrl}?stream&${new URLSearchParams(content)}`, {
    withCredentials: true,
  });

  responseStream.addEventListener('output', (event) => {
    const { data } = event;
    const json = JSON.parse(data);

    storeEngineSession(json);
    handleMessage(json);
  });

  const result = new Promise((resolve,) => {
    responseStream.addEventListener('final', (event) => {
      const { data } = event;
      const json = JSON.parse(data);

      responseStream.close();
      storeEngineSession(json);
      resolve(json);
    });
  });

  return result;
};

// eslint-disable-next-line func-style, max-params
export function sendInput (teneoEngineUrl, inputData, stream, handleMessage) {
  verifyInputData(inputData);

  let reactUrl = formatEngineUrl(teneoEngineUrl);
  const clientOrigin = readClientOrigin();

  reactUrl = applySessionUrlParamForLocalHost(reactUrl);

  const content = {
    viewtype: 'tieapi',
    ...getParameters(inputData),
    ...(clientOrigin ? { clientOrigin } : {}),
    userinput: inputData.text,
  };

  const headers = {
    'Accept': 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    ...sessionHeaders(),
  };

  return stream
    ? doSendForStream(reactUrl, headers, content, handleMessage)
    : doSend(reactUrl, headers, content, handleMessage);
}
