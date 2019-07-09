import {
  FETCH_MARKETS_SUCCESS,
  SUBSCRIBE_MARKET_SUCCESS,
  RECEIVE_MARKET_TICKER_DATA,
  RECEIVE_MARKET_ORDERBOOK_DATA,
  RECEIVE_MARKET_TRADES_DATA
} from '_actions/markets.actions';
import {
  CONNECT_EXCHANGE_REQUEST,
  CONNECT_EXCHANGE_SUCCESS,
  CONNECT_EXCHANGE_ERROR,
  GET_EXCHANGES_SUCCESS,
  DISCONNECT_EXCHANGE_REQUEST,
  DISCONNECT_EXCHANGE_SUCCESS,
  DISCONNECT_EXCHANGE_ERROR,
  RESET_EXCHANGE_FORM
} from '_actions/exchanges.actions';

import { AVAILABLE_EXCHANGES } from '_constants';

// case helper functions to update exchange in state tree
function markAsConnecting(exchanges, action) {
  return exchanges.map(exchange => {
    if (exchange.exchangeName !== action.exchange.exchangeName) {
      return exchange;
    }

    return {
      ...exchange,
      meta: {
        ...exchange.meta,
        connecting: true
      }
    };
  });
}

function markAsDisconnecting(exchanges, action) {
  return exchanges.map(exchange => {
    if (exchange.exchangeName !== action.exchange.exchangeName) {
      return exchange;
    }

    return {
      ...exchange,
      meta: {
        ...exchange.meta,
        disconnecting: true
      }
    };
  });
}

function markAsDisconnected(exchanges, action) {
  return exchanges.map(exchange => {
    if (exchange.exchangeName !== action.exchange.exchangeName) {
      return exchange;
    }

    // reset to initial state
    return {
      label: exchange.label,
      exchangeName: exchange.exchangeName,
      lastActivity: {},
      meta: {}
    };
  });
}

function markAsError(exchanges, action, connected = false) {
  return exchanges.map(exchange => {
    if (exchange.exchangeName !== action.exchange.exchangeName) {
      return exchange;
    }

    return {
      ...exchange,
      meta: {
        connected: connected ? true : undefined,
        error: true,
        errorMessage: action.error.message
      }
    };
  });
}

function updateExchangeInList(exchanges, action) {
  return exchanges.map(exchange => {
    if (exchange.exchangeName !== action.exchange.exchangeName) {
      return exchange;
    }

    // merge
    return {
      ...exchange,
      ...action.exchange,
      meta: {
        ...exchange.meta,
        connected: true
      }
    };
  });
}

function mergeExchanges(exchanges, action) {
  if (action.exchanges.length === 0) {
    return exchanges;
  }

  return exchanges.map(stateExchange => {
    // find matching exchange in the account exchanges
    const updatedExchange = action.exchanges.find(
      e => e.exchangeName.toUpperCase() === stateExchange.exchangeName
    );

    if (updatedExchange === undefined) {
      return stateExchange;
    }

    // return updated exchange
    return {
      ...stateExchange,
      id: updatedExchange.id,
      apiKey: updatedExchange.apiKey,
      secret: updatedExchange.secret,
      additional: updatedExchange.additional,
      meta: {
        connected: true
      }
    };
  });
}

function storeCoinList(state, action) {
  const { exchange, market } = action.markets;
  const exchangeIndex = state.findIndex(
    ex => ex.exchangeName.toUpperCase() === exchange.toUpperCase()
  );
  if (exchangeIndex < 0 || state[exchangeIndex].coins) {
    return state;
  }
  const coinsMap = Object.keys(market).reduce((prev, key) => {
    const [base, quote] = key.split('/');
    if (!prev[base]) {
      prev[base] = [];
    }
    prev[base].push(quote);
    return prev;
  }, {});

  const coins = Object.keys(coinsMap)
    .sort((a, b) => (a > b ? 1 : -1))
    .map(base => ({
      base,
      quotes: coinsMap[base]
    }));

  state[exchangeIndex] = { ...state[exchangeIndex], coins };
  return [...state];
}

/**
 * Updates last activity time on current exchange,
 * allowing to keep track of the websocket connection status.
 * @param {*} state
 * @param {*} action
 */
function updateLastActivity(state, action) {
  const exchangeName = action.exchange ? action.exchange : action.payload.exchange;
  const exchangeIndex = state.findIndex(ex => ex.exchangeName === exchangeName);

  // create copy
  const exchanges = [...state];

  const currentTimestamp = Date.now();

  // update last activity
  switch (action.type) {
    case SUBSCRIBE_MARKET_SUCCESS:
      exchanges[exchangeIndex].lastActivity = {}; // reset timers
      break;
    case RECEIVE_MARKET_TICKER_DATA:
      exchanges[exchangeIndex].lastActivity.marketTicker = currentTimestamp;
      break;
    case RECEIVE_MARKET_ORDERBOOK_DATA:
      exchanges[exchangeIndex].lastActivity.orderBook = currentTimestamp;
      break;
    case RECEIVE_MARKET_TRADES_DATA:
      exchanges[exchangeIndex].lastActivity.trades = currentTimestamp;
      break;
    default:
      break;
  }

  return exchanges;
}

function createInitialExchanges() {
  const EXCHANGES_LIST = AVAILABLE_EXCHANGES;

  return EXCHANGES_LIST.map(exchange => ({
    ...exchange,
    lastActivity: {},
    meta: {}
  }));
}

const initialState = createInitialExchanges();

const exchanges = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_EXCHANGE_REQUEST:
      return markAsConnecting(state, action);

    case CONNECT_EXCHANGE_SUCCESS:
      return updateExchangeInList(state, action);

    case CONNECT_EXCHANGE_ERROR:
      return markAsError(state, action);

    case GET_EXCHANGES_SUCCESS:
      return mergeExchanges(state, action);

    case DISCONNECT_EXCHANGE_REQUEST:
      return markAsDisconnecting(state, action);

    case DISCONNECT_EXCHANGE_SUCCESS:
      return markAsDisconnected(state, action);

    case DISCONNECT_EXCHANGE_ERROR:
      return markAsError(state, action, true);

    case FETCH_MARKETS_SUCCESS:
      return storeCoinList(state, action);

    case SUBSCRIBE_MARKET_SUCCESS:
    case RECEIVE_MARKET_ORDERBOOK_DATA:
    case RECEIVE_MARKET_TRADES_DATA:
    case RECEIVE_MARKET_TICKER_DATA:
      return updateLastActivity(state, action);

    case RESET_EXCHANGE_FORM:
      return state.map(exchange => ({
        ...exchange,
        meta: {
          ...exchange.meta,
          error: undefined,
          errorMessage: undefined
        }
      }));

    default:
      return state;
  }
};

export default exchanges;
