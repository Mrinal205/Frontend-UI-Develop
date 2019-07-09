import { getTrades } from '_api';

export const FETCH_TRADES_REQUEST = '@moon/FETCH_TRADES_REQUEST';
export const FETCH_TRADES_SUCCESS = '@moon/FETCH_TRADES_SUCCESS';
export const FETCH_TRADES_ERROR = '@moon/FETCH_TRADES_ERROR';

export function fetchTradesRequest(exchange, market) {
  return {
    type: FETCH_TRADES_REQUEST,
    payload: {
      exchange,
      market
    }
  };
}

export function fetchTradesSuccess(trades) {
  return {
    type: FETCH_TRADES_SUCCESS,
    payload: {
      trades
    }
  };
}

export function fetchTradesError(error) {
  return {
    type: FETCH_TRADES_ERROR,
    payload: {
      error
    }
  };
}

export function fetchTrades(exchange, market) {
  return dispatch => {
    dispatch(fetchTradesRequest());
    return getTrades(exchange, market).then(
      data => {
        dispatch(fetchTradesSuccess(data.trades));
      },
      error => dispatch(fetchTradesError(error))
    );
  };
}
