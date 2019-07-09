import axios from 'axios';
import { rpcIds } from '_actions/ids';

import { uniqueRequestById } from '_helpers/axios-xhr';
import { getSymbolForUrl } from '_helpers';
import { API_HOST } from '../_constants';
import { BACKEND_TIMEOUT } from '_constants/timeouts';

const instance = axios.create({
  baseURL: `https://${API_HOST}`,
  timeout: BACKEND_TIMEOUT,
  withCredentials: true
});

export function getBalance({ exchange, markets }) {
  const marketsurl = Boolean(markets) ? `/${markets}` : '';
  return instance
    .get(`/balances/${exchange.toUpperCase()}${marketsurl}`, {})
    .then(response => response.data);
}

export function getExchangeBalance({ exchange }) {
  return instance.get(`/balances/${exchange.toUpperCase()}`, {}).then(response => response.data);
}

/**
 * Fetches historical balance for user
 * @param {string} currencySymbol
 */
export function getHistoricalNetworth(currencySymbol = 'USD') {
  return instance.get(`/balances/networth/historical?currency=${currencySymbol}`);
}

/**
 * Fetches base networth for user
 */
export function getBaseNetworth() {
  return instance.get(`/balances/networth`);
}

export const getOrders = ({ exchangeName, symbol }) =>
  uniqueRequestById(rpcIds.fetchOrders, cancelToken => {
    return instance
      .get(`/orders/${exchangeName}/${getSymbolForUrl(symbol)}`, { cancelToken })
      .then(response => response.data);
  });

export const getExchangeOrders = ({ exchangeName }) => {
  return instance.get(`/orders/${exchangeName.toUpperCase()}`, {}).then(response => ({
    open: response.data.open,
    closed: response.data.closed
  }));
};

export function postOrder({ order }) {
  return instance.post('/orders', order);
}

export function deleteOrder({ order, exchangeName, symbol }) {
  if (order.id) {
    return instance.delete(`/orders/${order.id}`);
  }
  return instance.delete(
    `/orders/${exchangeName}/${getSymbolForUrl(symbol)}/${order.exchangeOrderId}`
  );
}
