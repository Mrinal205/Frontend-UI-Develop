import { API_HOST } from '../_constants';
export { _fetch as fetch };

function requestOptions(options) {
  return {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  };
}

function _fetch(path, body, options) {
  return fetch(
    `https://${API_HOST}/${path}`,
    requestOptions({
      body: JSON.stringify(body),
      ...options
    })
  )
    .then(handleStatusResponse)
    .then(handleResponse);
}

function handleStatusResponse(response) {
  var status = response.status;
  if (!response.ok || status < 200 || status > 399) {
    return response;
  } else {
    if (response.headers.get('Content-Type') === 'application/json') {
      return response;
    } else {
      return response;
    }
  }
}

function handleUnwrapped(response) {
  return data => {
    return response.ok ? data : Promise.reject(data);
  };
}

function handleJSONResponse(response) {
  return response.json().then(handleUnwrapped(response));
}

function handleTextResponse(response) {
  return response.text().then(handleUnwrapped(response));
}

function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return handleJSONResponse(response);
  } else {
    return handleTextResponse(response);
  }
}
