import { getMarketcapOverview } from '_api/coinmarketcap';

/* ------------------ coinmarketcap data ------------------------- */

export const FETCH_MARKETCAP_REQUEST = '@moon/FETCH_MARKETCAP_REQUEST';
export const FETCH_MARKETCAP_SUCCESS = '@moon/FETCH_MARKETCAP_SUCCESS';
export const FETCH_MARKETCAP_ERROR = '@moon/FETCH_MARKETCAP_ERROR';

export function fetchMarketcapOverviewRequest(exchange) {
  return {
    type: FETCH_MARKETCAP_REQUEST,
    exchange
  };
}

export function fetchMarketcapOverviewSuccess(marketcap) {
  return {
    type: FETCH_MARKETCAP_SUCCESS,
    marketcap
  };
}

export function fetchMarketcapOverviewError(error) {
  return {
    type: FETCH_MARKETCAP_ERROR,
    error
  };
}

export function fetchMarketcapOverview(value) {
  return dispatch => {
    dispatch(fetchMarketcapOverviewRequest(value));
    return getMarketcapOverview(value).then(
      data => {
        dispatch(fetchMarketcapOverviewSuccess(data));
      },
      error => dispatch(fetchMarketcapOverviewError(error))
    );
  };
}
