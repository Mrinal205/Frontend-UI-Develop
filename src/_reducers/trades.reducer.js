import {
  FETCH_TRADES_REQUEST,
  FETCH_TRADES_SUCCESS,
  FETCH_TRADES_ERROR
} from '_actions/trades.actions';

import { RECEIVE_MARKET_TRADES_DATA } from '_actions/markets.actions';

const initialState = {
  list: [],
  meta: {}
};

const TRADES_STORE_LIMIT = 100;

const trades = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRADES_REQUEST: {
      return {
        list: [],
        meta: { loading: true }
      };
    }

    case FETCH_TRADES_SUCCESS: {
      return {
        list: [...action.payload.trades.slice(0, TRADES_STORE_LIMIT)],
        meta: {}
      };
    }

    case FETCH_TRADES_ERROR: {
      return {
        ...initialState,
        meta: {
          error: true,
          errorMessage: action.payload.error.message
        }
      };
    }

    case RECEIVE_MARKET_TRADES_DATA: {
      const trades = action.payload.tradesData;
      const list = [...trades.reverse(), ...state.list];

      return {
        ...state,
        list: list.slice(0, TRADES_STORE_LIMIT)
      };
    }

    default:
      return state;
  }
};

export default trades;
