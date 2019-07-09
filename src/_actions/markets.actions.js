import { throttle } from 'lodash/function';

import { getMarkets } from '_api';
import { establishStream, closeConnection } from '_api/websockets';

import { TICKER_THROTTLE_VALUE } from '_constants';

export const FETCH_MARKETS_REQUEST = '@moon/FETCH_MARKETS_REQUEST';
export const FETCH_MARKETS_SUCCESS = '@moon/FETCH_MARKETS_SUCCESS';
export const FETCH_MARKETS_ERROR = '@moon/FETCH_MARKETS_ERROR';

export function fetchMarketsRequest(exchangeName) {
  return {
    type: FETCH_MARKETS_REQUEST,
    exchangeName
  };
}

export function fetchMarketsSuccess(markets, exchangeName) {
  return {
    type: FETCH_MARKETS_SUCCESS,
    markets,
    exchangeName
  };
}

export function fetchMarketsError(error, exchangeName) {
  return {
    type: FETCH_MARKETS_ERROR,
    error,
    exchangeName
  };
}

export function fetchMarkets(exchangeName) {
  return dispatch => {
    dispatch(fetchMarketsRequest(exchangeName));
    return getMarkets(exchangeName).then(
      data => {
        dispatch(fetchMarketsSuccess(data, exchangeName));
      },
      error => dispatch(fetchMarketsError(error, exchangeName))
    );
  };
}

/* ---------------- realtime fetch data data ------------------------- */

export const SUBSCRIBE_MARKET_REQUEST = '@moon/SUBSCRIBE_MARKET_REQUEST';
export const SUBSCRIBE_MARKET_SUCCESS = '@moon/SUBSCRIBE_MARKET_SUCCESS';
export const SUBSCRIBE_MARKET_ERROR = '@moon/SUBSCRIBE_MARKET_ERROR';

export function subscribeMarketRequest() {
  return {
    type: SUBSCRIBE_MARKET_REQUEST
  };
}

export function subscribeMarketSuccess(exchange) {
  return {
    type: SUBSCRIBE_MARKET_SUCCESS,
    exchange
  };
}

export function subscribeMarketError(error) {
  return {
    type: SUBSCRIBE_MARKET_ERROR,
    error
  };
}

/**
 * Thunk action to establish WS ticker connection to subscribe and fetch updates for:
 *  - orderbook
 *  - trades
 *  - market price ticker
 * @param {*} exchange
 * @param {*} market
 */
export function subscribeMarket(exchange, market) {
  return dispatch => {
    const cache = {
      orderbook: [],
      trades: [],
      market: {}
    };

    function orderbookActionHandler(data) {
      dispatch(receiveMarketOrderbookData(data, exchange));
      // clear the cache
      cache.orderbook = [];
    }

    const throttledOrderbookActionHandler = throttle(orderbookActionHandler, TICKER_THROTTLE_VALUE);

    function tradesActionHandler(data) {
      dispatch(receiveMarketTradesData(data, exchange));
      // clear the cache
      cache.trades = [];
    }

    const throttledTradesActionHandler = throttle(tradesActionHandler, TICKER_THROTTLE_VALUE);

    function marketActionHandler(data) {
      dispatch(receiveMarketTickerData(data, exchange));
    }

    const throttledMarketActionHandler = throttle(marketActionHandler, TICKER_THROTTLE_VALUE);

    const handlersStrategy = {
      ticker: function(data) {
        cache.market = data;
        throttledMarketActionHandler(cache.market);
      },
      orderbook: function(data) {
        cache.orderbook.push(data);
        throttledOrderbookActionHandler(cache.orderbook);
      },
      trade: function(data) {
        cache.trades.push(data);
        throttledTradesActionHandler(cache.trades);
      }
    };

    dispatch(subscribeMarketRequest(exchange, market));

    establishStream(exchange, market, {
      onSubscribe: () => {
        dispatch(subscribeMarketSuccess(exchange));
      },
      onSubscribeError: error => dispatch(subscribeMarketError(error)),
      onMessage: message => {
        // select appropriate handler strategy
        const handler = handlersStrategy[message.type];
        handler && handler(message.data);
      },
      onMessageError: error => dispatch(receiveMarketTickerError(error))
    });
  };
}

/* ---------------- disconnecting data ------------------------- */

export const UNSUBSCRIBE_MARKET_SUCCESS = '@moon/UNSUBSCRIBE_MARKET_SUCCESS';
export function unsubscribeMarketSuccess() {
  return {
    type: UNSUBSCRIBE_MARKET_SUCCESS
  };
}

export function unsubscribeMarket() {
  return dispatch => {
    closeConnection();
    dispatch(unsubscribeMarketSuccess());
  };
}

/* ---------------- handling data ------------------------- */

export const RECEIVE_MARKET_TICKER_DATA = '@moon/RECEIVE_MARKET_TICKER_DATA';
export const RECEIVE_MARKET_ORDERBOOK_DATA = '@moon/RECEIVE_MARKET_ORDERBOOK_DATA';
export const RECEIVE_MARKET_TRADES_DATA = '@moon/RECEIVE_MARKET_TRADES_DATA';
export const RECEIVE_MARKET_TICKER_ERROR = '@moon/RECEIVE_MARKET_TICKER_ERROR';

export function receiveMarketTickerData(tickerData, exchange) {
  return {
    type: RECEIVE_MARKET_TICKER_DATA,
    tickerData,
    exchange
  };
}

export function receiveMarketOrderbookData(orderbookData, exchange) {
  return {
    type: RECEIVE_MARKET_ORDERBOOK_DATA,
    payload: {
      orderbookData,
      exchange
    }
  };
}

export function receiveMarketTradesData(tradesData, exchange) {
  return {
    type: RECEIVE_MARKET_TRADES_DATA,
    payload: {
      tradesData,
      exchange
    }
  };
}

export function receiveMarketTickerError(error) {
  return {
    type: RECEIVE_MARKET_TICKER_ERROR,
    error
  };
}
