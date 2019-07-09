import {
  FETCH_MARKET_REQUEST,
  FETCH_MARKET_SUCCESS,
  FETCH_MARKET_ERROR
} from '_actions/marketInfo.actions';

import {
  FETCH_MARKETS_REQUEST,
  FETCH_MARKETS_SUCCESS,
  FETCH_MARKETS_ERROR,
  RECEIVE_MARKET_TICKER_DATA
} from '_actions/markets.actions';

import { SELECT_EXCHANGE } from '_actions/selections.actions';

const initialState = {};

/********                                       *****************/
// @TODO: Delete when backend is sending correct precision

const arrayDiff = arr => ['amount', 'base', 'price', 'quote'].filter(i => !arr.includes(i));

const setPrecision = (p, needs) =>
  needs.reduce((acc, a) => {
    switch (a) {
      case 'amount':
        return { ...acc, amount: acc.quote || 8 };
      case 'base':
        return { ...acc, base: acc.price || 8 };
      case 'price':
        return { ...acc, price: acc.base || 8 };
      case 'quote':
        return { ...acc, quote: acc.amount || 8 };
      default:
        return acc;
    }
  }, p);

const fillPrecision = market => {
  for (const pair in market) {
    const marketPrecision = market[pair].precision;
    const marketKeys = typeof marketPrecision === 'object' ? Object.keys(marketPrecision) : [];
    const precision = market[pair].precision;
    const needs = arrayDiff(marketKeys);
    market[pair].precision = setPrecision(precision || {}, needs);
  }
  return market;
};

/*     *************     */

const markets = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MARKET_REQUEST: {
      const { exchangeName, symbol } = action;
      return {
        ...state,
        [exchangeName]: {
          ...state[exchangeName],
          [symbol]: state[exchangeName][symbol] ? state[exchangeName][symbol] || {} : {}
        }
      };
    }
    case FETCH_MARKET_SUCCESS: {
      const { exchangeName, symbol, data } = action;
      return {
        ...state,
        [exchangeName]: {
          ...state[exchangeName],
          [symbol]: data
        }
      };
    }
    case FETCH_MARKET_ERROR: {
      const { exchangeName, symbol, error } = action;
      return {
        ...state,
        [exchangeName]: {
          ...state[exchangeName],
          [symbol]: {
            error: true,
            errorMessage: error.message
          }
        }
      };
    }

    case FETCH_MARKETS_REQUEST: {
      const { exchangeName } = action;
      return {
        ...state,
        [exchangeName]: {
          ...state[exchangeName],
          list: state[exchangeName] ? state[exchangeName].list || {} : {},
          meta: { loading: true }
        }
      };
    }

    case FETCH_MARKETS_SUCCESS: {
      const {
        exchangeName,
        markets: { market }
      } = action;
      return {
        ...state,
        [exchangeName]: {
          ...state[exchangeName],
          list: {
            ...fillPrecision(market) // @TODO: remove once backend is sending correct precision
          },
          meta: {
            timestamp: new Date()
          }
        }
      };
    }

    case FETCH_MARKETS_ERROR: {
      const { exchangeName } = action;
      return {
        ...state,
        [exchangeName]: {
          ...state[exchangeName],
          meta: {
            error: true,
            errorMessage: action.error.message
          }
        }
      };
    }

    case RECEIVE_MARKET_TICKER_DATA: {
      const { tickerData: data, exchange: exchangeName } = action;
      return {
        ...state,
        [exchangeName]: {
          ...state[exchangeName],
          list: {
            ...state[exchangeName].list,
            [data.symbol]: {
              ...state[exchangeName].list[data.symbol],
              ...data
            }
          }
        }
      };
    }

    case SELECT_EXCHANGE: {
      return {
        ...state,
        list: {}
      };
    }

    default:
      return state;
  }
};

export default markets;
