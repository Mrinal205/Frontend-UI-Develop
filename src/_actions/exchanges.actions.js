import AccountService from '../_services/account.service';

export const CONNECT_EXCHANGE_REQUEST = 'CONNECT_EXCHANGE_REQUEST';
export const CONNECT_EXCHANGE_SUCCESS = 'CONNECT_EXCHANGE_SUCCESS';
export const CONNECT_EXCHANGE_ERROR = 'CONNECT_EXCHANGE_ERROR';

export const GET_EXCHANGES_SUCCESS = 'GET_EXCHANGES_SUCCESS';

export const DISCONNECT_EXCHANGE_REQUEST = 'DISCONNECT_EXCHANGE_REQUEST';
export const DISCONNECT_EXCHANGE_SUCCESS = 'DISCONNECT_EXCHANGE_SUCCESS';
export const DISCONNECT_EXCHANGE_ERROR = 'DISCONNECT_EXCHANGE_ERROR';

export const RESET_EXCHANGE_FORM = 'RESET_EXCHANGE_FORM';

// connecting:
export function connectExchangeRequest(exchange) {
  return {
    type: CONNECT_EXCHANGE_REQUEST,
    exchange
  };
}

export function connectExchangeSuccess(exchange) {
  return {
    type: CONNECT_EXCHANGE_SUCCESS,
    exchange
  };
}

export function connectExchangeError(exchange, error) {
  return {
    type: CONNECT_EXCHANGE_ERROR,
    error,
    exchange
  };
}

export function connectExchange(exchange, accountId, onSuccessRedirect) {
  return dispatch => {
    dispatch(connectExchangeRequest(exchange));
    return AccountService.connectExchange(exchange, accountId).then(
      data => {
        dispatch(connectExchangeSuccess(data));
        onSuccessRedirect();
      },
      error => {
        dispatch(connectExchangeError(exchange, error));
      }
    );
  };
}

// handle exchanges loading together with account fetch
export function getExchangesSuccess(exchanges) {
  return {
    type: GET_EXCHANGES_SUCCESS,
    exchanges
  };
}

// disconnecting
export function disconnectExchangeRequest(exchange) {
  return {
    type: DISCONNECT_EXCHANGE_REQUEST,
    exchange
  };
}

export function disconnectExchangeSuccess(exchange) {
  return {
    type: DISCONNECT_EXCHANGE_SUCCESS,
    exchange
  };
}

export function disconnectExchangeError(exchange, error) {
  return {
    type: DISCONNECT_EXCHANGE_ERROR,
    error
  };
}

export function disconnectExchange(exchange, accountId) {
  return dispatch => {
    dispatch(disconnectExchangeRequest(exchange));
    return AccountService.disconnectExchange(exchange, accountId).then(
      data => dispatch(disconnectExchangeSuccess(exchange)),
      error => {
        dispatch(disconnectExchangeError(exchange, error));
      }
    );
  };
}

export function resetExchangeForm() {
  return {
    type: RESET_EXCHANGE_FORM
  };
}
