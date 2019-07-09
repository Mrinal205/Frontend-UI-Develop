import axios from 'axios';
import { TICKER_API_HOST } from '../_constants';
import { TICKER_TIMEOUT } from '_constants/timeouts';

const instance = axios.create({
  baseURL: `https://${TICKER_API_HOST}`,
  timeout: TICKER_TIMEOUT
});

export function getMarkets(exchangeName) {
  return instance
    .get('/markets', {
      params: {
        exchange: exchangeName.toLowerCase()
      }
    })
    .then(response => response.data);
}

export function getMarketInfo(exchangeName, symbol) {
  return instance
    .get('/market', {
      params: {
        exchange: exchangeName,
        symbol
      }
    })
    .then(response => response);
}

export function getCandleSticks(exchangeName, symbol, resolution, since) {
  const map = {
    '1': '1m',
    '5': '5m',
    '15': '15m',
    '30': '30m',
    '60': '1h',
    D: '1d'
  };

  const params = {
    exchange: exchangeName.toLowerCase(),
    symbol,
    interval: map[resolution]
  };

  if (since) {
    params.since = since;
  }

  return instance.get('/candlesticks', { params }).then(response => response.data);
}

export function getTicker(exchangeName, symbol) {
  return instance.get('tickers', {
    params: {
      exchange: exchangeName.toLowerCase(),
      symbol
    }
  });
}

export function getTrades(exchangeName, symbol) {
  return instance
    .get('/trades', {
      params: {
        exchange: exchangeName.toLowerCase(),
        symbol
      }
    })
    .then(response => response.data);
}

export function getOrderBook(exchangeName, symbol) {
  return instance
    .get('/ordersbook', {
      params: {
        exchange: exchangeName.toLowerCase(),
        symbol
      }
    })
    .then(response => response.data);
}
