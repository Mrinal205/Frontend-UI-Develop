import { getCandleSticks } from '_api';

export const FETCH_CANDLESTICKS_REQUEST = '@moon/FETCH_CANDLESTICKS_REQUEST';
export const FETCH_CANDLESTICKS_SUCCESS = '@moon/FETCH_CANDLESTICKS_SUCCESS';
export const FETCH_CANDLESTICKS_ERROR = '@moon/FETCH_CANDLESTICKS_ERROR';

export function fetchCandlesticksRequest(exchangeName, symbol, resolution, since) {
  return {
    type: FETCH_CANDLESTICKS_REQUEST,
    exchangeName,
    symbol,
    resolution,
    since
  };
}

export function fetchCandlesticksSuccess(candlesticks, exchangeName, symbol, resolution, since) {
  return {
    type: FETCH_CANDLESTICKS_SUCCESS,
    candlesticks,
    exchangeName,
    symbol,
    resolution,
    since
  };
}

export function fetchCandlesticksError(error, exchangeName, symbol, resolution, since) {
  return {
    type: FETCH_CANDLESTICKS_ERROR,
    error,
    exchangeName,
    symbol,
    resolution,
    since
  };
}

export function fetchCandlesticks(exchangeName, symbol, resolution, since) {
  return dispatch => {
    dispatch(fetchCandlesticksRequest(exchangeName, symbol, resolution, since));
    return getCandleSticks(exchangeName, symbol, resolution, since).then(
      data => {
        dispatch(fetchCandlesticksSuccess(data, exchangeName, symbol, resolution, since));
      },
      error => dispatch(fetchCandlesticksError(error, exchangeName, symbol, resolution, since))
    );
  };
}
