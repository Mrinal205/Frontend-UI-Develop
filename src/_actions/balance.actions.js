import { rpcIds } from '_actions/ids';
import { createRPCAction } from '_helpers/rpc';
import {
  getBalance,
  getExchangeBalance,
  getHistoricalNetworth,
  getBaseNetworth
} from '_api/backend';

export const fetchBalance = (exchange, markets) =>
  createRPCAction(rpcIds.fetchBalance, getBalance, {
    exchange,
    markets: Array.isArray(markets) ? markets.join(',') : markets
  });

export const fetchExchangeBalance = exchange =>
  createRPCAction(rpcIds.fetchExchangeBalance, getExchangeBalance, { exchange });

/* Account balance historical networth */
export const FETCH_BALANCE_NETWORTH_REQUEST = '@moon/FETCH_BALANCE_NETWORTH_REQUEST';
export const FETCH_BALANCE_NETWORTH_SUCCESS = '@moon/FETCH_BALANCE_NETWORTH_SUCCESS';
export const FETCH_BALANCE_NETWORTH_ERROR = '@moon/FETCH_BALANCE_NETWORTH_ERROR';

/* Account base networth data */
export const FETCH_BASE_NETWORTH_REQUEST = '@moon/FETCH_BASE_NETWORTH_REQUEST';
export const FETCH_BASE_NETWORTH_SUCCESS = '@moon/FETCH_BASE_NETWORTH_SUCCESS';
export const FETCH_BASE_NETWORTH_ERROR = '@moon/FETCH_BASE_NETWORTH_ERROR';

/* Historical networth */
export function fetchHistoricalNetworthRequest() {
  return {
    type: FETCH_BALANCE_NETWORTH_REQUEST
  };
}

export function fetchHistoricalNetworthSuccess(data) {
  return {
    type: FETCH_BALANCE_NETWORTH_SUCCESS,
    payload: data
  };
}

export function fetchHistoricalNetworthError(error) {
  return {
    type: FETCH_BALANCE_NETWORTH_ERROR,
    error
  };
}

export function fetchHistoricalNetworth() {
  return async dispatch => {
    dispatch(fetchHistoricalNetworthRequest());
    try {
      const response = await getHistoricalNetworth();
      dispatch(fetchHistoricalNetworthSuccess(response.data));
    } catch (error) {
      dispatch(fetchHistoricalNetworthError(error));
    }
  };
}

/* Base networth */
export function fetchBaseNetworthRequest() {
  return {
    type: FETCH_BASE_NETWORTH_REQUEST
  };
}

export function fetchBaseNetworthSuccess(data) {
  return {
    type: FETCH_BASE_NETWORTH_SUCCESS,
    payload: data
  };
}

export function fetchBaseNetworthError(error) {
  return {
    type: FETCH_BASE_NETWORTH_ERROR,
    error
  };
}

export function fetchBaseNetworth() {
  return async dispatch => {
    dispatch(fetchBaseNetworthRequest());
    try {
      const response = await getBaseNetworth();
      dispatch(fetchBaseNetworthSuccess(response.data));
    } catch (error) {
      dispatch(fetchBaseNetworthError(error));
    }
  };
}
