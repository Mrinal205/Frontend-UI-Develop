import { getMarketInfo } from '_api';

export const FETCH_MARKET_REQUEST = '@moon/FETCH_MARKET_REQUEST';
export const FETCH_MARKET_SUCCESS = '@moon/FETCH_MARKET_SUCCESS';
export const FETCH_MARKET_ERROR = '@moon/FETCH_MARKET_ERROR';

export function fetchMarketRequest(exchangeName, symbol) {
  return {
    type: FETCH_MARKET_REQUEST,
    exchangeName,
    symbol
  };
}

export function fetchMarketSuccess(data, exchangeName, symbol) {
  return {
    type: FETCH_MARKET_SUCCESS,
    data,
    exchangeName,
    symbol
  };
}

export function fetchMarketError(error, exchangeName, symbol) {
  return {
    type: FETCH_MARKET_ERROR,
    error,
    exchangeName,
    symbol
  };
}

export function fetchMarketInfo(exchangeName, symbol) {
  return dispatch => {
    dispatch(fetchMarketRequest(exchangeName, symbol));
    return getMarketInfo(exchangeName, symbol).then(
      res => {
        dispatch(fetchMarketSuccess(res.data.market, exchangeName, symbol));
      },
      error => dispatch(fetchMarketError(error, exchangeName, symbol))
    );
  };
}
